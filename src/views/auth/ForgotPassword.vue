<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-rainbow px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">重置密码</h1>
        <p class="text-gray-600">输入你的邮箱地址，我们将发送重置密码的链接</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="space-y-6">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="邮箱地址"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading || !email"
          class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? '发送中...' : '发送重置链接' }}
        </button>
      </form>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        {{ success }}
      </div>

      <!-- 底部链接 -->
      <div class="mt-6 text-center space-y-2">
        <router-link to="/auth/login" class="text-blue-500 hover:text-blue-600">
          返回登录
        </router-link>
        <br>
        <router-link to="/auth/register" class="text-gray-500 hover:text-gray-600 text-sm">
          还没有账户？立即注册
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleResetPassword = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  const { error: resetError } = await authStore.resetPassword(email.value)
  
  if (resetError) {
    error.value = resetError
  } else {
    success.value = '重置密码的链接已发送到你的邮箱，请查收并按照说明操作'
  }
  
  loading.value = false
}
</script>
