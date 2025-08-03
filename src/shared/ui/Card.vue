<template>
  <div
    :class="[
      'sliced-card rounded-lg shadow-xl p-6 border transition-all duration-300',
      backgroundClasses,
      borderClasses
    ]"
  >
    <div v-if="title" class="mb-4">
      <h2 :class="titleClasses">{{ title }}</h2>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const backgroundClasses = computed(() => {
  const variants = {
    primary: 'bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800 bg-gradient-to-r from-gray-50 to-white',
    secondary: 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-purple-900 dark:to-indigo-900'
  }
  return variants[props.variant]
})

const borderClasses = computed(() => {
  const variants = {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-purple-200 dark:border-purple-700'
  }
  return variants[props.variant]
})

const titleClasses = computed(() => {
  const variants = {
    primary: 'text-3xl font-extrabold text-gray-900 dark:text-white',
    secondary: 'text-3xl font-extrabold text-purple-900 dark:text-purple-100'
  }
  return variants[props.variant]
})
</script>
