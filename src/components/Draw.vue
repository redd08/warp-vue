<script setup lang="ts">
import { useFootballDrawStore } from '../stores/footballDraw'

const store = useFootballDrawStore()

function getCountryFlag(country: string) {
  const flags: Record<string, string> = {
    'England': '🏴',
    'Spain': '🇪🇸',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Portugal': '🇵🇹',
    'Netherlands': '🇳🇱',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷'
  }
  return flags[country] || '🌍'
}
</script>

<template>
  <div class="bg-gradient-to-r from-purple-600 to-indigo-800 rounded-lg shadow-xl p-8 mt-6 border border-gray-700">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-gray-200">Draw</h2>
      <button
        v-if="store.drawComplete"
        @click="store.resetDraw"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105"
      >
        Reset
      </button>
    </div>

    <div v-if="!store.drawComplete && !store.isDrawing" class="text-center">
      <button
        @click="store.performDraw"
        :disabled="!store.canDraw"
        class="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-5 rounded-full shadow-lg transform hover:bg-opacity-95 transition-transform"
      >
        Start Draw
      </button>
      <p v-if="!store.canDraw" class="mt-4 text-sm text-gray-300">
        Not enough teams to perform a draw.
      </p>
    </div>

    <div v-else-if="store.isDrawing" class="text-center text-lg font-semibold text-gray-400 animate-pulse">
      Drawing...
    </div>

    <div v-if="store.drawComplete" class="pt-6">
      <h3 class="text-xl font-bold mb-4">Match Fixtures</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="match in store.matches"
          :key="match.id"
          class="backdrop-filter backdrop-blur-lg bg-gradient-to-b from-gray-900/50 to-gray-800/50 p-5 rounded-lg border border-gray-700 hover:shadow-2xl transition-shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 flex-1">
              <span class="text-3xl drop-shadow-md">{{ getCountryFlag(match.team1.country) }}</span>
              <div class="text-base">
                <div class="font-semibold text-white/90">{{ match.team1.name }}</div>
                <div class="text-xs text-gray-400">{{ match.team1.country }}</div>
              </div>
            </div>
            <div class="mx-4 bg-white/20 px-4 py-1 rounded-full text-sm font-extrabold text-white shadow-inner">
              VS
            </div>
            <div class="flex items-center space-x-2 flex-1 justify-end">
              <div class="text-base text-right">
                <div class="font-semibold text-white/90">{{ match.team2.name }}</div>
                <div class="text-xs text-gray-400">{{ match.team2.country }}</div>
              </div>
              <span class="text-3xl drop-shadow-md">{{ getCountryFlag(match.team2.country) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">{{ store.matches.length }} matches generated</p>
      </div>
    </div>
  </div>
</template>

