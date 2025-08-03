/**
 * Test Runner Script
 * 
 * This file provides utilities for running and organizing tests.
 * It can be used to run specific test suites or all tests.
 */

export const testSuites = {
  entities: [
    'src/entities/team/model/team.test.ts',
    'src/entities/team/model/store.test.ts',
    'src/entities/match/model/match.test.ts',
    'src/entities/match/model/store.test.ts',
    'src/entities/group/model/group.test.ts',
    'src/entities/group/model/store.test.ts'
  ],
  features: [
    'src/features/tournament-format/model/store.test.ts',
    'src/features/manual-draw/model/store.test.ts',
    'src/features/draw-generation/model/store.test.ts'
  ],
  shared: [
    'src/shared/lib/persistence/storage.test.ts',
    'src/shared/lib/array-utils.test.ts',
    'src/shared/lib/country-flags.test.ts'
  ]
}

export const getAllTestFiles = (): string[] => {
  return [
    ...testSuites.entities,
    ...testSuites.features,
    ...testSuites.shared
  ]
}

export const getTestSuiteByType = (type: keyof typeof testSuites): string[] => {
  return testSuites[type]
}
