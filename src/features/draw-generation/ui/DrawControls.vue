<template>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-3xl font-extrabold text-gray-200">Draw</h2>
    <Button
      v-if="drawComplete"
      variant="danger"
      @click="$emit('reset')"
    >
      Reset
    </Button>
  </div>

  <div v-if="!drawComplete && !isDrawing" class="text-center space-y-4">
    <div class="flex justify-center space-x-4">
      <Button
        variant="success"
        size="lg"
        :disabled="!canDraw"
        @click="$emit('start')"
      >
        Random Draw
      </Button>
      <Button
        variant="primary"
        size="lg"
        :disabled="!canDraw"
        @click="$emit('startManual')"
      >
        Manual Draw
      </Button>
    </div>
    <p v-if="!canDraw" class="mt-4 text-sm text-gray-300">
      Not enough teams to perform a draw.
    </p>
  </div>

  <div v-else-if="isDrawing" class="text-center text-lg font-semibold text-gray-400 animate-pulse">
    Drawing...
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui'

interface Props {
  isDrawing: boolean
  drawComplete: boolean
  canDraw: boolean
}

defineProps<Props>()

defineEmits<{
  start: []
  startManual: []
  reset: []
}>()
</script>
