<template>
  <button 
    @click="toggleTheme"
    class="p-2 border border-gray-300 rounded-lg"
  >
    {{ isDark ? '🌙 Dark' : '☀️ Light' }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  
  // Save to localStorage
  localStorage.setItem('simple-theme', isDark.value ? 'dark' : 'light')
  
  console.log('Theme toggled to:', isDark.value ? 'dark' : 'light')
  console.log('Document classes:', document.documentElement.className)
}

onMounted(() => {
  // Load from localStorage
  const saved = localStorage.getItem('simple-theme')
  if (saved === 'dark') {
    isDark.value = true
    applyTheme(true)
  }
  
  console.log('BasicThemeToggle mounted, isDark:', isDark.value)
})
</script>
