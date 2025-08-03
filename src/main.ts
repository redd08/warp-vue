import { createApp } from 'vue'
import { setupProviders } from './app/providers'
import './style.css'
import App from './App.vue'

const app = createApp(App)
setupProviders(app)
app.mount('#app')
