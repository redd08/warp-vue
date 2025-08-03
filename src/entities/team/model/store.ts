import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import type { Team } from './types'

export const useTeamStore = defineStore('team', () => {
  const teams = ref<Team[]>([
    { id: 1, name: 'Manchester United', country: 'England', rating: 85 },
    { id: 2, name: 'Real Madrid', country: 'Spain', rating: 92 },
    { id: 3, name: 'Bayern Munich', country: 'Germany', rating: 89 },
    { id: 4, name: 'Barcelona', country: 'Spain', rating: 87 },
    { id: 5, name: 'PSG', country: 'France', rating: 86 },
    { id: 6, name: 'Liverpool', country: 'England', rating: 88 },
    { id: 7, name: 'Juventus', country: 'Italy', rating: 83 },
    { id: 8, name: 'Chelsea', country: 'England', rating: 84 },
  ])

  const addTeam = (name: string, country: string, rating: number) => {
    const newId = Math.max(0, ...teams.value.map(t => t.id)) + 1
    teams.value.push({ id: newId, name, country, rating })
  }

  const removeTeam = (teamId: number) => {
    teams.value = teams.value.filter(team => team.id !== teamId)
  }

  const getTeamById = (id: number): Team | undefined => {
    return teams.value.find(team => team.id === id)
  }

  return {
    teams: readonly(teams),
    addTeam,
    removeTeam,
    getTeamById
  }
})
