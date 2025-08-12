/**
 * AI服务基类
 * 提供所有AI服务的通用功能和接口
 */
export class AIServiceBase {
  constructor(config, httpClient, progressManager) {
    this.config = config
    this.httpClient = httpClient
    this.progressManager = progressManager
  }
  
  /**
   * 验证图片文件
   * @param {File|Blob} imageFile - 图片文件
   * @returns {Object} 验证结果 { valid: boolean, error?: string }
   */
  validateImageFile(imageFile) {
    if (!imageFile) {
      return { valid: false, error: '没有提供图片文件' }
    }
    
    // 检查文件大小
    const maxSize = this.config.maxFileSize || 10 * 1024 * 1024 // 默认10MB
    if (imageFile.size > maxSize) {
      return { 
        valid: false, 
        error: `图片文件过大，最大支持 ${Math.round(maxSize / 1024 / 1024)}MB`
      }
    }
    
    if (imageFile.size < 1024) { // 小于1KB
      return { valid: false, error: '图片文件过小，可能不是有效图片' }
    }
    
    // 检查文件类型
    const supportedTypes = this.config.supportedFormats || [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp'
    ]
    
    if (!supportedTypes.includes(imageFile.type.toLowerCase())) {
      return { 
        valid: false, 
        error: `不支持的图片格式: ${imageFile.type}，支持格式: ${supportedTypes.join(', ')}` 
      }
    }
    
    return { valid: true }
  }
  
  /**
   * 压缩图片（如果需要）
   * @param {File} file - 原始图片文件
   * @param {Object} options - 压缩选项
   * @returns {Promise<Blob>} 压缩后的图片
   */
  async compressImage(file, options = {}) {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.85,
      outputFormat = 'image/jpeg'
    } = options
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 计算压缩尺寸
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        canvas.width = width
        canvas.height = height
        
        // 绘制并压缩
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('图片压缩失败'))
          }
        }, outputFormat, quality)
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = URL.createObjectURL(file)
    })
  }
  
  /**
   * 生成唯一的任务ID
   * @param {string} prefix - ID前缀
   * @returns {string} 任务ID
   */
  generateTaskId(prefix = 'task') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  /**
   * 处理API错误
   * @param {Error} error - 原始错误
   * @param {string} operation - 操作名称
   * @returns {Error} 处理后的错误
   */
  handleError(error, operation = '处理') {
    let message = `${operation}失败`
    
    if (error.name === 'AbortError') {
      message = `${operation}超时，请稍后重试`
    } else if (error.message.includes('API Key') || error.message.includes('Token')) {
      message = 'API密钥配置错误'
    } else if (error.message.includes('quota') || error.message.includes('credit')) {
      message = 'API配额不足，请升级账户'
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      message = '网络连接失败，请检查网络状态'
    } else if (error.message.includes('format') || error.message.includes('type')) {
      message = '不支持的图片格式'
    } else if (error.message) {
      message = `${operation}失败: ${error.message}`
    }
    
    const enhancedError = new Error(message)
    enhancedError.originalError = error
    enhancedError.operation = operation
    
    return enhancedError
  }
  
  /**
   * 记录操作日志
   * @param {string} level - 日志级别
   * @param {string} operation - 操作名称
   * @param {Object} data - 日志数据
   */
  log(level, operation, data = {}) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      service: this.constructor.name,
      operation,
      level,
      ...data
    }
    
    console[level](`[${this.constructor.name}] ${operation}:`, logEntry)
  }
  
  /**
   * 创建进度跟踪器
   * @param {string} operation - 操作名称
   * @param {Object} options - 跟踪器选项
   * @returns {ProgressTracker} 进度跟踪器
   */
  createProgressTracker(operation, options = {}) {
    const taskId = this.generateTaskId(operation)
    return this.progressManager.createTracker(taskId, {
      totalSteps: 100,
      initialMessage: `准备${operation}...`,
      ...options
    })
  }
  
  /**
   * 等待指定时间
   * @param {number} ms - 等待时间（毫秒）
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  /**
   * 重试执行函数
   * @param {Function} fn - 要执行的函数
   * @param {Object} options - 重试选项
   * @returns {Promise<any>} 函数执行结果
   */
  async retry(fn, options = {}) {
    const {
      maxAttempts = 3,
      delay = 1000,
      backoff = 1.5
    } = options
    
    let lastError
    let currentDelay = delay
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (attempt < maxAttempts) {
          this.log('warn', 'retry', {
            attempt,
            maxAttempts,
            error: error.message,
            nextDelay: currentDelay
          })
          
          await this.delay(currentDelay)
          currentDelay *= backoff
        }
      }
    }
    
    throw this.handleError(lastError, '重试执行')
  }
}
