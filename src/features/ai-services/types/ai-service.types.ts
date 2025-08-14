/**
 * AI服务基础类型定义
 */

import type { ID, Timestamp, BaseResponse } from '@/shared/types'

// AI服务类型
export type AIServiceType = 'remove_background' | 'enlarge_image' | 'enhance_image' | 'style_transfer'

// AI服务状态
export type AIServiceStatus = 'idle' | 'processing' | 'completed' | 'failed' | 'cancelled'

// AI服务优先级
export type AIServicePriority = 'low' | 'normal' | 'high' | 'urgent'

// AI服务配置
export interface AIServiceConfig {
  apiKey: string
  endpoint: string
  timeout: number
  maxRetries: number
  retryDelay: number
}

// AI处理参数基础接口
export interface AIProcessingParams {
  imageUrl: string
  quality?: 'low' | 'medium' | 'high'
  format?: 'png' | 'jpg' | 'webp'
  [key: string]: any
}

// AI处理结果基础接口
export interface AIProcessingResult {
  id: ID
  serviceType: AIServiceType
  status: AIServiceStatus
  inputImageUrl: string
  outputImageUrl?: string
  processingTime: number
  creditsConsumed: number
  error?: AIServiceError
  metadata?: Record<string, any>
  createdAt: Timestamp
  completedAt?: Timestamp
}

// AI服务错误
export interface AIServiceError {
  code: string
  message: string
  details?: any
  retryable: boolean
}

// AI服务任务
export interface AIServiceTask {
  id: ID
  serviceType: AIServiceType
  params: AIProcessingParams
  status: AIServiceStatus
  priority: AIServicePriority
  result?: AIProcessingResult
  error?: AIServiceError
  progress: number
  retries: number
  maxRetries: number
  createdAt: Timestamp
  startedAt?: Timestamp
  completedAt?: Timestamp
}

// AI服务响应
export interface AIServiceResponse<T = any> extends BaseResponse {
  data: {
    taskId: ID
    result?: T
    creditsConsumed: number
    processingTime: number
    status: AIServiceStatus
  }
}

// AI服务事件类型
export type AIServiceEvent =
  | { type: 'task:created'; payload: { taskId: ID; serviceType: AIServiceType } }
  | { type: 'task:started'; payload: { taskId: ID } }
  | { type: 'task:progress'; payload: { taskId: ID; progress: number } }
  | { type: 'task:completed'; payload: { taskId: ID; result: AIProcessingResult } }
  | { type: 'task:failed'; payload: { taskId: ID; error: AIServiceError } }
  | { type: 'task:cancelled'; payload: { taskId: ID } }

// AI服务回调函数类型
export interface AIServiceCallbacks {
  onStart?: (task: AIServiceTask) => void
  onProgress?: (task: AIServiceTask) => void
  onComplete?: (task: AIServiceTask) => void
  onError?: (task: AIServiceTask) => void
  onCancel?: (task: AIServiceTask) => void
}

// AI服务基础接口
export interface IAIService {
  readonly type: AIServiceType
  readonly config: AIServiceConfig
  
  process(params: AIProcessingParams): Promise<AIProcessingResult>
  cancel(taskId: ID): Promise<void>
  getStatus(taskId: ID): Promise<AIServiceStatus>
  validateParams(params: AIProcessingParams): Promise<boolean>
}

// AI服务管理器接口
export interface IAIServiceManager {
  registerService(service: IAIService): void
  getService(type: AIServiceType): IAIService | null
  getAllServices(): IAIService[]
  processTask(task: AIServiceTask): Promise<AIProcessingResult>
  cancelTask(taskId: ID): Promise<void>
  getTaskStatus(taskId: ID): Promise<AIServiceStatus>
}
