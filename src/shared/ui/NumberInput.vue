<template>
  <div v-if="customArrows" class="number-input-custom">
    <input
      ref="numberInput"
      :value="modelValue"
      type="number"
      :min="min"
      :max="max"
      :step="step"
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
      @keyup.enter="$emit('enter')"
    />
    <div class="number-input-arrows" v-if="!disabled">
      <div 
        class="number-input-arrow" 
        :class="{ 'number-input-arrow-disabled': !canIncrement }"
        @click="increment"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </div>
      <div 
        class="number-input-arrow" 
        :class="{ 'number-input-arrow-disabled': !canDecrement }"
        @click="decrement"
      >
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
  <input
    v-else
    :value="modelValue"
    type="number"
    :min="min"
    :max="max"
    :step="step"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="[
      'px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200',
      'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
      'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
      'focus:ring-blue-500 dark:focus:ring-purple-500 focus:border-blue-500 dark:focus:border-purple-500',
      'hover:border-gray-400 dark:hover:border-gray-500',
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    @input="handleInput"
    @keyup.enter="$emit('enter')"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  customArrows?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  placeholder: '',
  disabled: false,
  customArrows: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  enter: []
}>()

const numberInput = ref<HTMLInputElement>()

// Computed properties for arrow states
const canIncrement = computed(() => props.modelValue < (props.max || Infinity))
const canDecrement = computed(() => props.modelValue > (props.min || -Infinity))

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = parseFloat(target.value) || 0
  
  // Clamp value to min/max limits
  if (props.min !== undefined) value = Math.max(props.min, value)
  if (props.max !== undefined) value = Math.min(props.max, value)
  
  emit('update:modelValue', value)
}

const increment = () => {
  if (canIncrement.value) {
    const newValue = props.modelValue + props.step
    emit('update:modelValue', newValue)
  }
}

const decrement = () => {
  if (canDecrement.value) {
    const newValue = props.modelValue - props.step
    emit('update:modelValue', newValue)
  }
}
</script>

<style scoped>
.number-input-custom {
  position: relative;
  display: inline-block;
  width: 100%;
}

.number-input-custom input[type="number"] {
  /* Hide default browser spinner arrows */
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  padding-right: 28px; /* Make room for custom arrows */
  box-sizing: border-box;
}

.number-input-custom input[type="number"]::-webkit-outer-spin-button,
.number-input-custom input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input-arrows {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: calc(100% - 8px);
  display: flex;
  flex-direction: column;
  border-left: 1px solid;
  border-radius: 0 4px 4px 0;
  @apply border-gray-300 dark:border-gray-600;
}

.number-input-arrow {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  @apply bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600;
  @apply text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200;
}

.number-input-arrow:first-child {
  border-top-right-radius: 4px;
  border-bottom: 0.5px solid;
  @apply border-gray-300 dark:border-gray-600;
}

.number-input-arrow:last-child {
  border-bottom-right-radius: 4px;
}

.number-input-arrow:active {
  @apply bg-gray-200 dark:bg-gray-500;
}

.number-input-arrow-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.number-input-arrow-disabled:hover {
  @apply bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400;
}
</style>
