/**
 * 统一错误处理服务
 * 提供全局错误处理、用户友好提示和错误恢复机制
 */

import { useAppStore } from '@/stores/appStore.js'

/**
 * 错误类型定义
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  UPLOAD_ERROR: 'UPLOAD_ERROR',
  QUOTA_ERROR: 'QUOTA_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

/**
 * 错误级别定义
 */
export const ErrorLevels = {
  LOW: 'low',        // 轻微错误，不影响用户使用
  MEDIUM: 'medium',  // 中等错误，影响部分功能
  HIGH: 'high',      // 严重错误，影响主要功能
  CRITICAL: 'critical' // 严重错误，系统不可用
}

/**
 * 统一错误处理类
 */
class ErrorHandlerService {
  constructor() {
    this.appStore = null
    this.errorHistory = []
    this.maxHistorySize = 50
    
    // 错误消息映射
    this.errorMessages = {
      [ErrorTypes.NETWORK_ERROR]: {
        title: '网络连接异常',
        message: '请检查网络连接后重试',
        suggestions: ['检查网络连接', '刷新页面重试', '稍后再试']
      },
      [ErrorTypes.AUTH_ERROR]: {
        title: '身份验证失败',
        message: '请重新登录后继续',
        suggestions: ['重新登录', '检查账号状态']
      },
      [ErrorTypes.VALIDATION_ERROR]: {
        title: '输入数据有误',
        message: '请检查输入内容是否正确',
        suggestions: ['检查输入格式', '确认必填项']
      },
      [ErrorTypes.AI_SERVICE_ERROR]: {
        title: 'AI服务异常',
        message: 'AI处理服务暂时不可用，请稍后重试',
        suggestions: ['稍后重试', '尝试其他AI功能', '联系客服']
      },
      [ErrorTypes.UPLOAD_ERROR]: {
        title: '文件上传失败',
        message: '文件上传过程中出现问题',
        suggestions: ['检查文件大小', '检查文件格式', '重新上传']
      },
      [ErrorTypes.QUOTA_ERROR]: {
        title: '使用配额不足',
        message: '当前配额已用完，请升级账户或等待配额重置',
        suggestions: ['升级账户', '等待配额重置', '购买更多配额']
      },
      [ErrorTypes.PERMISSION_ERROR]: {
        title: '权限不足',
        message: '您没有执行此操作的权限',
        suggestions: ['联系管理员', '检查账户权限']
      },
      [ErrorTypes.UNKNOWN_ERROR]: {
        title: '未知错误',
        message: '系统遇到未知问题，请稍后重试',
        suggestions: ['刷新页面', '稍后重试', '联系客服']
      }
    }
  }

  /**
   * 初始化错误处理服务
   */
  initialize() {
    this.appStore = useAppStore()
    this.setupGlobalErrorHandlers()
  }

