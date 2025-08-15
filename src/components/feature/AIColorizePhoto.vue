<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">🎨</span>
      </div>
      AI 黑白上色
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 上色风格选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">上色风格</label>
      <div class="grid grid-cols-1 gap-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors cursor-pointer">
          <input
            v-model="colorizeStyle"
            type="radio"
            value="natural"
            class="text-pink-600 focus:ring-pink-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm flex items-center">
              自然风格
              <span class="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">推荐</span>
            </div>
            <div class="text-xs text-gray-500">基于真实世界的色彩，效果自然逼真</div>
          </div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors cursor-pointer">
          <input
            v-model="colorizeStyle"
            type="radio"
            value="vivid"
            class="text-pink-600 focus:ring-pink-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">鲜艳风格</div>
            <div class="text-xs text-gray-500">色彩更加饱和鲜明，视觉冲击力强</div>
          </div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-pink-300 transition-colors cursor-pointer">
          <input
            v-model="colorizeStyle"
            type="radio"
            value="vintage"
            class="text-pink-600 focus:ring-pink-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">复古风格</div>
            <div class="text-xs text-gray-500">温暖的色调，营造怀旧氛围</div>
          </div>
        </label>
      </div>
    </div>

    <!-- 色彩强度调节 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        色彩强度 ({{ colorIntensity }}%)
      </label>
      <div class="space-y-3">
        <input
          v-model="colorIntensity"
          type="range"
          min="30"
          max="100"
          step="5"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>淡雅 (30%)</span>
          <span>标准 (70%)</span>
          <span>浓郁 (100%)</span>
        </div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        强度越高色彩越饱和，建议先尝试70-80%
      </p>
    </div>

    <!-- 智能优化选项 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">智能优化</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            v-model="enhanceSkin"
            type="checkbox"
            class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">肤色增强</span>
          <span class="ml-auto text-xs text-gray-500">优化人像肤色</span>
        </label>
        
        <label class="flex items-center">
          <input
            v-model="enhanceSky"
            type="checkbox"
            class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">天空增强</span>
          <span class="ml-auto text-xs text-gray-500">优化天空色彩</span>
        </label>
        
        <label class="flex items-center">
          <input
            v-model="enhanceGreen"
            type="checkbox"
            class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">植物增强</span>
          <span class="ml-auto text-xs text-gray-500">优化植物绿色</span>
        </label>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleColorizePhoto"
      >
        <template
          v-if="!isProcessing"
          #icon
        >
          <span class="text-sm">🎨</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div
        v-if="!canUseTrial"
        class="text-center"
      >
        <p class="text-sm text-gray-600 mb-2">
          今日黑白上色次数已用完
        </p>
        <Button
          type="warning"
          size="small"
          @click="showUpgradeModal = true"
        >
          升级解锁更多
        </Button>
      </div>
      
      <!-- 高消耗提示 -->
      <div class="text-center">
        <p class="text-xs text-orange-600">
          ⚠️ 此功能消耗 2 个积分，处理时间约 45-60 秒
        </p>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="mt-6 p-4 bg-pink-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <svg
          class="w-4 h-4 mr-2 text-pink-600"
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
        <li>• 为黑白照片智能添加真实色彩</li>
        <li>• AI学习自然界色彩规律</li>
        <li>• 支持人像、风景、建筑等各类图片</li>
        <li>• 可调节色彩风格和强度</li>
      </ul>
      
      <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div class="p-2 bg-white/60 rounded border border-pink-200">
          <div class="font-medium text-pink-700 mb-1">
            ✨ 最佳效果:
          </div>
          <div class="text-gray-600">
            清晰的黑白老照片
          </div>
        </div>
        <div class="p-2 bg-white/60 rounded border border-pink-200">
          <div class="font-medium text-pink-700 mb-1">
            ⏱️ 处理时间:
          </div>
          <div class="text-gray-600">
            约 45-60 秒
          </div>
        </div>
      </div>
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
  name: 'AIColorizePhoto',
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
    const colorizeStyle = ref('natural')
    const colorIntensity = ref(70)
    const enhanceSkin = ref(true)
    const enhanceSky = ref(true)
    const enhanceGreen = ref(false)
    
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
      if (isProcessing.value) return '正在为照片上色...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始黑白上色'
    })
    
    // 方法
    const handleColorizePhoto = async () => {
      if (!canProcess.value) return
      
      try {
        // 准备处理参数
        const params = {
          style: colorizeStyle.value,
          intensity: colorIntensity.value / 100,
          enhance_skin: enhanceSkin.value,
          enhance_sky: enhanceSky.value,
          enhance_green: enhanceGreen.value
        }
        
        const success = await neroAI.colorizePhoto(
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
          emit('error', new Error('黑白上色处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      colorizeStyle,
      colorIntensity,
      enhanceSkin,
      enhanceSky,
      enhanceGreen,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      handleColorizePhoto
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
  background: #ec4899;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: background .15s ease-in-out;
}

.slider::-webkit-slider-thumb:hover {
  background: #be185d;
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
}
</style>
