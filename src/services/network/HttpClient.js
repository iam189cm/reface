/**
 * HTTP客户端服务
 * 统一网络请求处理，支持重试、超时、错误处理
 */
export class HttpClient {
  constructor(config = {}) {
    this.config = {
      timeout: 60000, // 60秒默认超时
      retries: 3,     // 默认重试3次
      retryDelay: 1000, // 重试延迟1秒
      ...config
    }
  }
  
  /**
   * 发起HTTP请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>} 响应对象
   */
  async request(url, options = {}) {
    const requestOptions = {
      ...options,
      signal: this._createTimeoutSignal(options.timeout || this.config.timeout)
    }
    
    let lastError
    const maxRetries = options.retries !== undefined ? options.retries : this.config.retries
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`🔄 Retrying request (${attempt}/${maxRetries}): ${url}`)
          await this._delay(this.config.retryDelay * attempt)
        }
        
        const response = await fetch(url, requestOptions)
        
        // 如果是4xx错误，不重试（客户端错误）
        if (response.status >= 400 && response.status < 500) {
          return response
        }
        
        // 如果是5xx错误且还有重试次数，继续重试
        if (response.status >= 500 && attempt < maxRetries) {
          lastError = new Error(`Server error: ${response.status}`)
          continue
        }
        
        return response
        
      } catch (error) {
        lastError = error
        
        // 超时或网络错误，可以重试
        if (this._isRetriableError(error) && attempt < maxRetries) {
          console.warn(`⚠️ Request failed, retrying: ${error.message}`)
          continue
        }
        
        // 不可重试的错误或重试次数用完
        break
      }
    }
    
    throw lastError
  }
  
  /**
   * GET 请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>}
   */
  async get(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'GET'
    })
  }
  
  /**
   * POST 请求
   * @param {string} url - 请求URL
   * @param {any} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>}
   */
  async post(url, data, options = {}) {
    const requestOptions = {
      ...options,
      method: 'POST'
    }
    
    // 处理不同类型的数据
    if (data instanceof FormData) {
      requestOptions.body = data
      // 让浏览器自动设置Content-Type
    } else if (typeof data === 'object') {
      requestOptions.body = JSON.stringify(data)
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }
    } else {
      requestOptions.body = data
    }
    
    return this.request(url, requestOptions)
  }
  
  /**
   * PUT 请求
   * @param {string} url - 请求URL
   * @param {any} data - 请求数据
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>}
   */
  async put(url, data, options = {}) {
    return this.post(url, data, { ...options, method: 'PUT' })
  }
  
  /**
   * DELETE 请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>}
   */
  async delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    })
  }
  
  /**
   * 下载文件
   * @param {string} url - 文件URL
   * @param {Function} onProgress - 进度回调
   * @param {Object} options - 请求选项
   * @returns {Promise<Blob>}
   */
  async download(url, onProgress, options = {}) {
    const response = await this.request(url, options)
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`)
    }
    
    const contentLength = response.headers.get('content-length')
    const total = contentLength ? parseInt(contentLength, 10) : 0
    
    if (!response.body) {
      throw new Error('Response body is not available')
    }
    
    const reader = response.body.getReader()
    const chunks = []
    let receivedLength = 0
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        chunks.push(value)
        receivedLength += value.length
        
        if (onProgress && total > 0) {
          onProgress({
            loaded: receivedLength,
            total,
            percentage: Math.round((receivedLength / total) * 100)
          })
        }
      }
    } finally {
      reader.releaseLock()
    }
    
    // 合并所有chunks
    const allChunks = new Uint8Array(receivedLength)
    let position = 0
    for (const chunk of chunks) {
      allChunks.set(chunk, position)
      position += chunk.length
    }
    
    return new Blob([allChunks])
  }
  
  /**
   * 创建超时信号
   * @param {number} timeout - 超时时间（毫秒）
   * @returns {AbortSignal}
   * @private
   */
  _createTimeoutSignal(timeout) {
    const controller = new AbortController()
    
    setTimeout(() => {
      controller.abort()
    }, timeout)
    
    return controller.signal
  }
  
  /**
   * 判断错误是否可以重试
   * @param {Error} error - 错误对象
   * @returns {boolean}
   * @private
   */
  _isRetriableError(error) {
    // 网络错误
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return true
    }
    
    // 超时错误
    if (error.name === 'AbortError') {
      return true
    }
    
    // DNS错误
    if (error.message.includes('getaddrinfo')) {
      return true
    }
    
    return false
  }
  
  /**
   * 延迟函数
   * @param {number} ms - 延迟时间（毫秒）
   * @returns {Promise<void>}
   * @private
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
