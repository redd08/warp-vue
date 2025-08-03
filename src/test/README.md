# Testing Guide

This document provides information about the testing setup and how to run tests for the Football Draw application.

## Test Framework

We use **Vitest** as our test runner with the following setup:
- **@vue/test-utils** for Vue component testing
- **jsdom** for DOM environment simulation
- **Pinia** for state management testing
- **TypeScript** support included

## Test Structure

Tests are organized following the Feature-Sliced Design architecture:

```
src/
├── entities/
│   ├── team/model/
│   │   ├── team.test.ts       # Team entity tests
│   │   └── store.test.ts      # Team store tests
│   ├── match/model/
│   │   ├── match.test.ts      # Match entity tests
│   │   └── store.test.ts      # Match store tests
│   └── group/model/
│       ├── group.test.ts      # Group entity tests
│       └── store.test.ts      # Group store tests
├── features/
│   ├── tournament-format/model/
│   │   └── store.test.ts      # Tournament format tests
│   ├── manual-draw/model/
│   │   └── store.test.ts      # Manual draw tests
│   └── draw-generation/model/
│       └── store.test.ts      # Draw generation tests
├── shared/lib/
│   ├── persistence/
│   │   └── storage.test.ts    # LocalStorage utility tests
│   ├── array-utils.test.ts    # Array utility tests
│   └── country-flags.test.ts  # Country flags tests
└── test/
    ├── setup.ts               # Global test setup
    ├── test-runner.ts         # Test organization utilities
    └── README.md              # This file
```

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode
npm run test

# Run all tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Specific Test Suites

```bash
# Run only entity tests
npm run test:entities

# Run only feature tests
npm run test:features

# Run only shared utility tests
npm run test:shared
```

### Individual Test Files

```bash
# Run specific test file
npx vitest src/entities/team/model/store.test.ts

# Run tests matching a pattern
npx vitest team
```

## Test Categories

### Entity Tests
- **Team Entity**: Tests for team data structure and validation
- **Team Store**: Tests for team management functionality
- **Match Entity**: Tests for match data structure and results
- **Match Store**: Tests for match state management
- **Group Entity**: Tests for group standings and calculations
- **Group Store**: Tests for group management and match scoring

### Feature Tests
- **Tournament Format Store**: Tests for tournament configuration and flow
- **Manual Draw Store**: Tests for drag-and-drop draw functionality
- **Draw Generation Store**: Tests for automatic draw generation

### Shared Utility Tests
- **LocalStorage Manager**: Tests for data persistence utilities
- **Array Utils**: Tests for shuffle algorithms and array manipulation
- **Country Flags**: Tests for flag emoji mapping

## Test Coverage

Run tests with coverage to see how much of your code is tested:

```bash
npm run test:coverage
```

This generates:
- Console output with coverage summary
- HTML report in `coverage/` directory
- JSON report for CI/CD integration

### Coverage Targets
- **Statements**: Aim for >90%
- **Branches**: Aim for >85%
- **Functions**: Aim for >90%
- **Lines**: Aim for >90%

## Writing Tests

### Test Structure
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

describe('Feature Name', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should do something specific', () => {
    // Arrange
    const input = 'test data'
    
    // Act
    const result = functionUnderTest(input)
    
    // Assert
    expect(result).toBe('expected output')
  })
})
```

### Store Testing
For Pinia stores, always create a fresh Pinia instance:

```typescript
import { createPinia, setActivePinia } from 'pinia'
import { useMyStore } from './store'

describe('My Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useMyStore()
    expect(store.someProperty).toBe('default value')
  })
})
```

### Mocking
Use Vitest's built-in mocking:

```typescript
import { vi } from 'vitest'

// Mock external dependencies
vi.mock('@/shared/lib', () => ({
  shuffleArray: vi.fn((arr) => [...arr])
}))

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **One Assertion Per Test**: Keep tests focused and specific
3. **Descriptive Test Names**: Use clear, descriptive names that explain what is being tested
4. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification phases
5. **Mock External Dependencies**: Isolate the code under test from external dependencies
6. **Test Edge Cases**: Include tests for boundary conditions and error scenarios

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hooks)
- Pull requests
- Main branch updates

Coverage reports are generated and can be used to track testing progress over time.

## Debugging Tests

### VS Code Integration
Add this to your VS Code settings for better test debugging:

```json
{
  "vitest.enable": true,
  "vitest.commandLine": "npm run test"
}
```

### Debug Individual Tests
```bash
# Run a single test file with debug output
npx vitest --reporter=verbose src/path/to/test.ts

# Run tests matching a pattern
npx vitest --reporter=verbose -t "specific test name"
```

## Performance

- Tests should run quickly (< 1s per test file typically)
- Use `vi.useFakeTimers()` for time-dependent tests
- Mock expensive operations like API calls or file I/O
- Consider test parallelization for large test suites

This testing setup ensures high code quality and confidence in the Football Draw application functionality.
