<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-rainbow">
    <div class="text-center">
      <Loading :message="message" />
      <div class="mt-8 max-w-md mx-auto">
        <div
          v-if="error"
          class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          <h3 class="font-semibold mb-2">
            登录失败
          </h3>
          <p class="text-sm">
            {{ error }}
          </p>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthManager } from '@/composables/business/useAuthManager.js'
import { useNotification } from '@/composables/ui/useNotification.js'
import Loading from '@/components/ui/Loading.vue'

const router = useRouter()
const route = useRoute()
const authManager = useAuthManager()
const { showSuccess, showError } = useNotification()

const message = ref('正在处理登录...')
const error = ref('')

// 监听认证状态变化
watch(() => authManager.isAuthenticated.value, (isAuthenticated) => {
  if (isAuthenticated && !error.value) {
    message.value = '登录成功，正在跳转...'
    showSuccess('登录成功！')
    
    // 跳转到目标页面或首页
    const redirectTo = route.query.redirect || '/'
    setTimeout(() => {
      router.push(redirectTo)
    }, 1500)
  }
}, { immediate: true })

onMounted(async () => {
  try {
    // 检查URL中的错误参数
    if (route.query.error) {
      throw new Error(route.query.error_description || '登录失败')
    }

    console.log('[Callback] 开始处理OAuth回调')
    
    // 初始化认证管理器（这会设置Supabase监听器）
    await authManager.initialize()
    
    // 等待一段时间让Supabase处理OAuth回调
    setTimeout(async () => {
      if (!authManager.isAuthenticated.value && !error.value) {
        // 如果还没有认证成功，尝试手动获取当前会话
        try {
          const session = await authManager.getCurrentSession()
          if (!session) {
            throw new Error('登录验证失败，请重试')
          }
        } catch (err) {
          throw new Error('登录验证失败，请重试')
        }
      }
    }, 5000) // 给更多时间处理OAuth回调
    
  } catch (err) {
    console.error('[Callback] 处理错误:', err)
    error.value = err.message
    showError('登录失败：' + err.message)
  }
})
</script>
