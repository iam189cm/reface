<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">🎭</span>
      </div>
      AI 卡通化
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 卡通风格选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">卡通风格</label>
      <div class="grid grid-cols-1 gap-3">
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="cartoonStyle"
            value="anime"
            class="text-purple-600 focus:ring-purple-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm flex items-center">
              动漫风格
              <span class="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">热门</span>
            </div>
            <div class="text-xs text-gray-500">日式动漫风格，色彩鲜艳</div>
          </div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="cartoonStyle"
            value="disney"
            class="text-purple-600 focus:ring-purple-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">迪士尼风格</div>
            <div class="text-xs text-gray-500">温暖可爱的美式卡通风格</div>
          </div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="cartoonStyle"
            value="sketch"
            class="text-purple-600 focus:ring-purple-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">素描风格</div>
            <div class="text-xs text-gray-500">黑白线条勾勒，简洁清晰</div>
          </div>
        </label>
        
        <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
          <input
            type="radio"
            v-model="cartoonStyle"
            value="comic"
            class="text-purple-600 focus:ring-purple-500 mr-3"
          >
          <div class="flex-1">
            <div class="font-medium text-sm">漫画风格</div>
            <div class="text-xs text-gray-500">美式漫画风格，线条粗犷</div>
          </div>
        </label>
      </div>
    </div>

    <!-- 卡通化强度 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        卡通化强度 ({{ cartoonIntensity }}%)
      </label>
      <div class="space-y-3">
        <input
          type="range"
          v-model="cartoonIntensity"
          min="20"
          max="100"
          step="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-500">
          <span>轻度 (20%)</span>
          <span>中度 (60%)</span>
          <span>重度 (100%)</span>
        </div>
      </div>
    </div>

    <!-- 色彩选项 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">色彩设置</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="enhanceColors"
            class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">增强色彩饱和度</span>
          <span class="ml-auto text-xs text-gray-500">更鲜艳的卡通效果</span>
        </label>
        
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="smoothSkin"
            class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">肌肤平滑</span>
          <span class="ml-auto text-xs text-gray-500">适用于人像照片</span>
        </label>
        
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="preserveDetails"
            class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">保留细节</span>
          <span class="ml-auto text-xs text-gray-500">防止过度简化</span>
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
        @click="handleCartoonize"
      >
        <template #icon v-if="!isProcessing">
          <span class="text-sm">🎭</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial" class="text-center">
        <p class="text-sm text-gray-600 mb-2">今日卡通化次数已用完</p>
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
        <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        功能介绍
      </h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• 将真实照片转换为卡通风格</li>
        <li>• 支持多种艺术风格选择</li>
        <li>• 适用于头像制作、艺术创作</li>
        <li>• 保持人物特征的同时艺术化</li>
      </ul>
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
  name: 'AICartoon',
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
    const cartoonStyle = ref('anime')
    const cartoonIntensity = ref(70)
    const enhanceColors = ref(true)
    const smoothSkin = ref(false)
    const preserveDetails = ref(true)
    
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
      if (isProcessing.value) return '正在卡通化处理...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始卡通化'
    })
    
    // 方法
    const handleCartoonize = async () => {
      if (!canProcess.value) return
      
      try {
        const params = {
          style: cartoonStyle.value,
          intensity: cartoonIntensity.value / 100,
          enhance_colors: enhanceColors.value,
          smooth_skin: smoothSkin.value,
          preserve_details: preserveDetails.value
        }
        
        const success = await neroAI.cartoonizeImage(
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
          emit('error', new Error('卡通化处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      cartoonStyle,
      cartoonIntensity,
      enhanceColors,
      smoothSkin,
      preserveDetails,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      handleCartoonize
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
