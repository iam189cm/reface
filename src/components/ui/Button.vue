<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"
    />
    
    <!-- 图标 -->
    <slot
      v-if="!loading"
      name="icon"
    />
    
    <!-- 文本内容 -->
    <slot />
  </button>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Button',
  props: {
    // 按钮类型
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'ghost'].includes(value)
    },
    
    // 按钮尺寸
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    
    // 是否加载中
    loading: {
      type: Boolean,
      default: false
    },
    
    // 是否为块级按钮
    block: {
      type: Boolean,
      default: false
    },
    
    // 是否为圆形按钮
    round: {
      type: Boolean,
      default: false
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    // 按钮样式类
    const buttonClasses = computed(() => {
      const classes = [
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
      ]
      
      // 基础样式
      if (props.disabled || props.loading) {
        classes.push('opacity-50 cursor-not-allowed')
      } else {
        classes.push('hover:shadow-lg transform hover:scale-105')
      }
      
      // 类型样式
      switch (props.type) {
        case 'primary':
          classes.push('bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg focus:ring-pink-500')
          break
        case 'secondary':
          classes.push('bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500')
          break
        case 'success':
          classes.push('bg-green-500 text-white hover:bg-green-600 focus:ring-green-500')
          break
        case 'warning':
          classes.push('bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500')
          break
        case 'error':
          classes.push('bg-red-500 text-white hover:bg-red-600 focus:ring-red-500')
          break
        case 'ghost':
          classes.push('text-gray-600 hover:text-pink-500 hover:bg-pink-50 focus:ring-pink-500')
          break
      }
      
      // 尺寸样式
      switch (props.size) {
        case 'small':
          classes.push('px-3 py-1.5 text-sm')
          break
        case 'medium':
          classes.push('px-4 py-2 text-sm')
          break
        case 'large':
          classes.push('px-6 py-3 text-base')
          break
      }
      
      // 圆角样式
      if (props.round) {
        classes.push('rounded-full')
      } else {
        classes.push('rounded-lg')
      }
      
      // 块级样式
      if (props.block) {
        classes.push('w-full')
      }
      
      return classes.join(' ')
    })
    
    // 点击处理
    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event)
      }
    }
    
    return {
      buttonClasses,
      handleClick
    }
  }
}
</script>
