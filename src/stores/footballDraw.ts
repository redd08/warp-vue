import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Team {
  id: number
  name: string
  country: string
}

export interface Match {
  team1: Team
  team2: Team
  id: string
}

export const useFootballDrawStore = defineStore('footballDraw', () => {
  const teams = ref<Team[]>([
    { id: 1, name: 'Manchester United', country: 'England' },
    { id: 2, name: 'Real Madrid', country: 'Spain' },
    { id: 3, name: 'Bayern Munich', country: 'Germany' },
    { id: 4, name: 'Barcelona', country: 'Spain' },
    { id: 5, name: 'PSG', country: 'France' },
    { id: 6, name: 'Liverpool', country: 'England' },
    { id: 7, name: 'Juventus', country: 'Italy' },
    { id: 8, name: 'Chelsea', country: 'England' },
  ])

  const matches = ref<Match[]>([])
  const isDrawing = ref(false)
  const drawComplete = ref(false)

  const availableTeams = computed(() => 
    teams.value.filter(team => 
      !matches.value.some(match => 
        match.team1.id === team.id || match.team2.id === team.id
      )
    )
  )

  const canDraw = computed(() => availableTeams.value.length >= 2)

  function addTeam(name: string, country: string) {
    const newId = Math.max(0, ...teams.value.map(t => t.id)) + 1
    teams.value.push({ id: newId, name, country })
  }

  function removeTeam(teamId: number) {
    teams.value = teams.value.filter(team => team.id !== teamId)
    // Remove any matches involving this team
    matches.value = matches.value.filter(match => 
      match.team1.id !== teamId && match.team2.id !== teamId
    )
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  async function performDraw() {
    if (!canDraw.value) return
    
    isDrawing.value = true
    matches.value = []
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

    matches.value = newMatches
    isDrawing.value = false
    drawComplete.value = true
  }

  function resetDraw() {
    matches.value = []
    drawComplete.value = false
    isDrawing.value = false
  }

  return {
    teams,
    matches,
    isDrawing,
    drawComplete,
    availableTeams,
    canDraw,
    addTeam,
    removeTeam,
    performDraw,
    resetDraw
  }
})
