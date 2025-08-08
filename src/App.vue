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

export default {
  name: 'App',
  components: {
    AppHeader,
    Loading
  },
  setup() {
    const appStore = useAppStore()
    const trialStore = useTrialStore()
    
    // 全局加载状态
    const isGlobalLoading = computed(() => appStore.isGlobalLoading)
    const globalLoadingMessage = computed(() => appStore.globalLoadingMessage)
    
    // 应用初始化
    onMounted(() => {
      // 恢复应用设置
      appStore.restoreSettings()
      
      // 初始化试用数据
      trialStore.initializeTrialData()
      
      console.log('Reface 应用已初始化')
    })
    
    return {
      isGlobalLoading,
      globalLoadingMessage
    }
  }
}
</script>