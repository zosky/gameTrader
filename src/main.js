import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import './main.css'

const router = createRouter({history: createWebHistory()})
const app = createApp(App)
app.use(router)
app.mount('#app')