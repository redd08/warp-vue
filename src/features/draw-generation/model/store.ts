import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { useTeamStore, type Team } from '@/entities/team'
import { useMatchStore, type Match } from '@/entities/match'
import { shuffleArray } from '@/shared/lib'

export const useDrawStore = defineStore('draw', () => {
  const teamStore = useTeamStore()
  const matchStore = useMatchStore()
  
  const isDrawing = ref(false)
  const drawComplete = ref(false)

  const availableTeams = computed(() => {
    if (!drawComplete.value) return teamStore.teams
    
    const usedTeamIds = new Set()
    matchStore.matches.forEach(match => {
      usedTeamIds.add(match.team1.id)
      usedTeamIds.add(match.team2.id)
    })
    
    return teamStore.teams.filter(team => !usedTeamIds.has(team.id))
  })

  const canDraw = computed(() => availableTeams.value.length >= 2)

  const performDraw = async () => {
    if (!canDraw.value) return

    isDrawing.value = true
    matchStore.clearMatches()
    drawComplete.value = false

    // Simulate drawing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const shuffledTeams = shuffleArray(availableTeams.value)
    const newMatches: Match[] = []

    for (let i = 0; i < shuffledTeams.length - 1; i += 2) {
      if (shuffledTeams[i + 1]) {
        newMatches.push({
          id: `match-${i / 2 + 1}`,
          team1: shuffledTeams[i],
          team2: shuffledTeams[i + 1]
        })
      }
    }

    matchStore.setMatches(newMatches)
    isDrawing.value = false
    drawComplete.value = true
  }

  const resetDraw = () => {
    matchStore.clearMatches()
    drawComplete.value = false
    isDrawing.value = false
  }

  return {
    isDrawing: readonly(isDrawing),
    drawComplete: readonly(drawComplete),
    availableTeams,
    canDraw,
    performDraw,
    resetDraw
  }
})
