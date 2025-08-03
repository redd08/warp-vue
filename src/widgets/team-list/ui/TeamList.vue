<template>
  <Card title="Teams">
    <div class="flex justify-between items-center mb-6">
      <div></div>
      <Button @click="toggleAddForm">
        {{ showAddForm ? 'Cancel' : 'Add Team' }}
      </Button>
    </div>

    <AddTeamForm 
      :is-visible="showAddForm"
      @add-team="handleAddTeam"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <TeamCard
        v-for="team in teamStore.teams"
        :key="team.id"
        :team="team"
        :available="isTeamAvailable(team.id)"
        @remove="teamStore.removeTeam"
      />
    </div>

    <div v-if="teamStore.teams.length === 0" class="text-center py-8 text-gray-300">
      No teams added yet. Click "Add Team" to get started!
    </div>

    <div class="mt-4 text-sm text-gray-400">
      Total teams: {{ teamStore.teams.length }} | Available for draw: {{ availableTeamsCount }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, Button } from '@/shared/ui'
import { useTeamStore, TeamCard } from '@/entities/team'
import { AddTeamForm } from '@/features/team-management'
import { useDrawStore } from '@/features/draw-generation'

const teamStore = useTeamStore()
const drawStore = useDrawStore()

const showAddForm = ref(false)

const availableTeamsCount = computed(() => drawStore.availableTeams.length)

const isTeamAvailable = (teamId: number) => {
  return drawStore.availableTeams.some(team => team.id === teamId) || !drawStore.drawComplete
}

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
}

const handleAddTeam = (name: string, country: string, rating: number) => {
  teamStore.addTeam(name, country, rating)
  showAddForm.value = false
}
</script>
