<template>
  <button 
    @click="handleClick" 
    class="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
    style="pointer-events: auto;"
  >
    {{ isDark ? '☀️ Light' : '🌙 Dark' }}
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSimpleThemeStore } from '../simple-store'

const themeStore = useSimpleThemeStore()
const { isDark } = storeToRefs(themeStore)

const handleClick = () => {
  console.log('Button clicked!')
  console.log('Current theme before toggle:', themeStore.currentTheme)
  
  // Try direct DOM manipulation as well
  const root = document.documentElement
  const isCurrentlyDark = root.classList.contains('dark')
  
  if (isCurrentlyDark) {
    root.classList.remove('dark')
    localStorage.setItem('simple-theme-mode', 'light')
  } else {
    root.classList.add('dark')
    localStorage.setItem('simple-theme-mode', 'dark')
  }
  
  // Also call the store method
  themeStore.toggleTheme()
  
  console.log('Theme after toggle:', themeStore.currentTheme)
  console.log('DOM has dark class:', root.classList.contains('dark'))
}
</script>
