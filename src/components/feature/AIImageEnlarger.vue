<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      </div>
      🔍 AI图像高清放大
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 放大倍数选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        选择放大倍数
      </label>
      <div class="space-y-2">
        <div 
          v-for="(option, key) in scaleOptions" 
          :key="key"
          class="flex items-center justify-between p-3 rounded-lg border transition-all duration-200"
          :class="[
            selectedScale === key 
              ? 'border-pink-300 bg-pink-50' 
              : 'border-gray-200 hover:border-pink-200',
            !canUseScale(key) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
          @click="selectScale(key)"
        >
          <div class="flex items-center">
            <input
              type="radio"
              :value="key"
              v-model="selectedScale"
              :disabled="!canUseScale(key)"
              class="text-pink-600 focus:ring-pink-500 mr-3"
            >
            <div>
              <div class="font-medium text-gray-900">
                {{ option.name }}
                <span v-if="!canUseScale(key)" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                  🔒 需要升级
                </span>
              </div>
              <div class="text-sm text-gray-600">{{ option.description }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium text-gray-900">{{ option.credit }} Credit</div>
            <div class="text-xs text-gray-500">约 {{ getEstimatedTime(key) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 高级参数调节 -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <label class="text-sm font-medium text-gray-700">
          高级参数设置
        </label>
        <button
          @click="showAdvanced = !showAdvanced"
          class="text-sm text-pink-600 hover:text-pink-700 flex items-center"
        >
          {{ showAdvanced ? '收起' : '展开' }}
          <svg 
            class="w-4 h-4 ml-1 transition-transform duration-200"
            :class="{ 'rotate-180': showAdvanced }"
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
      
      <div v-show="showAdvanced" class="space-y-4 pt-2">
        <!-- 降噪强度 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">
            降噪强度: {{ suppressNoise }}
          </label>
          <Slider
            v-model="suppressNoise"
            :min="0"
            :max="100"
            :step="1"
            class="w-full"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>保留噪点</span>
            <span>完全降噪</span>
          </div>
        </div>

        <!-- 去模糊强度 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">
            去模糊强度: {{ removeBlur }}
          </label>
          <Slider
            v-model="removeBlur"
            :min="0"
            :max="100"
            :step="1"
            class="w-full"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>保持原样</span>
            <span>强力锐化</span>
          </div>
        </div>

        <!-- 重置按钮 -->
        <button
          @click="resetAdvancedParams"
          class="text-sm text-gray-600 hover:text-gray-800"
        >
          🔄 重置为推荐值
        </button>
      </div>
    </div>

    <!-- 处理按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleEnlargeImage"
      >
        <template #icon v-if="!isProcessing">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial || needsUpgrade" class="text-center">
        <p class="text-sm text-gray-600 mb-2">
          {{ needsUpgrade ? '该功能需要升级解锁' : '试用次数已用完' }}
        </p>
        <Button
          type="warning"
          size="small"
          @click="showUpgradeModal = true"
        >
          ✨ 升级解锁{{ needsUpgrade ? '高倍放大' : '更多次数' }}
        </Button>
      </div>

      <!-- 处理进度显示 -->
      <div v-if="isProcessing" class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">{{ processingMessage }}</span>
          <span class="text-sm text-gray-600">{{ processingProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: processingProgress + '%' }"
          ></div>
        </div>
        <div class="text-xs text-gray-500 mt-2 text-center">
          预计剩余时间: {{ getEstimatedRemainingTime() }}
        </div>
      </div>

      <!-- API Token 配置（开发模式） -->
      <div v-if="isDevelopment" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          VanceAI API Token (开发模式)
        </label>
        <input
          v-model="apiToken"
          type="password"
          placeholder="请输入 VanceAI API Token"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
        <p class="text-xs text-gray-600 mt-1">
          生产环境将使用服务器端 API Token
        </p>
      </div>
    </div>

    <!-- 升级弹窗 -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Button from '../ui/Button.vue'
import Slider from '../ui/Slider.vue'
import TrialStatusPanel from './TrialStatusPanel.vue'
import UpgradeModal from './UpgradeModal.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useTrialManager } from '../../composables/business/useTrialManager.js'
import { SERVICE_CAPABILITIES } from '../../services/nero-ai/index.ts'

export default {
  name: 'AIImageEnlarger',
  components: {
    Button,
    Slider,
    TrialStatusPanel,
    UpgradeModal
  },
  props: {
    // 图片文件
    imageFile: {
      type: File,
      default: null
    }
  },
  
  emits: ['result', 'error'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    const { canUseTrial } = useTrialManager()
    
    // 响应式数据
    const showUpgradeModal = ref(false)
    const showAdvanced = ref(false)
    const selectedService = ref('ImageUpscaler:Standard')
    const upscalingRate = ref(2)
    const qualityFactor = ref(95)
    
    // 获取放大选项 (基于 Nero AI 服务能力)
    const scaleOptions = computed(() => {
      const upscalerServices = Object.keys(SERVICE_CAPABILITIES).filter(key => 
        key.startsWith('ImageUpscaler')
      )
      
      const options = {}
      upscalerServices.forEach(serviceType => {
        const service = SERVICE_CAPABILITIES[serviceType]
        const key = serviceType.split(':')[1] || 'Standard'
        options[key.toLowerCase()] = {
          name: service.name,
          description: service.description,
          credit: service.credit_cost,
          serviceType: serviceType
        }
      })
      
      return options
    })
    
    // 开发环境判断
    const isDevelopment = computed(() => {
      return import.meta.env.DEV
    })
    
    // 检查是否可以使用指定服务
    const canUseScale = (scale) => {
      // 试用用户可以使用所有服务，但受配额限制
      return canUseTrial.value
    }
    
    // 选择放大倍数
    const selectScale = (scale) => {
      if (canUseScale(scale)) {
        const option = scaleOptions.value[scale]
        selectedService.value = option.serviceType
      }
    }
    
    // 是否需要升级
    const needsUpgrade = computed(() => {
      return false // 目前所有服务都对试用用户开放
    })
    
    // 是否可以处理
    const canProcess = computed(() => {
      return props.imageFile && 
             canUseTrial.value && 
             !neroAI.processingInfo.value.isProcessing
    })
    
    // 按钮类型
    const buttonType = computed(() => {
      if (!canUseTrial.value) return 'secondary'
      if (neroAI.processingInfo.value.isProcessing) return 'primary'
      return canProcess.value ? 'primary' : 'secondary'
    })
    
    // 按钮文本
    const buttonText = computed(() => {
      if (neroAI.processingInfo.value.isProcessing) return '正在处理...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      
      const serviceInfo = SERVICE_CAPABILITIES[selectedService.value]
      return `开始${serviceInfo?.name || '图像放大'}处理`
    })
    
    // 获取预估处理时间
    const getEstimatedTime = (scale) => {
      const option = scaleOptions.value[scale]
      const serviceInfo = SERVICE_CAPABILITIES[option?.serviceType]
      const time = serviceInfo?.average_processing_time || 30000
      return `${Math.round(time / 1000)}秒`
    }
    
    // 获取预估剩余时间
    const getEstimatedRemainingTime = () => {
      if (!neroAI.processingInfo.value.isProcessing) return '0秒'
      
      const progress = neroAI.processingInfo.value.progress || 0
      const serviceInfo = SERVICE_CAPABILITIES[selectedService.value]
      const totalTime = (serviceInfo?.average_processing_time || 30000) / 1000
      
      const remainingPercent = (100 - progress) / 100
      const remainingSeconds = Math.ceil(totalTime * remainingPercent)
      
      return `${remainingSeconds}秒`
    }
    
    // 重置高级参数
    const resetAdvancedParams = () => {
      upscalingRate.value = 2
      qualityFactor.value = 95
    }
    
    // 处理图像放大
    const handleEnlargeImage = async () => {
      if (!canProcess.value) return
      
      try {
        const success = await neroAI.upscaleImage(
          props.imageFile,
          (result) => {
            emit('result', result)
          },
          (error) => {
            emit('error', error)
          },
          {
            mode: selectedService.value,
            scale: upscalingRate.value,
            quality: qualityFactor.value
          }
        )
        
        if (!success) {
          emit('error', new Error('AI图像放大处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    // 监听服务变化，自动切换参数
    watch(selectedService, (newService) => {
      const serviceInfo = SERVICE_CAPABILITIES[newService]
      if (serviceInfo?.parameters) {
        // 根据服务能力设置默认参数
        const upscalingParam = serviceInfo.parameters.find(p => p.name === 'upscaling_rate')
        if (upscalingParam) {
          upscalingRate.value = upscalingParam.default || 2
        }
      }
    })
    
    return {
      // 响应式数据
      showUpgradeModal,
      showAdvanced,
      selectedService,
      upscalingRate,
      qualityFactor,
      
      // 计算属性
      scaleOptions,
      isDevelopment,
      needsUpgrade,
      canProcess,
      canUseTrial,
      buttonType,
      buttonText,
      processingInfo: neroAI.processingInfo,
      
      // 方法
      canUseScale,
      selectScale,
      getEstimatedTime,
      getEstimatedRemainingTime,
      resetAdvancedParams,
      handleEnlargeImage
    }
  }
}
</script>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>
