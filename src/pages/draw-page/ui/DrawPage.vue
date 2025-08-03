<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black py-8 px-4 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 relative">
        <!-- Theme Toggle -->
        <div class="absolute top-0 right-0 z-50">
          <StyledThemeToggle />
        </div>
        
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-64 h-2 bg-gradient-to-r from-transparent via-gray-400 dark:via-white to-transparent opacity-40 transform rotate-12"></div>
            <span class="text-9xl text-gray-700 dark:text-gray-100 transform rotate-12 transition-colors duration-300">⚽</span>
          </div>
        </div>
        <h1 class="text-6xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-lg transition-colors duration-300">Smart Football Draw</h1>
        <p class="text-2xl text-gray-600 dark:text-gray-400 transition-colors duration-300">Organize your football tournament draws</p>
        <div class="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
      </div>

      <!-- Team List Widget -->
      <TeamList />

      <!-- Match Results Widget -->
      <div class="mt-6">
        <MatchResults />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { TeamList } from '@/widgets/team-list'
import { MatchResults } from '@/widgets/match-results'
import { useSimpleThemeStore } from '@/shared/lib/theme/simple-store'
import StyledThemeToggle from '@/shared/lib/theme/ui/StyledThemeToggle.vue'

// Initialize theme
const themeStore = useSimpleThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
