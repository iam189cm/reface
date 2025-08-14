/**
 * Nero AI 统一服务类
 * 提供所有 Nero AI 功能的统一接口
 */

import type {
  NeroAIServiceType,
  NeroAIProcessParams,
  NeroAIResponse,
  NeroAIResult,
  NeroAIConfig,
  NeroAIError,
  BatchProcessResult,
  TaskInfo
} from './types/nero-ai.types'

import { NERO_AI_CONFIG, SERVICE_CAPABILITIES, ERROR_CODES, DEFAULT_PARAMS } from './config/nero-ai.config'

export class NeroAIService {
  private config: Required<NeroAIConfig>
  private activeTasks = new Map<string, TaskInfo>()
  private rateLimitQueue: Array<() => void> = []
  private lastRequestTime = 0
  private requestCount = 0

  constructor(config: NeroAIConfig) {
    this.config = {
      baseUrl: NERO_AI_CONFIG.BASE_URL,
      timeout: NERO_AI_CONFIG.DEFAULT_TIMEOUT,
      maxRetries: NERO_AI_CONFIG.MAX_RETRIES,
      webhookUrl: '',
      ...config
    }

    if (!this.config.apiKey) {
      throw new Error('Nero AI API Key 是必需的')
    }
  }

  /**
   * 处理单个图片任务
   */
  async processImage(params: NeroAIProcessParams): Promise<NeroAIResult> {
    // 参数验证
    await this.validateParams(params)
    
    // 速率限制
    await this.enforceRateLimit()

    // 生成任务ID
    const taskId = this.generateTaskId()
    
    // 记录任务开始
    this.recordTaskStart(taskId, params.type)

    try {
      // 创建任务
      const response = await this.createTask(params)
      
      if (response.code !== 0 || !response.data?.task_id) {
        throw this.createError(response.code, response.msg || '创建任务失败')
      }

      const serverTaskId = response.data.task_id
      
      // 等待任务完成
      const result = await this.waitForCompletion(serverTaskId, params.type)
      
      // 更新任务状态
      this.recordTaskComplete(taskId, result)
      
      return result

    } catch (error) {
      // 记录任务失败
      this.recordTaskError(taskId, error as Error)
      throw error
    }
  }

  /**
   * 批量处理图片
   */
  async batchProcess(
    paramsList: NeroAIProcessParams[], 
    maxConcurrent: number = 3
  ): Promise<BatchProcessResult> {
    const startTime = Date.now()
    const results: BatchProcessResult['results'] = []
    
    // 分批处理
    const batches = this.chunkArray(paramsList, maxConcurrent)
    
    for (const batch of batches) {
      const batchPromises = batch.map(async (params, index) => {
        try {
          const result = await this.processImage(params)
          return {
            index: results.length + index,
            success: true,
            result
          }
        } catch (error) {
          return {
            index: results.length + index,
            success: false,
            error: (error as Error).message
          }
        }
      })
      
      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)
    }

    const completedTasks = results.filter(r => r.success).length
    const failedTasks = results.length - completedTasks

