<template>
  <div class="theme-toggle-debug">
    <p>Current Theme: {{ currentTheme }}</p>
    <p>Is Dark: {{ isDark }}</p>
    <p>Resolved Theme: {{ resolvedTheme }}</p>
    
    <button 
      @click="handleToggle"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Toggle Theme ({{ isDark ? 'Switch to Light' : 'Switch to Dark' }})
    </button>
    
    <button 
      @click="setLight"
      class="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 ml-2"
    >
      Force Light
    </button>
    
    <button 
      @click="setDark"
      class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 ml-2"
    >
      Force Dark
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../store'

const themeStore = useThemeStore()
const { currentTheme, isDark, resolvedTheme, setTheme, toggleTheme } = themeStore

const handleToggle = () => {
  console.log('SimpleThemeToggle: Before toggle - isDark:', isDark.value)
  toggleTheme()
  console.log('SimpleThemeToggle: After toggle - isDark:', isDark.value)
}

const setLight = () => {
  console.log('SimpleThemeToggle: Setting to light')
  setTheme('light')
}

const setDark = () => {
  console.log('SimpleThemeToggle: Setting to dark')
  setTheme('dark')
}
</script>
