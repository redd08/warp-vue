<template>
  <div class="p-8 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
    <h1 class="text-2xl mb-4">Theme Test Page</h1>
    
    <div class="mb-4">
      <p>Current Theme: {{ currentTheme }}</p>
      <p>Is Dark: {{ isDark }}</p>
      <p>Resolved Theme: {{ resolvedTheme }}</p>
    </div>

    <div class="mb-4">
      <BasicThemeToggle />
    </div>

    <div class="space-x-4">
      <button 
        @click="testToggle" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Toggle Theme (Store)
      </button>

      <button 
        @click="forceLight" 
        class="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
      >
        Force Light
      </button>

      <button 
        @click="forceDark" 
        class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        Force Dark
      </button>

      <button 
        @click="testDOM" 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Test DOM
      </button>
    </div>

    <div class="mt-8">
      <h2 class="text-xl mb-2">DOM Debug:</h2>
      <p>Document Element Classes: {{ documentClasses }}</p>
      <p>LocalStorage Value: {{ storageValue }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useThemeStore } from '@/shared/lib/theme/store'
import BasicThemeToggle from './BasicThemeToggle.vue'

const themeStore = useThemeStore()
const { currentTheme, isDark, resolvedTheme, setTheme, toggleTheme } = themeStore

const documentClasses = ref('')
const storageValue = ref('')

const updateDebugInfo = () => {
  if (typeof document !== 'undefined') {
    documentClasses.value = document.documentElement.className
  }
  if (typeof localStorage !== 'undefined') {
    storageValue.value = localStorage.getItem('football-draw-theme') || 'null'
  }
}

const testToggle = () => {
  console.log('Before toggle:', { currentTheme: currentTheme.value, isDark: isDark.value })
  toggleTheme()
  console.log('After toggle:', { currentTheme: currentTheme.value, isDark: isDark.value })
  updateDebugInfo()
}

const forceLight = () => {
  console.log('Setting light theme')
  setTheme('light')
  updateDebugInfo()
}

const forceDark = () => {
  console.log('Setting dark theme')
  setTheme('dark')
  updateDebugInfo()
}

const testDOM = () => {
  console.log('Testing DOM manipulation')
  const root = document.documentElement
  
  if (root.classList.contains('dark')) {
    root.classList.remove('dark')
    console.log('Removed dark class')
  } else {
    root.classList.add('dark')
    console.log('Added dark class')
  }
  
  updateDebugInfo()
}

onMounted(() => {
  console.log('TestTheme mounted')
  console.log('Theme store:', themeStore)
  themeStore.initializeTheme()
  updateDebugInfo()
  
  // Update debug info every second
  setInterval(updateDebugInfo, 1000)
})
</script>
