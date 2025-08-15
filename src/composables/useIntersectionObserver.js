/**
 * Intersection Observer 响应式 Hook
 * 用于实现懒加载和滚动动画等功能
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * 使用 Intersection Observer 监听元素可见性
 * @param {Object} options - 配置选项
 */
export function useIntersectionObserver(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    once = true
  } = options

  const target = ref(null)
  const isVisible = ref(false)
  const isIntersecting = ref(false)
  
  let observer = null

  const startObserver = () => {
    if (typeof window === 'undefined' || !target.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isIntersecting.value = entry.isIntersecting
        
        if (entry.isIntersecting) {
          isVisible.value = true
          
          // 如果是一次性观察，则断开连接
          if (once) {
            stopObserver()
          }
        } else if (!once) {
          isVisible.value = false
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    )

    observer.observe(target.value)
  }

  const stopObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  // 监听 target 变化
  watch(target, (newTarget, oldTarget) => {
    if (oldTarget) {
      stopObserver()
    }
    if (newTarget) {
      startObserver()
    }
  })

  onUnmounted(() => {
    stopObserver()
  })

  return {
    target,
    isVisible,
    isIntersecting,
    startObserver,
    stopObserver
  }
}

/**
 * 懒加载 Hook
 * 专门用于图片或内容的懒加载
 */
export function useLazyLoad(callback, options = {}) {
  const { threshold = 0.1, rootMargin = '50px', once = true } = options
  
  const { target, isVisible, startObserver, stopObserver } = useIntersectionObserver({
    threshold,
    rootMargin,
    once
  })

  // 当变为可见时执行回调
  watch(isVisible, (visible) => {
    if (visible && callback) {
      callback()
    }
  })

  return {
    target,
    isVisible,
    startObserver,
    stopObserver
  }
}

/**
 * 滚动动画 Hook
 * 用于元素进入视窗时的动画效果
 */
export function useScrollAnimation(animationClass = 'fade-in', options = {}) {
  const { threshold = 0.2, rootMargin = '0px' } = options
  
  const { target, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    once: true
  })

  // 动态添加动画类
  watch(isVisible, (visible) => {
    if (visible && target.value) {
      target.value.classList.add(animationClass)
    }
  })

  return {
    target,
    isVisible
  }
}

/**
 * 无限滚动 Hook
 * 用于列表的无限滚动加载
 */
export function useInfiniteScroll(callback, options = {}) {
  const { threshold = 1.0, rootMargin = '100px' } = options
  
  const sentinel = ref(null)
  const isLoading = ref(false)

  const { isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    once: false
  })

  // 将 sentinel 设置为 target
  watch(sentinel, (newSentinel) => {
    if (newSentinel) {
      // 这里需要手动设置 target
    }
  })

  // 当哨兵元素可见且不在加载状态时，执行回调
  watch(isIntersecting, (intersecting) => {
    if (intersecting && !isLoading.value && callback) {
      isLoading.value = true
      callback().finally(() => {
        isLoading.value = false
      })
    }
  })

  return {
    sentinel,
    isLoading,
    isIntersecting
  }
}

/**
 * 视口状态 Hook
 * 提供元素相对视口的详细状态信息
 */
export function useViewportStatus(options = {}) {
  const { threshold = [0, 0.25, 0.5, 0.75, 1], rootMargin = '0px' } = options
  
  const target = ref(null)
  const visibilityRatio = ref(0)
  const isFullyVisible = ref(false)
  const isPartiallyVisible = ref(false)
  
  let observer = null

  const startObserver = () => {
    if (typeof window === 'undefined' || !target.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        visibilityRatio.value = entry.intersectionRatio
        isPartiallyVisible.value = entry.intersectionRatio > 0
        isFullyVisible.value = entry.intersectionRatio === 1
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(target.value)
  }

  const stopObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  watch(target, (newTarget, oldTarget) => {
    if (oldTarget) {
      stopObserver()
    }
    if (newTarget) {
      startObserver()
    }
  })

  onUnmounted(() => {
    stopObserver()
  })

  return {
    target,
    visibilityRatio,
    isFullyVisible,
    isPartiallyVisible,
    startObserver,
    stopObserver
  }
}
