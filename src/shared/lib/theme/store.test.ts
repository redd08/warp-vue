import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useThemeStore } from './store'

describe('Theme Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(null), // Default to null to prevent undefined errors
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    }
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    // Mock document
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        }
      },
      writable: true
    })
  })

  it('should initialize with system theme by default', () => {
    const store = useThemeStore()
    
    expect(store.currentTheme).toBe('system')
  })

  it('should resolve system theme to light when system prefers light', () => {
    // Mock system preference for light mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false, // prefers-color-scheme: dark returns false
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const store = useThemeStore()
    
    expect(store.resolvedTheme).toBe('light')
    expect(store.isDark).toBe(false)
  })

  it('should resolve system theme to dark when system prefers dark', () => {
    // Mock system preference for dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    // Create new store instance with dark system preference
    setActivePinia(createPinia())
    const store = useThemeStore()
    
    expect(store.resolvedTheme).toBe('dark')
    expect(store.isDark).toBe(true)
  })

  it('should set theme and save to localStorage', () => {
    const store = useThemeStore()
    const mockSetItem = vi.mocked(localStorage.setItem)
    
    store.setTheme('dark')
    
    expect(store.currentTheme).toBe('dark')
    expect(mockSetItem).toHaveBeenCalledWith('football-draw-theme', '"dark"')
  })

  it('should toggle between light and dark themes', () => {
    const store = useThemeStore()
    
    // Start with light theme
    store.setTheme('light')
    expect(store.currentTheme).toBe('light')
    
    // Toggle to dark
    store.toggleTheme()
    expect(store.currentTheme).toBe('dark')
    
    // Toggle back to light
    store.toggleTheme()
    expect(store.currentTheme).toBe('light')
  })

  it('should apply dark class to document element', () => {
    const store = useThemeStore()
    const mockAdd = vi.mocked(document.documentElement.classList.add)
    const mockRemove = vi.mocked(document.documentElement.classList.remove)
    
    // Clear previous calls from store initialization
    mockAdd.mockClear()
    mockRemove.mockClear()
    
    store.setTheme('dark')
    
    expect(mockAdd).toHaveBeenCalledWith('dark')
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('should remove dark class from document element for light theme', () => {
    const store = useThemeStore()
    const mockAdd = vi.mocked(document.documentElement.classList.add)
    const mockRemove = vi.mocked(document.documentElement.classList.remove)
    
    // Clear previous calls from store initialization
    mockAdd.mockClear()
    mockRemove.mockClear()

    store.setTheme('light')
    
    expect(mockRemove).toHaveBeenCalledWith('dark')
    expect(mockAdd).not.toHaveBeenCalledWith('dark')
  })

  it('should load theme from localStorage on initialization', () => {
    const mockGetItem = vi.mocked(localStorage.getItem)
    mockGetItem.mockReturnValue('"dark"')
    
    // Create a new store instance
    setActivePinia(createPinia())
    const store = useThemeStore()
    
    expect(mockGetItem).toHaveBeenCalledWith('football-draw-theme')
    expect(store.currentTheme).toBe('dark')
  })

  it('should handle invalid localStorage data gracefully', () => {
    // Mock console.error to suppress expected error output
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const mockGetItem = vi.mocked(localStorage.getItem)
    mockGetItem.mockReturnValue('invalid-json')
    
    // Create a new store instance
    setActivePinia(createPinia())
    const store = useThemeStore()
    
    // Should fallback to system theme
    expect(store.currentTheme).toBe('system')
    
    // Ensure the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to load data from localStorage for key "theme":',
      expect.any(SyntaxError)
    )
    
    // Restore console.error
    consoleErrorSpy.mockRestore()
  })

  it('should handle missing localStorage gracefully', () => {
    const mockGetItem = vi.mocked(localStorage.getItem)
    mockGetItem.mockReturnValue(null)
    
    // Create a new store instance
    setActivePinia(createPinia())
    const store = useThemeStore()
    
    // Should fallback to system theme
    expect(store.currentTheme).toBe('system')
  })

  it('should initialize theme system correctly', () => {
    // Mock system preference for dark mode BEFORE creating store
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    // Create new store instance with mocked system preference
    setActivePinia(createPinia())
    const store = useThemeStore()
    const mockAdd = vi.mocked(document.documentElement.classList.add)
    
    store.initializeTheme()
    
    // Should apply dark theme based on system preference
    expect(mockAdd).toHaveBeenCalledWith('dark')
  })

  it('should handle environment without window object', () => {
    // Temporarily remove window object
    const originalWindow = global.window
    // @ts-expect-error - Testing SSR environment
    delete global.window
    
    const store = useThemeStore()
    
    // Should not throw error and default to light theme
    expect(store.resolvedTheme).toBe('light')
    expect(store.isDark).toBe(false)
    
    // Restore window object
    global.window = originalWindow
  })

  it('should handle environment without document object', () => {
    // Temporarily remove document object
    const originalDocument = global.document
    // @ts-expect-error - Testing SSR environment
    delete global.document
    
    const store = useThemeStore()
    
    // Should not throw error when applying theme
    expect(() => store.setTheme('dark')).not.toThrow()
    
    // Restore document object
    global.document = originalDocument
  })
})
