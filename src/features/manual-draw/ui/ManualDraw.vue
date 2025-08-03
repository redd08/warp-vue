<template>
  <div v-if="manualDrawStore.isManualMode" class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-white">Manual Draw - Drag & Drop Teams</h3>
      <div class="space-x-2">
        <Button variant="secondary" size="sm" @click="manualDrawStore.addMatchSlot">
          Add Match
        </Button>
        <Button variant="danger" size="sm" @click="manualDrawStore.cancelManualDraw">
          Cancel
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Available Teams -->
      <div class="lg:col-span-1">
        <h4 class="text-lg font-semibold text-white mb-4">Available Teams</h4>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <DraggableTeam
            v-for="team in manualDrawStore.availableTeams"
            :key="team.id"
            :team="team"
          />
          <div v-if="manualDrawStore.availableTeams.length === 0" class="text-center py-8 text-gray-400">
            All teams have been assigned to matches
          </div>
        </div>
      </div>

      <!-- Match Slots -->
      <div class="lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-semibold text-white">Match Fixtures</h4>
          <Button
            variant="success"
            :disabled="!manualDrawStore.canFinalizeDraw"
            @click="manualDrawStore.finalizeDraw"
          >
            Finalize Draw
          </Button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="slot in manualDrawStore.matchSlots"
            :key="slot.id"
            class="bg-gradient-to-r from-gray-900/50 to-gray-800/50 p-4 rounded-lg border border-gray-700"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-300">{{ slot.id.replace('slot-', 'Match ') }}</span>
              <button
                @click="manualDrawStore.removeMatchSlot(slot.id)"
                :disabled="manualDrawStore.matchSlots.length <= 1"
                class="text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed p-1 rounded transition-colors"
                title="Remove match slot"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
            
            <div class="grid grid-cols-3 gap-4 items-center">
              <!-- Team 1 Drop Zone -->
              <TeamDropZone
                :team="slot.team1"
                :slot-id="slot.id"
                position="team1"
                @team-dropped="handleTeamDropped"
                @team-removed="handleTeamRemoved"
              />
              
              <!-- VS -->
              <div class="text-center">
                <div class="mx-auto bg-white/20 px-3 py-1 rounded-full text-sm font-extrabold text-white shadow-inner w-fit">
                  VS
                </div>
              </div>
              
              <!-- Team 2 Drop Zone -->
              <TeamDropZone
                :team="slot.team2"
                :slot-id="slot.id"
                position="team2"
                @team-dropped="handleTeamDropped"
                @team-removed="handleTeamRemoved"
              />
            </div>
          </div>

          <div v-if="manualDrawStore.matchSlots.length === 0" class="text-center py-8 text-gray-400">
            No match slots created. Click "Add Match" to start.
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
      <h5 class="text-sm font-semibold text-blue-300 mb-2">Instructions:</h5>
      <ul class="text-xs text-blue-200 space-y-1">
        <li>• Drag teams from the left panel into match slots</li>
        <li>• Each match needs exactly 2 teams</li>
        <li>• Click the × button to remove a team from a slot</li>
        <li>• Use "Add Match" to create more match slots</li>
        <li>• Click "Finalize Draw" when all matches are complete</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui'
import type { Team } from '@/entities/team'
import { useManualDrawStore } from '../model/store'
import DraggableTeam from './DraggableTeam.vue'
import TeamDropZone from './TeamDropZone.vue'

const manualDrawStore = useManualDrawStore()

const handleTeamDropped = (team: Team, slotId: string, position: 'team1' | 'team2') => {
  manualDrawStore.setTeamInSlot(slotId, position, team)
}

const handleTeamRemoved = (slotId: string, position: 'team1' | 'team2') => {
  manualDrawStore.removeTeamFromSlot(slotId, position)
}
</script>
