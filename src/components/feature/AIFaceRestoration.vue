<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">😊</span>
      </div>
      AI 面部修复
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 修复强度调节 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        修复强度 ({{ fidelity.toFixed(1) }})
      </label>
      <div class="space-y-3">
        <input
          v-model="fidelity"
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>轻度修复</span>
          <span>标准修复</span>
          <span>重度修复</span>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        数值越高修复效果越明显，但可能影响人脸的自然度
      </p>
    </div>

    <!-- 预设选项 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">快速预设</label>
      <div class="grid grid-cols-3 gap-2">
        <Button
          type="secondary"
          size="small"
          :class="{ 'bg-purple-100 border-purple-300': Math.abs(fidelity - 0.3) < 0.05 }"
          @click="setFidelity(0.3)"
        >
          轻度
        </Button>
        <Button
          type="secondary" 
          size="small"
          :class="{ 'bg-purple-100 border-purple-300': Math.abs(fidelity - 0.7) < 0.05 }"
          @click="setFidelity(0.7)"
        >
          标准
        </Button>
        <Button
          type="secondary"
          size="small" 
          :class="{ 'bg-purple-100 border-purple-300': Math.abs(fidelity - 0.9) < 0.05 }"
          @click="setFidelity(0.9)"
        >
          重度
        </Button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleFaceRestoration"
      >
        <template
          v-if="!isProcessing"
          #icon
        >
          <span class="text-sm">😊</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div
        v-if="!canUseTrial"
        class="text-center"
      >
        <p class="text-sm text-gray-600 mb-2">
          今日面部修复次数已用完
        </p>
        <Button
          type="warning"
          size="small"
          @click="showUpgradeModal = true"
        >
          升级解锁更多
        </Button>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="mt-6 p-4 bg-purple-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        功能介绍
      </h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• 修复模糊、低质量的面部细节</li>
        <li>• 增强眼部、鼻部、嘴部的清晰度</li>
        <li>• 适用于老照片、模糊照片修复</li>
        <li>• 处理时间约30-45秒</li>
      </ul>
    </div>

    <!-- 升级弹窗 -->
    <UpgradeModal
      v-if="showUpgradeModal"
      @close="showUpgradeModal = false"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Button from '../ui/Button.vue'
import TrialStatusPanel from './TrialStatusPanel.vue'
import UpgradeModal from './UpgradeModal.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useTrialManager } from '../../composables/business/useTrialManager.js'

export default {
  name: 'AIFaceRestoration',
  components: {
    Button,
    TrialStatusPanel,
    UpgradeModal
  },
  props: {
    imageFile: {
      type: File,
      default: null
    }
  },
  
  emits: ['result', 'error'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    const { canUseTrial } = useTrialManager()
    
    const showUpgradeModal = ref(false)
    const fidelity = ref(0.7)
    
    // 计算属性
    const isProcessing = computed(() => neroAI.processingInfo.value.isProcessing)
    
    const canProcess = computed(() => {
      return props.imageFile && canUseTrial.value && !isProcessing.value
    })
    
    const buttonType = computed(() => {
      if (!canUseTrial.value) return 'secondary'
      if (isProcessing.value) return 'primary'
      return canProcess.value ? 'primary' : 'secondary'
    })
    
    const buttonText = computed(() => {
      if (isProcessing.value) return '正在修复面部...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始面部修复'
    })
    
    // 方法
    const setFidelity = (value) => {
      fidelity.value = value
    }
    
    const handleFaceRestoration = async () => {
      if (!canProcess.value) return
      
      try {
        const success = await neroAI.restoreFace(
          props.imageFile,
          (result) => {
            emit('result', result)
          },
          (error) => {
            emit('error', error)
          },
          {
            fidelity: fidelity.value
          }
        )
        
        if (!success) {
          emit('error', new Error('面部修复处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      fidelity,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      setFidelity,
      handleFaceRestoration
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background .15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: #7c3aed;
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
}
</style>
