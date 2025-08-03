import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMatchStore } from './store'
import type { Match } from './types'
import type { Team } from '@/entities/team'

describe('Match Store', () => {
  let store: ReturnType<typeof useMatchStore>
  
  const team1: Team = { id: '1', name: 'Team A' }
  const team2: Team = { id: '2', name: 'Team B' }
  const team3: Team = { id: '3', name: 'Team C' }
  const team4: Team = { id: '4', name: 'Team D' }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMatchStore()
  })

  it('should initialize with empty matches', () => {
    expect(store.matches).toHaveLength(0)
  })

  it('should set matches', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2,
        round: 'Round 1'
      },
      {
        id: 'match-2',
        team1: team3,
        team2: team4,
        round: 'Round 1'
      }
    ]

    store.setMatches(matches)

    expect(store.matches).toEqual(matches)
    expect(store.matches).toHaveLength(2)
  })

  it('should clear matches', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2
      }
    ]

    store.setMatches(matches)
    expect(store.matches).toHaveLength(1)

    store.clearMatches()
    expect(store.matches).toHaveLength(0)
  })

  it('should get match by ID', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2,
        round: 'Final'
      },
      {
        id: 'match-2',
        team1: team3,
        team2: team4,
        round: 'Semi-final'
      }
    ]

    store.setMatches(matches)

    const match = store.getMatchById('match-1')
    expect(match).toEqual({
      id: 'match-1',
      team1,
      team2,
      round: 'Final'
    })
  })

  it('should return undefined for non-existent match ID', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2
      }
    ]

    store.setMatches(matches)

    const match = store.getMatchById('non-existent')
    expect(match).toBeUndefined()
  })

  it('should replace existing matches when setting new ones', () => {
    const initialMatches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2
      }
    ]

    const newMatches: Match[] = [
      {
        id: 'match-2',
        team1: team3,
        team2: team4
      },
      {
        id: 'match-3',
        team1,
        team2: team3
      }
    ]

    store.setMatches(initialMatches)
    expect(store.matches).toHaveLength(1)

    store.setMatches(newMatches)
    expect(store.matches).toEqual(newMatches)
    expect(store.matches).toHaveLength(2)
    expect(store.getMatchById('match-1')).toBeUndefined()
  })

  it('should maintain readonly matches reference', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2
      }
    ]

    store.setMatches(matches)

    // This should not be allowed in TypeScript, but let's test the behavior
    expect(() => {
      // @ts-expect-error - Testing readonly behavior
      store.matches.push({ id: 'invalid', team1, team2 })
    }).toThrow()
  })

  it('should handle empty matches array', () => {
    store.setMatches([])
    
    expect(store.matches).toHaveLength(0)
    expect(store.getMatchById('any-id')).toBeUndefined()
  })
})
