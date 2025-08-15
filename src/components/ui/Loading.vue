<template>
  <div :class="containerClasses">
    <!-- 加载图标 -->
    <div :class="spinnerClasses" />
    
    <!-- 加载文本 -->
    <p
      v-if="message"
      :class="textClasses"
    >
      {{ message }}
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Loading',
  props: {
    // 加载消息
    message: {
      type: String,
      default: ''
    },
    
    // 加载器大小
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    
    // 是否为覆盖层模式
    overlay: {
      type: Boolean,
      default: false
    },
    
    // 加载器颜色
    color: {
      type: String,
      default: 'pink',
      validator: (value) => ['pink', 'purple', 'blue', 'green', 'gray'].includes(value)
    }
  },
  
  setup(props) {
    // 容器样式
    const containerClasses = computed(() => {
      const classes = ['flex flex-col items-center justify-center']
      
      if (props.overlay) {
        classes.push('fixed inset-0 bg-black/20 backdrop-blur-sm z-50')
      } else {
        classes.push('text-center')
      }
      
      return classes.join(' ')
    })
    
    // 加载器样式
    const spinnerClasses = computed(() => {
      const classes = ['animate-spin rounded-full border-b-2']
      
      // 尺寸
      switch (props.size) {
        case 'small':
          classes.push('h-4 w-4')
          break
        case 'medium':
          classes.push('h-8 w-8')
          break
        case 'large':
          classes.push('h-12 w-12')
          break
      }
      
      // 颜色
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
      
      return classes.join(' ')
    })
    
    // 文本样式
    const textClasses = computed(() => {
      const classes = ['text-gray-600 mt-2']
      
      switch (props.size) {
        case 'small':
          classes.push('text-xs')
          break
        case 'medium':
          classes.push('text-sm')
          break
        case 'large':
          classes.push('text-base')
          break
      }
      
      return classes.join(' ')
    })
    
    return {
      containerClasses,
      spinnerClasses,
      textClasses
    }
  }
}
</script>
