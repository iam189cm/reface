<template>
  <div class="space-y-3">
    <!-- 标签和数值显示 -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <div class="flex items-center space-x-2">
        <span :class="valueClasses">{{ displayValue }}</span>
        <span
          v-if="unit"
          class="text-xs text-gray-500"
        >{{ unit }}</span>
      </div>
    </div>
    
    <!-- 滑块容器 -->
    <div class="relative">
      <!-- 滑块轨道 -->
      <div :class="trackClasses">
        <!-- 进度条 -->
        <div 
          :class="progressClasses"
          :style="progressStyle"
        />
        
        <!-- 滑块手柄 -->
        <div
          :class="thumbClasses"
          :style="thumbStyle"
          @mousedown="startDrag"
          @touchstart="startDrag"
        />
      </div>
      
      <!-- 隐藏的原生滑块（用于键盘导航和无障碍） -->
      <input
        ref="sliderInput"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @input="handleInput"
        @change="handleChange"
      >
    </div>
    
    <!-- 刻度标记（可选） -->
    <div
      v-if="showTicks"
      class="flex justify-between text-xs text-gray-400 px-1"
    >
      <span>{{ min }}</span>
      <span v-if="showMiddleTick">{{ Math.round((min + max) / 2) }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Slider',
  props: {
    // v-model 值
    modelValue: {
      type: Number,
      required: true
    },
    
    // 最小值
    min: {
      type: Number,
      default: 0
    },
    
    // 最大值
    max: {
      type: Number,
      default: 100
    },
    
    // 步长
    step: {
      type: Number,
      default: 1
    },
    
    // 标签
    label: {
      type: String,
      default: ''
    },
    
    // 单位
    unit: {
      type: String,
      default: ''
    },
    
    // 颜色主题
    color: {
      type: String,
      default: 'pink',
      validator: (value) => ['pink', 'purple', 'blue', 'green', 'gray'].includes(value)
    },
    
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    
    // 是否显示刻度
    showTicks: {
      type: Boolean,
      default: false
    },
    
    // 是否显示中间刻度
    showMiddleTick: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['update:modelValue', 'change'],
  
  setup(props, { emit }) {
    const sliderInput = ref(null)
    const isDragging = ref(false)
    
    // 显示值
    const displayValue = computed(() => {
      return Math.round(props.modelValue * 100) / 100
    })
    
    // 进度百分比
    const progressPercent = computed(() => {
      return ((props.modelValue - props.min) / (props.max - props.min)) * 100
    })
    
    // 数值显示样式
    const valueClasses = computed(() => {
      const classes = ['text-sm font-semibold']
      
      switch (props.color) {
        case 'pink':
          classes.push('text-pink-600')
          break
        case 'purple':
          classes.push('text-purple-600')
          break
        case 'blue':
          classes.push('text-blue-600')
          break
        case 'green':
          classes.push('text-green-600')
          break
        case 'gray':
          classes.push('text-gray-600')
          break
      }
      
      return classes.join(' ')
    })
    
    // 轨道样式
    const trackClasses = computed(() => {
      const classes = [
        'relative h-2 bg-gray-200 rounded-full cursor-pointer'
      ]
      
      if (props.disabled) {
        classes.push('opacity-50 cursor-not-allowed')
      }
      
      return classes.join(' ')
    })
    
    // 进度条样式
    const progressClasses = computed(() => {
      const classes = ['absolute top-0 left-0 h-full rounded-full transition-all duration-200']
      
      switch (props.color) {
        case 'pink':
          classes.push('bg-gradient-to-r from-pink-400 to-pink-600')
          break
        case 'purple':
          classes.push('bg-gradient-to-r from-purple-400 to-purple-600')
          break
        case 'blue':
          classes.push('bg-gradient-to-r from-blue-400 to-blue-600')
          break
        case 'green':
          classes.push('bg-gradient-to-r from-green-400 to-green-600')
          break
        case 'gray':
          classes.push('bg-gradient-to-r from-gray-400 to-gray-600')
          break
      }
      
      return classes.join(' ')
    })
    
    // 进度条样式
    const progressStyle = computed(() => ({
      width: `${progressPercent.value}%`
    }))
    
    // 滑块手柄样式
    const thumbClasses = computed(() => {
      const classes = [
        'absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-md border-2 cursor-pointer transform -translate-y-1/2 transition-all duration-200'
      ]
      
      if (isDragging.value) {
        classes.push('scale-110 shadow-lg')
      } else {
        classes.push('hover:scale-105')
      }
      
      switch (props.color) {
        case 'pink':
          classes.push('border-pink-500')
          break
        case 'purple':
          classes.push('border-purple-500')
          break
        case 'blue':
          classes.push('border-blue-500')
          break
        case 'green':
          classes.push('border-green-500')
          break
        case 'gray':
          classes.push('border-gray-500')
          break
      }
      
      if (props.disabled) {
        classes.push('cursor-not-allowed opacity-50')
      }
      
      return classes.join(' ')
    })
    
    // 滑块手柄位置
    const thumbStyle = computed(() => ({
      left: `calc(${progressPercent.value}% - 10px)`
    }))
    
    // 处理输入
    const handleInput = (event) => {
      const value = parseFloat(event.target.value)
      emit('update:modelValue', value)
    }
    
    // 处理变化
    const handleChange = (event) => {
      const value = parseFloat(event.target.value)
      emit('change', value)
    }
    
    // 开始拖拽
    const startDrag = (event) => {
      if (props.disabled) return
      
      isDragging.value = true
      event.preventDefault()
      
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('touchmove', handleDrag)
      document.addEventListener('touchend', endDrag)
    }
    
    // 拖拽中
    const handleDrag = (event) => {
      if (!isDragging.value || props.disabled) return
      
      const rect = sliderInput.value.getBoundingClientRect()
      const clientX = event.touches ? event.touches[0].clientX : event.clientX
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const value = props.min + percent * (props.max - props.min)
      
      // 根据步长调整值
      const steppedValue = Math.round(value / props.step) * props.step
      const clampedValue = Math.max(props.min, Math.min(props.max, steppedValue))
      
      emit('update:modelValue', clampedValue)
    }
    
    // 结束拖拽
    const endDrag = () => {
      isDragging.value = false
      
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', endDrag)
      
      emit('change', props.modelValue)
    }
    
    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('touchmove', handleDrag)
      document.removeEventListener('touchend', endDrag)
    })
    
    return {
      sliderInput,
      isDragging,
      displayValue,
      valueClasses,
      trackClasses,
      progressClasses,
      progressStyle,
      thumbClasses,
      thumbStyle,
      handleInput,
      handleChange,
      startDrag
    }
  }
}
</script>
