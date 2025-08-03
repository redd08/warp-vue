import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { Group, GroupStanding, GroupMatch } from './types'
import type { Team } from '@/entities/team'
import type { Match } from '@/entities/match'

export const useGroupStore = defineStore('group', () => {
  const groups = ref<Group[]>([])
  const groupMatches = ref<GroupMatch[]>([])

  const setGroups = (newGroups: Group[]) => {
    groups.value = newGroups
  }

  const setGroupMatches = (matches: GroupMatch[]) => {
    groupMatches.value = matches
  }

  const updateMatchScore = (matchId: string, team1Score: number, team2Score: number) => {
    const match = groupMatches.value.find(m => m.id === matchId)
    if (match) {
      match.team1Score = team1Score
      match.team2Score = team2Score
      match.isComplete = true
      updateGroupStandings(match.groupId)
    }
  }

  const resetMatchScore = (matchId: string) => {
    const match = groupMatches.value.find(m => m.id === matchId)
    if (match) {
      match.team1Score = undefined
      match.team2Score = undefined
      match.isComplete = false
      updateGroupStandings(match.groupId)
    }
  }

  const updateGroupStandings = (groupId: string) => {
    const group = groups.value.find(g => g.id === groupId)
    if (!group) return

    // Reset standings
    group.standings = group.teams.map(team => ({
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    }))

    // Calculate standings from completed matches
    const groupMatchesForThisGroup = groupMatches.value.filter(
      m => m.groupId === groupId && m.isComplete
    )

    groupMatchesForThisGroup.forEach(match => {
      const team1Standing = group.standings.find(s => s.team.id === match.team1.id)!
      const team2Standing = group.standings.find(s => s.team.id === match.team2.id)!

      team1Standing.played++
      team2Standing.played++
      team1Standing.goalsFor += match.team1Score!
      team1Standing.goalsAgainst += match.team2Score!
      team2Standing.goalsFor += match.team2Score!
      team2Standing.goalsAgainst += match.team1Score!

      if (match.team1Score! > match.team2Score!) {
        team1Standing.won++
        team1Standing.points += 3
        team2Standing.lost++
      } else if (match.team1Score! < match.team2Score!) {
        team2Standing.won++
        team2Standing.points += 3
        team1Standing.lost++
      } else {
        team1Standing.drawn++
        team1Standing.points += 1
        team2Standing.drawn++
        team2Standing.points += 1
      }

      team1Standing.goalDifference = team1Standing.goalsFor - team1Standing.goalsAgainst
      team2Standing.goalDifference = team2Standing.goalsFor - team2Standing.goalsAgainst
    })

    // Sort standings
    group.standings.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points
      if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Check if group is complete
    const totalMatches = (group.teams.length * (group.teams.length - 1)) / 2
    group.isComplete = groupMatchesForThisGroup.length === totalMatches
  }

  const getQualifiedTeams = (qualifiersPerGroup: number): Team[] => {
    const qualifiedTeams: Team[] = []
    groups.value.forEach(group => {
      if (group.isComplete) {
        const qualifiers = group.standings.slice(0, qualifiersPerGroup).map(s => s.team)
        qualifiedTeams.push(...qualifiers)
      }
    })
    return qualifiedTeams
  }

  const clearGroups = () => {
    groups.value = []
    groupMatches.value = []
  }

  // New method to update standings from unified matches
  const updateStandingsFromUnifiedMatches = (unifiedMatches: Match[]) => {
    groups.value.forEach(group => {
      // Reset standings
      group.standings = group.teams.map(team => ({
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }))

      // Get completed matches for this group
      const groupMatchesForThisGroup = unifiedMatches.filter(
        m => m.groupId === group.id && m.isComplete && typeof m.team1Score === 'number' && typeof m.team2Score === 'number'
      )

      groupMatchesForThisGroup.forEach(match => {
        const team1Standing = group.standings.find(s => s.team.id === match.team1.id)!
        const team2Standing = group.standings.find(s => s.team.id === match.team2.id)!

        team1Standing.played++
        team2Standing.played++
        team1Standing.goalsFor += match.team1Score!
        team1Standing.goalsAgainst += match.team2Score!
        team2Standing.goalsFor += match.team2Score!
        team2Standing.goalsAgainst += match.team1Score!

        if (match.team1Score! > match.team2Score!) {
          team1Standing.won++
          team1Standing.points += 3
          team2Standing.lost++
        } else if (match.team1Score! < match.team2Score!) {
          team2Standing.won++
          team2Standing.points += 3
          team1Standing.lost++
        } else {
          team1Standing.drawn++
          team1Standing.points += 1
          team2Standing.drawn++
          team2Standing.points += 1
        }

        team1Standing.goalDifference = team1Standing.goalsFor - team1Standing.goalsAgainst
        team2Standing.goalDifference = team2Standing.goalsFor - team2Standing.goalsAgainst
      })

      // Sort standings
      group.standings.sort((a, b) => {
        if (a.points !== b.points) return b.points - a.points
        if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
        return b.goalsFor - a.goalsFor
      })

      // Check if group is complete
      // Get the total number of matches that should exist for this group
      const totalMatchesForThisGroup = unifiedMatches.filter(m => m.groupId === group.id).length
      group.isComplete = groupMatchesForThisGroup.length === totalMatchesForThisGroup
    })
  }

  const allGroupsComplete = computed(() => {
    return groups.value.length > 0 && groups.value.every(group => group.isComplete)
  })

  return {
    groups: readonly(groups),
    groupMatches: readonly(groupMatches),
    allGroupsComplete,
    setGroups,
    setGroupMatches,
    updateMatchScore,
    resetMatchScore,
    updateStandingsFromUnifiedMatches,
    getQualifiedTeams,
    clearGroups
  }
})
