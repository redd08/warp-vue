import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useTeamStore, type Team } from '@/entities/team'
import { useGroupStore, type Group } from '@/entities/group'
import { useMatchStore, type Match, type MatchStage } from '@/entities/match'
import { shuffleArray } from '@/shared/lib'
import { TournamentFormat, GroupCount, MatchFormat, type TournamentSettings, type TournamentPhase, type StageInfo } from './types'

const STAGE_CONFIGS: Record<TournamentPhase, StageInfo> = {
  setup: {
    id: 'setup',
    name: 'Tournament Setup',
    matchesTitle: 'Tournament Setup',
    advanceButtonText: 'Start Tournament',
    isKnockout: false
  },
  groups: {
    id: 'groups',
    name: 'Group Stage',
    matchesTitle: 'Group Stage Matches',
    advanceButtonText: '⚡ Advance to Knockout Stage',
    isKnockout: false
  },
  direct: {
    id: 'direct',
    name: 'Direct Knockout',
    matchesTitle: 'Direct Knockout Matches',
    advanceButtonText: '🏆 Complete Tournament',
    isKnockout: true
  },
  round16: {
    id: 'round16',
    name: 'Round of 16',
    matchesTitle: 'Round of 16 Matches',
    advanceButtonText: '⚡ Advance to Quarterfinals',
    isKnockout: true
  },
  quarters: {
    id: 'quarters',
    name: 'Quarterfinals',
    matchesTitle: 'Quarterfinal Matches',
    advanceButtonText: '⚡ Advance to Semifinals',
    isKnockout: true
  },
  semis: {
    id: 'semis',
    name: 'Semifinals',
    matchesTitle: 'Semifinal Matches',
    advanceButtonText: '⚡ Advance to Final',
    isKnockout: true
  },
  final: {
    id: 'final',
    name: 'Final',
    matchesTitle: 'Final Match',
    advanceButtonText: '🏆 Complete Tournament',
    isKnockout: true
  },
  complete: {
    id: 'complete',
    name: 'Tournament Complete',
    matchesTitle: 'Tournament Results',
    advanceButtonText: 'Tournament Complete',
    isKnockout: false
  }
}

