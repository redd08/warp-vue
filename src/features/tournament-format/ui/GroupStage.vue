<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-2xl font-bold text-white">Group Stage</h3>
      <div class="flex space-x-2">
        <Button
          v-if="groupStore.allGroupsComplete"
          variant="success"
          @click="tournamentStore.advanceToPlayoffs"
        >
          Advance to Playoffs
        </Button>
        <Button variant="danger" @click="tournamentStore.resetTournament">
          Reset Tournament
        </Button>
      </div>
    </div>

    <!-- Groups Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <GroupTable
        v-for="group in groupStore.groups"
        :key="group.id"
        :group="group"
        :qualifiers-per-group="tournamentStore.settings.qualifiersPerGroup"
      />
    </div>

    <!-- Group Matches -->
    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h4 class="text-xl font-bold text-white">Group Matches</h4>
        <div class="flex space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            @click="randomizeAllMatches"
            :disabled="allMatchesComplete"
          >
            🎲 Random All
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            @click="resetAllMatches"
            v-if="hasCompletedMatches"
          >
            Reset All
          </Button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MatchCard
          v-for="match in sortedMatchesByTours"
          :key="match.id"
          :match="match"
        />
      </div>
    </div>

    <!-- Progress Indicator -->
    <div class="bg-gray-900/50 rounded-lg p-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-white">Group Stage Progress</span>
        <span class="text-sm text-gray-400">
          {{ completedMatches }}/{{ totalMatches }} matches completed
        </span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2">
        <div
          class="bg-green-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Qualification Preview -->
    <div v-if="groupStore.allGroupsComplete" class="mt-6">
      <div class="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
        <h5 class="text-lg font-semibold text-green-300 mb-4">Qualified Teams for Playoffs</h5>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="team in qualifiedTeams"
            :key="team.id"
            class="flex items-center space-x-2 p-2 bg-green-900/30 rounded-lg"
          >
            <span class="text-lg">{{ getCountryFlag(team.country) }}</span>
            <div>
              <div class="font-medium text-white text-sm">{{ team.name }}</div>
              <div class="text-xs text-green-300">{{ team.country }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/shared/ui'
import { getCountryFlag } from '@/shared/lib'
import { useGroupStore, GroupTable } from '@/entities/group'
import { useMatchStore, MatchCard } from '@/entities/match'
import { useTournamentStore } from '../model/store'

const groupStore = useGroupStore()
const matchStore = useMatchStore()
const tournamentStore = useTournamentStore()

// Get group stage matches from unified match store
const groupMatches = computed(() => {
  return matchStore.getMatchesByStage('group')
})

const sortedMatchesByTours = computed(() => {
  return groupMatches.value.slice().sort((a, b) => a.stageOrder - b.stageOrder)
})

const completedMatches = computed(() => {
  return groupMatches.value.filter(match => match.isComplete).length
})

const totalMatches = computed(() => {
  return groupMatches.value.length
})

const progressPercentage = computed(() => {
  if (totalMatches.value === 0) return 0
  return (completedMatches.value / totalMatches.value) * 100
})

const allMatchesComplete = computed(() => {
  return groupMatches.value.every(match => match.isComplete)
})

const hasCompletedMatches = computed(() => {
  return groupMatches.value.some(match => match.isComplete)
})

const qualifiedTeams = computed(() => {
  return groupStore.getQualifiedTeams(tournamentStore.settings.qualifiersPerGroup)
})

const randomizeAllMatches = () => {
  groupMatches.value.forEach(match => {
    if (!match.isComplete) {
      // Generate realistic football scores based on team ratings
      const team1Rating = match.team1.rating
      const team2Rating = match.team2.rating
      
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
      
      // Use unified match store for updates
      matchStore.updateMatchResult(match.id, finalScore1, finalScore2)
    }
  })
  // Update group standings after all matches are processed
  groupStore.updateStandingsFromUnifiedMatches(matchStore.matches)
}

const resetAllMatches = () => {
  groupMatches.value.forEach(match => {
    if (match.isComplete) {
      // Use unified match store for resets
      matchStore.resetMatchResult(match.id)
    }
  })
  // Update group standings after all matches are reset
  groupStore.updateStandingsFromUnifiedMatches(matchStore.matches)
}
</script>
