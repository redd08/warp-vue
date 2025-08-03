import type { Team } from '@/entities/team'

export interface GroupStanding {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Group {
  id: string
  name: string
  teams: Team[]
  standings: GroupStanding[]
  isComplete: boolean
}

export interface GroupMatch {
  id: string
  groupId: string
  team1: Team
  team2: Team
  team1Score?: number
  team2Score?: number
  isComplete: boolean
}
