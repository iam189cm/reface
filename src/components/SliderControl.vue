<template>
  <div class="slider-control">
    <div class="flex items-center justify-between mb-3">
      <label class="text-sm font-medium text-gray-700">{{ label }}</label>
      <div class="flex items-center space-x-2">
        <span class="text-sm font-semibold text-gray-600 min-w-[3rem] text-right">
          {{ modelValue }}{{ unit }}
        </span>
        <button
          @click="reset"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="重置"
        >
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="relative">
      <!-- 滑块轨道 -->
      <div class="h-2 bg-gray-200 rounded-full relative overflow-hidden">
        <!-- 进度条 -->
        <div 
          class="h-full rounded-full transition-all duration-200 ease-out"
          :class="progressBarClass"
          :style="{ width: progressWidth }"
        ></div>
        
        <!-- 中心线（对于有负值的滑块） -->
        <div 
          v-if="min < 0"
          class="absolute top-0 w-0.5 h-full bg-gray-300"
          :style="{ left: centerPosition }"
        ></div>
      </div>
      
      <!-- 滑块输入 -->
      <input
        type="range"
        :min="min"
        :max="max"
        :value="modelValue"
        @input="handleInput"
        class="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
      >
      
      <!-- 滑块手柄 -->
      <div 
        class="absolute top-1/2 w-5 h-5 rounded-full shadow-lg border-2 border-white transform -translate-y-1/2 -translate-x-1/2 transition-all duration-200 ease-out hover:scale-110"
        :class="handleClass"
        :style="{ left: handlePosition }"
      ></div>
    </div>
    
    <!-- 刻度标记 -->
    <div class="flex justify-between mt-2 px-1">
      <span class="text-xs text-gray-400">{{ min }}{{ unit }}</span>
      <span v-if="min < 0" class="text-xs text-gray-400">0{{ unit }}</span>
      <span class="text-xs text-gray-400">{{ max }}{{ unit }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'SliderControl',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    label: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'pink',
      validator: (value) => ['pink', 'purple', 'yellow', 'indigo', 'green'].includes(value)
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const colorClasses = {
      pink: {
        progress: 'bg-gradient-to-r from-pink-400 to-pink-600',
        handle: 'bg-pink-500'
      },
      purple: {
        progress: 'bg-gradient-to-r from-purple-400 to-purple-600',
        handle: 'bg-purple-500'
      },
      yellow: {
        progress: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
        handle: 'bg-yellow-500'
      },
      indigo: {
        progress: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
        handle: 'bg-indigo-500'
      },
      green: {
        progress: 'bg-gradient-to-r from-green-400 to-green-600',
        handle: 'bg-green-500'
      }
    }

    const progressBarClass = computed(() => colorClasses[props.color].progress)
    const handleClass = computed(() => colorClasses[props.color].handle)

    const normalizedValue = computed(() => {
      return (props.modelValue - props.min) / (props.max - props.min)
    })

    const progressWidth = computed(() => {
      if (props.min < 0) {
        // 对于有负值的滑块，进度条从中心开始
        const center = Math.abs(props.min) / (props.max - props.min)
        const current = normalizedValue.value
        if (current >= center) {
          return `${(current - center) * 100}%`
        } else {
          return '0%'
        }
      } else {
        // 对于只有正值的滑块，进度条从左边开始
        return `${normalizedValue.value * 100}%`
      }
    })

    const handlePosition = computed(() => `${normalizedValue.value * 100}%`)

    const centerPosition = computed(() => {
      if (props.min < 0) {
        return `${(Math.abs(props.min) / (props.max - props.min)) * 100}%`
      }
      return '0%'
    })

    const handleInput = (event) => {
      const value = parseInt(event.target.value)
      emit('update:modelValue', value)
    }

    const reset = () => {
      emit('update:modelValue', props.min < 0 ? 0 : props.min)
    }

    return {
      progressBarClass,
      handleClass,
      progressWidth,
      handlePosition,
      centerPosition,
      handleInput,
      reset
    }
  }
}
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}

input[type="range"]::-moz-range-thumb {
  width: 0;
  height: 0;
  border: none;
  background: transparent;
}
</style>