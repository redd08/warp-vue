import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { LocalStorageManager } from '@/shared/lib/persistence'

export type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const storage = LocalStorageManager.getInstance()
  
  // Load theme from localStorage or default to light
  let savedTheme: Theme = 'system'
  const loadTheme = () => {
    try {
      const loaded = storage.load('theme') as Theme
      if (loaded && ['light', 'dark', 'system'].includes(loaded)) {
        return loaded
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error)
    }
    return 'system'
  }

  savedTheme = loadTheme()
  
  const currentTheme = ref<Theme>(savedTheme)
  
  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } catch (error) {
        console.error('Failed to detect system theme:', error)
        return 'light'
      }
    }
    return 'light'
  }
  
  // Computed actual theme (resolves 'system' to actual theme)
  const resolvedTheme = computed(() => {
    if (currentTheme.value === 'system') {
      return getSystemTheme()
    }
    return currentTheme.value
  })
  
  // Check if current theme is dark
  const isDark = computed(() => {
    return resolvedTheme.value === 'dark'
  })
  
  // Apply theme to document
  const applyTheme = (theme: 'light' | 'dark') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }
  
  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    storage.save('theme', theme)
    
    // Apply the resolved theme
    applyTheme(resolvedTheme.value)
  }
  
  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  // Initialize theme on store creation
  const initializeTheme = () => {
    applyTheme(resolvedTheme.value)
    
    // Watch for system theme changes when using system theme
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (currentTheme.value === 'system') {
          applyTheme(resolvedTheme.value)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // Cleanup function (if needed)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }
  
  // Watch for theme changes
  watch(resolvedTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: true })
  
  return {
    currentTheme: computed(() => currentTheme.value),
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme
  }
})
