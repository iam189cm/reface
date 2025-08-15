import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n/index.js'
import { setI18nInstance } from './utils/i18nNotification.js'
import Home from './views/Home.vue'
import Editor from './views/Editor.vue'
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'
import Callback from './views/auth/Callback.vue'
import ForgotPassword from './views/auth/ForgotPassword.vue'
import Admin from './views/Admin.vue'
import Pricing from './views/Pricing.vue'
import Help from './views/Help.vue'
import Solutions from './views/Solutions.vue'
import Showcase from './views/Showcase.vue'
// 性能优化工具
import { initPerformanceOptimizations, createAsyncComponent } from './utils/performance.js'

// 解决方案页面使用动态导入
const PersonalUser = createAsyncComponent(() => import('./pages/SolutionPages/PersonalUser.vue'))
const ContentCreator = createAsyncComponent(() => import('./pages/SolutionPages/ContentCreator.vue'))
const EcommerceSeller = createAsyncComponent(() => import('./pages/SolutionPages/EcommerceSeller.vue'))
const Designer = createAsyncComponent(() => import('./pages/SolutionPages/Designer.vue'))

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/editor', name: 'editor', component: Editor },
  { path: '/solutions', name: 'solutions', component: Solutions },
  { path: '/showcase', name: 'showcase', component: Showcase },
  { path: '/pricing', name: 'pricing', component: Pricing },
  { path: '/help', name: 'help', component: Help },
  
  // 解决方案页面路由
  { 
    path: '/solutions/personal', 
    name: 'solutions-personal', 
    component: PersonalUser,
    meta: { title: '个人用户解决方案' }
  },
  { 
    path: '/solutions/content-creator', 
    name: 'solutions-content-creator', 
    component: ContentCreator,
    meta: { title: '内容创作者解决方案' }
  },
  { 
    path: '/solutions/ecommerce', 
    name: 'solutions-ecommerce', 
    component: EcommerceSeller,
    meta: { title: '电商卖家解决方案' }
  },
  { 
    path: '/solutions/designer', 
    name: 'solutions-designer', 
    component: Designer,
    meta: { title: '设计师解决方案' }
  },
  
  // 认证路由
  { path: '/auth/login', name: 'login', component: Login },
  { path: '/auth/register', name: 'register', component: Register },
  { path: '/auth/callback', name: 'auth-callback', component: Callback },
  { path: '/auth/forgot-password', name: 'forgot-password', component: ForgotPassword },
  
  // 管理员路由
  { 
    path: '/admin', 
    name: 'admin', 
    component: Admin,
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🆕 路由守卫 - 保护需要特殊权限的路由
router.beforeEach(async (to, from, next) => {
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    // 动态导入Pinia store（避免循环依赖）
    const { useAuthStore } = await import('./stores/modules/auth/authStore.js')
    const authStore = useAuthStore()
    
    // 确保认证状态已初始化
    if (!authStore.initialized) {
      await authStore.initialize()
    }
    
    // 检查是否为管理员
    if (!authStore.isAdmin) {
      console.warn('[Router] 访问被拒绝：需要管理员权限', to.path)
      
      // 未登录跳转到登录页，已登录但非管理员跳转到首页
      const redirectTo = authStore.isAuthenticated ? '/' : '/auth/login'
      next(redirectTo)
      return
    }
  }
  
  next()
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// 设置i18n实例给通知系统
setI18nInstance(i18n)

// 初始化性能优化
initPerformanceOptimizations()

app.mount('#app')