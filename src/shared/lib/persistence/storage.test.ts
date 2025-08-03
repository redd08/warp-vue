import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageManager } from './storage'

describe('LocalStorageManager', () => {
  let storageManager: LocalStorageManager

  beforeEach(() => {
    storageManager = LocalStorageManager.getInstance()
    vi.clearAllMocks()
  })

  it('should be a singleton', () => {
    const instance1 = LocalStorageManager.getInstance()
    const instance2 = LocalStorageManager.getInstance()
    
    expect(instance1).toBe(instance2)
  })

  it('should save data with prefixed key', () => {
    const testData = { name: 'test', value: 123 }
    
    storageManager.save('test-key', testData)
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'football-draw-test-key',
      JSON.stringify(testData)
    )
  })

  it('should load data from storage', () => {
    const testData = { name: 'test', value: 123 }
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(testData))
    
    const result = storageManager.load('test-key')
    
    expect(localStorage.getItem).toHaveBeenCalledWith('football-draw-test-key')
    expect(result).toEqual(testData)
  })

  it('should return null for non-existent key', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    const result = storageManager.load('non-existent')
    
    expect(result).toBeNull()
  })

  it('should handle JSON parse errors', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('invalid-json')
    
    const result = storageManager.load('invalid-key')
    
    expect(result).toBeNull()
  })

  it('should remove data from storage', () => {
    storageManager.remove('test-key')
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('football-draw-test-key')
  })

  it('should clear all data with prefix', () => {
    const mockKeys = ['football-draw-key1', 'football-draw-key2', 'other-key']
    
    // Mock localStorage.key method
    vi.mocked(localStorage.key).mockImplementation((index) => mockKeys[index] || null)
    Object.defineProperty(localStorage, 'length', { value: mockKeys.length })
    
    storageManager.clear()
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('football-draw-key1')
    expect(localStorage.removeItem).toHaveBeenCalledWith('football-draw-key2')
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('other-key')
  })

  it('should check if key exists', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('some-value')
    
    const exists = storageManager.exists('test-key')
    
    expect(localStorage.getItem).toHaveBeenCalledWith('football-draw-test-key')
    expect(exists).toBe(true)
  })

  it('should return false for non-existent key check', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    
    const exists = storageManager.exists('non-existent')
    
    expect(exists).toBe(false)
  })

  it('should list all keys with prefix', () => {
    const mockKeys = ['football-draw-teams', 'football-draw-matches', 'other-key', 'football-draw-settings']
    
    vi.mocked(localStorage.key).mockImplementation((index) => mockKeys[index] || null)
    Object.defineProperty(localStorage, 'length', { value: mockKeys.length })
    
    const keys = storageManager.listKeys()
    
    expect(keys).toEqual(['teams', 'matches', 'settings'])
  })

  it('should handle empty storage when listing keys', () => {
    Object.defineProperty(localStorage, 'length', { value: 0 })
    
    const keys = storageManager.listKeys()
    
    expect(keys).toEqual([])
  })

  it('should handle localStorage errors gracefully', () => {
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const result = storageManager.save('test-key', { data: 'test' })
    
    expect(result).toBe(false)
  })
})
