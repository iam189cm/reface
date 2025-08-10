<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-rainbow px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">登录 Reface</h1>
        <p class="text-gray-600">选择你喜欢的登录方式</p>
      </div>

      <!-- 第三方登录按钮 -->
      <div class="space-y-4 mb-6">
        <button
          @click="signInWithProvider('google')"
          :disabled="loading"
          class="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          </svg>
          Google 登录
        </button>

        <button
          @click="signInWithProvider('github')"
          :disabled="loading"
          class="w-full flex items-center justify-center px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub 登录
        </button>
      </div>

      <!-- 分割线 -->
      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">或使用邮箱登录</span>
        </div>
      </div>

      <!-- 邮箱登录表单 -->
      <form @submit.prevent="handleEmailLogin" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="邮箱地址"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="密码"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          :disabled="loading || !email || !password"
          class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? '登录中...' : '邮箱登录' }}
        </button>
      </form>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- 底部链接 -->
      <div class="mt-6 text-center space-y-2">
        <router-link to="/auth/register" class="text-blue-500 hover:text-blue-600">
          还没有账户？立即注册
        </router-link>
        <br>
        <router-link to="/auth/forgot-password" class="text-gray-500 hover:text-gray-600 text-sm">
          忘记密码？
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useNotification } from '@/composables/useNotification.js'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// 邮箱登录
const handleEmailLogin = async () => {
  loading.value = true
  error.value = ''
  
  const { error: loginError } = await authStore.signInWithEmail(email.value, password.value)
  
  if (loginError) {
    error.value = loginError
  } else {
    showSuccess('登录成功')
    router.push('/')
  }
  
  loading.value = false
}

// 第三方登录
const signInWithProvider = async (provider) => {
  loading.value = true
  error.value = ''
  
  const { error: loginError } = await authStore.signInWithProvider(provider)
  
  if (loginError) {
    error.value = loginError
    loading.value = false
  }
  // 第三方登录会重定向，不需要手动处理成功状态
}
</script>
