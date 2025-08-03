<template>
  <input
    :value="modelValue"
    :type="type"
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
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
