/**
 * 图片放大服务类型定义  
 */

import type { AIProcessingParams, AIProcessingResult } from './ai-service.types'

// 放大倍数选项
export type EnlargeScale = 2 | 4 | 6 | 8

// 放大模式
export type EnlargeMode = 'enhance' | 'denoise' | 'sharpen'

// 图片放大参数
export interface ImageEnlargeParams extends AIProcessingParams {
  scale: EnlargeScale
  mode?: EnlargeMode
  denoise?: boolean
  sharpen?: boolean
  faceEnhance?: boolean
}

// 图片放大结果
export interface ImageEnlargeResult extends AIProcessingResult {
  serviceType: 'enlarge_image'
  metadata: {
    originalSize: { width: number; height: number }
    processedSize: { width: number; height: number }
    scale: EnlargeScale
    mode: EnlargeMode
    processingModel: string
  }
}

// VanceAI 配置
export interface VanceAIConfig {
  apiKey: string
  baseUrl: string
  timeout: number
  maxRetries: number
  defaultScale: EnlargeScale
  defaultMode: EnlargeMode
}

// VanceAI 任务状态
export type VanceAITaskStatus = 'pending' | 'processing' | 'finished' | 'failed'

// VanceAI API 任务响应
export interface VanceAITaskResponse {
  code: number
  msg: string
  data: {
    uid: string
    jid: string
    status: VanceAITaskStatus
    img_url?: string
    progress?: number
  }
}

// VanceAI 创建任务参数
export interface VanceAICreateTaskParams {
  img_url: string
  config: {
    scale: EnlargeScale
    mode: EnlargeMode
    denoise: boolean
    sharpen: boolean
    face_enhance: boolean
  }
  webhook_url?: string
}

// VanceAI 错误响应
export interface VanceAIError {
  code: number
  msg: string
  detail?: string
}
