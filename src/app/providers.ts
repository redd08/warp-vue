import { createPinia } from 'pinia'
import type { App } from 'vue'

export const setupProviders = (app: App) => {
  const pinia = createPinia()
  app.use(pinia)
}
