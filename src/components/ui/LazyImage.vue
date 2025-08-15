<template>
  <div 
    ref="containerRef"
    class="lazy-image-container"
    :class="containerClass"
  >
    <!-- 骨架屏加载状态 -->
    <div 
      v-if="isLoading" 
      class="skeleton-loader"
      :class="skeletonClass"
    >
      <div class="skeleton-content">
        <div class="skeleton-icon">
          <Camera :size="24" class="text-gray-400" />
        </div>
        <div class="skeleton-text">加载中...</div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div 
      v-else-if="hasError" 
      class="error-state"
      :class="errorClass"
      @click="retryLoad"
    >
      <div class="error-content">
        <div class="error-icon">
          <AlertCircle :size="24" class="text-red-400" />
        </div>
        <div class="error-text">加载失败</div>
        <button class="retry-button">点击重试</button>
      </div>
    </div>

    <!-- 实际图片 -->
    <img
      v-else-if="shouldLoad"
      ref="imgRef"
      :src="actualSrc"
      :alt="alt"
      :class="imageClass"
      @load="onLoad"
      @error="onError"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Camera, AlertCircle } from '@/utils/icons.js'

const props = defineProps({
  /** 图片源地址 */
  src: {
    type: String,
    required: true
  },
  
  /** 图片替代文本 */
  alt: {
    type: String,
    default: ''
  },
  
  /** 容器样式类 */
  containerClass: {
    type: String,
    default: ''
  },
  
  /** 图片样式类 */
  imageClass: {
    type: String,
    default: 'w-full h-full object-cover transition-opacity duration-300'
  },
  
  /** 骨架屏样式类 */
  skeletonClass: {
    type: String,
    default: 'w-full h-full'
  },
  
  /** 错误状态样式类 */
  errorClass: {
    type: String,
    default: 'w-full h-full'
  },
  
  /** 是否启用懒加载 */
  lazy: {
    type: Boolean,
    default: true
  },
  
  /** 懒加载阈值 (0.0 - 1.0) */
  threshold: {
    type: Number,
    default: 0.1
  },
  
  /** 预加载距离 (px) */
  rootMargin: {
    type: String,
    default: '50px'
  },
  
  /** 占位符图片 */
  placeholder: {
    type: String,
    default: ''
  },
  
  /** 加载失败时的备用图片 */
  fallback: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['load', 'error', 'visible'])

// 响应式状态
const containerRef = ref(null)
const imgRef = ref(null)
const isVisible = ref(false)
const isLoading = ref(true)
const hasError = ref(false)
const loadAttempts = ref(0)
const maxRetries = 3

// 计算属性
const shouldLoad = computed(() => {
  return !props.lazy || isVisible.value
})

const actualSrc = computed(() => {
  if (hasError.value && props.fallback) {
    return props.fallback
  }
  return props.src
})

// Intersection Observer
let observer = null

// 初始化观察器
const initObserver = () => {
  if (!props.lazy || typeof window === 'undefined') {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        isVisible.value = true
        emit('visible')
        observer.disconnect()
      }
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin
    }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
}

// 图片加载完成处理
const onLoad = () => {
  isLoading.value = false
  hasError.value = false
  emit('load', imgRef.value)
}

// 图片加载错误处理
const onError = () => {
  isLoading.value = false
  loadAttempts.value++
  
  // 如果有备用图片且不是备用图片本身出错
  if (props.fallback && props.src !== props.fallback && loadAttempts.value === 1) {
    // 尝试加载备用图片
    return
  }
  
  hasError.value = true
  emit('error', new Error('Image loading failed'))
}

// 重试加载
const retryLoad = () => {
  if (loadAttempts.value >= maxRetries) return
  
  hasError.value = false
  isLoading.value = true
  
  nextTick(() => {
    // 重新创建图片元素来重试
    if (imgRef.value) {
      imgRef.value.src = actualSrc.value
    }
  })
}

// 监听src变化
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc) {
    isLoading.value = true
    hasError.value = false
    loadAttempts.value = 0
  }
})

// 组件生命周期
onMounted(() => {
  initObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}

/* 骨架屏样式 */
.skeleton-loader {
  @apply bg-gray-100 skeleton flex items-center justify-center;
  border-radius: inherit;
}

.skeleton-content {
  @apply flex flex-col items-center justify-center space-y-2 text-gray-400;
}

.skeleton-icon {
  @apply animate-pulse;
}

.skeleton-text {
  @apply text-sm font-medium animate-pulse;
}

/* 错误状态样式 */
.error-state {
  @apply bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors;
  border-radius: inherit;
}

.error-content {
  @apply flex flex-col items-center justify-center space-y-2 text-gray-500 text-center p-4;
}

.error-icon {
  @apply text-red-400;
}

.error-text {
  @apply text-sm font-medium;
}

.retry-button {
  @apply text-xs text-pink-600 hover:text-pink-700 underline mt-1;
}

/* 图片加载动画 */
img {
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 骨架屏动画 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
