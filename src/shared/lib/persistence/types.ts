import type { Team } from '@/entities/team'
import type { Match } from '@/entities/match'
import type { Group, GroupMatch } from '@/entities/group'
import type { TournamentSettings } from '@/features/tournament-format'
import type { MatchSlot } from '@/features/manual-draw'

export interface SavedTournamentData {
  version: string
  timestamp: number
  teams: Team[]
  tournamentSettings: TournamentSettings
  currentPhase: 'setup' | 'groups' | 'playoffs' | 'complete'
  
  // Group stage data
  groups: Group[]
  groupMatches: GroupMatch[]
  
  // Knockout/playoff matches
  matches: Match[]
  
  // Draw states
  drawComplete: boolean
  isManualMode: boolean
  manualDrawSlots: MatchSlot[]
}

export interface SaveMetadata {
  id: string
  name: string
  timestamp: number
  teamCount: number
  tournamentFormat: string
  phase: string
}

export const STORAGE_KEYS = {
  CURRENT_TOURNAMENT: 'current-tournament',
  AUTO_SAVE: 'auto-save',
  SAVES_LIST: 'saves-list'
} as const
