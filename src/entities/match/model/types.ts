import type { Team } from '@/entities/team'

export type MatchStage = 'group' | 'round16' | 'quarters' | 'semis' | 'final' | 'direct'

export interface Match {
  id: string
  team1: Team
  team2: Team
  team1Score?: number
  team2Score?: number
  isComplete?: boolean
  winner?: Team
  stage: MatchStage
  groupId?: string // Only for group stage matches
  stageOrder?: number // For ordering within a stage
}
