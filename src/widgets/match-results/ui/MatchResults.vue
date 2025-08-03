<template>
  <Card title="Tournament" variant="secondary">
    <!-- Tournament Settings -->
    <TournamentSettings v-if="tournamentStore.currentPhase === 'setup'" />

    <!-- Group Stage -->
    <GroupStage v-if="tournamentStore.currentPhase === 'groups'" />

    <!-- Knockout Stages -->
    <div v-if="['direct', 'round16', 'quarters', 'semis', 'final', 'complete'].includes(tournamentStore.currentPhase)">
      <!-- Tournament Winner Display -->
      <div v-if="tournamentStore.currentPhase === 'complete' && tournamentWinner" class="text-center mb-8">
        <div class="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg">
          <div class="text-4xl mb-2">🏆</div>
          <h2 class="text-3xl font-bold text-yellow-900 mb-2">Tournament Winner</h2>
          <p class="text-2xl font-semibold text-yellow-800">{{ tournamentWinner.name }}</p>
        </div>
      </div>
      
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-white">
          {{ getStageTitle() }}
        </h3>
        <Button variant="danger" @click="tournamentStore.resetTournament">
          Reset Tournament
        </Button>
      </div>

      <!-- Legacy Draw Controls for Direct Knockout -->
      <div v-if="tournamentStore.settings.format === 'direct-knockout' && tournamentStore.currentPhase === 'complete'">
        <DrawControls
          :is-drawing="drawStore.isDrawing"
          :draw-complete="drawStore.drawComplete || manualDrawStore.isManualMode"
          :can-draw="drawStore.canDraw"
          @start="drawStore.performDraw"
          @start-manual="manualDrawStore.startManualDraw"
          @reset="handleReset"
        />

        <!-- Manual Draw Interface -->
        <ManualDraw />
      </div>

      <!-- Match Results -->
      <div v-if="matchStore.matches.length > 0" class="pt-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-xl font-bold text-white">
            {{ getMatchesTitle() }}
          </h4>
          <div class="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              @click="randomizeAllMatches"
              :disabled="allMatchesComplete"
            >
              🎲 Random All
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              @click="resetAllMatches"
              v-if="hasCompletedMatches"
            >
              Reset All
            </Button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchCard
            v-for="match in matchStore.matches"
            :key="match.id"
            :match="match"
          />
        </div>
        
        <!-- Advance to Next Stage Button -->
        <div v-if="allMatchesComplete && tournamentStore.canAdvanceToNextStage" class="mt-6 text-center">
          <Button 
            variant="primary" 
            @click="tournamentStore.advanceToNextStage"
            class="px-8 py-3 text-lg font-semibold"
          >
            {{ getAdvanceButtonText() }}
          </Button>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-400">{{ matchStore.matches.length }} matches generated</p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, Button } from '@/shared/ui'
import { useMatchStore, MatchCard } from '@/entities/match'
import { useDrawStore, DrawControls } from '@/features/draw-generation'
import { useManualDrawStore, ManualDraw } from '@/features/manual-draw'
import { useTournamentStore, TournamentSettings, GroupStage } from '@/features/tournament-format'

const matchStore = useMatchStore()
const drawStore = useDrawStore()
const manualDrawStore = useManualDrawStore()
const tournamentStore = useTournamentStore()

const allMatchesComplete = computed(() => {
  return matchStore.matches.every(match => match.isComplete)
})

const hasCompletedMatches = computed(() => {
  return matchStore.matches.some(match => match.isComplete)
})

// Determine the tournament winner
const tournamentWinner = computed(() => {
  if (tournamentStore.currentPhase !== 'complete') return null
  
  // Find the final match (stage: 'final')
  const finalMatch = matchStore.matches.find(match => match.stage === 'final' && match.isComplete)
  
  if (!finalMatch || typeof finalMatch.team1Score !== 'number' || typeof finalMatch.team2Score !== 'number') {
    return null
  }
  
  // Return the winner of the final match
  return finalMatch.team1Score > finalMatch.team2Score ? finalMatch.team1 : finalMatch.team2
})

const randomizeAllMatches = () => {
  matchStore.matches.forEach(match => {
    if (!match.isComplete) {
      // Generate realistic football scores based on team ratings
      const team1Rating = match.team1.rating
      const team2Rating = match.team2.rating
      
      // Calculate probability weights based on team ratings
      const ratingDiff = team1Rating - team2Rating
      const team1Advantage = Math.max(0, Math.min(20, ratingDiff)) / 20 // 0 to 1
      
      // Generate random scores (0-5 range for realistic football scores)
      const baseScore1 = Math.random() * 3 // 0-3 base range
      const baseScore2 = Math.random() * 3
      
      // Apply rating advantage
      const adjustedScore1 = baseScore1 + (team1Advantage * 1.5)
      const adjustedScore2 = baseScore2 + ((1 - team1Advantage) * 1.5)
      
      // Round to integers and ensure minimum 0
      const finalScore1 = Math.max(0, Math.round(adjustedScore1))
      const finalScore2 = Math.max(0, Math.round(adjustedScore2))
      
      matchStore.updateMatchResult(match.id, finalScore1, finalScore2)
    }
  })
}

const resetAllMatches = () => {
  matchStore.matches.forEach(match => {
    if (match.isComplete) {
      matchStore.resetMatchResult(match.id)
    }
  })
}

const handleReset = () => {
  drawStore.resetDraw()
  manualDrawStore.cancelManualDraw()
}

// Use unified tournament store methods
const getStageTitle = () => {
  return tournamentStore.getCurrentStageInfo.name
}

const getMatchesTitle = () => {
  return tournamentStore.getCurrentStageInfo.matchesTitle
}

const getAdvanceButtonText = () => {
  return tournamentStore.getCurrentStageInfo.advanceButtonText
}
</script>
