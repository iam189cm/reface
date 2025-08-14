<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">🔧</span>
      </div>
      AI 划痕修复
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 修复模式选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">修复模式</label>
      <div class="space-y-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="repairMode"
            value="auto"
            class="text-orange-600 focus:ring-orange-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">智能修复</div>
            <div class="text-xs text-gray-500">自动检测并修复划痕、瑕疵</div>
          </div>
          <div class="text-xs text-orange-600 font-medium">推荐</div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="repairMode"
            value="manual"
            class="text-orange-600 focus:ring-orange-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">手动标记</div>
            <div class="text-xs text-gray-500">需要提供划痕位置遮罩</div>
          </div>
          <div class="text-xs text-gray-500">高级</div>
        </label>
      </div>
    </div>

    <!-- 遮罩上传 (手动模式) -->
    <div v-if="repairMode === 'manual'" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">划痕遮罩</label>
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
        @click="$refs.maskInput?.click()"
        @drop="handleMaskDrop"
        @dragover.prevent
      >
        <input
          ref="maskInput"
          type="file"
          accept="image/*"
          @change="handleMaskSelect"
          class="hidden"
        >
        
        <div v-if="!maskFile">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p class="text-sm text-gray-600">点击或拖拽上传划痕遮罩</p>
          <p class="text-xs text-gray-400 mt-1">白色区域表示需要修复的位置</p>
        </div>
        
        <div v-else class="flex items-center justify-center space-x-3">
          <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            <img :src="maskPreview" alt="Mask" class="w-full h-full object-cover">
          </div>
          <div class="text-left">
            <div class="text-sm font-medium text-gray-900">{{ maskFile.name }}</div>
            <div class="text-xs text-gray-500">{{ formatFileSize(maskFile.size) }}</div>
          </div>
          <Button
            type="secondary"
            size="small"
            @click.stop="removeMask"
          >
            移除
          </Button>
        </div>
      </div>
    </div>

    <!-- 修复强度 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        修复强度 ({{ repairStrength }})
      </label>
      <div class="space-y-3">
        <input
          type="range"
          v-model="repairStrength"
          min="1"
          max="10"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>保守</span>
          <span>标准</span>
          <span>激进</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleScratchFix"
      >
        <template #icon v-if="!isProcessing">
          <span class="text-sm">🔧</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial" class="text-center">
        <p class="text-sm text-gray-600 mb-2">今日划痕修复次数已用完</p>
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
    <div class="mt-6 p-4 bg-orange-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        功能介绍
      </h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• 智能识别并修复图片中的划痕</li>
        <li>• 支持老照片、损坏照片修复</li>
        <li>• 可处理折痕、斑点、污渍等瑕疵</li>
        <li>• 保持图片原有质感和色彩</li>
      </ul>
      
      <div class="mt-3 p-2 bg-white/60 rounded border border-orange-200">
        <p class="text-xs text-orange-700 font-medium mb-1">💡 使用技巧：</p>
        <p class="text-xs text-gray-600">对于严重损坏的照片，建议先使用"智能修复"，效果不满意再尝试"手动标记"模式。</p>
      </div>
    </div>

    <!-- 升级弹窗 -->
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
  name: 'AIScratchFix',
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
    const repairMode = ref('auto')
    const repairStrength = ref(5)
    const maskFile = ref(null)
    const maskPreview = ref('')
    
    // 计算属性
    const isProcessing = computed(() => neroAI.processingInfo.value.isProcessing)
    
    const canProcess = computed(() => {
      const hasImage = props.imageFile
      const hasValidMask = repairMode.value === 'auto' || maskFile.value
      const hasTrialQuota = canUseTrial.value
      const notProcessing = !isProcessing.value
      
      return hasImage && hasValidMask && hasTrialQuota && notProcessing
    })
    
    const buttonType = computed(() => {
      if (!canUseTrial.value) return 'secondary'
      if (isProcessing.value) return 'primary'
      return canProcess.value ? 'primary' : 'secondary'
    })
    
    const buttonText = computed(() => {
      if (isProcessing.value) return '正在修复划痕...'
      if (!props.imageFile) return '请先选择图片'
      if (repairMode.value === 'manual' && !maskFile.value) return '请上传划痕遮罩'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始划痕修复'
    })
    
    // 方法
    const handleMaskSelect = (event) => {
      const file = event.target.files?.[0]
      if (file && file.type.startsWith('image/')) {
        setMaskFile(file)
      }
    }
    
    const handleMaskDrop = (event) => {
      event.preventDefault()
      const files = Array.from(event.dataTransfer.files)
      const imageFile = files.find(file => file.type.startsWith('image/'))
      if (imageFile) {
        setMaskFile(imageFile)
      }
    }
    
    const setMaskFile = (file) => {
      maskFile.value = file
      maskPreview.value = URL.createObjectURL(file)
    }
    
    const removeMask = () => {
      if (maskPreview.value) {
        URL.revokeObjectURL(maskPreview.value)
      }
      maskFile.value = null
      maskPreview.value = ''
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }
    
    const handleScratchFix = async () => {
      if (!canProcess.value) return
      
      try {
        // 准备参数
        const params = {
          strength: repairStrength.value,
          mode: repairMode.value
        }
        
        // 如果是手动模式，添加遮罩
        if (repairMode.value === 'manual' && maskFile.value) {
          // 这里需要将遮罩文件转换为URL或base64
          params.mask = URL.createObjectURL(maskFile.value)
        }
        
        const success = await neroAI.fixScratch(
          props.imageFile,
          (result) => {
            emit('result', result)
          },
          (error) => {
            emit('error', error)
          },
          params
        )
        
        if (!success) {
          emit('error', new Error('划痕修复处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      repairMode,
      repairStrength,
      maskFile,
      maskPreview,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      handleMaskSelect,
      handleMaskDrop,
      removeMask,
      formatFileSize,
      handleScratchFix
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
  background: #f59e0b;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background .15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: #d97706;
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
}
</style>
