import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useManualDrawStore } from './store'
import { useTeamStore } from '@/entities/team'
import { useMatchStore } from '@/entities/match'
import type { Team } from '@/entities/team'

describe('Manual Draw Store', () => {
  let manualDrawStore: ReturnType<typeof useManualDrawStore>
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
    manualDrawStore = useManualDrawStore()
    teamStore = useTeamStore()
    matchStore = useMatchStore()

    // Clear default teams and add test teams
    while (teamStore.teams.length > 0) {
      teamStore.removeTeam(teamStore.teams[0].id)
    }
    testTeams.forEach(team => {
      teamStore.addTeam(team.name, 'Country', 80)
    })
  })

  it('should initialize with manual mode disabled', () => {
    expect(manualDrawStore.isManualMode).toBe(false)
    expect(manualDrawStore.matchSlots).toHaveLength(0)
    expect(manualDrawStore.draggedTeam).toBeNull()
    expect(manualDrawStore.availableTeams).toHaveLength(0)
    expect(manualDrawStore.canFinalizeDraw).toBe(false)
  })

  it('should start manual draw and create match slots', () => {
    const clearMatchesSpy = vi.spyOn(matchStore, 'clearMatches')

    manualDrawStore.startManualDraw()

    expect(manualDrawStore.isManualMode).toBe(true)
    expect(clearMatchesSpy).toHaveBeenCalled()
    expect(manualDrawStore.matchSlots).toHaveLength(2) // 4 teams = 2 matches
    expect(manualDrawStore.availableTeams).toHaveLength(4)
  })

  it('should calculate available teams correctly', () => {
    manualDrawStore.startManualDraw()

    // Initially all teams available
    expect(manualDrawStore.availableTeams).toHaveLength(4)

    // Place teams in slots
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])
    manualDrawStore.setTeamInSlot('slot-1', 'team2', teamStore.teams[1])

    // Should have 2 teams left
    expect(manualDrawStore.availableTeams).toHaveLength(2)
    expect(manualDrawStore.availableTeams.map(t => t.id)).toEqual(['3', '4'])
  })

  it('should add match slot', () => {
    manualDrawStore.startManualDraw()
    expect(manualDrawStore.matchSlots).toHaveLength(2)

    manualDrawStore.addMatchSlot()
    expect(manualDrawStore.matchSlots).toHaveLength(3)
    expect(manualDrawStore.matchSlots[2].id).toBe('slot-3')
  })

  it('should remove match slot', () => {
    manualDrawStore.startManualDraw()
    expect(manualDrawStore.matchSlots).toHaveLength(2)

    manualDrawStore.removeMatchSlot('slot-1')
    expect(manualDrawStore.matchSlots).toHaveLength(1)
    expect(manualDrawStore.matchSlots[0].id).toBe('slot-2')
  })

  it('should set team in slot', () => {
    manualDrawStore.startManualDraw()
    const team = teamStore.teams[0]

    manualDrawStore.setTeamInSlot('slot-1', 'team1', team)

    const slot = manualDrawStore.matchSlots.find(s => s.id === 'slot-1')
    expect(slot?.team1).toEqual(team)
    expect(slot?.team2).toBeNull()
  })

  it('should remove team from slot', () => {
    manualDrawStore.startManualDraw()
    const team = teamStore.teams[0]

    manualDrawStore.setTeamInSlot('slot-1', 'team1', team)
    expect(manualDrawStore.matchSlots[0].team1).toEqual(team)

    manualDrawStore.removeTeamFromSlot('slot-1', 'team1')
    expect(manualDrawStore.matchSlots[0].team1).toBeNull()
  })

  it('should detect when draw can be finalized', () => {
    manualDrawStore.startManualDraw()
    expect(manualDrawStore.canFinalizeDraw).toBe(false)

    // Fill first slot completely
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])
    manualDrawStore.setTeamInSlot('slot-1', 'team2', teamStore.teams[1])
    expect(manualDrawStore.canFinalizeDraw).toBe(false) // Still need to fill other slots

    // Fill second slot completely
    manualDrawStore.setTeamInSlot('slot-2', 'team1', teamStore.teams[2])
    manualDrawStore.setTeamInSlot('slot-2', 'team2', teamStore.teams[3])
    expect(manualDrawStore.canFinalizeDraw).toBe(true)
  })

  it('should finalize draw and create matches', () => {
    manualDrawStore.startManualDraw()
    
    // Fill slots
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])
    manualDrawStore.setTeamInSlot('slot-1', 'team2', teamStore.teams[1])
    manualDrawStore.setTeamInSlot('slot-2', 'team1', teamStore.teams[2])
    manualDrawStore.setTeamInSlot('slot-2', 'team2', teamStore.teams[3])

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    manualDrawStore.finalizeDraw()

    expect(setMatchesSpy).toHaveBeenCalled()
    expect(manualDrawStore.isManualMode).toBe(false)
    expect(manualDrawStore.matchSlots).toHaveLength(0)

    // Check matches were created correctly
    const matches = setMatchesSpy.mock.calls[0][0]
    expect(matches).toHaveLength(2)
    expect(matches[0].id).toBe('match-1')
    expect(matches[1].id).toBe('match-2')
  })

  it('should not finalize draw if conditions not met', () => {
    manualDrawStore.startManualDraw()
    
    // Only fill one slot partially
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    manualDrawStore.finalizeDraw()

    expect(setMatchesSpy).not.toHaveBeenCalled()
    expect(manualDrawStore.isManualMode).toBe(true)
  })

  it('should cancel manual draw', () => {
    manualDrawStore.startManualDraw()
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])
    manualDrawStore.setDraggedTeam(teamStore.teams[1])

    manualDrawStore.cancelManualDraw()

    expect(manualDrawStore.isManualMode).toBe(false)
    expect(manualDrawStore.matchSlots).toHaveLength(0)
    expect(manualDrawStore.draggedTeam).toBeNull()
  })

  it('should set and clear dragged team', () => {
    const team = teamStore.teams[0]

    manualDrawStore.setDraggedTeam(team)
    expect(manualDrawStore.draggedTeam).toEqual(team)

    manualDrawStore.setDraggedTeam(null)
    expect(manualDrawStore.draggedTeam).toBeNull()
  })

  it('should handle setting team in non-existent slot', () => {
    manualDrawStore.startManualDraw()
    const team = teamStore.teams[0]

    // Should not throw error
    manualDrawStore.setTeamInSlot('non-existent', 'team1', team)

    // Verify no slots were affected
    expect(manualDrawStore.matchSlots.every(slot => slot.team1 === null)).toBe(true)
  })

  it('should filter out incomplete slots when finalizing', () => {
    manualDrawStore.startManualDraw()
    manualDrawStore.addMatchSlot() // Add extra slot

    // Fill only first two slots completely
    manualDrawStore.setTeamInSlot('slot-1', 'team1', teamStore.teams[0])
    manualDrawStore.setTeamInSlot('slot-1', 'team2', teamStore.teams[1])
    manualDrawStore.setTeamInSlot('slot-2', 'team1', teamStore.teams[2])
    manualDrawStore.setTeamInSlot('slot-2', 'team2', teamStore.teams[3])
    // Leave slot-3 empty

    const setMatchesSpy = vi.spyOn(matchStore, 'setMatches')

    // Should not be able to finalize with incomplete slots
    expect(manualDrawStore.canFinalizeDraw).toBe(false)
    
    manualDrawStore.finalizeDraw()
    expect(setMatchesSpy).not.toHaveBeenCalled()
  })

  it('should handle odd number of teams', () => {
    // Remove one team to have 3 teams
    teamStore.removeTeam(teamStore.teams[3].id)

    manualDrawStore.startManualDraw()

    // Should create 1 match slot for 3 teams (floor(3/2) = 1)
    expect(manualDrawStore.matchSlots).toHaveLength(1)
    expect(manualDrawStore.availableTeams).toHaveLength(3)
  })
})
