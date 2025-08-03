export enum TournamentFormat {
  DIRECT_KNOCKOUT = 'direct-knockout',
  GROUP_STAGE = 'group-stage'
}

export enum GroupCount {
  ONE = 1,
  TWO = 2,
  FOUR = 4
}

export enum MatchFormat {
  SINGLE = 'single',
  HOME_AWAY = 'home-away'
}

export type TournamentPhase = 'setup' | 'groups' | 'direct' | 'round16' | 'quarters' | 'semis' | 'final' | 'complete'

export interface TournamentSettings {
  format: TournamentFormat
  groupCount: GroupCount
  teamsPerGroup: number
  qualifiersPerGroup: number
  hasPlayoffs: boolean
  matchFormat: MatchFormat
}

export interface StageInfo {
  id: TournamentPhase
  name: string
  matchesTitle: string
  advanceButtonText: string
  isKnockout: boolean
}

export const GROUP_COUNT_OPTIONS = [
  { value: GroupCount.ONE, label: '1 Group' },
  { value: GroupCount.TWO, label: '2 Groups' },
  { value: GroupCount.FOUR, label: '4 Groups' }
]

export const MATCH_FORMAT_OPTIONS = [
  { value: MatchFormat.SINGLE, label: 'Single Match', description: 'Teams play once against each opponent' },
  { value: MatchFormat.HOME_AWAY, label: 'Home & Away', description: 'Teams play twice against each opponent (home and away)' }
]
