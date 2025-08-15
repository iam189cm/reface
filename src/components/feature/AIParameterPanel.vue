<template>
  <div class="ai-parameter-panel">
    <div
      v-if="!serviceType"
      class="text-center py-8"
    >
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
          />
        </svg>
      </div>
      <p class="text-gray-500">
        请先选择AI功能以调节参数
      </p>
    </div>
    
    <div
      v-else
      class="space-y-6"
    >
      <!-- 参数面板头部 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
            :class="getCategoryGradient(serviceInfo?.category)"
          >
            <span class="text-sm">{{ serviceInfo?.icon }}</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ serviceInfo?.name }}
            </h3>
            <p class="text-sm text-gray-500">
              参数调节
            </p>
          </div>
        </div>
        <Button 
          v-if="hasChanges" 
          type="secondary" 
          size="small" 
          @click="resetToDefaults"
        >
          重置默认
        </Button>
      </div>
      
      <!-- 参数组 -->
      <div class="space-y-4">
        <!-- 通用参数 -->
        <div v-if="commonParams.length > 0">
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg
              class="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4"
              />
            </svg>
            基础设置
          </h4>
          <div class="space-y-3">
            <ParameterControl
              v-for="param in commonParams"
              :key="param.name"
              :parameter="param"
              :value="parameters[param.name]"
              @update="updateParameter"
            />
          </div>
        </div>
        
        <!-- 高级参数 -->
        <div v-if="advancedParams.length > 0">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 flex items-center">
              <svg
                class="w-4 h-4 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              高级设置
            </h4>
            <Button 
              type="secondary" 
              size="small" 
              @click="showAdvanced = !showAdvanced"
            >
              {{ showAdvanced ? '隐藏' : '显示' }}
            </Button>
          </div>
          <div
            v-show="showAdvanced"
            class="space-y-3"
          >
            <ParameterControl
              v-for="param in advancedParams"
              :key="param.name"
              :parameter="param"
              :value="parameters[param.name]"
              @update="updateParameter"
            />
          </div>
        </div>
        
        <!-- 预设模版 -->
        <div
          v-if="presets.length > 0"
          class="border-t border-gray-200 pt-4"
        >
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <svg
              class="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            快速预设
          </h4>
          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="preset in presets"
              :key="preset.name"
              type="secondary"
              size="small"
              @click="applyPreset(preset)"
            >
              {{ preset.name }}
            </Button>
          </div>
        </div>
      </div>
      
      <!-- 参数预览 -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-sm font-medium text-gray-700">
            参数预览
          </h4>
          <span class="text-xs text-gray-500">预计处理时间: {{ estimatedTime }}秒</span>
        </div>
        <div class="text-xs text-gray-600 space-y-1">
          <div
            v-for="(value, key) in parameters"
            :key="key"
            class="flex justify-between"
          >
            <span>{{ getParameterLabel(key) }}:</span>
            <span class="font-mono">{{ formatParameterValue(key, value) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Button from '../ui/Button.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { DEFAULT_PARAMS } from '../../services/nero-ai/index.ts'

// 参数控制组件
const ParameterControl = {
  template: `
    <div class="parameter-control">
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-medium text-gray-700">{{ parameter.label || parameter.name }}</label>
        <span v-if="parameter.type === 'number' || parameter.type === 'range'" 
              class="text-xs text-gray-500 font-mono">
          {{ formatValue(value) }}
        </span>
      </div>
      
      <!-- 数字滑块 -->
      <div v-if="parameter.type === 'number' || parameter.type === 'range'">
        <input
          type="range"
          :min="parameter.min || 0"
          :max="parameter.max || 100"
          :step="parameter.step || 1"
          :value="value"
          @input="$emit('update', parameter.name, Number($event.target.value))"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        >
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>{{ parameter.min || 0 }}</span>
          <span>{{ parameter.max || 100 }}</span>
        </div>
      </div>
      
      <!-- 选择器 -->
      <div v-else-if="parameter.type === 'select'">
        <select
          :value="value"
          @change="$emit('update', parameter.name, $event.target.value)"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
          <option v-for="option in parameter.options" :key="option" :value="option">
            {{ formatOption(option) }}
          </option>
        </select>
      </div>
      
      <!-- 布尔开关 -->
      <div v-else-if="parameter.type === 'boolean'">
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="value"
            @change="$emit('update', parameter.name, $event.target.checked)"
            class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-600">{{ parameter.description || '启用此选项' }}</span>
        </label>
      </div>
      
      <!-- 文本输入 -->
      <div v-else>
        <input
          type="text"
          :value="value"
          @input="$emit('update', parameter.name, $event.target.value)"
          :placeholder="parameter.placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
      </div>
      
      <!-- 参数说明 -->
      <p v-if="parameter.description" class="text-xs text-gray-500 mt-1">
        {{ parameter.description }}
      </p>
    </div>
  `,
  props: ['parameter', 'value'],
  emits: ['update'],
  setup() {
    const formatValue = (value) => {
      if (typeof value === 'number') {
        return value.toFixed(1)
      }
      return value?.toString() || ''
    }
    
    const formatOption = (option) => {
      // 格式化选项显示
      const optionMap = {
        'preview': '预览尺寸',
        'small': '小图', 
        'regular': '标准',
        'medium': '中等',
        'hd': '高清',
        'full': '原图尺寸',
        'auto': '自动',
        'person': '人像',
        'product': '产品',
        'car': '汽车',
        '2': '2倍',
        '4': '4倍'
      }
      return optionMap[option] || option
    }
    
    return {
      formatValue,
      formatOption
    }
  }
}

export default {
  name: 'AIParameterPanel',
  components: {
    Button,
    ParameterControl
  },
  
  props: {
    serviceType: {
      type: String,
      default: null
    },
    initialParameters: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['parameters-changed', 'preset-applied'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    
    // 响应式数据
    const parameters = ref({})
    const showAdvanced = ref(false)
    const originalParameters = ref({})
    
    // 计算属性
    const serviceCapabilities = computed(() => neroAI.serviceCapabilities.value)
    const serviceInfo = computed(() => serviceCapabilities.value[props.serviceType])
    
    // 参数定义
    const parameterDefinitions = computed(() => {
      if (!serviceInfo.value?.parameters) return []
      
      // 扩展参数定义，添加标签和描述
      return serviceInfo.value.parameters.map(param => ({
        ...param,
        label: getParameterLabel(param.name),
        description: getParameterDescription(param.name)
      }))
    })
    
    // 通用参数（基础设置）
    const commonParams = computed(() => {
      return parameterDefinitions.value.filter(param => 
        ['size', 'upscaling_rate', 'quality_factor', 'type_hint'].includes(param.name)
      )
    })
    
    // 高级参数
    const advancedParams = computed(() => {
      return parameterDefinitions.value.filter(param => 
        !['size', 'upscaling_rate', 'quality_factor', 'type_hint'].includes(param.name)
      )
    })
    
    // 预设配置
    const presets = computed(() => {
      const presetMap = {
        'BackgroundRemover': [
          { name: '标准', params: { size: 'preview', type_hint: 'auto', crop: false }},
          { name: '人像', params: { size: 'regular', type_hint: 'person', crop: true }},
          { name: '产品', params: { size: 'hd', type_hint: 'product', crop: false }}
        ],
        'ImageUpscaler:Standard': [
          { name: '快速', params: { upscaling_rate: 2, quality_factor: 85 }},
          { name: '标准', params: { upscaling_rate: 2, quality_factor: 95 }},
          { name: '高质量', params: { upscaling_rate: 4, quality_factor: 95 }}
        ],
        'FaceRestoration': [
          { name: '轻度修复', params: { fidelity: 0.5 }},
          { name: '标准修复', params: { fidelity: 0.7 }},
          { name: '重度修复', params: { fidelity: 0.9 }}
        ]
      }
      
      return presetMap[props.serviceType] || []
    })
    
    // 是否有参数变化
    const hasChanges = computed(() => {
      return JSON.stringify(parameters.value) !== JSON.stringify(originalParameters.value)
    })
    
    // 预计处理时间
    const estimatedTime = computed(() => {
      const baseTime = serviceInfo.value?.average_processing_time || 30000
      // 根据参数调整时间估算
      let multiplier = 1
      
      if (parameters.value.upscaling_rate === 4) multiplier *= 1.5
      if (parameters.value.size === 'hd') multiplier *= 1.3
      if (parameters.value.size === 'full') multiplier *= 2
      
      return Math.round((baseTime * multiplier) / 1000)
    })
    
    // 方法
    const initializeParameters = () => {
      if (!props.serviceType) return
      
      // 获取默认参数
      const defaults = DEFAULT_PARAMS[props.serviceType] || {}
      const initial = { ...defaults, ...props.initialParameters }
      
      parameters.value = { ...initial }
      originalParameters.value = { ...initial }
    }
    
    const updateParameter = (name, value) => {
      parameters.value[name] = value
      emit('parameters-changed', { ...parameters.value })
    }
    
    const resetToDefaults = () => {
      const defaults = DEFAULT_PARAMS[props.serviceType] || {}
      parameters.value = { ...defaults }
      originalParameters.value = { ...defaults }
      emit('parameters-changed', { ...parameters.value })
    }
    
    const applyPreset = (preset) => {
      parameters.value = { ...parameters.value, ...preset.params }
      emit('parameters-changed', { ...parameters.value })
      emit('preset-applied', preset)
    }
    
    const getCategoryGradient = (category) => {
      const gradients = {
        background: 'bg-gradient-to-r from-blue-500 to-blue-600',
        enhancement: 'bg-gradient-to-r from-green-500 to-green-600', 
        creative: 'bg-gradient-to-r from-purple-500 to-purple-600',
        utility: 'bg-gradient-to-r from-gray-500 to-gray-600'
      }
      return gradients[category] || gradients.utility
    }
    
    const getParameterLabel = (name) => {
      const labels = {
        size: '输出尺寸',
        upscaling_rate: '放大倍数',
        quality_factor: '图片质量',
        type_hint: '图片类型',
        crop: '裁剪到主体',
        fidelity: '修复强度',
        denoise_level: '降噪等级',
        compression_level: '压缩等级'
      }
      return labels[name] || name
    }
    
    const getParameterDescription = (name) => {
      const descriptions = {
        size: '选择输出图片的尺寸大小',
        upscaling_rate: '图片放大的倍数，倍数越大处理时间越长',
        quality_factor: '输出图片的质量，数值越高文件越大',
        type_hint: '帮助AI更好识别图片内容',
        crop: '是否将图片裁剪到主体周围',
        fidelity: '修复的强度，数值越高修复越明显',
        denoise_level: '降噪的强度，数值越高噪点去除越多',
        compression_level: '压缩的程度，数值越高压缩越多'
      }
      return descriptions[name]
    }
    
    const formatParameterValue = (key, value) => {
      if (typeof value === 'boolean') return value ? '是' : '否'
      if (typeof value === 'number') return value.toFixed(1)
      return value?.toString() || ''
    }
    
    // 监听服务类型变化
    watch(() => props.serviceType, initializeParameters, { immediate: true })
    
    return {
      parameters,
      showAdvanced,
      serviceInfo,
      commonParams,
      advancedParams,
      presets,
      hasChanges,
      estimatedTime,
      updateParameter,
      resetToDefaults,
      applyPreset,
      getCategoryGradient,
      getParameterLabel,
      formatParameterValue
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
