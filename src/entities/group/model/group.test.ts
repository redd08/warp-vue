import { describe, it, expect } from 'vitest'
import type { Group, GroupMatch, GroupStanding } from './types'
import type { Team } from '@/entities/team'

describe('Group Entity', () => {
  const teamA: Team = { id: '1', name: 'Team A' }
  const teamB: Team = { id: '2', name: 'Team B' }
  const teamC: Team = { id: '3', name: 'Team C' }
  const teamD: Team = { id: '4', name: 'Team D' }

  it('should create a valid group', () => {
    const group: Group = {
      id: 'group-a',
      name: 'Group A',
      teams: [teamA, teamB, teamC, teamD],
      standings: []
    }

    expect(group.id).toBe('group-a')
    expect(group.name).toBe('Group A')
    expect(group.teams).toHaveLength(4)
    expect(group.standings).toHaveLength(0)
  })

  it('should create group standings with correct structure', () => {
    const standing: GroupStanding = {
      team: teamA,
      position: 1,
      points: 9,
      played: 3,
      won: 3,
      drawn: 0,
      lost: 0,
      goalsFor: 8,
      goalsAgainst: 2,
      goalDifference: 6,
      qualified: true,
      eliminated: false
    }

    expect(standing.team).toEqual(teamA)
    expect(standing.points).toBe(9)
    expect(standing.goalDifference).toBe(6)
    expect(standing.qualified).toBe(true)
    expect(standing.eliminated).toBe(false)
  })

  it('should create a group match', () => {
    const groupMatch: GroupMatch = {
      id: 'match-1',
      groupId: 'group-a',
      team1: teamA,
      team2: teamB,
      team1Score: 2,
      team2Score: 1,
      completed: true
    }

    expect(groupMatch.groupId).toBe('group-a')
    expect(groupMatch.team1Score).toBe(2)
    expect(groupMatch.team2Score).toBe(1)
    expect(groupMatch.completed).toBe(true)
  })

  it('should create incomplete group match', () => {
    const groupMatch: GroupMatch = {
      id: 'match-2',
      groupId: 'group-b',
      team1: teamC,
      team2: teamD,
      completed: false
    }

    expect(groupMatch.team1Score).toBeUndefined()
    expect(groupMatch.team2Score).toBeUndefined()
    expect(groupMatch.completed).toBe(false)
  })

  it('should handle draw in group match', () => {
    const groupMatch: GroupMatch = {
      id: 'match-3',
      groupId: 'group-a',
      team1: teamA,
      team2: teamB,
      team1Score: 1,
      team2Score: 1,
      completed: true
    }

    expect(groupMatch.team1Score).toBe(groupMatch.team2Score)
    expect(groupMatch.completed).toBe(true)
  })

  it('should validate group standings calculations', () => {
    const standing: GroupStanding = {
      team: teamA,
      position: 2,
      points: 4,
      played: 3,
      won: 1,
      drawn: 1,
      lost: 1,
      goalsFor: 3,
      goalsAgainst: 3,
      goalDifference: 0,
      qualified: false,
      eliminated: false
    }

    // Points calculation: (won * 3) + (drawn * 1) = (1 * 3) + (1 * 1) = 4
    expect(standing.won * 3 + standing.drawn * 1).toBe(standing.points)
    
    // Goal difference calculation
    expect(standing.goalsFor - standing.goalsAgainst).toBe(standing.goalDifference)
    
    // Games played calculation
    expect(standing.won + standing.drawn + standing.lost).toBe(standing.played)
  })
})
