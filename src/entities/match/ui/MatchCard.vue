<template>
  <div class="bg-gradient-to-b from-gray-900/50 to-gray-800/50 p-5 rounded-lg border border-gray-700 hover:shadow-2xl transition-shadow backdrop-filter backdrop-blur-lg">
    <div class="flex items-center justify-between">
      <!-- Team 1 -->
      <div class="flex items-center space-x-2 flex-1">
        <span class="text-3xl drop-shadow-md">{{ getCountryFlag(match.team1.country) }}</span>
        <div class="text-base">
          <div class="font-semibold text-white/90" :class="{ 'text-green-400': match.winner?.id === match.team1.id }">
            {{ match.team1.name }}
            <span v-if="match.winner?.id === match.team1.id" class="ml-1 text-yellow-400">👑</span>
          </div>
          <div class="text-xs text-gray-400">{{ match.team1.country }}</div>
          <div class="text-xs font-medium" :class="getRatingColor(match.team1.rating)">
            Rating: {{ match.team1.rating }}
          </div>
        </div>
      </div>

      <!-- Score Section -->
      <div class="mx-4 flex flex-col items-center space-y-2">
        <!-- Score Display or Input -->
        <div v-if="match.isComplete" class="flex items-center space-x-2">
          <div class="text-2xl font-bold text-white bg-blue-600 rounded px-3 py-1">
            {{ match.team1Score }}
          </div>
          <div class="text-sm text-gray-300">-</div>
          <div class="text-2xl font-bold text-white bg-blue-600 rounded px-3 py-1">
            {{ match.team2Score }}
          </div>
        </div>
        
        <div v-else class="flex items-center space-x-2">
          <input
            v-model.number="localTeam1Score"
            type="number"
            min="0"
            max="99"
            class="w-12 h-10 text-center bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <div class="text-sm text-gray-300">-</div>
          <input
            v-model.number="localTeam2Score"
            type="number"
            min="0"
            max="99"
            class="w-12 h-10 text-center bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-1">
          <button
            v-if="!match.isComplete"
            @click="saveResult"
            :disabled="!canSaveResult"
            class="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
          >
            Save
          </button>
          <button
            v-if="!match.isComplete"
            @click="randomizeResult"
            class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
            title="Generate random result"
          >
            🎲 Random
          </button>
          <button
            v-if="match.isComplete"
            @click="editResult"
            class="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
          >
            Edit
          </button>
          <button
            v-if="match.isComplete"
            @click="resetResult"
            class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Team 2 -->
      <div class="flex items-center space-x-2 flex-1 justify-end">
        <div class="text-base text-right">
          <div class="font-semibold text-white/90" :class="{ 'text-green-400': match.winner?.id === match.team2.id }">
            {{ match.team2.name }}
            <span v-if="match.winner?.id === match.team2.id" class="ml-1 text-yellow-400">👑</span>
          </div>
          <div class="text-xs text-gray-400">{{ match.team2.country }}</div>
          <div class="text-xs font-medium" :class="getRatingColor(match.team2.rating)">
            Rating: {{ match.team2.rating }}
          </div>
        </div>
        <span class="text-3xl drop-shadow-md">{{ getCountryFlag(match.team2.country) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCountryFlag } from '@/shared/lib'
import { useMatchStore } from '../model/store'
import type { Match } from '../model/types'

interface Props {
  match: Match
}

const props = defineProps<Props>()
const matchStore = useMatchStore()

// Local state for score inputs
const localTeam1Score = ref<number>(props.match.team1Score ?? 0)
const localTeam2Score = ref<number>(props.match.team2Score ?? 0)

const canSaveResult = computed(() => {
  return localTeam1Score.value >= 0 && localTeam2Score.value >= 0
})

const saveResult = async () => {
  if (canSaveResult.value) {
    matchStore.updateMatchResult(props.match.id, localTeam1Score.value, localTeam2Score.value)
    // If this is a group match, update group standings
    if (props.match.stage === 'group' && props.match.groupId) {
      const { useGroupStore } = await import('@/entities/group')
      const groupStore = useGroupStore()
      groupStore.updateStandingsFromUnifiedMatches(matchStore.matches)
    }
  }
}

const editResult = () => {
  localTeam1Score.value = props.match.team1Score ?? 0
  localTeam2Score.value = props.match.team2Score ?? 0
  matchStore.resetMatchResult(props.match.id)
}

const resetResult = () => {
  localTeam1Score.value = 0
  localTeam2Score.value = 0
  matchStore.resetMatchResult(props.match.id)
}

const randomizeResult = async () => {
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
  const finalScore1 = Math.max(0, Math.round(adjustedScore1))
  const finalScore2 = Math.max(0, Math.round(adjustedScore2))
  
  // Update local inputs and save immediately
  localTeam1Score.value = finalScore1
  localTeam2Score.value = finalScore2
  matchStore.updateMatchResult(props.match.id, finalScore1, finalScore2)
  
  // If this is a group match, update group standings
  if (props.match.stage === 'group' && props.match.groupId) {
    const { useGroupStore } = await import('@/entities/group')
    const groupStore = useGroupStore()
    groupStore.updateStandingsFromUnifiedMatches(matchStore.matches)
  }
}

const getRatingColor = (rating: number): string => {
  if (rating >= 90) return 'text-yellow-400'
  if (rating >= 80) return 'text-green-400'
  if (rating >= 70) return 'text-blue-400'
  if (rating >= 60) return 'text-orange-400'
  return 'text-red-400'
}
</script>
