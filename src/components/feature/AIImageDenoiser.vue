<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">✨</span>
      </div>
      AI 图像降噪
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 降噪强度调节 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        降噪等级 ({{ denoiseLevel }})
      </label>
      <div class="space-y-3">
        <input
          type="range"
          v-model="denoiseLevel"
          min="1"
          max="10"
          step="1"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>轻度 (1)</span>
          <span>中度 (5)</span>
          <span>重度 (10)</span>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        等级越高噪点去除越彻底，但可能丢失部分细节
      </p>
    </div>

    <!-- 噪点类型选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">噪点类型</label>
      <div class="grid grid-cols-2 gap-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="noiseType"
            value="general"
            class="text-green-600 focus:ring-green-500 mr-3"
          >
          <div>
            <div class="font-medium text-sm">通用噪点</div>
            <div class="text-xs text-gray-500">适用于大部分图片</div>
          </div>
        </label>
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="noiseType"
            value="photo"
            class="text-green-600 focus:ring-green-500 mr-3"
          >
          <div>
            <div class="font-medium text-sm">照片噪点</div>
            <div class="text-xs text-gray-500">适用于拍摄照片</div>
          </div>
        </label>
      </div>
    </div>

    <!-- 预设选项 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">快速预设</label>
      <div class="space-y-2">
        <Button
          type="secondary"
          size="small"
          block
          @click="applyPreset('light')"
          :class="{ 'bg-green-100 border-green-300': currentPreset === 'light' }"
        >
          <div class="flex items-center justify-between w-full">
            <span>轻度降噪</span>
            <span class="text-xs text-gray-500">保留细节</span>
          </div>
        </Button>
        <Button
          type="secondary"
          size="small"
          block
          @click="applyPreset('standard')"
          :class="{ 'bg-green-100 border-green-300': currentPreset === 'standard' }"
        >
          <div class="flex items-center justify-between w-full">
            <span>标准降噪</span>
            <span class="text-xs text-gray-500">平衡效果</span>
          </div>
        </Button>
        <Button
          type="secondary"
          size="small"
          block
          @click="applyPreset('strong')"
          :class="{ 'bg-green-100 border-green-300': currentPreset === 'strong' }"
        >
          <div class="flex items-center justify-between w-full">
            <span>强力降噪</span>
            <span class="text-xs text-gray-500">最大程度</span>
          </div>
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
        @click="handleImageDenoise"
      >
        <template #icon v-if="!isProcessing">
          <span class="text-sm">✨</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial" class="text-center">
        <p class="text-sm text-gray-600 mb-2">今日图像降噪次数已用完</p>
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
    <div class="mt-6 p-4 bg-green-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        功能介绍
      </h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• 去除图片中的噪点和颗粒感</li>
        <li>• 提升图片整体清晰度和质感</li>
        <li>• 适用于夜拍、高ISO照片处理</li>
        <li>• 智能保护重要细节不丢失</li>
      </ul>
    </div>

    <!-- 升级弹窗 -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Button from '../ui/Button.vue'
import TrialStatusPanel from './TrialStatusPanel.vue'
import UpgradeModal from './UpgradeModal.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useTrialManager } from '../../composables/business/useTrialManager.js'

export default {
  name: 'AIImageDenoiser',
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
    const denoiseLevel = ref(5)
    const noiseType = ref('general')
    const currentPreset = ref('standard')
    
    // 预设配置
    const presets = {
      light: { level: 3, type: 'general' },
      standard: { level: 5, type: 'general' },
      strong: { level: 8, type: 'photo' }
    }
    
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
      if (isProcessing.value) return '正在降噪处理...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始图像降噪'
    })
    
    // 方法
    const applyPreset = (presetName) => {
      const preset = presets[presetName]
      if (preset) {
        denoiseLevel.value = preset.level
        noiseType.value = preset.type
        currentPreset.value = presetName
      }
    }
    
    const updatePreset = () => {
      // 根据当前设置确定预设
      for (const [name, preset] of Object.entries(presets)) {
        if (preset.level === denoiseLevel.value && preset.type === noiseType.value) {
          currentPreset.value = name
          return
        }
      }
      currentPreset.value = ''
    }
    
    const handleImageDenoise = async () => {
      if (!canProcess.value) return
      
      try {
        const success = await neroAI.denoiseImage(
          props.imageFile,
          (result) => {
            emit('result', result)
          },
          (error) => {
            emit('error', error)
          },
          {
            level: denoiseLevel.value,
            type: noiseType.value
          }
        )
        
        if (!success) {
          emit('error', new Error('图像降噪处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    // 监听参数变化
    watch([denoiseLevel, noiseType], updatePreset)
    
    return {
      showUpgradeModal,
      denoiseLevel,
      noiseType,
      currentPreset,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      applyPreset,
      handleImageDenoise
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
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background .15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: #059669;
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
}
</style>
