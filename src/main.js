import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Editor from './views/Editor.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import Callback from './views/auth/Callback.vue'
import ForgotPassword from './views/auth/ForgotPassword.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/editor', name: 'editor', component: Editor },
  { path: '/auth/login', name: 'login', component: Login },
  { path: '/auth/register', name: 'register', component: Register },
  { path: '/auth/callback', name: 'auth-callback', component: Callback },
  { path: '/auth/forgot-password', name: 'forgot-password', component: ForgotPassword }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')