<template>
  <div v-if="isVisible" class="mb-6 p-6 backdrop-filter backdrop-blur-sm bg-gray-800/50 rounded-lg relative z-50">
    <h3 class="text-lg font-semibold mb-3 text-purple-300">Add New Team</h3>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input
        v-model="teamName"
        placeholder="Team name"
        @enter="handleAddTeam"
      />
      <AutocompleteInput
        v-model="teamCountry"
        :options="countryOptions"
        placeholder="Country"
        :minSearchLength="0"
        :maxResults="8"
        @enter="handleAddTeam"
        @select="handleCountrySelect"
      />
      <NumberInput
        v-model="teamRating"
        :min="1"
        :max="99"
        :customArrows="true"
        placeholder="Rating (1-99)"
        @enter="handleAddTeam"
      />
      <Button
        variant="success"
        :disabled="!canAddTeam"
        @click="handleAddTeam"
      >
        Add Team
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button, Input, NumberInput, AutocompleteInput } from '@/shared/ui'
import { getCountries, type CountryOption } from '@/shared/lib'

interface Props {
  isVisible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  addTeam: [name: string, country: string, rating: number]
}>()

const teamName = ref('')
const teamCountry = ref('')
const teamRating = ref(75)

const countryOptions = getCountries()

const canAddTeam = computed(() => {
  return teamName.value.trim() && teamCountry.value.trim() && teamRating.value >= 1 && teamRating.value <= 99
})

const handleCountrySelect = (option: CountryOption) => {
  // Country is already set by v-model, no additional action needed
}

const handleAddTeam = () => {
  if (canAddTeam.value) {
    emit('addTeam', teamName.value.trim(), teamCountry.value.trim(), teamRating.value)
    teamName.value = ''
    teamCountry.value = ''
    teamRating.value = 75
  }
}
</script>
