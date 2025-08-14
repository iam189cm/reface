<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">🗜️</span>
      </div>
      AI 图像压缩
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 压缩质量选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        压缩质量 ({{ compressionQuality }}%)
      </label>
      <div class="space-y-3">
        <input
          type="range"
          v-model="compressionQuality"
          min="10"
          max="95"
          step="5"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>最小文件</span>
          <span>平衡</span>
          <span>最高质量</span>
        </div>
      </div>
      <div class="mt-2 p-2 bg-teal-50 rounded text-xs">
        <div class="flex justify-between">
          <span>预估压缩率:</span>
          <span class="font-medium">{{ getCompressionRatio() }}%</span>
        </div>
      </div>
    </div>

    <!-- 压缩模式 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">压缩模式</label>
      <div class="grid grid-cols-1 gap-2">
        <Button
          type="secondary"
          size="small"
          block
          @click="setMode('size')"
          :class="{ 'bg-teal-100 border-teal-300': compressionMode === 'size' }"
        >
          文件大小优先
        </Button>
        <Button
          type="secondary"
          size="small"
          block
          @click="setMode('quality')"
          :class="{ 'bg-teal-100 border-teal-300': compressionMode === 'quality' }"
        >
          质量优先
        </Button>
        <Button
          type="secondary"
          size="small"
          block
          @click="setMode('web')"
          :class="{ 'bg-teal-100 border-teal-300': compressionMode === 'web' }"
        >
          Web优化
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
        @click="handleCompress"
      >
        <template #icon v-if="!isProcessing">
          <span class="text-sm">🗜️</span>
        </template>
        {{ buttonText }}
      </Button>

      <div class="text-center">
        <p class="text-xs text-teal-600">
          💚 此功能仅消耗 0.5 个积分，处理快速
        </p>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="mt-6 p-4 bg-teal-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2">功能介绍</h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• AI智能压缩，减小文件大小</li>
        <li>• 保持图片质量的同时压缩体积</li>
        <li>• 支持多种压缩模式</li>
        <li>• 适用于网站优化、存储节省</li>
      </ul>
    </div>

    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
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
  name: 'AIImageCompressor',
  components: { Button, TrialStatusPanel, UpgradeModal },
  props: { imageFile: { type: File, default: null } },
  emits: ['result', 'error'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    const { canUseTrial } = useTrialManager()
    
    const showUpgradeModal = ref(false)
    const compressionQuality = ref(75)
    const compressionMode = ref('quality')
    
    const isProcessing = computed(() => neroAI.processingInfo.value.isProcessing)
    const canProcess = computed(() => props.imageFile && canUseTrial.value && !isProcessing.value)
    const buttonType = computed(() => !canUseTrial.value ? 'secondary' : (isProcessing.value ? 'primary' : (canProcess.value ? 'primary' : 'secondary')))
    const buttonText = computed(() => {
      if (isProcessing.value) return '正在压缩...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始压缩'
    })
    
    const getCompressionRatio = () => Math.round(100 - compressionQuality.value)
    const setMode = (mode) => { compressionMode.value = mode }
    
    const handleCompress = async () => {
      if (!canProcess.value) return
      
      try {
        const success = await neroAI.compressImage(
          props.imageFile,
          (result) => emit('result', result),
          (error) => emit('error', error),
          { quality: compressionQuality.value, mode: compressionMode.value }
        )
        
        if (!success) emit('error', new Error('图像压缩失败'))
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal, compressionQuality, compressionMode, canUseTrial, canProcess, 
      buttonType, buttonText, isProcessing, getCompressionRatio, setMode, handleCompress
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none; height: 20px; width: 20px; border-radius: 50%;
  background: #14b8a6; cursor: pointer; box-shadow: 0 0 2px 0 #555;
}
.slider::-webkit-slider-track { height: 8px; cursor: pointer; background: #ddd; border-radius: 4px; }
</style>
