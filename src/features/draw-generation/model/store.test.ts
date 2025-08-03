import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useDrawStore } from './store'
import { useTeamStore } from '@/entities/team'
import { useMatchStore } from '@/entities/match'
import type { Team } from '@/entities/team'

// Mock the shuffle function and timers
vi.mock('@/shared/lib', () => ({
  shuffleArray: vi.fn((arr) => [...arr]) // Return array as-is for predictable tests
}))

describe('Draw Generation Store', () => {
  let drawStore: ReturnType<typeof useDrawStore>
  let teamStore: ReturnType<typeof useTeamStore>
  let matchStore: ReturnType<typeof useMatchStore>

  const testTeams: Team[] = [
    { id: '1', name: 'Team A' },
    { id: '2', name: 'Team B' },
    { id: '3', name: 'Team C' },
    { id: '4', name: 'Team D' }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    drawStore = useDrawStore()
    teamStore = useTeamStore()
    matchStore = useMatchStore()

    // Clear default teams and add test teams
    while (teamStore.teams.length > 0) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }
    testTeams.forEach(team => {
      teamStore.addTeam(team.name, 'Country', 80)
    })

    // Mock setTimeout for faster tests
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with correct default state', () => {
    expect(drawStore.isDrawing).toBe(false)
    expect(drawStore.drawComplete).toBe(false)
    expect(drawStore.availableTeams).toHaveLength(4)
    expect(drawStore.canDraw).toBe(true)
  })

  it('should calculate available teams correctly', () => {
    // Initially all teams available
    expect(drawStore.availableTeams).toHaveLength(4)
    expect(drawStore.availableTeams.map(t => t.name)).toEqual(['Team A', 'Team B', 'Team C', 'Team D'])
  })

  it('should detect when draw is possible', () => {
    expect(drawStore.canDraw).toBe(true)

    // Remove teams until only 1 remains
    while (teamStore.teams.length > 1) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }
    expect(drawStore.canDraw).toBe(false)

    // Add another team
    teamStore.addTeam('Team E', 'Country', 80)
    expect(drawStore.canDraw).toBe(true)
  })

  it('should perform draw successfully', async () => {
    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')
    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    const drawPromise = drawStore.performDraw()
    
    // Check immediate state changes
    expect(drawStore.isDrawing).toBe(true)
    expect(drawStore.drawComplete).toBe(false)
    expect(clearMatchesSpy).toHaveBeenCalled()

    // Fast-forward timer
    vi.advanceTimersByTime(1500)
    await drawPromise

    // Check final state
    expect(drawStore.isDrawing).toBe(false)
    expect(drawStore.drawComplete).toBe(true)
    expect(setMatchesSpy).toHaveBeenCalled()

    // Check matches were created correctly
    const matches = setMatchesSpy.mock.calls[0][0]
    expect(matches).toHaveLength(2) // 4 teams = 2 matches
    expect(matches[0].id).toBe('match-1')
    expect(matches[1].id).toBe('match-2')
  })

  it('should not perform draw if conditions not met', async () => {
    // Remove teams until only 1 remains
    while (teamStore.teams.length > 1) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }

    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    await drawStore.performDraw()

    expect(clearMatchesSpy).not.toHaveBeenCalled()
    expect(drawStore.isDrawing).toBe(false)
    expect(drawStore.drawComplete).toBe(false)
  })

  it('should reset draw correctly', () => {
    // First perform a draw
    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    
    // Wait for draw to complete
    return drawPromise.then(() => {
      expect(drawStore.drawComplete).toBe(true)

      const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

      drawStore.resetDraw()

      expect(clearMatchesSpy).toHaveBeenCalled()
      expect(drawStore.drawComplete).toBe(false)
      expect(drawStore.isDrawing).toBe(false)
    })
  })

  it('should update available teams after draw completion', async () => {
    // Perform draw
    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    await drawPromise

    // After draw, available teams should exclude used teams
    // With 4 teams creating 2 matches, all teams should be used
    expect(drawStore.availableTeams).toHaveLength(0)
  })

  it('should handle odd number of teams', async () => {
    // Remove one team to have 3 teams
    teamStore.removeTeam(teamStore.teams[3].id)

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    await drawPromise

    // Should create 1 match with 3 teams (1 team left out)
    const matches = setMatchesSpy.mock.calls[0][0]
    expect(matches).toHaveLength(1)
    expect(drawStore.availableTeams).toHaveLength(1) // 1 team not matched
  })

  it('should handle draw with existing matches', async () => {
    // Set some existing matches
    matchStore.setMatches([{
      id: 'existing-match',
      team1: teamStore.teams[0],
      team2: teamStore.teams[1]
    }])

    // Draw should still work with remaining teams
    expect(drawStore.availableTeams).toHaveLength(2)
    expect(drawStore.canDraw).toBe(true)

    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    await drawPromise

    expect(drawStore.drawComplete).toBe(true)
  })

  it('should clear matches before performing new draw', async () => {
    // Set some existing matches
    matchStore.setMatches([{
      id: 'existing-match',
      team1: teamStore.teams[0],
      team2: teamStore.teams[1]
    }])

    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    await drawPromise

    expect(clearMatchesSpy).toHaveBeenCalled()
  })

  it('should maintain correct state during draw process', async () => {
    const drawPromise = drawStore.performDraw()

    // During drawing
    expect(drawStore.isDrawing).toBe(true)
    expect(drawStore.drawComplete).toBe(false)

    // Complete the draw
    vi.advanceTimersByTime(1500)
    await drawPromise

    // After drawing
    expect(drawStore.isDrawing).toBe(false)
    expect(drawStore.drawComplete).toBe(true)
  })

  it('should create matches with sequential IDs', async () => {
    // Add more teams for more matches
    teamStore.addTeam('Team E', 'Country', 80)
    teamStore.addTeam('Team F', 'Country', 80)

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    const drawPromise = drawStore.performDraw()
    vi.advanceTimersByTime(1500)
    await drawPromise

    const matches = setMatchesSpy.mock.calls[0][0]
    expect(matches).toHaveLength(3) // 6 teams = 3 matches
    expect(matches[0].id).toBe('match-1')
    expect(matches[1].id).toBe('match-2')
    expect(matches[2].id).toBe('match-3')
  })

  it('should handle empty teams list', async () => {
    // Remove all teams
    while (teamStore.teams.length > 0) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }

    expect(drawStore.canDraw).toBe(false)
    expect(drawStore.availableTeams).toHaveLength(0)

    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    await drawStore.performDraw()

    expect(clearMatchesSpy).not.toHaveBeenCalled()
    expect(drawStore.isDrawing).toBe(false)
    expect(drawStore.drawComplete).toBe(false)
  })
})
