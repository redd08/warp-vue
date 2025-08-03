<template>
  <div class="relative" ref="containerRef">
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 w-full',
        'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
        'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
        'focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500',
        'hover:border-gray-400 dark:hover:border-gray-500',
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup.enter="$emit('enter')"
      autocomplete="off"
    />
    
    <!-- Dropdown -->
    <div
      v-if="showDropdown && filteredOptions.length > 0"
      class="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-2xl max-h-60 overflow-y-auto backdrop-blur-sm"
      style="box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);"
    >
      <div
        v-for="(option, index) in filteredOptions"
        :key="option.value"
        :class="[
          'px-4 py-2 cursor-pointer transition-colors duration-150 flex items-center space-x-3',
          'text-gray-900 dark:text-white',
          index === highlightedIndex
            ? 'bg-blue-100 dark:bg-purple-900/50'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        ]"
        @mousedown.prevent="selectOption(option)"
        @mouseenter="highlightedIndex = index"
      >
        <span class="text-lg">{{ option.flag }}</span>
        <span class="flex-1">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface AutocompleteOption {
  value: string
  label: string
  flag?: string
}

interface Props {
  modelValue: string
  options: AutocompleteOption[]
  placeholder?: string
  disabled?: boolean
  minSearchLength?: number
  maxResults?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  minSearchLength: 0,
  maxResults: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [option: AutocompleteOption]
  'enter': []
}>()

const containerRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()
const showDropdown = ref(false)
const highlightedIndex = ref(-1)

const filteredOptions = computed(() => {
  const searchTerm = props.modelValue.toLowerCase().trim()
  
  if (searchTerm.length < props.minSearchLength) {
    return []
  }
  
  const filtered = props.options
    .filter(option => 
      option.label.toLowerCase().includes(searchTerm) ||
      option.value.toLowerCase().includes(searchTerm)
    )
    .slice(0, props.maxResults)
  
  return filtered
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  showDropdown.value = true
  highlightedIndex.value = -1
}

const handleFocus = () => {
  showDropdown.value = true
}

const handleBlur = () => {
  // Delay hiding dropdown to allow for option selection
  setTimeout(() => {
    showDropdown.value = false
    highlightedIndex.value = -1
  }, 150)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value || filteredOptions.value.length === 0) return
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        filteredOptions.value.length - 1
      )
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectOption(filteredOptions.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      showDropdown.value = false
      highlightedIndex.value = -1
      inputRef.value?.blur()
      break
  }
}

const selectOption = (option: AutocompleteOption) => {
  emit('update:modelValue', option.label)
  emit('select', option)
  showDropdown.value = false
  highlightedIndex.value = -1
  
  nextTick(() => {
    inputRef.value?.blur()
  })
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    showDropdown.value = false
    highlightedIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