  /**
   * 设置全局错误处理器
   */
  setupGlobalErrorHandlers() {
    // 全局Vue错误处理
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        console.error('[Global Error]', event.error)
        this.handleError(event.error, ErrorTypes.UNKNOWN_ERROR, ErrorLevels.MEDIUM)
      })

      // 未处理的Promise拒绝
      window.addEventListener('unhandledrejection', (event) => {
        console.error('[Unhandled Promise Rejection]', event.reason)
        this.handleError(event.reason, ErrorTypes.UNKNOWN_ERROR, ErrorLevels.MEDIUM)
        event.preventDefault() // 阻止默认的控制台错误输出
      })
    }
  }

  /**
   * 主要错误处理方法
   * @param {Error|Object} error - 错误对象
   * @param {String} type - 错误类型
   * @param {String} level - 错误级别
   * @param {Object} context - 错误上下文信息
   */
  handleError(error, type = ErrorTypes.UNKNOWN_ERROR, level = ErrorLevels.MEDIUM, context = {}) {
    // 记录错误历史
    this.recordError(error, type, level, context)

    // 根据错误类型和级别决定处理方式
    const errorInfo = this.analyzeError(error, type)
    
    // 显示用户友好的错误提示
    this.showUserFriendlyError(errorInfo, level)

    // 执行错误恢复策略
    this.executeRecoveryStrategy(errorInfo, context)

    // 发送错误报告（生产环境）
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, type, level, context)
    }
  }

  /**
   * 分析错误信息
   */
  analyzeError(error, type) {
    let errorInfo = { ...this.errorMessages[type] }

    // 根据具体错误内容调整消息
    if (error?.message) {
      const message = error.message.toLowerCase()
      
      if (message.includes('network') || message.includes('fetch')) {
        errorInfo = { ...this.errorMessages[ErrorTypes.NETWORK_ERROR] }
      } else if (message.includes('unauthorized') || message.includes('403')) {
        errorInfo = { ...this.errorMessages[ErrorTypes.AUTH_ERROR] }
      } else if (message.includes('quota') || message.includes('limit')) {
        errorInfo = { ...this.errorMessages[ErrorTypes.QUOTA_ERROR] }
      }
    }

    return {
      ...errorInfo,
      originalError: error,
      type
    }
  }

  /**
   * 显示用户友好的错误提示
   */
  showUserFriendlyError(errorInfo, level) {
    if (!this.appStore) {
      this.initialize()
    }

    const notificationConfig = {
      title: errorInfo.title,
      message: errorInfo.message,
      duration: level === ErrorLevels.CRITICAL ? 0 : 5000
    }

    // 根据错误级别选择通知类型
    if (level === ErrorLevels.CRITICAL || level === ErrorLevels.HIGH) {
      this.appStore.addErrorNotification(notificationConfig.message, notificationConfig.title)
    } else if (level === ErrorLevels.MEDIUM) {
      this.appStore.addWarningNotification(notificationConfig.message, notificationConfig.title)
    } else {
      this.appStore.addInfoNotification(notificationConfig.message, notificationConfig.title)
    }
  }

  /**
   * 执行错误恢复策略
   */
  executeRecoveryStrategy(errorInfo, context) {
    // 停止全局加载状态
    if (this.appStore?.isGlobalLoading) {
      this.appStore.setGlobalLoading(false)
    }

    // 根据错误类型执行特定恢复策略
    switch (errorInfo.type) {
      case ErrorTypes.AUTH_ERROR:
        this.handleAuthError(context)
        break
      case ErrorTypes.NETWORK_ERROR:
        this.handleNetworkError(context)
        break
      case ErrorTypes.AI_SERVICE_ERROR:
        this.handleAIServiceError(context)
        break
      // 可以添加更多恢复策略
    }
  }

  /**
   * 处理认证错误
   */
  handleAuthError(context) {
    // 清除认证状态，重定向到登录页
    if (context.requireAuth) {
      console.info('[ErrorHandler] 认证失败，准备重定向到登录页')
      // 这里可以调用路由跳转
    }
  }

  /**
   * 处理网络错误
   */
  handleNetworkError(context) {
    // 可以实现重试机制
    if (context.retryable && context.retryCount < 3) {
      console.info('[ErrorHandler] 网络错误，准备重试...')
      setTimeout(() => {
        if (context.retryCallback) {
          context.retryCallback()
        }
      }, 1000 * (context.retryCount + 1))
    }
  }

  /**
   * 处理AI服务错误
   */
  handleAIServiceError(context) {
    // 可以尝试切换到备用AI服务或降级处理
    console.info('[ErrorHandler] AI服务错误，考虑降级处理')
  }

  /**
   * 记录错误历史
   */
  recordError(error, type, level, context) {
    const errorRecord = {
      timestamp: new Date().toISOString(),
      error: {
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        name: error?.name
      },
      type,
      level,
      context,
      userAgent: navigator?.userAgent,
      url: window?.location?.href
    }

    this.errorHistory.unshift(errorRecord)

    // 限制历史记录大小
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * 发送错误报告到服务端
   */
  async reportError(error, type, level, context) {
    try {
      // 这里可以发送错误报告到监控服务
      console.info('[ErrorHandler] 错误已记录:', { error, type, level, context })
    } catch (reportError) {
      console.error('[ErrorHandler] 发送错误报告失败:', reportError)
    }
  }

  /**
   * 获取错误历史
   */
  getErrorHistory() {
    return this.errorHistory
  }

  /**
   * 清除错误历史
   */
  clearErrorHistory() {
    this.errorHistory = []
  }

  /**
   * 便捷方法：处理网络请求错误
   */
  handleNetworkRequestError(error, context = {}) {
    let type = ErrorTypes.NETWORK_ERROR
    let level = ErrorLevels.MEDIUM

    // 根据HTTP状态码调整错误类型
    if (error.response) {
      const status = error.response.status
      if (status === 401 || status === 403) {
        type = ErrorTypes.AUTH_ERROR
        level = ErrorLevels.HIGH
      } else if (status === 429) {
        type = ErrorTypes.QUOTA_ERROR
        level = ErrorLevels.MEDIUM
      } else if (status >= 500) {
        level = ErrorLevels.HIGH
      }
    }

    this.handleError(error, type, level, { ...context, requestError: true })
  }

  /**
   * 便捷方法：处理AI服务错误
   */
  handleAIRequestError(error, serviceType, context = {}) {
    this.handleError(error, ErrorTypes.AI_SERVICE_ERROR, ErrorLevels.MEDIUM, {
      ...context,
      serviceType,
      aiError: true
    })
  }

  /**
   * 便捷方法：处理文件上传错误
   */
  handleUploadError(error, fileName, context = {}) {
    this.handleError(error, ErrorTypes.UPLOAD_ERROR, ErrorLevels.MEDIUM, {
      ...context,
      fileName,
      uploadError: true
    })
  }
}

// 创建全局单例
export const errorHandler = new ErrorHandlerService()

// 初始化（如果在浏览器环境中）
if (typeof window !== 'undefined') {
  errorHandler.initialize()
}

export default errorHandler
