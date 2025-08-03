<template>
  <div
    class="flex items-center justify-between p-4 backdrop-filter backdrop-blur-xl bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors"
    :class="{ 'opacity-50': !available }"
  >
    <div class="flex items-center space-x-3">
      <span class="text-2xl text-white drop-shadow-md">{{ getCountryFlag(team.country) }}</span>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white/90 truncate">{{ team.name }}</div>
        <div class="text-xs text-gray-400 mb-1">{{ team.country }}</div>
        <div class="flex items-center space-x-2">
          <div class="text-xs font-medium whitespace-nowrap" :class="getRatingColor(team.rating)">
            {{ team.rating }}
          </div>
          <div class="w-16 bg-gray-700 rounded-full h-1.5">
            <div 
              class="h-1.5 rounded-full transition-all duration-300"
              :class="getRatingBarColor(team.rating)"
              :style="{ width: `${team.rating}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="showRemove"
      @click="$emit('remove', team.id)"
      class="text-red-500 hover:text-red-700 p-1 rounded-full transition-transform transform hover:scale-105"
      title="Remove team"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { getCountryFlag } from '@/shared/lib'
import type { Team } from '../model/types'

interface Props {
  team: Team
  available?: boolean
  showRemove?: boolean
}

withDefaults(defineProps<Props>(), {
  available: true,
  showRemove: true
})

defineEmits<{
  remove: [teamId: number]
}>()

const getRatingColor = (rating: number): string => {
  if (rating >= 90) return 'text-yellow-400'
  if (rating >= 80) return 'text-green-400'
  if (rating >= 70) return 'text-blue-400'
  if (rating >= 60) return 'text-orange-400'
  return 'text-red-400'
}

const getRatingBarColor = (rating: number): string => {
  if (rating >= 90) return 'bg-yellow-400'
  if (rating >= 80) return 'bg-green-400'
  if (rating >= 70) return 'bg-blue-400'
  if (rating >= 60) return 'bg-orange-400'
  return 'bg-red-400'
}
</script>