    return {
      total_tasks: paramsList.length,
      completed_tasks: completedTasks,
      failed_tasks: failedTasks,
      results,
      processing_time: Date.now() - startTime
    }
  }

  /**
   * 获取任务状态
   */
  async getTaskStatus(taskId: string): Promise<NeroAIResponse> {
    const url = `${this.config.baseUrl}${NERO_AI_CONFIG.ENDPOINTS.TASK}?task_id=${taskId}`
    
    const response = await this.makeRequest(url, {
      method: 'GET',
      headers: this.getHeaders()
    })

    return response.json()
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<void> {
    const taskInfo = this.activeTasks.get(taskId)
    if (taskInfo) {
      taskInfo.status = 'failed'
      this.activeTasks.delete(taskId)
    }
  }

  /**
   * 获取服务能力信息
   */
  getServiceCapabilities(): typeof SERVICE_CAPABILITIES {
    return SERVICE_CAPABILITIES
  }

  /**
   * 获取支持的服务类型
   */
  getSupportedServices(): NeroAIServiceType[] {
    return Object.keys(SERVICE_CAPABILITIES) as NeroAIServiceType[]
  }

  /**
   * 检查服务是否支持
   */
  isServiceSupported(serviceType: NeroAIServiceType): boolean {
    return serviceType in SERVICE_CAPABILITIES
  }

  /**
   * 获取活动任务
   */
  getActiveTasks(): TaskInfo[] {
    return Array.from(this.activeTasks.values())
  }

  // 私有方法

  /**
   * 验证参数
   */
  private async validateParams(params: NeroAIProcessParams): Promise<void> {
    if (!params.type) {
      throw new Error('服务类型不能为空')
    }

    if (!this.isServiceSupported(params.type)) {
      throw new Error(`不支持的服务类型: ${params.type}`)
    }

    if (!params.body) {
      throw new Error('请求参数不能为空')
    }

    // 检查是否有图片输入
    if (!params.body.image && !params.body.image_file) {
      throw new Error('必须提供图片文件或图片URL')
    }

    // 验证文件大小
    if (params.body.image_file) {
      const capability = SERVICE_CAPABILITIES[params.type]
      if (params.body.image_file.size > capability.max_file_size) {
        throw new Error(`文件大小超过限制 (${capability.max_file_size / 1024 / 1024}MB)`)
      }
    }
  }

  /**
   * 创建任务
   */
  private async createTask(params: NeroAIProcessParams): Promise<NeroAIResponse> {
    const url = `${this.config.baseUrl}${NERO_AI_CONFIG.ENDPOINTS.TASK}`
    
    // 准备请求体
    const requestBody = {
      type: params.type,
      body: {
        ...DEFAULT_PARAMS[params.type],
        ...params.body
      },
      info: {
        ...params.info,
        webhook: this.config.webhookUrl || params.info?.webhook
      }
    }

    // 处理文件上传
    let body: FormData | string
    let contentType: string

    if (params.body.image_file) {
      // 使用 FormData 上传文件
      const formData = new FormData()
      formData.append('payload', JSON.stringify({
        type: params.type,
        body: {
          ...requestBody.body,
          image_file: undefined // 移除 image_file，因为会单独上传
        },
        info: requestBody.info
      }))
      formData.append('file', params.body.image_file)
      
      body = formData
      contentType = 'multipart/form-data'
    } else {
      // 使用 JSON 发送 URL
      body = JSON.stringify(requestBody)
      contentType = 'application/json'
    }

    const response = await this.makeRequest(url, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        ...(contentType === 'application/json' && { 'Content-Type': contentType })
      },
      body
    })

    return response.json()
  }

  /**
   * 等待任务完成
   */
  private async waitForCompletion(taskId: string, serviceType: NeroAIServiceType): Promise<NeroAIResult> {
    const startTime = Date.now()
    const maxAttempts = NERO_AI_CONFIG.POLLING.MAX_ATTEMPTS
    const interval = NERO_AI_CONFIG.POLLING.INTERVAL
    const timeout = NERO_AI_CONFIG.POLLING.TIMEOUT

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // 检查超时
      if (Date.now() - startTime > timeout) {
        throw new Error('任务处理超时')
      }

      try {
        const response = await this.getTaskStatus(taskId)
        
        if (response.code !== 0) {
          throw this.createError(response.code, response.msg || '获取任务状态失败')
        }

        const data = response.data!
        
        // 更新任务信息
        this.updateTaskProgress(taskId, data.progress || 0, data.status || 'pending')

        // 检查任务状态
        switch (data.status) {
          case 'done':
            return {
              task_id: taskId,
              service_type: serviceType,
              status: 'done',
              result: data.result,
              progress: 100,
              created_at: new Date().toISOString(),
              completed_at: new Date().toISOString()
            }
            
          case 'failed':
            throw new Error(data.msg || '任务处理失败')
            
          case 'running':
          case 'pending':
            // 继续等待
            break
            
          default:
            throw new Error(`未知的任务状态: ${data.status}`)
        }

      } catch (error) {
        // 如果是API错误，直接抛出
        if (error instanceof Error && error.message.includes('API')) {
          throw error
        }
        
        // 其他错误，记录并继续重试
        console.warn(`获取任务状态失败 (尝试 ${attempt + 1}/${maxAttempts}):`, error)
      }

      // 等待下次轮询
      await this.sleep(interval)
    }

    throw new Error('任务处理超时，请稍后查看结果')
  }

  /**
   * 发送 HTTP 请求
   */
  private async makeRequest(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(this.config.timeout)
        })

        // 检查HTTP状态
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response

      } catch (error) {
        lastError = error as Error
        
        // 如果不是可重试的错误，直接抛出
        if (!this.isRetryableError(error as Error)) {
          throw error
        }

        // 等待重试
        if (attempt < this.config.maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000) // 指数退避
        }
      }
    }

    throw lastError || new Error('请求失败')
  }

  /**
   * 获取请求头
   */
  private getHeaders(): Record<string, string> {
    return {
      'x-neroai-api-key': this.config.apiKey,
      'Accept': 'application/json'
    }
  }

  /**
   * 速率限制
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeWindow = 1000 // 1秒

    // 重置计数器（如果过了时间窗口）
    if (now - this.lastRequestTime > timeWindow) {
      this.requestCount = 0
      this.lastRequestTime = now
    }

    // 检查是否超过速率限制
    if (this.requestCount >= NERO_AI_CONFIG.RATE_LIMIT) {
      const waitTime = timeWindow - (now - this.lastRequestTime)
      await this.sleep(waitTime)
      
      // 重置计数器
      this.requestCount = 0
      this.lastRequestTime = Date.now()
    }

    this.requestCount++
  }

  /**
   * 任务管理方法
   */
  private generateTaskId(): string {
    return `nero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private recordTaskStart(taskId: string, serviceType: NeroAIServiceType): void {
    this.activeTasks.set(taskId, {
      id: taskId,
      service_type: serviceType,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0
    })
  }

  private updateTaskProgress(taskId: string, progress: number, status: TaskInfo['status']): void {
    const task = this.activeTasks.get(taskId)
    if (task) {
      task.progress = progress
      task.status = status
      task.updated_at = new Date().toISOString()
    }
  }

  private recordTaskComplete(taskId: string, result: NeroAIResult): void {
    const task = this.activeTasks.get(taskId)
    if (task) {
      task.status = 'done'
      task.progress = 100
      task.updated_at = new Date().toISOString()
    }
    
    // 清理完成的任务（可选）
    setTimeout(() => {
      this.activeTasks.delete(taskId)
    }, 60000) // 1分钟后清理
  }

  private recordTaskError(taskId: string, error: Error): void {
    const task = this.activeTasks.get(taskId)
    if (task) {
      task.status = 'failed'
      task.updated_at = new Date().toISOString()
    }
  }

  /**
   * 工具方法
   */
  private createError(code: number, message: string): NeroAIError {
    return {
      code,
      message: ERROR_CODES[code as keyof typeof ERROR_CODES] || message,
      retryable: this.isRetryableErrorCode(code)
    }
  }

  private isRetryableError(error: Error): boolean {
    return error.message.includes('timeout') || 
           error.message.includes('network') ||
           error.message.includes('503') ||
           error.message.includes('502')
  }

  private isRetryableErrorCode(code: number): boolean {
    return [429, 500, 502, 503].includes(code)
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
