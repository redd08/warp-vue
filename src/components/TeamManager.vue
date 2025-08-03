<script setup lang="ts">
import { ref } from 'vue'
import { useFootballDrawStore } from '../stores/footballDraw'

const store = useFootballDrawStore()

const newTeamName = ref('')
const newTeamCountry = ref('')
const showAddForm = ref(false)

function addTeam() {
  if (newTeamName.value.trim() && newTeamCountry.value.trim()) {
    store.addTeam(newTeamName.value.trim(), newTeamCountry.value.trim())
    newTeamName.value = ''
    newTeamCountry.value = ''
    showAddForm.value = false
  }
}

function getCountryFlag(country: string) {
  const flags: Record<string, string> = {
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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
  <div class="bg-gradient-to-r from-gray-900 to-gray-700 rounded-lg shadow-2xl p-8 border border-gray-800">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-extrabold text-white">Teams</h2>
      <button
        @click="showAddForm = !showAddForm"
        class="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105"
      >
        {{ showAddForm ? 'Cancel' : 'Add Team' }}
      </button>
    </div>

    <!-- Add Team Form -->
    <div v-if="showAddForm" class="mb-6 p-6 backdrop-filter backdrop-blur-sm bg-gray-800/50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3 text-purple-300">Add New Team</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="newTeamName"
          type="text"
          placeholder="Team name"
          class="px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          @keyup.enter="addTeam"
        />
        <input
          v-model="newTeamCountry"
          type="text"
          placeholder="Country"
          class="px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          @keyup.enter="addTeam"
        />
        <button
          @click="addTeam"
          :disabled="!newTeamName.trim() || !newTeamCountry.trim()"
          class="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
        >
          Add Team
        </button>
      </div>
    </div>

    <!-- Teams List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="team in store.teams"
        :key="team.id"
        class="flex items-center justify-between p-4 backdrop-filter backdrop-blur-xl bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors"
        :class="{
          'opacity-50': !store.availableTeams.some(t => t.id === team.id) && store.drawComplete
        }"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl text-white drop-shadow-md">{{ getCountryFlag(team.country) }}</span>
          <div>
            <div class="font-semibold text-white/90">{{ team.name }}</div>
            <div class="text-xs text-gray-400">{{ team.country }}</div>
          </div>
        </div>
        <button
          @click="store.removeTeam(team.id)"
          class="text-red-500 hover:text-red-700 p-1 rounded-full transition-transform transform hover:scale-105"
          title="Remove team"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="store.teams.length === 0" class="text-center py-8 text-gray-300">
      No teams added yet. Click "Add Team" to get started!
    </div>

    <div class="mt-4 text-sm text-gray-400">
      Total teams: {{ store.teams.length }} | Available for draw: {{ store.availableTeams.length }}
    </div>
  </div>
</template>
