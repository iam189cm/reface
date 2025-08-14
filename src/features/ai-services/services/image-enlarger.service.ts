/**
 * 图片放大服务
 * 基于VanceAI API实现
 */

import { AIServiceBase } from './ai-service-base.service'
import type { 
  AIServiceStatus,
  AIProcessingParams,
  AIProcessingResult
} from '../types/ai-service.types'
import type {
  ImageEnlargeParams,
  ImageEnlargeResult,
  VanceAIConfig,
  VanceAITaskResponse,
  VanceAICreateTaskParams,
  VanceAITaskStatus,
  VanceAIError
} from '../types/image-enlarger.types'

export class ImageEnlargerService extends AIServiceBase {
  private readonly baseUrl: string
  private activeTasks = new Map<string, { jid: string; abortController: AbortController }>()

  constructor(config: VanceAIConfig) {
    super('enlarge_image', {
      apiKey: config.apiKey,
      endpoint: config.baseUrl || 'https://api-service.vanceai.com/web_api/v1',
      timeout: config.timeout || 120000, // 图片放大通常需要更长时间
      maxRetries: config.maxRetries || 3
    })
    
    this.baseUrl = this.config.endpoint
  }

  async process(params: AIProcessingParams): Promise<AIProcessingResult> {
    const taskId = this.generateTaskId()
    const enlargeParams = params as ImageEnlargeParams
    
    this.onTaskStart(taskId)

    try {
      // 验证参数
      await this.validateParams(enlargeParams)

      // 创建取消控制器
      const abortController = new AbortController()

      // 创建VanceAI任务
      const vanceTaskId = await this.createVanceAITask(enlargeParams, abortController.signal)
      
      // 保存任务信息
      this.activeTasks.set(taskId, { jid: vanceTaskId, abortController })

      // 轮询任务状态
      const result = await this.pollTaskStatus(vanceTaskId, abortController.signal)
      
      // 清理任务
      this.activeTasks.delete(taskId)
      
      // 构建结果
      const processedResult: ImageEnlargeResult = {
        id: taskId,
        serviceType: 'enlarge_image',
        status: 'completed',
        inputImageUrl: enlargeParams.imageUrl,
        outputImageUrl: result.outputUrl,
        processingTime: result.processingTime,
        creditsConsumed: result.creditsConsumed,
        metadata: {
          originalSize: result.originalSize,
          processedSize: result.processedSize,
          scale: enlargeParams.scale,
          mode: enlargeParams.mode || 'enhance',
          processingModel: 'VanceAI-v3'
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
    const taskInfo = this.activeTasks.get(taskId)
    if (taskInfo) {
      // 取消VanceAI任务
      try {
        await this.cancelVanceAITask(taskInfo.jid)
      } catch (error) {
        this.logError(this.handleError(error as Error), 'Cancel VanceAI task')
      }
      
      // 取消本地请求
      taskInfo.abortController.abort()
      this.activeTasks.delete(taskId)
      this.logInfo(`Task cancelled: ${taskId}`)
    }
  }

  async getStatus(taskId: string): Promise<AIServiceStatus> {
    const taskInfo = this.activeTasks.get(taskId)
    if (!taskInfo) return 'completed'

    try {
      const status = await this.getVanceAITaskStatus(taskInfo.jid)
      return this.mapVanceAIStatus(status)
    } catch {
      return 'failed'
    }
  }

  async validateParams(params: AIProcessingParams): Promise<boolean> {
    const enlargeParams = params as ImageEnlargeParams

    // 验证必需参数
    if (!enlargeParams.imageUrl) {
      throw this.createError('MISSING_IMAGE_URL', '图片URL不能为空', false)
    }

    if (!enlargeParams.scale || ![2, 4, 6, 8].includes(enlargeParams.scale)) {
      throw this.createError('INVALID_SCALE', '放大倍数必须是2、4、6或8', false)
    }

    // 验证图片URL格式
    if (!await this.validateImageUrl(enlargeParams.imageUrl)) {
      throw this.createError('INVALID_IMAGE_URL', '无效的图片URL', false)
    }

    // 验证API Key
    if (!this.config.apiKey) {
      throw this.createError('MISSING_API_KEY', 'VanceAI API Key未配置', false)
    }

    return true
  }

  // 创建VanceAI任务
  private async createVanceAITask(
    params: ImageEnlargeParams, 
    signal?: AbortSignal
  ): Promise<string> {
    const createParams: VanceAICreateTaskParams = {
      img_url: params.imageUrl,
      config: {
        scale: params.scale,
        mode: params.mode || 'enhance',
        denoise: params.denoise || false,
        sharpen: params.sharpen || false,
        face_enhance: params.faceEnhance || false
      }
    }

    const response = await fetch(`${this.baseUrl}/transform`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': this.config.apiKey
      },
      body: JSON.stringify(createParams),
      signal
    })

    const data: VanceAITaskResponse = await response.json()

    if (!response.ok || data.code !== 200) {
      const error: VanceAIError = data as any
      throw this.createError(
        `VANCE_API_ERROR_${error.code}`,
        error.msg || 'VanceAI API错误',
        error.code >= 500
      )
    }

    if (!data.data.jid) {
      throw this.createError('INVALID_TASK_RESPONSE', '创建任务失败：缺少任务ID', false)
    }

    return data.data.jid
  }

  // 轮询任务状态
  private async pollTaskStatus(
    jid: string, 
    signal?: AbortSignal
  ): Promise<{
    outputUrl: string
    processingTime: number
    creditsConsumed: number
    originalSize: { width: number; height: number }
    processedSize: { width: number; height: number }
  }> {
    const startTime = Date.now()
    const maxPollingTime = 5 * 60 * 1000 // 5分钟最大等待时间
    const pollingInterval = 3000 // 3秒轮询间隔

    while (Date.now() - startTime < maxPollingTime) {
      if (signal?.aborted) {
        throw new Error('Task cancelled')
      }

      try {
        const status = await this.getVanceAITaskStatus(jid)
        
        if (status.status === 'finished' && status.img_url) {
          // 任务完成，获取结果
          const processingTime = Date.now() - startTime
          
          // 获取原始图片尺寸
          const originalBlob = await this.fetchImage(status.img_url)
          const originalSize = await this.getImageDimensions(originalBlob)
          
          // 计算处理后尺寸（基于缩放比例）
          const processedSize = {
            width: originalSize.width, // VanceAI返回的通常是处理后的图片
            height: originalSize.height
          }
          
          return {
            outputUrl: status.img_url,
            processingTime,
            creditsConsumed: 1, // VanceAI通常每个任务消耗1个配额
            originalSize,
            processedSize
          }
        }
        
        if (status.status === 'failed') {
          throw this.createError('PROCESSING_FAILED', '图片处理失败', false)
        }

        // 更新进度
        if (status.progress !== undefined) {
          this.onTaskProgress(jid, status.progress)
        }

        // 等待下次轮询
        await this.delay(pollingInterval)

      } catch (error) {
        if ((error as Error).message === 'Task cancelled') {
          throw error
        }
        
        // 轮询错误不应该立即失败，继续尝试
        this.logError(this.handleError(error as Error), `Polling error for task ${jid}`)
        await this.delay(pollingInterval)
      }
    }

    throw this.createError('TIMEOUT', '任务处理超时', true)
  }

  // 获取VanceAI任务状态
  private async getVanceAITaskStatus(jid: string): Promise<VanceAITaskResponse['data']> {
    const response = await fetch(`${this.baseUrl}/query_by_jid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': this.config.apiKey
      },
      body: JSON.stringify({ jid })
    })

    const data: VanceAITaskResponse = await response.json()

    if (!response.ok || data.code !== 200) {
      const error: VanceAIError = data as any
      throw this.createError(
        `VANCE_STATUS_ERROR_${error.code}`,
        error.msg || '查询任务状态失败',
        error.code >= 500
      )
    }

    return data.data
  }

  // 取消VanceAI任务
  private async cancelVanceAITask(jid: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': this.config.apiKey
        },
        body: JSON.stringify({ jid })
      })

      const data = await response.json()
      
      if (!response.ok || data.code !== 200) {
        throw new Error(data.msg || '取消任务失败')
      }
    } catch (error) {
      // 取消失败不是致命错误
      this.logInfo(`Failed to cancel VanceAI task ${jid}: ${(error as Error).message}`)
    }
  }

  // 映射VanceAI状态到AI服务状态
  private mapVanceAIStatus(status: VanceAITaskStatus): AIServiceStatus {
    switch (status) {
      case 'pending':
      case 'processing':
        return 'processing'
      case 'finished':
        return 'completed'
      case 'failed':
        return 'failed'
      default:
        return 'idle'
    }
  }

  // 获取图片文件
  private async fetchImage(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw this.createError(
        'IMAGE_FETCH_ERROR',
        `无法获取图片: ${response.status} ${response.statusText}`,
        true
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

  // 公共方法：检查API余额
  async checkBalance(): Promise<{ balance: number; currency: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/get_balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': this.config.apiKey
        },
        body: JSON.stringify({})
      })

      const data = await response.json()
      
      if (!response.ok || data.code !== 200) {
        throw new Error(data.msg || '查询余额失败')
      }

      return {
        balance: data.data.balance || 0,
        currency: data.data.currency || 'USD'
      }
    } catch (error) {
      throw this.createError(
        'BALANCE_CHECK_ERROR',
        '无法获取API余额信息',
        true,
        error
      )
    }
  }
}
