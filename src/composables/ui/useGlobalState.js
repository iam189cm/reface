/**
 * 全局状态管理Composable
 * 提供统一的全局状态访问和错误处理接口
 */

import { computed, nextTick } from 'vue'
import { useAppStore } from '@/stores/appStore.js'
import { errorHandler, ErrorTypes, ErrorLevels } from '@/services/error-handler.service.js'

/**
 * 全局状态管理Hook
 */
export function useGlobalState() {
  const appStore = useAppStore()

  return {
    // 全局状态
    isGlobalLoading: computed(() => appStore.isGlobalLoading),
    globalLoadingMessage: computed(() => appStore.globalLoadingMessage),
    notifications: computed(() => appStore.notifications),
    
    // 加载状态管理
    setGlobalLoading: (loading, message = '') => {
      appStore.setGlobalLoading(loading, message)
    },
    
    // 通知管理
    showSuccess: (message, title) => appStore.addSuccessNotification(message, title),
    showError: (message, title) => appStore.addErrorNotification(message, title),
    showWarning: (message, title) => appStore.addWarningNotification(message, title),
    showInfo: (message, title) => appStore.addInfoNotification(message, title),
    
    // 便捷通知方法
    showNotification: appStore.showNotification,
    clearNotifications: appStore.clearAllNotifications,
    removeNotification: appStore.removeNotification
  }
}

/**
 * 错误处理Hook
 */
export function useErrorHandler() {
  return {
    // 主要错误处理方法
    handleError: errorHandler.handleError.bind(errorHandler),
    
    // 便捷错误处理方法
    handleNetworkError: errorHandler.handleNetworkRequestError.bind(errorHandler),
    handleAIError: errorHandler.handleAIRequestError.bind(errorHandler),
    handleUploadError: errorHandler.handleUploadError.bind(errorHandler),
    
    // 错误类型和级别
    ErrorTypes,
    ErrorLevels,
    
    // 错误历史
    getErrorHistory: errorHandler.getErrorHistory.bind(errorHandler),
    clearErrorHistory: errorHandler.clearErrorHistory.bind(errorHandler)
  }
}

/**
 * 异步操作包装器Hook
 * 提供统一的加载状态和错误处理
 */
export function useAsyncOperation() {
  const { setGlobalLoading } = useGlobalState()
  const { handleError, ErrorTypes, ErrorLevels } = useErrorHandler()

  /**
   * 包装异步操作，自动处理加载状态和错误
   * @param {Function} operation - 异步操作函数
   * @param {Object} options - 配置选项
   */
  const executeAsync = async (operation, options = {}) => {
    const {
      loadingMessage = '处理中...',
      showGlobalLoading = true,
      errorType = ErrorTypes.UNKNOWN_ERROR,
      errorLevel = ErrorLevels.MEDIUM,
      silent = false, // 静默模式不显示错误提示
      context = {}
    } = options

    try {
      // 显示加载状态
      if (showGlobalLoading) {
        setGlobalLoading(true, loadingMessage)
      }

      // 执行异步操作
      const result = await operation()
      
      return { success: true, data: result, error: null }
    } catch (error) {
      console.error('[AsyncOperation] 操作失败:', error)
      
      // 处理错误
      if (!silent) {
        handleError(error, errorType, errorLevel, context)
      }
      
      return { success: false, data: null, error }
    } finally {
      // 隐藏加载状态
      if (showGlobalLoading) {
        await nextTick() // 确保UI更新
        setGlobalLoading(false)
      }
    }
  }

  /**
   * AI服务操作包装器
   */
  const executeAIOperation = async (operation, serviceType, options = {}) => {
    return executeAsync(operation, {
      loadingMessage: 'AI正在处理中，请耐心等待...',
      errorType: ErrorTypes.AI_SERVICE_ERROR,
      errorLevel: ErrorLevels.MEDIUM,
      context: { serviceType, aiOperation: true },
      ...options
    })
  }

  /**
   * 网络请求操作包装器
   */
  const executeNetworkOperation = async (operation, options = {}) => {
    return executeAsync(operation, {
      loadingMessage: '加载数据中...',
      errorType: ErrorTypes.NETWORK_ERROR,
      errorLevel: ErrorLevels.MEDIUM,
      context: { networkOperation: true },
      ...options
    })
  }

  /**
   * 文件上传操作包装器
   */
  const executeUploadOperation = async (operation, fileName, options = {}) => {
    return executeAsync(operation, {
      loadingMessage: `正在上传 ${fileName}...`,
      errorType: ErrorTypes.UPLOAD_ERROR,
      errorLevel: ErrorLevels.MEDIUM,
      context: { fileName, uploadOperation: true },
      ...options
    })
  }

  return {
    executeAsync,
    executeAIOperation,
    executeNetworkOperation,
    executeUploadOperation
  }
}

/**
 * 便捷的组合Hook
 * 同时提供全局状态和错误处理功能
 */
export function useGlobalUI() {
  const globalState = useGlobalState()
  const errorHandler = useErrorHandler()
  const asyncOps = useAsyncOperation()

  return {
    // 全局状态
    ...globalState,
    
    // 错误处理
    ...errorHandler,
    
    // 异步操作
    ...asyncOps,
    
    // 便捷方法
    withLoading: (operation, message) => {
      return asyncOps.executeAsync(operation, { loadingMessage: message })
    },
    
    withAI: (operation, serviceType) => {
      return asyncOps.executeAIOperation(operation, serviceType)
    }
  }
}

// 默认导出最常用的Hook
export default useGlobalUI
