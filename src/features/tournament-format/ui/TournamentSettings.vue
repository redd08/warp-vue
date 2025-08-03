<template>
  <Card title="Tournament Settings">
    <div class="space-y-6">
      <!-- Format Selection -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">Tournament Format</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            class="relative p-4 border-2 rounded-lg cursor-pointer transition-all"
            :class="settings.format === TournamentFormat.DIRECT_KNOCKOUT 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'"
            @click="updateFormat(TournamentFormat.DIRECT_KNOCKOUT)"
          >
            <div class="flex items-center space-x-2">
              <input
                type="radio"
                :checked="settings.format === TournamentFormat.DIRECT_KNOCKOUT"
                class="text-purple-500"
                readonly
              />
              <span class="font-semibold text-white">Direct Knockout</span>
            </div>
            <p class="text-xs text-gray-400 mt-2">Teams are paired randomly for direct elimination matches</p>
          </div>
          
          <div
            class="relative p-4 border-2 rounded-lg cursor-pointer transition-all"
            :class="settings.format === TournamentFormat.GROUP_STAGE 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'"
            @click="updateFormat(TournamentFormat.GROUP_STAGE)"
          >
            <div class="flex items-center space-x-2">
              <input
                type="radio"
                :checked="settings.format === TournamentFormat.GROUP_STAGE"
                class="text-purple-500"
                readonly
              />
              <span class="font-semibold text-white">Group Stage + Playoffs</span>
            </div>
            <p class="text-xs text-gray-400 mt-2">Teams play in groups, then top teams advance to playoffs</p>
          </div>
        </div>
      </div>

      <!-- Group Stage Settings -->
      <div v-if="settings.format === TournamentFormat.GROUP_STAGE" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Number of Groups</label>
          <select
            :value="settings.groupCount"
            @change="updateGroupCount($event)"
            class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option
              v-for="option in GROUP_COUNT_OPTIONS"
              :key="option.value"
              :value="option.value"
              :disabled="!canUseGroupCount(option.value)"
            >
              {{ option.label }}
              {{ !canUseGroupCount(option.value) ? '(Not enough teams)' : '' }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Teams per Group</label>
            <NumberInput
              :model-value="settings.teamsPerGroup"
              :min="2"
              :max="8"
              :disabled="true"
              :customArrows="true"
              class="w-full"
            />
            <p class="text-xs text-gray-400 mt-1">Auto-calculated based on total teams and groups</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Qualifiers per Group</label>
            <NumberInput
              :model-value="settings.qualifiersPerGroup"
              :min="1"
              :max="settings.teamsPerGroup - 1"
              @update:model-value="updateQualifiersPerGroup"
              :customArrows="true"
              class="w-full"
            />
            <p class="text-xs text-gray-400 mt-1">Teams that advance to playoffs</p>
          </div>
        </div>
      </div>

      <!-- Tournament Info -->
      <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <h5 class="text-sm font-semibold text-blue-300 mb-2">Tournament Overview</h5>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-blue-200">
          <div>
            <div class="text-blue-300 font-medium">Total Teams</div>
            <div>{{ teamStore.teams.length }}</div>
          </div>
          <div v-if="settings.format === TournamentFormat.GROUP_STAGE">
            <div class="text-blue-300 font-medium">Groups</div>
            <div>{{ settings.groupCount }}</div>
          </div>
          <div v-if="settings.format === TournamentFormat.GROUP_STAGE">
            <div class="text-blue-300 font-medium">Teams/Group</div>
            <div>{{ settings.teamsPerGroup }}</div>
          </div>
          <div v-if="settings.format === TournamentFormat.GROUP_STAGE">
            <div class="text-blue-300 font-medium">Playoff Teams</div>
            <div>{{ settings.groupCount * settings.qualifiersPerGroup }}</div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="Object.keys(recommendedSettings).length > 0" class="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
        <h5 class="text-sm font-semibold text-yellow-300 mb-2">Recommendations</h5>
        <p class="text-xs text-yellow-200 mb-3">Based on your {{ teamStore.teams.length }} teams, we recommend:</p>
        
        <div class="bg-yellow-800/20 rounded p-3 mb-3 text-xs">
          <div v-if="recommendedSettings.format" class="text-yellow-100 mb-1">
            <strong>Format:</strong> {{ recommendedSettings.format === TournamentFormat.GROUP_STAGE ? 'Group Stage + Playoffs' : 'Direct Knockout' }}
          </div>
          <div v-if="recommendedSettings.groupCount" class="text-yellow-100 mb-1">
            <strong>Groups:</strong> {{ recommendedSettings.groupCount }}
          </div>
          <div v-if="recommendedSettings.teamsPerGroup" class="text-yellow-100 mb-1">
            <strong>Teams per group:</strong> {{ recommendedSettings.teamsPerGroup }}
          </div>
          <div v-if="recommendedSettings.qualifiersPerGroup" class="text-yellow-100">
            <strong>Qualifiers per group:</strong> {{ recommendedSettings.qualifiersPerGroup }}
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          @click="applyRecommendations"
        >
          Apply Recommended Settings
        </Button>
      </div>

      <!-- Match Format Selection -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">Match Format</label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="option in MATCH_FORMAT_OPTIONS"
            :key="option.value"
            class="relative p-4 border-2 rounded-lg cursor-pointer transition-all"
            :class="settings.matchFormat === option.value
              ? 'border-purple-500 bg-purple-900/20'
              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'"
            @click="updateMatchFormat(option.value)"
          >
            <div class="flex items-center space-x-2">
              <input
                type="radio"
                :checked="settings.matchFormat === option.value"
                class="text-purple-500"
                readonly
              />
              <span class="font-semibold text-white">{{ option.label }}</span>
            </div>
            <p class="text-xs text-gray-400 mt-2">{{ option.description }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          💡 Note: {{ getMatchFormatNote() }}
        </p>
      </div>

      <!-- Start Tournament -->
      <div class="text-center">
        <Button
          variant="success"
          size="lg"
          :disabled="!canStartTournament"
          @click="tournamentStore.startTournament"
        >
          Start Tournament
        </Button>
        <p v-if="!canStartTournament" class="text-xs text-gray-400 mt-2">
          {{ settings.format === TournamentFormat.GROUP_STAGE 
            ? `Need at least ${settings.groupCount * 2} teams for ${settings.groupCount} groups`
            : 'Need at least 2 teams'
          }}
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card, Button, NumberInput } from '@/shared/ui'
import { useTeamStore } from '@/entities/team'
import { TournamentFormat, GroupCount, MatchFormat, GROUP_COUNT_OPTIONS, MATCH_FORMAT_OPTIONS } from '../model/types'
import { useTournamentStore } from '../model/store'

const teamStore = useTeamStore()
const tournamentStore = useTournamentStore()

const settings = computed(() => tournamentStore.settings)
const canStartTournament = computed(() => tournamentStore.canStartTournament)
const recommendedSettings = computed(() => tournamentStore.recommendedSettings)

const updateFormat = (format: TournamentFormat) => {
  tournamentStore.updateSettings({ format })
}

const updateGroupCount = (event: Event) => {
  const groupCount = parseInt((event.target as HTMLSelectElement).value) as GroupCount
  tournamentStore.updateSettings({ groupCount })
}

const updateQualifiersPerGroup = (qualifiersPerGroup: number) => {
  tournamentStore.updateSettings({ qualifiersPerGroup })
}

const updateMatchFormat = (matchFormat: MatchFormat) => {
  tournamentStore.updateSettings({ matchFormat })
}

const canUseGroupCount = (groupCount: GroupCount): boolean => {
  return teamStore.teams.length >= groupCount * 2
}

const applyRecommendations = () => {
  if (Object.keys(recommendedSettings.value).length > 0) {
    tournamentStore.updateSettings(recommendedSettings.value)
  }
}

const getMatchFormatNote = (): string => {
  if (settings.value.format === TournamentFormat.DIRECT_KNOCKOUT) {
    return 'This format applies to all knockout stage matches.'
  } else {
    return 'This format applies to both group stage and playoff matches.'
  }
}
</script>
