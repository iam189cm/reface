/**
 * AI服务基础类
 */

import type { 
  IAIService,
  AIServiceType,
  AIServiceConfig,
  AIProcessingParams,
  AIProcessingResult,
  AIServiceStatus,
  AIServiceError,
  AIServiceCallbacks
} from '../types/ai-service.types'
import { useNotification } from '@/shared/composables/useNotification'

export abstract class AIServiceBase implements IAIService {
  protected readonly notification = useNotification()
  
  constructor(
    public readonly type: AIServiceType,
    public readonly config: AIServiceConfig,
    protected readonly callbacks?: AIServiceCallbacks
  ) {}

  // 抽象方法，子类必须实现
  abstract process(params: AIProcessingParams): Promise<AIProcessingResult>
  abstract cancel(taskId: string): Promise<void>
  abstract getStatus(taskId: string): Promise<AIServiceStatus>
  abstract validateParams(params: AIProcessingParams): Promise<boolean>

  // 通用方法
  protected generateTaskId(): string {
    return `${this.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  protected async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = this.config.maxRetries,
    delay: number = this.config.retryDelay || 1000
  ): Promise<T> {
    let lastError: Error

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxRetries) {
          throw lastError
        }

        // 指数退避策略
        const backoffDelay = delay * Math.pow(2, attempt)
        await this.delay(backoffDelay)
      }
    }

    throw lastError!
  }

  protected createError(
    code: string, 
    message: string, 
    retryable: boolean = true,
    details?: any
  ): AIServiceError {
    return {
      code,
      message,
      retryable,
      details
    }
  }

  protected logError(error: AIServiceError, context?: string): void {
    console.error(`[${this.type}] ${context || 'AI Service Error'}:`, error)
    
    // 显示用户友好的错误消息
    if (!error.retryable) {
      this.notification.showError(error.message)
    }
  }

  protected logInfo(message: string, data?: any): void {
    console.log(`[${this.type}] ${message}`, data || '')
  }

  // 公共验证方法
  protected async validateImageUrl(imageUrl: string): Promise<boolean> {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return false
    }

    try {
      // 基础URL格式验证
      const url = new URL(imageUrl)
      
      // 检查是否为HTTP/HTTPS
      if (!['http:', 'https:'].includes(url.protocol)) {
        return false
      }

      // 可选：检查图片是否可访问（但可能影响性能）
      if (this.config.validateImageAccess) {
        const response = await fetch(imageUrl, { method: 'HEAD' })
        return response.ok && response.headers.get('content-type')?.startsWith('image/')
      }

      return true
    } catch {
      return false
    }
  }

  protected async validateFileSize(imageUrl: string, maxSize?: number): Promise<boolean> {
    if (!maxSize) return true

    try {
      const response = await fetch(imageUrl, { method: 'HEAD' })
      const contentLength = response.headers.get('content-length')
      
      if (contentLength) {
        const size = parseInt(contentLength, 10)
        return size <= maxSize
      }
      
      return true // 无法获取大小时默认通过
    } catch {
      return true
    }
  }

  // 任务生命周期钩子
  protected onTaskStart(taskId: string): void {
    this.logInfo(`Task started: ${taskId}`)
    // 可以在这里触发回调或事件
  }

  protected onTaskProgress(taskId: string, progress: number): void {
    this.logInfo(`Task progress: ${taskId} - ${progress}%`)
    // 可以在这里触发进度回调
  }

  protected onTaskComplete(taskId: string, result: AIProcessingResult): void {
    this.logInfo(`Task completed: ${taskId}`, result)
    this.callbacks?.onComplete?.({ 
      id: taskId, 
      result,
      status: 'completed'
    } as any)
  }

  protected onTaskError(taskId: string, error: AIServiceError): void {
    this.logError(error, `Task failed: ${taskId}`)
    this.callbacks?.onError?.({ 
      id: taskId, 
      error,
      status: 'failed'
    } as any)
  }
}

// 扩展配置接口
declare module '../types/ai-service.types' {
  interface AIServiceConfig {
    validateImageAccess?: boolean
    maxImageSize?: number
    retryDelay?: number
  }
}
