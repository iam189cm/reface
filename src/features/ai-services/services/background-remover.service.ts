/**
 * 背景移除服务
 * 基于Remove.bg API实现
 */

import { AIServiceBase } from './ai-service-base.service'
import type { 
  AIServiceStatus,
  AIProcessingParams,
  AIProcessingResult
} from '../types/ai-service.types'
import type {
  BackgroundRemoveParams,
  BackgroundRemoveResult,
  RemoveBgConfig,
  RemoveBgApiResponse,
  RemoveBgErrorResponse,
  RemoveBgQuota
} from '../types/background-remover.types'

export class BackgroundRemoverService extends AIServiceBase {
  private readonly apiUrl = 'https://api.remove.bg/v1.0/removebg'
  private activeTasks = new Map<string, AbortController>()

  constructor(config: RemoveBgConfig) {
    super('remove_background', {
      apiKey: config.apiKey,
      endpoint: config.baseUrl || 'https://api.remove.bg/v1.0',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3
    })
  }

  async process(params: AIProcessingParams): Promise<AIProcessingResult> {
    const taskId = this.generateTaskId()
    const removeParams = params as BackgroundRemoveParams
    
    this.onTaskStart(taskId)

    try {
      // 验证参数
      await this.validateParams(removeParams)

      // 创建取消控制器
      const abortController = new AbortController()
      this.activeTasks.set(taskId, abortController)

      // 执行背景移除
      const result = await this.removeBackground(removeParams, abortController.signal)
      
      // 清理任务
      this.activeTasks.delete(taskId)
      
      // 构建结果
      const processedResult: BackgroundRemoveResult = {
        id: taskId,
        serviceType: 'remove_background',
        status: 'completed',
        inputImageUrl: removeParams.imageUrl,
        outputImageUrl: result.outputUrl,
        processingTime: result.processingTime,
        creditsConsumed: result.creditsConsumed,
        metadata: {
          originalSize: result.originalSize,
          processedSize: result.processedSize,
          detectedType: result.detectedType || 'unknown',
          confidence: result.confidence || 0,
          apiVersion: '1.0'
        },
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }

      this.onTaskComplete(taskId, processedResult)
      return processedResult

    } catch (error) {
      // 清理任务
      this.activeTasks.delete(taskId)
      
      const aiError = this.handleError(error as Error)
      this.onTaskError(taskId, aiError)
      throw aiError
    }
  }

  async cancel(taskId: string): Promise<void> {
    const controller = this.activeTasks.get(taskId)
    if (controller) {
      controller.abort()
      this.activeTasks.delete(taskId)
      this.logInfo(`Task cancelled: ${taskId}`)
    }
  }

  async getStatus(taskId: string): Promise<AIServiceStatus> {
    // Remove.bg是同步API，没有轮询状态的概念
    return this.activeTasks.has(taskId) ? 'processing' : 'completed'
  }

  async validateParams(params: AIProcessingParams): Promise<boolean> {
    const removeParams = params as BackgroundRemoveParams

    // 验证必需参数
    if (!removeParams.imageUrl) {
      throw this.createError('MISSING_IMAGE_URL', '图片URL不能为空', false)
    }

    // 验证图片URL格式
    if (!await this.validateImageUrl(removeParams.imageUrl)) {
      throw this.createError('INVALID_IMAGE_URL', '无效的图片URL', false)
    }

    // 验证API Key
    if (!this.config.apiKey) {
      throw this.createError('MISSING_API_KEY', 'Remove.bg API Key未配置', false)
    }

    return true
  }

