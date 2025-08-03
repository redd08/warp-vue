import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGroupStore } from './store'
import type { Group, GroupMatch } from './types'
import type { Team } from '@/entities/team'

describe('Group Store', () => {
  let store: ReturnType<typeof useGroupStore>
  
  const teamA: Team = { id: '1', name: 'Team A' }
  const teamB: Team = { id: '2', name: 'Team B' }
  const teamC: Team = { id: '3', name: 'Team C' }
  const teamD: Team = { id: '4', name: 'Team D' }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGroupStore()
  })

  it('should initialize with empty groups and matches', () => {
    expect(store.groups).toHaveLength(0)
    expect(store.groupMatches).toHaveLength(0)
    expect(store.allGroupsComplete).toBe(false)
  })

  it('should set groups', () => {
    const groups: Group[] = [{
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB],
      standings: [],
      isComplete: false
    }]

    store.setGroups(groups)

    expect(store.groups).toEqual(groups)
  })

  it('should set group matches', () => {
    const matches: GroupMatch[] = [{
      id: 'match-1',
      groupId: 'group-a',
      team1: teamA,
      team2: teamB,
      isComplete: false
    }]

    store.setGroupMatches(matches)

    expect(store.groupMatches).toEqual(matches)
  })

  it('should update match score and calculate standings', () => {
    // Setup group and match
    const group: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB],
      standings: [
        {
          team: teamA,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        },
        {
          team: teamB,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        }
      ],
      isComplete: false
    }

    const match: GroupMatch = {
      id: 'match-1',
      groupId: 'group-a',
      team1: teamA,
      team2: teamB,
      isComplete: false
    }

    store.setGroups([group])
    store.setGroupMatches([match])

    // Update match score
    store.updateMatchScore('match-1', 2, 1)

    // Check match was updated
    expect(store.groupMatches[0].team1Score).toBe(2)
    expect(store.groupMatches[0].team2Score).toBe(1)
    expect(store.groupMatches[0].isComplete).toBe(true)

    // Check standings were updated
    const updatedGroup = store.groups[0]
    const teamAStanding = updatedGroup.standings.find(s => s.team.id === teamA.id)!
    const teamBStanding = updatedGroup.standings.find(s => s.team.id === teamB.id)!

    expect(teamAStanding.played).toBe(1)
    expect(teamAStanding.won).toBe(1)
    expect(teamAStanding.points).toBe(3)
    expect(teamAStanding.goalsFor).toBe(2)
    expect(teamAStanding.goalsAgainst).toBe(1)
    expect(teamAStanding.goalDifference).toBe(1)

    expect(teamBStanding.played).toBe(1)
    expect(teamBStanding.lost).toBe(1)
    expect(teamBStanding.points).toBe(0)
    expect(teamBStanding.goalsFor).toBe(1)
    expect(teamBStanding.goalsAgainst).toBe(2)
    expect(teamBStanding.goalDifference).toBe(-1)
  })

  it('should handle draw match score', () => {
    const group: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB],
      standings: [
        {
          team: teamA,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        },
        {
          team: teamB,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        }
      ],
      isComplete: false
    }

    const match: GroupMatch = {
      id: 'match-1',
      groupId: 'group-a',
      team1: teamA,
      team2: teamB,
      isComplete: false
    }

    store.setGroups([group])
    store.setGroupMatches([match])

    store.updateMatchScore('match-1', 1, 1)

    const updatedGroup = store.groups[0]
    const teamAStanding = updatedGroup.standings.find(s => s.team.id === teamA.id)!
    const teamBStanding = updatedGroup.standings.find(s => s.team.id === teamB.id)!

    expect(teamAStanding.drawn).toBe(1)
    expect(teamAStanding.points).toBe(1)
    expect(teamBStanding.drawn).toBe(1)
    expect(teamBStanding.points).toBe(1)
  })

  it('should sort standings correctly', () => {
    const group: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB, teamC],
      standings: [],
      isComplete: false
    }

    const matches: GroupMatch[] = [
      {
        id: 'match-1',
        groupId: 'group-a',
        team1: teamA,
        team2: teamB,
        team1Score: 3,
        team2Score: 0,
        isComplete: true
      },
      {
        id: 'match-2',
        groupId: 'group-a',
        team1: teamB,
        team2: teamC,
        team1Score: 1,
        team2Score: 1,
        isComplete: true
      },
      {
        id: 'match-3',
        groupId: 'group-a',
        team1: teamA,
        team2: teamC,
        team1Score: 2,
        team2Score: 1,
        isComplete: true
      }
    ]

    store.setGroups([group])
    store.setGroupMatches(matches)

    // Trigger standings calculation by updating a completed match
    store.updateMatchScore('match-1', 3, 0)

    const standings = store.groups[0].standings
    
    // Team A should be first (6 points, +4 goal difference)
    expect(standings[0].team.id).toBe(teamA.id)
    expect(standings[0].points).toBe(6)
    
    // Team C should be second (1 point)
    expect(standings[1].team.id).toBe(teamC.id)
    expect(standings[1].points).toBe(1)
    
    // Team B should be third (1 point, worse goal difference)
    expect(standings[2].team.id).toBe(teamB.id)
    expect(standings[2].points).toBe(1)
  })

  it('should detect when all groups are complete', () => {
    const group1: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB],
      standings: [],
      isComplete: false
    }

    const group2: Group = {
      id: 'group-b',
      name: 'Group B',
      teams: [teamC, teamD],
      standings: [],
      isComplete: false
    }

    store.setGroups([group1, group2])
    store.setGroupMatches([
      {
        id: 'match-1',
        groupId: 'group-a',
        team1: teamA,
        team2: teamB,
        isComplete: false
      },
      {
        id: 'match-2',
        groupId: 'group-b',
        team1: teamC,
        team2: teamD,
        isComplete: false
      }
    ])

    expect(store.allGroupsComplete).toBe(false)

    // Complete first match
    store.updateMatchScore('match-1', 1, 0)
    expect(store.allGroupsComplete).toBe(false) // Still one incomplete group

    // Complete second match
    store.updateMatchScore('match-2', 2, 1)
    expect(store.allGroupsComplete).toBe(true) // All groups complete
  })

  it('should get qualified teams', () => {
    const group: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB, teamC, teamD],
      standings: [
        { team: teamA, played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 6, goalsAgainst: 1, goalDifference: 5, points: 9 },
        { team: teamB, played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, points: 6 },
        { team: teamC, played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
        { team: teamD, played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 0 }
      ],
      isComplete: true
    }

    store.setGroups([group])

    const qualifiedTeams = store.getQualifiedTeams(2)

    expect(qualifiedTeams).toHaveLength(2)
    expect(qualifiedTeams[0]).toEqual(teamA)
    expect(qualifiedTeams[1]).toEqual(teamB)
  })

  it('should clear groups and matches', () => {
    const groups: Group[] = [{ id: 'group-a', name: 'Group A', teams: [], standings: [], isComplete: false }]
    const matches: GroupMatch[] = [{ id: 'match-1', groupId: 'group-a', team1: teamA, team2: teamB, isComplete: false }]

    store.setGroups(groups)
    store.setGroupMatches(matches)

    expect(store.groups).toHaveLength(1)
    expect(store.groupMatches).toHaveLength(1)

    store.clearGroups()

    expect(store.groups).toHaveLength(0)
    expect(store.groupMatches).toHaveLength(0)
  })

  it('should handle updating non-existent match', () => {
    store.updateMatchScore('non-existent', 1, 0)
    // Should not throw error, just do nothing
    expect(store.groupMatches).toHaveLength(0)
  })
})
