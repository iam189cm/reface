<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 translate-y-2"
    enter-to-class="transform opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 translate-y-0"
    leave-to-class="transform opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      :class="toastClasses"
      @click="handleClick"
    >
      <!-- 图标 -->
      <div :class="iconClasses">
        <svg
          v-if="type === 'success'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        
        <svg
          v-else-if="type === 'error'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        
        <svg
          v-else-if="type === 'warning'"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        
        <svg
          v-else
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      
      <!-- 内容 -->
      <div class="ml-3 flex-1">
        <p
          v-if="title"
          class="font-medium text-gray-900"
        >
          {{ title }}
        </p>
        <p :class="messageClasses">
          {{ message }}
        </p>
      </div>
      
      <!-- 关闭按钮 -->
      <button
        v-if="closable"
        class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
        @click="close"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Toast',
  props: {
    // 通知类型
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    
    // 标题
    title: {
      type: String,
      default: ''
    },
    
    // 消息内容
    message: {
      type: String,
      required: true
    },
    
    // 自动关闭时间（毫秒，0表示不自动关闭）
    duration: {
      type: Number,
      default: 3000
    },
    
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: true
    },
    
    // 位置
    position: {
      type: String,
      default: 'top-right',
      validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(value)
    }
  },
  
  emits: ['close'],
  
  setup(props, { emit }) {
    const visible = ref(false)
    let autoCloseTimer = null
    
    // Toast样式
    const toastClasses = computed(() => {
      const classes = [
        'fixed z-50 flex items-start p-4 rounded-lg shadow-lg bg-white border-l-4 cursor-pointer max-w-sm'
      ]
      
      // 位置样式
      switch (props.position) {
        case 'top-left':
          classes.push('top-4 left-4')
          break
        case 'top-right':
          classes.push('top-4 right-4')
          break
        case 'bottom-left':
          classes.push('bottom-4 left-4')
          break
        case 'bottom-right':
          classes.push('bottom-4 right-4')
          break
      }
      
      // 类型边框颜色
      switch (props.type) {
        case 'success':
          classes.push('border-green-500')
          break
        case 'error':
          classes.push('border-red-500')
          break
        case 'warning':
          classes.push('border-yellow-500')
          break
        case 'info':
          classes.push('border-blue-500')
          break
      }
      
      return classes.join(' ')
    })
    
    // 图标样式
    const iconClasses = computed(() => {
      const classes = ['flex-shrink-0']
      
      switch (props.type) {
        case 'success':
          classes.push('text-green-500')
          break
        case 'error':
          classes.push('text-red-500')
          break
        case 'warning':
          classes.push('text-yellow-500')
          break
        case 'info':
          classes.push('text-blue-500')
          break
      }
      
      return classes.join(' ')
    })
    
    // 消息样式
    const messageClasses = computed(() => {
      const classes = ['text-sm']
      
      if (props.title) {
        classes.push('text-gray-600')
      } else {
        classes.push('text-gray-900')
      }
      
      return classes.join(' ')
    })
    
    // 显示Toast
    const show = () => {
      visible.value = true
      
      // 设置自动关闭
      if (props.duration > 0) {
        autoCloseTimer = setTimeout(() => {
          close()
        }, props.duration)
      }
    }
    
    // 关闭Toast
    const close = () => {
      visible.value = false
      
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
        autoCloseTimer = null
      }
      
      emit('close')
    }
    
    // 点击处理
    const handleClick = () => {
      if (props.closable) {
        close()
      }
    }
    
    onMounted(() => {
      show()
    })
    
    onUnmounted(() => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
      }
    })
    
    return {
      visible,
      toastClasses,
      iconClasses,
      messageClasses,
      close,
      handleClick
    }
  }
}
</script>