  // 执行背景移除的核心方法
  private async removeBackground(
    params: BackgroundRemoveParams, 
    signal?: AbortSignal
  ): Promise<{
    outputUrl: string
    processingTime: number
    creditsConsumed: number
    originalSize: { width: number; height: number }
    processedSize: { width: number; height: number }
    detectedType?: string
    confidence?: number
  }> {
    const startTime = Date.now()

    // 获取图片文件
    const imageBlob = await this.fetchImage(params.imageUrl, signal)
    
    // 构建表单数据
    const formData = new FormData()
    formData.append('image_file', imageBlob)
    formData.append('size', params.size || 'preview')
    
    if (params.type) {
      formData.append('type', params.type)
    }
    if (params.crop !== undefined) {
      formData.append('crop', params.crop.toString())
    }
    if (params.position) {
      formData.append('position', params.position)
    }
    if (params.channels) {
      formData.append('channels', params.channels)
    }

    // 发送API请求
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'X-Api-Key': this.config.apiKey
      },
      body: formData,
      signal
    })

    const processingTime = Date.now() - startTime

    if (!response.ok) {
      await this.handleApiError(response)
    }

    // 处理成功响应
    const resultBlob = await response.blob()
    const outputUrl = URL.createObjectURL(resultBlob)

    // 获取图片尺寸信息
    const originalSize = await this.getImageDimensions(imageBlob)
    const processedSize = await this.getImageDimensions(resultBlob)

    // 从响应头获取消耗的配额信息
    const creditsConsumed = parseInt(
      response.headers.get('X-Credits-Charged') || '1',
      10
    )

    return {
      outputUrl,
      processingTime,
      creditsConsumed,
      originalSize,
      processedSize
    }
  }

  // 获取图片文件
  private async fetchImage(imageUrl: string, signal?: AbortSignal): Promise<Blob> {
    const response = await fetch(imageUrl, { signal })
    
    if (!response.ok) {
      throw this.createError(
        'IMAGE_FETCH_ERROR',
        `无法获取图片: ${response.status} ${response.statusText}`,
        true
      )
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.startsWith('image/')) {
      throw this.createError(
        'INVALID_IMAGE_TYPE',
        'URL指向的不是图片文件',
        false
      )
    }

    return await response.blob()
  }

  // 获取图片尺寸
  private async getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)
      
      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('无法获取图片尺寸'))
      }
      
      img.src = url
    })
  }

  // 处理API错误
  private async handleApiError(response: Response): Promise<never> {
    let errorData: RemoveBgErrorResponse
    
    try {
      errorData = await response.json()
    } catch {
      throw this.createError(
        'API_ERROR',
        `Remove.bg API错误: ${response.status} ${response.statusText}`,
        response.status >= 500
      )
    }

    const error = errorData.errors?.[0]
    if (error) {
      throw this.createError(
        error.code || 'API_ERROR',
        error.title || error.detail || 'Remove.bg API错误',
        response.status >= 500
      )
    }

    throw this.createError(
      'UNKNOWN_API_ERROR',
      'Remove.bg API未知错误',
      true
    )
  }

  // 通用错误处理
  private handleError(error: Error): any {
    if (error.name === 'AbortError') {
      return this.createError('CANCELLED', '任务已取消', false)
    }

    if (error.message?.includes('timeout')) {
      return this.createError('TIMEOUT', 'API请求超时', true)
    }

    if (error.message?.includes('network')) {
      return this.createError('NETWORK_ERROR', '网络连接错误', true)
    }

    // 如果已经是AIServiceError，直接返回
    if ((error as any).code) {
      return error
    }

    return this.createError(
      'UNKNOWN_ERROR',
      error.message || '未知错误',
      true
    )
  }

  // 公共方法：检查API配额
  async checkQuota(): Promise<RemoveBgQuota> {
    try {
      const response = await fetch('https://api.remove.bg/v1.0/account', {
        headers: {
          'X-Api-Key': this.config.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`配额查询失败: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        total: data.data.attributes.credits.total,
        remaining: data.data.attributes.credits.remaining,
        used: data.data.attributes.credits.total - data.data.attributes.credits.remaining,
        resetDate: data.data.attributes.credits.reset_date
      }
    } catch (error) {
      throw this.createError(
        'QUOTA_CHECK_ERROR',
        '无法获取API配额信息',
        true,
        error
      )
    }
  }
}
