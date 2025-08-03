import { describe, it, expect } from 'vitest'
import type { Team } from './types'

describe('Team Entity', () => {
  it('should create a valid team object', () => {
    const team: Team = {
      id: '1',
      name: 'Manchester United',
      country: 'England'
    }

    expect(team.id).toBe('1')
    expect(team.name).toBe('Manchester United')
    expect(team.country).toBe('England')
  })

  it('should allow team without country', () => {
    const team: Team = {
      id: '2',
      name: 'Barcelona'
    }

    expect(team.id).toBe('2')
    expect(team.name).toBe('Barcelona')
    expect(team.country).toBeUndefined()
  })

  it('should maintain immutability principles', () => {
    const originalTeam: Team = {
      id: '1',
      name: 'Liverpool',
      country: 'England'
    }

    // Create a copy and modify it
    const modifiedTeam = { ...originalTeam, name: 'Liverpool FC' }

    expect(originalTeam.name).toBe('Liverpool')
    expect(modifiedTeam.name).toBe('Liverpool FC')
    expect(originalTeam.id).toBe(modifiedTeam.id)
  })
})
