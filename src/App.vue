<template>
  <div id="app" class="min-h-screen bg-gradient-rainbow">
    <!-- 导航栏 -->
    <AppHeader />

    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- 全局加载覆盖层 -->
    <Loading v-if="isGlobalLoading" :message="globalLoadingMessage" overlay />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import Loading from './components/ui/Loading.vue'
import { useAppStore } from './stores/appStore.js'
import { useTrialStore } from './stores/trialStore.js'
import { useAuthStore } from './stores/authStore.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    Loading
  },
  setup() {
    const appStore = useAppStore()
    const trialStore = useTrialStore()
    const authStore = useAuthStore()
    
    // 全局加载状态
    const isGlobalLoading = computed(() => appStore.isGlobalLoading || authStore.loading)
    const globalLoadingMessage = computed(() => {
      if (authStore.loading && !authStore.initialized) {
        return '正在初始化用户认证...'
      }
      return appStore.globalLoadingMessage
    })
    
    // 应用初始化
    onMounted(async () => {
      try {
        // 首先初始化认证状态
        await authStore.initialize()
        
        // 恢复应用设置
        appStore.restoreSettings()
        
        // 初始化试用数据（如果用户未登录）
        if (!authStore.isAuthenticated) {
          trialStore.initializeTrialData()
        }
        
        console.log('Reface 应用已初始化', {
          authenticated: authStore.isAuthenticated,
          userType: authStore.userType
        })
      } catch (error) {
        console.error('应用初始化失败:', error)
      }
    })
    
    return {
      isGlobalLoading,
      globalLoadingMessage
    }
  }
}
</script>