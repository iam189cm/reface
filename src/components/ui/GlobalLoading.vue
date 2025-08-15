<template>
  <!-- 全局加载遮罩层 -->
  <transition name="loading-fade">
    <div 
      v-if="appStore.isGlobalLoading" 
      class="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
      @click.prevent
    >
      <div class="glass-effect rounded-2xl p-8 max-w-sm mx-4 text-center">
        <!-- 加载动画 -->
        <div class="relative mb-6">
          <div class="w-16 h-16 mx-auto">
            <!-- 旋转的粉紫色圆环 -->
            <div class="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin">
              <div class="w-16 h-16 border-4 border-transparent border-t-pink-500 border-r-purple-500 rounded-full absolute top-0 left-0"></div>
            </div>
            <!-- 中心AI图标 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <Sparkles :size="24" class="text-pink-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <!-- 加载文本 -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ loadingTitle }}
          </h3>
          <p v-if="appStore.globalLoadingMessage" class="text-sm text-gray-600">
            {{ appStore.globalLoadingMessage }}
          </p>
          <!-- 进度点动画 -->
          <div class="flex justify-center space-x-1 mt-4">
            <div 
              v-for="i in 3" 
              :key="i"
              class="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
              :style="{ animationDelay: `${i * 0.15}s` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/appStore.js'
import { Sparkles } from '@/utils/icons.js'

const appStore = useAppStore()

// 根据加载消息智能显示标题
const loadingTitle = computed(() => {
  const message = appStore.globalLoadingMessage.toLowerCase()
  
  if (message.includes('upload') || message.includes('上传')) {
    return '正在上传图片...'
  }
  if (message.includes('process') || message.includes('处理')) {
    return 'AI 正在处理中...'
  }
  if (message.includes('download') || message.includes('下载')) {
    return '正在准备下载...'
  }
  if (message.includes('auth') || message.includes('登录') || message.includes('认证')) {
    return '正在验证身份...'
  }
  
  return '加载中...'
})
</script>

<style scoped>
/* 加载动画过渡效果 */
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.loading-fade-enter-to,
.loading-fade-leave-from {
  opacity: 1;
  backdrop-filter: blur(4px);
}

/* 玻璃效果 */
.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* 自定义加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 弹跳点动画 */
.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 脉冲动画 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
