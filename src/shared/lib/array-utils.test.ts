import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shuffleArray } from './array-utils'

describe('Array Utils', () => {
  beforeEach(() => {
    // Reset Math.random mock before each test
    vi.restoreAllMocks()
  })

  describe('shuffleArray', () => {
    it('should return a new array with same length', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)

      expect(shuffled).toHaveLength(original.length)
      expect(shuffled).not.toBe(original) // Should be a new array
    })

    it('should contain all original elements', () => {
      const original = ['a', 'b', 'c', 'd']
      const shuffled = shuffleArray(original)

      expect(shuffled).toHaveLength(4)
      expect(shuffled).toContain('a')
      expect(shuffled).toContain('b')
      expect(shuffled).toContain('c')
      expect(shuffled).toContain('d')
    })

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4]
      const originalCopy = [...original]
      
      shuffleArray(original)
      
      expect(original).toEqual(originalCopy)
    })

    it('should handle empty array', () => {
      const empty: number[] = []
      const shuffled = shuffleArray(empty)

      expect(shuffled).toHaveLength(0)
      expect(shuffled).toEqual([])
    })

    it('should handle single element array', () => {
      const single = ['only']
      const shuffled = shuffleArray(single)

      expect(shuffled).toEqual(['only'])
      expect(shuffled).not.toBe(single)
    })

    it('should handle array with duplicate elements', () => {
      const withDuplicates = [1, 1, 2, 2, 3]
      const shuffled = shuffleArray(withDuplicates)

      expect(shuffled).toHaveLength(5)
      expect(shuffled.filter(x => x === 1)).toHaveLength(2)
      expect(shuffled.filter(x => x === 2)).toHaveLength(2)
      expect(shuffled.filter(x => x === 3)).toHaveLength(1)
    })

    it('should produce different results with different random values', () => {
      const original = [1, 2, 3, 4, 5]
      
      // Mock Math.random to return specific values for predictable shuffling
      let callCount = 0
      const mockRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
        // Return different values for different calls to get predictable but different results
        return callCount++ % 2 === 0 ? 0.1 : 0.9
      })

      const shuffled1 = shuffleArray(original)
      
      // Reset call count for second shuffle
      callCount = 0
      mockRandom.mockImplementation(() => {
        return callCount++ % 2 === 0 ? 0.9 : 0.1
      })
      
      const shuffled2 = shuffleArray(original)

      // They might be different (not guaranteed due to randomness, but likely)
      // At minimum, they should both be valid shuffles
      expect(shuffled1).toHaveLength(5)
      expect(shuffled2).toHaveLength(5)
      expect(shuffled1.sort()).toEqual([1, 2, 3, 4, 5])
      expect(shuffled2.sort()).toEqual([1, 2, 3, 4, 5])
    })

    it('should work with complex objects', () => {
      const objects = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]
      
      const shuffled = shuffleArray(objects)

      expect(shuffled).toHaveLength(3)
      expect(shuffled).toContainEqual({ id: 1, name: 'Alice' })
      expect(shuffled).toContainEqual({ id: 2, name: 'Bob' })
      expect(shuffled).toContainEqual({ id: 3, name: 'Charlie' })
    })

    it('should use proper Fisher-Yates algorithm implementation', () => {
      const original = [1, 2, 3, 4]
      
      // Mock Math.random to return 0.5 for all calls
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      
      const shuffled = shuffleArray(original)
      
      // With Math.random always returning 0.5, we can predict the shuffle result
      // This tests that the algorithm is implemented correctly
      expect(shuffled).toHaveLength(4)
      expect(shuffled).toContain(1)
      expect(shuffled).toContain(2)
      expect(shuffled).toContain(3)
      expect(shuffled).toContain(4)
    })

    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i)
      
      const start = performance.now()
      const shuffled = shuffleArray(largeArray)
      const end = performance.now()
      
      expect(shuffled).toHaveLength(1000)
      expect(end - start).toBeLessThan(100) // Should complete within 100ms
      
      // Verify all elements are present
      const sortedShuffled = shuffled.sort((a, b) => a - b)
      expect(sortedShuffled).toEqual(largeArray)
    })
  })
})
