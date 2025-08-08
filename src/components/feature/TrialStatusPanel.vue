<template>
  <div class="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">免费试用</span>
      <span class="text-sm font-semibold" :class="statusTextClass">
        {{ remainingTrials }}/{{ maxTrials }} 次
      </span>
    </div>
    
    <!-- 进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div 
        class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
        :style="{ width: `${trialProgress}%` }"
      ></div>
    </div>
    
    <!-- 状态文本 -->
    <p class="text-xs text-gray-600">
      {{ trialStatusText }}
    </p>
    
    <!-- 开发模式重置按钮 -->
    <div v-if="isDevelopment" class="mt-2">
      <button
        @click="resetTrials"
        class="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        重置试用次数 (开发模式)
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTrialManager } from '../../composables/useTrialManager.js'

export default {
  name: 'TrialStatusPanel',
  setup() {
    const { 
      remainingTrials, 
      maxTrials, 
      trialProgress, 
      trialStatusText, 
      canUseTrial,
      resetTrialsForDev
    } = useTrialManager()
    
    // 开发环境判断
    const isDevelopment = computed(() => {
      return process.env.NODE_ENV === 'development'
    })
    
    // 状态文本颜色
    const statusTextClass = computed(() => {
      return canUseTrial.value ? 'text-green-600' : 'text-red-500'
    })
    
    // 重置试用次数
    const resetTrials = () => {
      resetTrialsForDev()
    }
    
    return {
      remainingTrials,
      maxTrials,
      trialProgress,
      trialStatusText,
      statusTextClass,
      isDevelopment,
      resetTrials
    }
  }
}
</script>