export const useTournamentStore = defineStore('tournament', () => {
  const teamStore = useTeamStore()
  const groupStore = useGroupStore()
  const matchStore = useMatchStore()

  const settings = ref<TournamentSettings>({
    format: TournamentFormat.DIRECT_KNOCKOUT,
    groupCount: GroupCount.FOUR,
    teamsPerGroup: 4,
    qualifiersPerGroup: 2,
    hasPlayoffs: true,
    matchFormat: MatchFormat.SINGLE
  })

  const currentPhase = ref<'setup' | 'groups' | 'direct' | 'round16' | 'quarters' | 'semis' | 'final' | 'complete'>('setup')

  const canStartTournament = computed(() => {
    const totalTeams = teamStore.teams.length
    if (settings.value.format === TournamentFormat.DIRECT_KNOCKOUT) {
      return totalTeams >= 2
    } else {
      const minTeams = settings.value.groupCount * 2
      return totalTeams >= minTeams
    }
  })

  const recommendedSettings = computed(() => {
    const totalTeams = teamStore.teams.length
    const recommendations: Partial<TournamentSettings> = {}

    // Only provide recommendations if we have enough teams for group stage
    if (totalTeams >= 4) {
      recommendations.format = TournamentFormat.GROUP_STAGE
      
      if (totalTeams >= 16) {
        recommendations.groupCount = GroupCount.FOUR
        recommendations.teamsPerGroup = Math.floor(totalTeams / 4)
        recommendations.qualifiersPerGroup = 2
      } else if (totalTeams >= 8) {
        recommendations.groupCount = GroupCount.TWO
        recommendations.teamsPerGroup = Math.floor(totalTeams / 2)
        recommendations.qualifiersPerGroup = 2
      } else if (totalTeams >= 4) {
        recommendations.groupCount = GroupCount.ONE
        recommendations.teamsPerGroup = totalTeams
        recommendations.qualifiersPerGroup = Math.min(2, totalTeams - 1)
      }
    }

    return recommendations
  })

  const updateSettings = (newSettings: Partial<TournamentSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    
    // Auto-calculate teams per group
    const totalTeams = teamStore.teams.length
    settings.value.teamsPerGroup = Math.floor(totalTeams / settings.value.groupCount)
  }

  const startTournament = () => {
    if (!canStartTournament.value) return

    groupStore.clearGroups()
    matchStore.clearMatches()

    if (settings.value.format === TournamentFormat.DIRECT_KNOCKOUT) {
      generateDirectKnockout()
    } else {
      generateGroupStage()
    }
  }

  const generateDirectKnockout = () => {
    const shuffledTeams = shuffleArray([...teamStore.teams])
    const startingStage = getNextKnockoutStage(shuffledTeams.length)
    generateKnockoutMatches(shuffledTeams, startingStage)
  }

  // Round-robin scheduling algorithm
  const generateRoundRobinSchedule = (teams: Team[], groupId: string): Match[] => {
    const numTeams = teams.length
    if (numTeams < 2) return []
    
    const matches: Match[] = []
    const isHomeAway = settings.value.matchFormat === MatchFormat.HOME_AWAY
    const rounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams
    const totalRounds = isHomeAway ? rounds * 2 : rounds
    const teamsPerRound = Math.floor(numTeams / 2)
    
    // For even number of teams, use circle method
    if (numTeams % 2 === 0) {
      const fixedTeam = teams[0]
      const rotatingTeams = teams.slice(1)
      
      for (let round = 0; round < rounds; round++) {
        // First match always involves the fixed team
        const opponent = rotatingTeams[round % rotatingTeams.length]
        matches.push({
          id: `${groupId}-r${round + 1}-m1`,
          team1: fixedTeam,
          team2: opponent,
          stage: 'group',
          groupId,
          stageOrder: round + 1,
          isComplete: false
        })
        
        // Other matches in the round
        for (let matchInRound = 1; matchInRound < teamsPerRound; matchInRound++) {
          const team1Index = (round + matchInRound) % rotatingTeams.length
          const team2Index = (round - matchInRound + rotatingTeams.length) % rotatingTeams.length
          
          matches.push({
            id: `${groupId}-r${round + 1}-m${matchInRound + 1}`,
            team1: rotatingTeams[team1Index],
            team2: rotatingTeams[team2Index],
            stage: 'group',
            groupId,
            stageOrder: round + 1,
            isComplete: false
          })
        }
      }
    } else {
      // For odd number of teams, each team gets a bye in one round
      for (let round = 0; round < rounds; round++) {
        const matchesInRound: { team1: Team; team2: Team }[] = []
        
        for (let i = 0; i < numTeams; i++) {
          const opponent = (round + i + 1) % numTeams
          if (i < opponent) {
            matchesInRound.push({ team1: teams[i], team2: teams[opponent] })
          }
        }
        
        matchesInRound.forEach((match, index) => {
          matches.push({
            id: `${groupId}-r${round + 1}-m${index + 1}`,
            team1: match.team1,
            team2: match.team2,
            stage: 'group',
            groupId,
            stageOrder: round + 1,
            isComplete: false
          })
        })
      }
    }
    
    // If home and away format, generate the return matches
    if (isHomeAway) {
      const firstRoundMatches = [...matches]
      
      firstRoundMatches.forEach((match, index) => {
        // Create return match with teams swapped
        matches.push({
          id: `${groupId}-r${rounds + match.stageOrder}-m${(index % teamsPerRound) + 1}`,
          team1: match.team2, // Swap home and away
          team2: match.team1,
          stage: 'group',
          groupId,
          stageOrder: rounds + match.stageOrder,
          isComplete: false
        })
      })
    }
    
    return matches
  }

  const generateGroupStage = () => {
    const shuffledTeams = shuffleArray([...teamStore.teams])
    const groups: Group[] = []
    const groupMatches: Match[] = []

    // Create groups
    for (let i = 0; i < settings.value.groupCount; i++) {
      const groupName = String.fromCharCode(65 + i) // A, B, C, D...
      const startIndex = i * settings.value.teamsPerGroup
      const endIndex = startIndex + settings.value.teamsPerGroup
      const groupTeams = shuffledTeams.slice(startIndex, endIndex)

      const group: Group = {
        id: `group-${groupName.toLowerCase()}`,
        name: `Group ${groupName}`,
        teams: groupTeams,
        standings: groupTeams.map(team => ({
          team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        })),
        isComplete: false
      }

      groups.push(group)

      // Generate matches for this group using round-robin scheduling
      const roundRobinMatches = generateRoundRobinSchedule(groupTeams, group.id)
      groupMatches.push(...roundRobinMatches)
    }

    groupStore.setGroups(groups)
    // Use the unified match store instead of group-specific matches
    matchStore.addMatches(groupMatches)
    currentPhase.value = 'groups'
  }

  const advanceToPlayoffs = () => {
    if (!groupStore.allGroupsComplete) return

    const qualifiedTeams = groupStore.getQualifiedTeams(settings.value.qualifiersPerGroup)
    
    if (qualifiedTeams.length < 2) {
      currentPhase.value = 'complete'
      return
    }

    // Determine which knockout stage to start with based on number of qualified teams
    const nextStage = getNextKnockoutStage(qualifiedTeams.length)
    generateKnockoutMatches(qualifiedTeams, nextStage)
  }

  const getNextKnockoutStage = (teamCount: number): 'round16' | 'quarters' | 'semis' | 'final' => {
    if (teamCount >= 16) return 'round16'
    if (teamCount >= 8) return 'quarters'
    if (teamCount >= 4) return 'semis'
    return 'final'
  }

  const generateKnockoutMatches = (teams: Team[], stage: 'round16' | 'quarters' | 'semis' | 'final') => {
    const shuffledTeams = shuffleArray(teams)
    const matches: Match[] = []
    const stagePrefix = getStagePrefix(stage)
    const isHomeAway = settings.value.matchFormat === MatchFormat.HOME_AWAY

    for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
      if (shuffledTeams[i + 1]) {
        const matchIndex = Math.floor(i / 2) + 1
        
        // First leg (or single match)
        matches.push({
          id: `${stagePrefix}-${matchIndex}${isHomeAway ? '-leg1' : ''}`,
          team1: shuffledTeams[i],
          team2: shuffledTeams[i + 1],
          stage: stage as MatchStage,
          stageOrder: matchIndex,
          isComplete: false
        })
        
        // Second leg (only for home & away)
        if (isHomeAway) {
          matches.push({
            id: `${stagePrefix}-${matchIndex}-leg2`,
            team1: shuffledTeams[i + 1], // Swap teams for return leg
            team2: shuffledTeams[i],
            stage: stage as MatchStage,
            stageOrder: matchIndex,
            isComplete: false
          })
        }
      }
    }

    matchStore.setMatches(matches)
    currentPhase.value = stage
  }

  const getStagePrefix = (stage: 'round16' | 'quarters' | 'semis' | 'final'): string => {
    switch (stage) {
      case 'round16': return 'r16'
      case 'quarters': return 'qf'
      case 'semis': return 'sf'
      case 'final': return 'final'
      default: return 'ko'
    }
  }

  const advanceToNextStage = () => {
    const completedMatches = matchStore.matches.filter(match => match.isComplete)
    if (completedMatches.length !== matchStore.matches.length) return

    const isHomeAway = settings.value.matchFormat === MatchFormat.HOME_AWAY
    let winners: Team[] = []

    if (isHomeAway) {
      // Group matches by stageOrder to handle two-legged ties
      const matchPairs = new Map<number, Match[]>()
      completedMatches.forEach(match => {
        const stageOrder = match.stageOrder!
        if (!matchPairs.has(stageOrder)) {
          matchPairs.set(stageOrder, [])
        }
        matchPairs.get(stageOrder)!.push(match)
      })

      // Determine winner for each pair based on aggregate score
      matchPairs.forEach(matches => {
        if (matches.length === 2) {
          const [leg1, leg2] = matches
          
          // Calculate aggregate scores
          let team1Aggregate = 0
          let team2Aggregate = 0
          
          // Find which team is which across both legs
          const team1 = leg1.team1
          const team2 = leg1.team2
          
          matches.forEach(match => {
            if (match.team1.id === team1.id) {
              team1Aggregate += match.team1Score!
              team2Aggregate += match.team2Score!
            } else {
              team1Aggregate += match.team2Score!
              team2Aggregate += match.team1Score!
            }
          })
          
          // Determine winner based on aggregate
          const winner = team1Aggregate > team2Aggregate ? team1 : team2
          winners.push(winner)
        }
      })
    } else {
      // Single match format - simple winner determination
      winners = completedMatches.map(match => {
        if (typeof match.team1Score !== 'number' || typeof match.team2Score !== 'number') return null
        return match.team1Score > match.team2Score ? match.team1 : match.team2
      }).filter(Boolean) as Team[]
    }

    if (winners.length < 2) {
      currentPhase.value = 'complete'
      return
    }

    if (currentPhase.value === 'final') {
      currentPhase.value = 'complete'
      return
    }

    const nextStage = getNextStageFromCurrent()
    generateKnockoutMatches(winners, nextStage)
  }

  const getNextStageFromCurrent = (): 'quarters' | 'semis' | 'final' | 'complete' => {
    switch (currentPhase.value) {
      case 'round16': return 'quarters'
      case 'quarters': return 'semis'
      case 'semis': return 'final'
      case 'final': return 'complete'
      default: return 'complete'
    }
  }

  const resetTournament = () => {
    currentPhase.value = 'setup'
    groupStore.clearGroups()
    matchStore.clearMatches()
  }

  // Unified stage information methods
  const getCurrentStageInfo = computed((): StageInfo => {
    return STAGE_CONFIGS[currentPhase.value]
  })

  const getStageInfo = (phase: TournamentPhase): StageInfo => {
    return STAGE_CONFIGS[phase]
  }

  const isKnockoutPhase = computed((): boolean => {
    return getCurrentStageInfo.value.isKnockout
  })

  const canAdvanceToNextStage = computed((): boolean => {
    const currentStage = currentPhase.value
    
    // Include 'direct' phase in stages that can advance
    if (!['direct', 'round16', 'quarters', 'semis', 'final'].includes(currentStage)) return false
    
    const currentMatches = matchStore.matches
    return currentMatches.length > 0 && currentMatches.every(match => match.isComplete)
  })

  return {
    settings: readonly(settings),
    currentPhase: readonly(currentPhase),
    canStartTournament,
    recommendedSettings,
    updateSettings,
    startTournament,
    advanceToPlayoffs,
    advanceToNextStage,
    resetTournament,
    getCurrentStageInfo,
    getStageInfo,
    isKnockoutPhase,
    canAdvanceToNextStage
  }
})
