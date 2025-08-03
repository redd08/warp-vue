<template>
  <div class="bg-gradient-to-b from-gray-900/50 to-gray-800/50 p-4 rounded-lg border border-gray-700 hover:shadow-xl transition-shadow backdrop-filter backdrop-blur-lg">
    <div class="grid grid-cols-3 gap-4 items-center">
      <!-- Team 1 -->
      <div class="flex items-center space-x-2 min-w-0">
        <span class="text-2xl drop-shadow-md flex-shrink-0">{{ getCountryFlag(match.team1.country) }}</span>
        <div class="text-sm min-w-0 flex-1 overflow-hidden">
          <div class="font-semibold text-white/90 truncate" :title="match.team1.name">{{ match.team1.name }}</div>
          <div class="text-xs text-gray-400 truncate" :title="match.team1.country">{{ match.team1.country }}</div>
        </div>
      </div>
      
      <!-- Score Section -->
      <div class="flex items-center justify-center space-x-2">
        <NumberInput
          v-if="!match.isComplete"
          v-model="team1Score"
          :min="0"
          :max="20"
          placeholder="0"
          class="w-12 text-center"
        />
        <div v-else class="w-8 text-center font-bold text-white text-lg">
          {{ match.team1Score }}
        </div>
        
        <div class="text-white font-bold text-sm px-1">-</div>
        
        <NumberInput
          v-if="!match.isComplete"
          v-model="team2Score"
          :min="0"
          :max="20"
          placeholder="0"
          class="w-12 text-center"
        />
        <div v-else class="w-8 text-center font-bold text-white text-lg">
          {{ match.team2Score }}
        </div>
      </div>
      
      <!-- Team 2 -->
      <div class="flex items-center justify-end space-x-2 min-w-0">
        <div class="text-sm text-right min-w-0 flex-1 overflow-hidden">
          <div class="font-semibold text-white/90 truncate" :title="match.team2.name">{{ match.team2.name }}</div>
          <div class="text-xs text-gray-400 truncate" :title="match.team2.country">{{ match.team2.country }}</div>
        </div>
        <span class="text-2xl drop-shadow-md flex-shrink-0">{{ getCountryFlag(match.team2.country) }}</span>
      </div>
    </div>
    
    <div v-if="!match.isComplete" class="mt-3 text-center">
      <div class="flex justify-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          @click="randomizeScore"
          title="Generate random score"
        >
          🎲 Random
        </Button>
        <Button
          variant="success"
          size="sm"
          :disabled="!canSubmitScore"
          @click="submitScore"
        >
          Submit Score
        </Button>
      </div>
    </div>
    
    <div v-else class="mt-2 text-center text-xs text-green-400">
      Match Complete
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCountryFlag } from '@/shared/lib'
import { Button, NumberInput } from '@/shared/ui'
import { useMatchStore } from '@/entities/match'
import { useGroupStore } from '../model/store'
import type { Match } from '@/entities/match'

interface Props {
  match: Match
}

const props = defineProps<Props>()
const matchStore = useMatchStore()
const groupStore = useGroupStore()

const team1Score = ref(props.match.team1Score ?? 0)
const team2Score = ref(props.match.team2Score ?? 0)

const randomizeScore = () => {
  // Generate realistic football scores based on team ratings
  const team1Rating = props.match.team1.rating
  const team2Rating = props.match.team2.rating
  
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
  team1Score.value = Math.max(0, Math.round(adjustedScore1))
  team2Score.value = Math.max(0, Math.round(adjustedScore2))
}

const canSubmitScore = computed(() => {
  return team1Score.value >= 0 && team2Score.value >= 0
})

const submitScore = () => {
  if (canSubmitScore.value) {
    // Update unified match store
    matchStore.updateMatchResult(props.match.id, team1Score.value, team2Score.value)
    // Update group standings by refreshing from unified matches
    groupStore.updateStandingsFromUnifiedMatches(matchStore.matches)
  }
}
</script>
