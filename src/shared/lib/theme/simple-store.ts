import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

export const useSimpleThemeStore = defineStore('simple-theme', () => {
  // Function to get initial theme
  const getInitialTheme = (): Theme => {
    try {
      // First check localStorage
      const saved = localStorage.getItem('simple-theme-mode')
      if (saved === 'dark' || saved === 'light') {
        return saved as Theme
      }
      
      // If no saved preference, check system preference
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefersDark ? 'dark' : 'light'
      }
      
      // Default to dark as requested
      return 'dark'
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
      return 'dark' // Default to dark on error
    }
  }
  
  // Simple state - initialized with proper default
  const currentTheme = ref<Theme>(getInitialTheme())
  
  // Apply theme immediately when store is created
  const applyThemeToDOM = () => {
    const root = document.documentElement
    if (currentTheme.value === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
  
  // Apply initial theme immediately
  applyThemeToDOM()
  
  // Computed to check if dark
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // Apply theme to DOM (use the same function as above)
  const applyTheme = applyThemeToDOM
  
  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    
    // Save to localStorage
    try {
      localStorage.setItem('simple-theme-mode', theme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
    
    // Apply to DOM
    applyTheme()
  }
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  // Initialize theme
  const initTheme = () => {
    applyTheme()
  }
  
  return {
    currentTheme: computed(() => currentTheme.value),
    isDark,
    setTheme,
    toggleTheme,
    initTheme
  }
})
