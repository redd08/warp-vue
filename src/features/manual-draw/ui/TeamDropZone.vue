<template>
  <div
    class="relative min-h-[60px] border-2 border-dashed rounded-lg transition-all duration-200"
    :class="[
      isDragOver ? 'border-purple-400 bg-purple-400/10' : 'border-gray-600 bg-gray-800/30',
      team ? 'border-solid' : ''
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div v-if="team" class="p-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-lg">{{ getCountryFlag(team.country) }}</span>
          <div>
            <div class="font-semibold text-white text-sm">{{ team.name }}</div>
            <div class="text-xs text-gray-400">{{ team.country }}</div>
            <div class="text-xs font-medium" :class="getRatingColor(team.rating)">
              {{ team.rating }}
            </div>
          </div>
        </div>
        <button
          @click="handleRemove"
          class="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
          title="Remove team"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-full p-4">
      <div class="text-center">
        <div class="text-gray-500 text-sm">{{ isDragOver ? 'Drop team here' : 'Drag team here' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCountryFlag } from '@/shared/lib'
import type { Team } from '@/entities/team'

interface Props {
  team: Team | null
  slotId: string
  position: 'team1' | 'team2'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  teamDropped: [team: Team, slotId: string, position: 'team1' | 'team2']
  teamRemoved: [slotId: string, position: 'team1' | 'team2']
}>()

const isDragOver = ref(false)

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer) {
    try {
      const teamData = JSON.parse(event.dataTransfer.getData('application/json'))
      emit('teamDropped', teamData, props.slotId, props.position)
    } catch (error) {
      // Handle error during parsing
    }
  }
}

const handleRemove = () => {
  emit('teamRemoved', props.slotId, props.position)
}

const getRatingColor = (rating: number): string => {
  if (rating >= 90) return 'text-yellow-400'
  if (rating >= 80) return 'text-green-400'
  if (rating >= 70) return 'text-blue-400'
  if (rating >= 60) return 'text-orange-400'
  return 'text-red-400'
}
</script>
