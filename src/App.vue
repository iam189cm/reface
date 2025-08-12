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
    
    <!-- 开发环境信息 -->
    <div v-if="isDevelopment && showDevInfo" class="fixed bottom-4 right-4 z-50">
      <div class="bg-black bg-opacity-75 text-white text-xs p-2 rounded-lg max-w-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="font-semibold">🔧 开发模式</span>
          <button @click="showDevInfo = false" class="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        <div class="space-y-1">
          <div>服务状态: {{ serviceHealthy ? '✅ 健康' : '❌ 异常' }}</div>
          <div>AI服务: {{ aiServicesCount }} 个</div>
          <div>配置错误: {{ configErrors.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, provide, ref } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import Loading from './components/ui/Loading.vue'
import { useAppStore } from './stores/appStore.js'
import { useTrialStore } from './stores/trialStore.js'
import { useAuthStore } from './stores/modules/auth/authStore.js'
import { setupDependencyInjection, setupDevelopmentDI, healthCheck } from './services/core/DISetup.js'

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
    
    // 开发环境状态
    const isDevelopment = ref(import.meta.env.DEV)
    const showDevInfo = ref(false)
    const serviceHealthy = ref(true)
    const aiServicesCount = ref(0)
    const configErrors = ref([])
    
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
        console.log('🚀 开始初始化 Reface 应用')
        
        // 🆕 设置依赖注入容器
        const container = isDevelopment.value
          ? setupDevelopmentDI()
          : setupDependencyInjection()
        
        // 🆕 进行健康检查
        const health = await healthCheck(container)
        serviceHealthy.value = health.healthy
        configErrors.value = health.errors || []
        
        if (!health.healthy) {
          console.warn('⚠️ 服务健康检查发现问题:', health.errors)
        }
        
        // 🆕 提供依赖注入服务给子组件
        provide('serviceContainer', container)
        provide('configService', container.get('configService'))
        provide('aiServices', container.get('aiServiceContainer'))
        provide('httpClient', container.get('httpClient'))
        provide('progressManager', container.get('progressManager'))
        
        // 统计AI服务数量（用于开发环境显示）
        if (isDevelopment.value) {
          const aiServices = container.get('aiServiceContainer')
          aiServicesCount.value = Object.keys(aiServices).length
          showDevInfo.value = true
          
          // 在控制台显示服务信息
          console.group('🛠️ 依赖注入服务信息')
          console.table({
            '配置服务': '✅ ConfigService',
            'HTTP客户端': '✅ HttpClient', 
            '进度管理器': '✅ ProgressManager',
            '背景移除': '✅ RemoveBackgroundService',
            '图像放大': '✅ VanceAIService'
          })
          console.groupEnd()
          
          // 显示配置验证结果
          if (configErrors.value.length > 0) {
            console.group('⚠️ 配置警告')
            configErrors.value.forEach(error => console.warn(error))
            console.groupEnd()
          }
        }
        
        // 继续原有的初始化逻辑
        await authStore.initialize()
        appStore.restoreSettings()
        
        if (!authStore.isAuthenticated) {
          trialStore.initializeTrialData()
        }
        
        console.log('✅ Reface 应用初始化完成', {
          authenticated: authStore.isAuthenticated,
          userType: authStore.userType,
          servicesHealthy: serviceHealthy.value,
          aiServices: aiServicesCount.value
        })
        
      } catch (error) {
        console.error('❌ 应用初始化失败:', error)
        
        // 显示错误通知
        if (typeof window !== 'undefined' && window.alert) {
          alert(`应用初始化失败: ${error.message}`)
        }
        
        // 尝试回退到基础模式
        try {
          console.log('🔄 尝试回退到基础模式...')
          await authStore.initialize()
          appStore.restoreSettings()
          console.log('✅ 基础模式初始化成功')
        } catch (fallbackError) {
          console.error('❌ 基础模式初始化也失败:', fallbackError)
        }
      }
    })
    
    return {
      isGlobalLoading,
      globalLoadingMessage,
      isDevelopment,
      showDevInfo,
      serviceHealthy,
      aiServicesCount,
      configErrors
    }
  }
}
</script>

<style>
/* 全局样式保持不变 */
#app {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 彩虹渐变背景 */
.bg-gradient-rainbow {
  background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%);
  min-height: 100vh;
}

/* 开发环境信息样式 */
.dev-info-enter-active,
.dev-info-leave-active {
  transition: all 0.3s ease;
}

.dev-info-enter-from,
.dev-info-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>