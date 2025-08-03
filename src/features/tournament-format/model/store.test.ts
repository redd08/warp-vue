import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTournamentStore } from './store'
import { useTeamStore } from '@/entities/team'
import { useGroupStore } from '@/entities/group'
import { useMatchStore } from '@/entities/match'
import { TournamentFormat, GroupCount, MatchFormat } from './types'

// Mock the shuffle function to make tests predictable
vi.mock('@/shared/lib', () => ({
  shuffleArray: vi.fn((arr) => [...arr]) // Return array as-is for predictable tests
}))

describe('Tournament Store', () => {
  let tournamentStore: ReturnType<typeof useTournamentStore>
  let teamStore: ReturnType<typeof useTeamStore>
  let groupStore: ReturnType<typeof useGroupStore>
  let matchStore: ReturnType<typeof useMatchStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    tournamentStore = useTournamentStore()
    teamStore = useTeamStore()
    groupStore = useGroupStore()
    matchStore = useMatchStore()
  })

  it('should initialize with default settings', () => {
    expect(tournamentStore.settings).toEqual({
      format: TournamentFormat.DIRECT_KNOCKOUT,
      groupCount: GroupCount.FOUR,
      teamsPerGroup: 4,
      qualifiersPerGroup: 2,
      hasPlayoffs: true,
      matchFormat: MatchFormat.SINGLE
    })
    expect(tournamentStore.currentPhase).toBe('setup')
  })

  it('should calculate if tournament can start for direct knockout', () => {
    // Default teams count is 8, should be able to start
    expect(tournamentStore.canStartTournament).toBe(true)

    // Remove teams until only 1 remains
    while (teamStore.teams.length > 1) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }
    expect(tournamentStore.canStartTournament).toBe(false)

    // Add one more team
    teamStore.addTeam('Test Team', 'Test Country', 80)
    expect(tournamentStore.canStartTournament).toBe(true)
  })

  it('should calculate if tournament can start for group stage', () => {
    tournamentStore.updateSettings({ format: TournamentFormat.GROUP_STAGE })

    // With 4 groups, need at least 8 teams (2 per group minimum)
    expect(tournamentStore.canStartTournament).toBe(true)

    // Remove teams until below minimum
    while (teamStore.teams.length > 7) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }
    expect(tournamentStore.canStartTournament).toBe(false)
  })

  it('should provide recommended settings based on team count', () => {
    // With 8 teams (default), should recommend 2 groups
    const recommendations = tournamentStore.recommendedSettings
    expect(recommendations.groupCount).toBe(GroupCount.TWO)
    expect(recommendations.teamsPerGroup).toBe(4)
  })

  it('should recommend settings for different team counts', () => {
    // Add more teams to reach 16
    for (let i = 0; i < 8; i++) {
      teamStore.addTeam(`Team ${i + 9}`, 'Country', 80)
    }

    const recommendations = tournamentStore.recommendedSettings
    expect(recommendations.groupCount).toBe(GroupCount.FOUR)
    expect(recommendations.teamsPerGroup).toBe(4)
  })

  it('should update settings and recalculate teams per group', () => {
    const newSettings = {
      format: TournamentFormat.GROUP_STAGE,
      groupCount: GroupCount.TWO
    }

    tournamentStore.updateSettings(newSettings)

    expect(tournamentStore.settings.format).toBe(TournamentFormat.GROUP_STAGE)
    expect(tournamentStore.settings.groupCount).toBe(GroupCount.TWO)
    expect(tournamentStore.settings.teamsPerGroup).toBe(4) // 8 teams / 2 groups
  })

  it('should start direct knockout tournament', () => {
    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')
    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    tournamentStore.startTournament()

    expect(clearMatchesSpy).toHaveBeenCalled()
    expect(setMatchesSpy).toHaveBeenCalled()
    expect(tournamentStore.currentPhase).toBe('quarters')

    // Check that matches were created
    const setMatchesCall = setMatchesSpy.mock.calls[0][0]
    expect(setMatchesCall).toHaveLength(4) // 8 teams = 4 matches
  })

  it('should start group stage tournament', () => {
    tournamentStore.updateSettings({ format: TournamentFormat.GROUP_STAGE })

    const clearGroupsSpy = vi.spyOn(groupStore, 'clearGroups')
    const setGroupsSpy = vi.spyOn(groupStore, 'setGroups')
    const addMatchesSpy = vi.spyOn(matchStore, 'addMatches')

    tournamentStore.startTournament()

    expect(clearGroupsSpy).toHaveBeenCalled()
    expect(setGroupsSpy).toHaveBeenCalled()
    expect(addMatchesSpy).toHaveBeenCalled()
    expect(tournamentStore.currentPhase).toBe('groups')

    // Check groups were created
    const setGroupsCall = setGroupsSpy.mock.calls[0][0]
    expect(setGroupsCall).toHaveLength(4) // Default is 4 groups

    // Check group matches were created
    const addMatchesCall = addMatchesSpy.mock.calls[0][0]
    // Each group has 2 teams, so 1 match per group = 4 matches total
    expect(addMatchesCall).toHaveLength(4)
  })

  it('should not start tournament if conditions not met', () => {
    // Remove all teams
    while (teamStore.teams.length > 0) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }

    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    tournamentStore.startTournament()

    expect(clearMatchesSpy).not.toHaveBeenCalled()
    expect(tournamentStore.currentPhase).toBe('setup')
  })

  it('should advance to playoffs when all groups complete', () => {
    // Mock group store to return completed groups
    vi.spyOn(groupStore, 'allGroupsComplete', 'get').mockReturnValue(true)
    vi.spyOn(groupStore, 'getQualifiedTeams').mockReturnValue([
      teamStore.teams[0],
      teamStore.teams[1],
      teamStore.teams[2],
      teamStore.teams[3]
    ])

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    tournamentStore.advanceToPlayoffs()

    expect(setMatchesSpy).toHaveBeenCalled()
    expect(tournamentStore.currentPhase).toBe('semis')

    // Check playoff matches were created
    const setMatchesCall = setMatchesSpy.mock.calls[0][0]
    expect(setMatchesCall).toHaveLength(2) // 4 qualified teams = 2 matches
  })

  it('should complete tournament if not enough qualified teams', () => {
    vi.spyOn(groupStore, 'allGroupsComplete', 'get').mockReturnValue(true)
    vi.spyOn(groupStore, 'getQualifiedTeams').mockReturnValue([teamStore.teams[0]]) // Only 1 team

    tournamentStore.advanceToPlayoffs()

    expect(tournamentStore.currentPhase).toBe('complete')
  })

  it('should not advance to playoffs if groups not complete', () => {
    vi.spyOn(groupStore, 'allGroupsComplete', 'get').mockReturnValue(false)

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    tournamentStore.advanceToPlayoffs()

    expect(setMatchesSpy).not.toHaveBeenCalled()
    expect(tournamentStore.currentPhase).toBe('setup')
  })

  it('should reset tournament', () => {
    // Start a tournament first
    tournamentStore.startTournament()
    expect(tournamentStore.currentPhase).toBe('quarters')

    const clearGroupsSpy = vi.spyOn(groupStore, 'clearGroups')
    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    tournamentStore.resetTournament()

    expect(tournamentStore.currentPhase).toBe('setup')
    expect(clearGroupsSpy).toHaveBeenCalled()
    expect(clearMatchesSpy).toHaveBeenCalled()
  })

  it('should create correct group names', () => {
    tournamentStore.updateSettings({ 
      format: TournamentFormat.GROUP_STAGE,
      groupCount: GroupCount.FOUR
    })

    const setGroupsSpy = vi.spyOn(groupStore, 'setGroups')

    tournamentStore.startTournament()

    const groups = setGroupsSpy.mock.calls[0][0]
    expect(groups[0].name).toBe('Group A')
    expect(groups[1].name).toBe('Group B')
    expect(groups[2].name).toBe('Group C')
    expect(groups[3].name).toBe('Group D')
  })

  it('should initialize group standings correctly', () => {
    tournamentStore.updateSettings({ format: TournamentFormat.GROUP_STAGE })

    const setGroupsSpy = vi.spyOn(groupStore, 'setGroups')

    tournamentStore.startTournament()

    const groups = setGroupsSpy.mock.calls[0][0]
    const firstGroup = groups[0]
    
    expect(firstGroup.standings).toHaveLength(firstGroup.teams.length)
    
    const firstStanding = firstGroup.standings[0]
    expect(firstStanding.played).toBe(0)
    expect(firstStanding.won).toBe(0)
    expect(firstStanding.drawn).toBe(0)
    expect(firstStanding.lost).toBe(0)
    expect(firstStanding.points).toBe(0)
    expect(firstStanding.goalsFor).toBe(0)
    expect(firstStanding.goalsAgainst).toBe(0)
    expect(firstStanding.goalDifference).toBe(0)
  })
})
