/**
 * 性能优化工具
 * 包含代码分割、预加载、缓存等优化功能
 */

/**
 * 动态导入路由组件，支持预加载和错误处理
 * @param {Function} importFunc - 动态导入函数
 * @param {Object} options - 配置选项
 */
export const createAsyncComponent = (importFunc, options = {}) => {
  const {
    loadingComponent = null,
    errorComponent = null,
    delay = 200,
    timeout = 10000,
    preload = false
  } = options

  const AsyncComponent = () => {
    const promise = importFunc()
    
    // 预加载
    if (preload) {
      promise.catch(error => {
        console.warn('[Performance] 组件预加载失败:', error)
      })
    }

    return promise
  }

  // 配置异步组件选项
  const componentOptions = {
    loader: AsyncComponent,
    delay,
    timeout
  }

  if (loadingComponent) {
    componentOptions.loadingComponent = loadingComponent
  }

  if (errorComponent) {
    componentOptions.errorComponent = errorComponent
  }

  return AsyncComponent
}

/**
 * 预加载指定的路由组件
 * @param {Array} routes - 路由配置数组
 */
export const preloadRoutes = (routes = []) => {
  if (typeof window === 'undefined') return

  const preloadRoute = (route) => {
    if (route.component && typeof route.component === 'function') {
      // 在空闲时间预加载
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          route.component().catch(error => {
            console.warn(`[Performance] 预加载路由 ${route.name} 失败:`, error)
          })
        })
      } else {
        // 降级到setTimeout
        setTimeout(() => {
          route.component().catch(error => {
            console.warn(`[Performance] 预加载路由 ${route.name} 失败:`, error)
          })
        }, 100)
      }
    }
  }

  routes.forEach(preloadRoute)
}

/**
 * 图片预加载工具
 * @param {Array} imageUrls - 图片URL数组
 * @param {Object} options - 配置选项
 */
export const preloadImages = (imageUrls = [], options = {}) => {
  const { 
    priority = 'low',
    timeout = 30000,
    onProgress = null,
    onComplete = null,
    onError = null
  } = options

  const results = {
    loaded: 0,
    failed: 0,
    total: imageUrls.length
  }

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        reject(new Error(`图片加载超时: ${url}`))
      }, timeout)

      img.onload = () => {
        clearTimeout(timeoutId)
        results.loaded++
        resolve(url)
        
        if (onProgress) {
          onProgress(results.loaded, results.total)
        }
      }

      img.onerror = () => {
        clearTimeout(timeoutId)
        results.failed++
        reject(new Error(`图片加载失败: ${url}`))
        
        if (onError) {
          onError(url, results.failed)
        }
      }

      img.src = url
    })
  }

  // 根据优先级选择加载策略
  const loadPromises = imageUrls.map(url => 
    loadImage(url).catch(error => {
      console.warn('[Performance] 图片预加载失败:', error)
      return null
    })
  )

  return Promise.allSettled(loadPromises).then((results) => {
    if (onComplete) {
      onComplete(results)
    }
    return results
  })
}

/**
 * 资源预加载管理器
 */
export class ResourcePreloader {
  constructor() {
    this.cache = new Map()
    this.loading = new Map()
    this.maxCacheSize = 50
  }

  /**
   * 预加载资源
   * @param {String} url - 资源URL
   * @param {String} type - 资源类型 ('image', 'script', 'style', 'fetch')
   */
  async preload(url, type = 'fetch') {
    // 检查缓存
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    // 检查是否正在加载
    if (this.loading.has(url)) {
      return this.loading.get(url)
    }

    let promise

    switch (type) {
      case 'image':
        promise = this.preloadImage(url)
        break
      case 'script':
        promise = this.preloadScript(url)
        break
      case 'style':
        promise = this.preloadStyle(url)
        break
      case 'fetch':
        promise = this.preloadFetch(url)
        break
      default:
        promise = this.preloadFetch(url)
    }

    this.loading.set(url, promise)

    try {
      const result = await promise
      this.cache.set(url, result)
      this.manageCacheSize()
      return result
    } catch (error) {
      console.warn(`[Performance] 预加载 ${type} 资源失败: ${url}`, error)
      throw error
    } finally {
      this.loading.delete(url)
    }
  }

  /**
   * 预加载图片
   */
  preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  /**
   * 预加载脚本
   */
  preloadScript(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = url
      link.onload = () => resolve(url)
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  /**
   * 预加载样式
   */
  preloadStyle(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url
      link.onload = () => resolve(url)
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  /**
   * 使用fetch预加载
   */
  async preloadFetch(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response
  }

  /**
   * 管理缓存大小
   */
  manageCacheSize() {
    if (this.cache.size > this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear()
    this.loading.clear()
  }
}

/**
 * 全局资源预加载器实例
 */
export const resourcePreloader = new ResourcePreloader()

/**
 * 代码分割工具
 */
export const codeSplitting = {
  /**
   * 创建路由级别的代码分割
   */
  createRouteComponent: (importFunc, chunkName) => {
    return () => import(
      /* webpackChunkName: "[request]" */
      /* webpackPrefetch: true */
      importFunc
    )
  },

  /**
   * 创建功能级别的代码分割
   */
  createFeatureComponent: (importFunc, chunkName) => {
    return () => import(
      /* webpackChunkName: "[request]" */
      /* webpackPreload: true */
      importFunc
    )
  }
}

/**
 * 性能监控工具
 */
export const performanceMonitor = {
  /**
   * 测量函数执行时间
   */
  measureFunction: (fn, name) => {
    return async (...args) => {
      const start = performance.now()
      try {
        const result = await fn(...args)
        const duration = performance.now() - start
        console.log(`[Performance] ${name} 执行时间: ${duration.toFixed(2)}ms`)
        return result
      } catch (error) {
        const duration = performance.now() - start
        console.error(`[Performance] ${name} 执行失败 (${duration.toFixed(2)}ms):`, error)
        throw error
      }
    }
  },

  /**
   * 监控页面加载性能
   */
  monitorPageLoad: () => {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      // 获取性能指标
      const perfData = performance.getEntriesByType('navigation')[0]
      
      const metrics = {
        DNS: perfData.domainLookupEnd - perfData.domainLookupStart,
        TCP: perfData.connectEnd - perfData.connectStart,
        Request: perfData.responseStart - perfData.requestStart,
        Response: perfData.responseEnd - perfData.responseStart,
        DOM: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        Total: perfData.loadEventEnd - perfData.navigationStart
      }

      console.group('[Performance] 页面加载性能指标')
      Object.entries(metrics).forEach(([key, value]) => {
        console.log(`${key}: ${value.toFixed(2)}ms`)
      })
      console.groupEnd()
    })
  },

  /**
   * 监控资源加载
   */
  monitorResourceLoad: () => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        if (entry.duration > 1000) { // 超过1秒的资源
          console.warn(`[Performance] 慢速资源: ${entry.name} (${entry.duration.toFixed(2)}ms)`)
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })
  }
}

/**
 * 节流函数
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 防抖函数
 */
export const debounce = (func, delay) => {
  let timeoutId
  return function() {
    const args = arguments
    const context = this
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(context, args), delay)
  }
}

/**
 * 初始化性能优化
 */
export const initPerformanceOptimizations = () => {
  if (typeof window === 'undefined') return

  // 启动性能监控
  performanceMonitor.monitorPageLoad()
  performanceMonitor.monitorResourceLoad()

  // 预加载关键资源
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // 在这里添加需要预加载的资源
      console.log('[Performance] 空闲时间预加载启动')
    })
  }
}
