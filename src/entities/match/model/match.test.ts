import { describe, it, expect } from 'vitest'
import type { Match, MatchResult } from './types'
import type { Team } from '@/entities/team'

describe('Match Entity', () => {
  const team1: Team = { id: '1', name: 'Team A' }
  const team2: Team = { id: '2', name: 'Team B' }

  it('should create a valid match object', () => {
    const match: Match = {
      id: '1',
      team1,
      team2,
      round: 'Round of 16'
    }

    expect(match.id).toBe('1')
    expect(match.team1).toEqual(team1)
    expect(match.team2).toEqual(team2)
    expect(match.round).toBe('Round of 16')
    expect(match.result).toBeUndefined()
  })

  it('should create a match with result', () => {
    const result: MatchResult = {
      team1Score: 2,
      team2Score: 1,
      winner: team1
    }

    const match: Match = {
      id: '2',
      team1,
      team2,
      round: 'Final',
      result
    }

    expect(match.result).toEqual(result)
    expect(match.result?.winner).toEqual(team1)
  })

  it('should handle draw result', () => {
    const result: MatchResult = {
      team1Score: 1,
      team2Score: 1,
      winner: null
    }

    const match: Match = {
      id: '3',
      team1,
      team2,
      round: 'Group Stage',
      result
    }

    expect(match.result?.winner).toBeNull()
    expect(match.result?.team1Score).toBe(1)
    expect(match.result?.team2Score).toBe(1)
  })

  it('should allow match without round specification', () => {
    const match: Match = {
      id: '4',
      team1,
      team2
    }

    expect(match.round).toBeUndefined()
    expect(match.id).toBe('4')
  })
})
