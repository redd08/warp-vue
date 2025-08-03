<template>
  <div class="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg border border-gray-700 p-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-white">{{ group.name }}</h3>
      <div class="text-xs text-gray-400">
        {{ group.isComplete ? 'Complete' : 'In Progress' }}
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-xs text-gray-400 border-b border-gray-600">
            <th class="text-left p-2">Pos</th>
            <th class="text-left p-2">Team</th>
            <th class="text-center p-2">P</th>
            <th class="text-center p-2">W</th>
            <th class="text-center p-2">D</th>
            <th class="text-center p-2">L</th>
            <th class="text-center p-2">GF</th>
            <th class="text-center p-2">GA</th>
            <th class="text-center p-2">GD</th>
            <th class="text-center p-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(standing, index) in group.standings"
            :key="standing.team.id"
            class="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
            :class="{
              'bg-green-900/20': isQualified(index),
              'bg-yellow-900/20': isPlayoff(index)
            }"
          >
            <td class="p-2 font-medium text-white">{{ index + 1 }}</td>
            <td class="p-2">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ getCountryFlag(standing.team.country) }}</span>
                <div>
                  <div class="font-medium text-white text-xs">{{ standing.team.name }}</div>
                  <div class="text-xs text-gray-400">{{ standing.team.country }}</div>
                </div>
              </div>
            </td>
            <td class="text-center p-2 text-white">{{ standing.played }}</td>
            <td class="text-center p-2 text-green-400">{{ standing.won }}</td>
            <td class="text-center p-2 text-gray-400">{{ standing.drawn }}</td>
            <td class="text-center p-2 text-red-400">{{ standing.lost }}</td>
            <td class="text-center p-2 text-white">{{ standing.goalsFor }}</td>
            <td class="text-center p-2 text-white">{{ standing.goalsAgainst }}</td>
            <td class="text-center p-2" :class="getGDColor(standing.goalDifference)">
              {{ standing.goalDifference > 0 ? '+' : '' }}{{ standing.goalDifference }}
            </td>
            <td class="text-center p-2 font-bold text-white">{{ standing.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="qualifiersPerGroup > 0" class="mt-3 text-xs text-gray-400 flex items-center space-x-4">
      <div class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-green-900/40 rounded"></div>
        <span>Qualified</span>
      </div>
      <div v-if="hasPlayoffSpots" class="flex items-center space-x-1">
        <div class="w-3 h-3 bg-yellow-900/40 rounded"></div>
        <span>Playoff</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCountryFlag } from '@/shared/lib'
import type { Group } from '../model/types'

interface Props {
  group: Group
  qualifiersPerGroup?: number
  hasPlayoffSpots?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  qualifiersPerGroup: 2,
  hasPlayoffSpots: false
})

const isQualified = (position: number): boolean => {
  return position < props.qualifiersPerGroup
}

const isPlayoff = (position: number): boolean => {
  return props.hasPlayoffSpots && position === props.qualifiersPerGroup
}

const getGDColor = (goalDifference: number): string => {
  if (goalDifference > 0) return 'text-green-400'
  if (goalDifference < 0) return 'text-red-400'
  return 'text-gray-400'
}
</script>
