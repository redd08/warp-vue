<template>
  <div
    :draggable="true"
    class="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600 cursor-grab active:cursor-grabbing hover:from-gray-700 hover:to-gray-600 transition-all duration-200 transform hover:scale-105"
    :class="{ 'opacity-50 scale-95': isDragging }"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <span class="text-xl">{{ getCountryFlag(team.country) }}</span>
    <div class="flex-1 min-w-0">
      <div class="font-semibold text-white text-sm truncate">{{ team.name }}</div>
      <div class="text-xs text-gray-400">{{ team.country }}</div>
      <div class="text-xs font-medium" :class="getRatingColor(team.rating)">
        {{ team.rating }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getCountryFlag } from '@/shared/lib'
import type { Team } from '@/entities/team'
import { useManualDrawStore } from '../model/store'

interface Props {
  team: Team
}

const props = defineProps<Props>()

const manualDrawStore = useManualDrawStore()
const isDragging = ref(false)

const handleDragStart = (event: DragEvent) => {
  isDragging.value = true
  manualDrawStore.setDraggedTeam(props.team)
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify(props.team))
  }
}

const handleDragEnd = () => {
  isDragging.value = false
  manualDrawStore.setDraggedTeam(null)
}

const getRatingColor = (rating: number): string => {
  if (rating >= 90) return 'text-yellow-400'
  if (rating >= 80) return 'text-green-400'
  if (rating >= 70) return 'text-blue-400'
  if (rating >= 60) return 'text-orange-400'
  return 'text-red-400'
}
</script>
