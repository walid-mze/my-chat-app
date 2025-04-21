// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 🔥 Firebase config import
import './firebase'

createApp(App).use(router).mount('#app')
