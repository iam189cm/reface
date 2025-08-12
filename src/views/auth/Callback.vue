<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-rainbow">
    <div class="text-center">
      <Loading :message="message" />
      <div class="mt-8 max-w-md mx-auto">
        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 class="font-semibold mb-2">登录失败</h3>
          <p class="text-sm">{{ error }}</p>
          <router-link 
            to="/auth/login"
            class="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            返回登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth/authStore.js'
import { useNotification } from '@/composables/ui/useNotification.js'
import Loading from '@/components/ui/Loading.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const message = ref('正在处理登录...')
const error = ref('')

onMounted(async () => {
  try {
    // 检查URL中的错误参数
    if (route.query.error) {
      throw new Error(route.query.error_description || '登录失败')
    }

    // 等待认证状态初始化
    if (!authStore.initialized) {
      await authStore.initialize()
    }

    // 检查是否已成功登录
    if (authStore.isAuthenticated) {
      message.value = '登录成功，正在跳转...'
      showSuccess('登录成功！')
      
      // 跳转到目标页面或首页
      const redirectTo = route.query.redirect || '/'
      setTimeout(() => {
        router.push(redirectTo)
      }, 1500)
    } else {
      // 如果没有登录成功，等待一段时间后重定向
      setTimeout(() => {
        if (!authStore.isAuthenticated) {
          throw new Error('登录验证失败，请重试')
        }
      }, 3000)
    }
  } catch (err) {
    error.value = err.message
    showError('登录失败：' + err.message)
  }
})
</script>
