import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useTeamStore, type Team } from '@/entities/team'
import { useMatchStore, type Match } from '@/entities/match'

export interface MatchSlot {
  id: string
  team1: Team | null
  team2: Team | null
}

export const useManualDrawStore = defineStore('manualDraw', () => {
  const teamStore = useTeamStore()
  const matchStore = useMatchStore()
  
  const isManualMode = ref(false)
  const matchSlots = ref<MatchSlot[]>([])
  const draggedTeam = ref<Team | null>(null)

  const availableTeams = computed(() => {
    if (!isManualMode.value) return []
    
    const usedTeamIds = new Set()
    matchSlots.value.forEach(slot => {
      if (slot.team1) usedTeamIds.add(slot.team1.id)
      if (slot.team2) usedTeamIds.add(slot.team2.id)
    })
    
    return teamStore.teams.filter(team => !usedTeamIds.has(team.id))
  })

  const canFinalizeDraw = computed(() => {
    return matchSlots.value.length > 0 && 
           matchSlots.value.every(slot => slot.team1 && slot.team2)
  })

  const startManualDraw = () => {
    isManualMode.value = true
    matchStore.clearMatches()
    
    // Create initial match slots based on available teams
    const teamCount = teamStore.teams.length
    const matchCount = Math.floor(teamCount / 2)
    
    matchSlots.value = Array.from({ length: matchCount }, (_, index) => ({
      id: `slot-${index + 1}`,
      team1: null,
      team2: null
    }))
  }

  const addMatchSlot = () => {
    const newId = `slot-${matchSlots.value.length + 1}`
    matchSlots.value.push({
      id: newId,
      team1: null,
      team2: null
    })
  }

  const removeMatchSlot = (slotId: string) => {
    matchSlots.value = matchSlots.value.filter(slot => slot.id !== slotId)
  }

  const setTeamInSlot = (slotId: string, position: 'team1' | 'team2', team: Team | null) => {
    const slot = matchSlots.value.find(s => s.id === slotId)
    if (slot) {
      slot[position] = team
    }
  }

  const removeTeamFromSlot = (slotId: string, position: 'team1' | 'team2') => {
    setTeamInSlot(slotId, position, null)
  }

  const finalizeDraw = () => {
    if (!canFinalizeDraw.value) return

    const matches: Match[] = matchSlots.value
      .filter(slot => slot.team1 && slot.team2)
      .map((slot, index) => ({
        id: `match-${index + 1}`,
        team1: slot.team1!,
        team2: slot.team2!
      }))

    matchStore.setMatches(matches)
    isManualMode.value = false
    matchSlots.value = []
  }

  const cancelManualDraw = () => {
    isManualMode.value = false
    matchSlots.value = []
    draggedTeam.value = null
  }

  const setDraggedTeam = (team: Team | null) => {
    draggedTeam.value = team
  }

  return {
    isManualMode: readonly(isManualMode),
    matchSlots: readonly(matchSlots),
    draggedTeam: readonly(draggedTeam),
    availableTeams,
    canFinalizeDraw,
    startManualDraw,
    addMatchSlot,
    removeMatchSlot,
    setTeamInSlot,
    removeTeamFromSlot,
    finalizeDraw,
    cancelManualDraw,
    setDraggedTeam
  }
})
