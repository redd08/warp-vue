import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTeamStore } from './store'

describe('Team Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default teams', () => {
    const store = useTeamStore()
    
    expect(store.teams).toHaveLength(8)
    expect(store.teams[0]).toEqual({
      id: 1,
      name: 'Manchester United',
      country: 'England',
      rating: 85
    })
  })

  it('should add a new team', () => {
    const store = useTeamStore()
    const initialCount = store.teams.length
    
    store.addTeam('Arsenal', 'England', 82)
    
    expect(store.teams).toHaveLength(initialCount + 1)
    const newTeam = store.teams[store.teams.length - 1]
    expect(newTeam.name).toBe('Arsenal')
    expect(newTeam.country).toBe('England')
    expect(newTeam.rating).toBe(82)
    expect(newTeam.id).toBe(9) // Should be max existing ID + 1
  })

  it('should generate correct ID for new team', () => {
    const store = useTeamStore()
    
    // Remove a team to create a gap in IDs
    store.removeTeam(3)
    
    store.addTeam('Test Team', 'Test Country', 80)
    
    const newTeam = store.teams[store.teams.length - 1]
    expect(newTeam.id).toBe(9) // Should be max + 1 (8 + 1), not filling the gap
  })

  it('should remove a team by ID', () => {
    const store = useTeamStore()
    const initialCount = store.teams.length
    
    store.removeTeam(1)
    
    expect(store.teams).toHaveLength(initialCount - 1)
    expect(store.teams.find(t => t.id === 1)).toBeUndefined()
  })

  it('should handle removing non-existent team', () => {
    const store = useTeamStore()
    const initialCount = store.teams.length
    
    store.removeTeam(999)
    
    expect(store.teams).toHaveLength(initialCount)
  })

  it('should get team by ID', () => {
    const store = useTeamStore()
    
    const team = store.getTeamById(2)
    
    expect(team).toEqual({
      id: 2,
      name: 'Real Madrid',
      country: 'Spain',
      rating: 92
    })
  })

  it('should return undefined for non-existent team ID', () => {
    const store = useTeamStore()
    
    const team = store.getTeamById(999)
    
    expect(team).toBeUndefined()
  })

  it('should handle adding team when teams array is empty', () => {
    const store = useTeamStore()
    
    // Remove all teams
    while (store.teams.length > 0) {
      store.removeTeam(store.teams[0].id)
    }
    
    store.addTeam('First Team', 'Country', 90)
    
    expect(store.teams).toHaveLength(1)
    expect(store.teams[0].id).toBe(1) // Should start from 1 when array is empty
  })

  it('should maintain readonly teams reference', () => {
    const store = useTeamStore()
    
    // Vue's readonly wrapper prevents mutations but doesn't throw errors
    // It just logs warnings and the mutation is ignored
    const initialLength = store.teams.length
    
    // @ts-expect-error - Testing readonly behavior
    store.teams.push({ id: 999, name: 'Test', country: 'Test', rating: 0 })
    
    // The array should remain unchanged
    expect(store.teams).toHaveLength(initialLength)
  })
})
