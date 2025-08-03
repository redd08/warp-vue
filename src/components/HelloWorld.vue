<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">{{ msg }}</h1>

    <div class="text-center mb-8">
      <button 
        type="button" 
        @click="count++"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
      >
        Local count is {{ count }}
      </button>
      <p class="mt-4 text-gray-600">
        Edit
        <code class="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">components/HelloWorld.vue</code> 
        to test HMR
      </p>
    </div>

    <div class="space-y-4 text-center">
      <p class="text-gray-700">
        Check out
        <a 
          href="https://vuejs.org/guide/quick-start.html#local" 
          target="_blank"
          class="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          create-vue
        </a>, the official Vue + Vite starter
      </p>
      <p class="text-gray-700">
        Learn more about IDE Support for Vue in the
        <a
          href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
          target="_blank"
          class="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          Vue Docs Scaling up Guide
        </a>.
      </p>
      <p class="text-gray-500 text-sm">Click on the Vite and Vue logos to learn more</p>
    </div>
  </div>
</template>
