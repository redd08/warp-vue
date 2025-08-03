import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageManager } from './storage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

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
    const mockKeys = [
      'football-draw-key1',
      'football-draw-key2', 
      'other-key'
    ]
    
    // Mock Object.keys to return our mock keys
    const objectKeysSpy = vi.spyOn(Object, 'keys').mockReturnValue(mockKeys)
    
    storageManager.clear()
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('football-draw-key1')
    expect(localStorage.removeItem).toHaveBeenCalledWith('football-draw-key2')
    expect(localStorage.removeItem).not.toHaveBeenCalledWith('other-key')
    
    // Restore Object.keys spy
    objectKeysSpy.mockRestore()
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
    const mockKeys = [
      'football-draw-teams',
      'football-draw-matches',
      'other-key',
      'football-draw-settings'
    ]
    
    // Mock Object.keys for localStorage to return our mock keys
    const objectKeysSpy = vi.spyOn(Object, 'keys').mockReturnValue(mockKeys)
    
    const keys = storageManager.getAllKeys()
    
    expect(keys).toEqual(['teams', 'matches', 'settings'])
    
    // Restore Object.keys spy
    objectKeysSpy.mockRestore()
  })

  it('should handle empty storage when listing keys', () => {
    // Mock Object.keys to return empty array
    const objectKeysSpy = vi.spyOn(Object, 'keys').mockReturnValue([])
    
    const keys = storageManager.getAllKeys()
    
    expect(keys).toEqual([])
    
    // Restore Object.keys spy
    objectKeysSpy.mockRestore()
  })

  it('should handle localStorage errors gracefully', () => {
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const result = storageManager.save('test-key', { data: 'test' })
    
    expect(result).toBe(false)
  })
})
