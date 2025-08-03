import { defineStore } from 'pinia'
import { ref, readonly, computed } from 'vue'
import type { Match, MatchStage } from './types'

export const useMatchStore = defineStore('match', () => {
  const matches = ref<Match[]>([])

  const setMatches = (newMatches: Match[]) => {
    matches.value = newMatches
  }

  const clearMatches = () => {
    matches.value = []
  }

  const getMatchById = (id: string): Match | undefined => {
    return matches.value.find(match => match.id === id)
  }

  const updateMatchResult = (matchId: string, team1Score: number, team2Score: number) => {
    const matchIndex = matches.value.findIndex(match => match.id === matchId)
    if (matchIndex !== -1) {
      const match = matches.value[matchIndex]
      match.team1Score = team1Score
      match.team2Score = team2Score
      match.isComplete = true
      
      // Determine winner
      if (team1Score > team2Score) {
        match.winner = match.team1
      } else if (team2Score > team1Score) {
        match.winner = match.team2
      } else {
        match.winner = undefined // Draw
      }
    }
  }

  const resetMatchResult = (matchId: string) => {
    const matchIndex = matches.value.findIndex(match => match.id === matchId)
    if (matchIndex !== -1) {
      const match = matches.value[matchIndex]
      match.team1Score = undefined
      match.team2Score = undefined
      match.isComplete = false
      match.winner = undefined
    }
  }

  const getMatchesByStage = (stage: MatchStage): Match[] => {
    return matches.value.filter(match => match.stage === stage)
  }

  const addMatches = (newMatches: Match[]) => {
    matches.value = [...matches.value, ...newMatches]
  }

  const clearMatchesByStage = (stage: MatchStage) => {
    matches.value = matches.value.filter(match => match.stage !== stage)
  }

  const getMatchesByGroup = (groupId: string): Match[] => {
    return matches.value.filter(match => match.groupId === groupId)
  }

  const allMatchesCompletedForStage = (stage: MatchStage): boolean => {
    const stageMatches = getMatchesByStage(stage)
    return stageMatches.length > 0 && stageMatches.every(match => match.isComplete)
  }

  return {
    matches: readonly(matches),
    setMatches,
    clearMatches,
    getMatchById,
    updateMatchResult,
    resetMatchResult,
    getMatchesByStage,
    addMatches,
    clearMatchesByStage,
    getMatchesByGroup,
    allMatchesCompletedForStage
  }
})
