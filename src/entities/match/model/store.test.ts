import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMatchStore } from './store'
import type { Match } from './types'
import type { Team } from '@/entities/team'

describe('Match Store', () => {
  let store: ReturnType<typeof useMatchStore>
  
  const team1: Team = { id: 1, name: 'Team A', country: 'Country A', rating: 80 }
  const team2: Team = { id: 2, name: 'Team B', country: 'Country B', rating: 80 }
  const team3: Team = { id: 3, name: 'Team C', country: 'Country C', rating: 80 }
  const team4: Team = { id: 4, name: 'Team D', country: 'Country D', rating: 80 }

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
        stage: 'group'
      },
      {
        id: 'match-2',
        team1: team3,
        team2: team4,
        stage: 'group'
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
        team2,
        stage: 'group'
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
        stage: 'final'
      },
      {
        id: 'match-2',
        team1: team3,
        team2: team4,
        stage: 'semis'
      }
    ]

    store.setMatches(matches)

    const match = store.getMatchById('match-1')
    expect(match).toEqual({
      id: 'match-1',
      team1,
      team2,
      stage: 'final'
    })
  })

  it('should return undefined for non-existent match ID', () => {
    const matches: Match[] = [
      {
        id: 'match-1',
        team1,
        team2,
        stage: 'group'
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
        team2,
        stage: 'group'
      }
    ]

    const newMatches: Match[] = [
      {
        id: 'match-2',
        team1: team3,
        team2: team4,
        stage: 'quarters'
      },
      {
        id: 'match-3',
        team1,
        team2: team3,
        stage: 'quarters'
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
        team2,
        stage: 'group'
      }
    ]

    store.setMatches(matches)

    // Vue's readonly wrapper prevents mutations but doesn't throw errors
    // It just logs warnings and the mutation is ignored
    const initialLength = store.matches.length

    // @ts-expect-error - Testing readonly behavior
    store.matches.push({ id: 'invalid', team1, team2, stage: 'group' })

    // The array should remain unchanged
    expect(store.matches).toHaveLength(initialLength)
  })

  it('should handle empty matches array', () => {
    store.setMatches([])
    
    expect(store.matches).toHaveLength(0)
    expect(store.getMatchById('any-id')).toBeUndefined()
  })
})
