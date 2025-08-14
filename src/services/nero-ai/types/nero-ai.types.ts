/**
 * Nero AI 服务类型定义
 */

// Nero AI 支持的服务类型
export type NeroAIServiceType = 
  | 'ImageUpscaler:Standard'
  | 'ImageUpscaler:Photograph' 
  | 'ImageUpscaler:Anime'
  | 'ImageUpscaler:FaceEnhancement'
  | 'BackgroundRemover'
  | 'BackgroundChanger'
  | 'ScratchFix'
  | 'ColorizePhoto'
  | 'FaceRestoration'
  | 'FaceAnimation:Detection'
  | 'FaceAnimation:Generation'
  | 'FaceDetection'
  | 'ImageDenoiser'
  | 'ImageCompressor'
  | 'ImageToImage'
  | 'ObjectCounter'
  | 'Cartoon'

// 处理参数接口
export interface NeroAIProcessParams {
  type: NeroAIServiceType
  body: {
    image?: string
    image_file?: File
    // ImageUpscaler 参数
    quality_factor?: number
    presigned_url?: string
    upscaling_rate?: number
    // BackgroundRemover 参数
    size?: 'preview' | 'small' | 'regular' | 'medium' | 'hd' | 'full'
    type_hint?: 'auto' | 'person' | 'product' | 'car'
    crop?: boolean
    position?: string
    channels?: string
    // ScratchFix 参数
    mask?: string
    // ColorizePhoto 参数 (无特殊参数)
    // FaceRestoration 参数
    fidelity?: number
    // ImageDenoiser 参数
    denoise_level?: number
    // ImageCompressor 参数
    compression_level?: number
    // 通用参数
    [key: string]: any
  }
  info?: {
    webhook?: string
    user_id?: string
    task_name?: string
  }
}

// API 响应接口
export interface NeroAIResponse {
  code: number
  data?: {
    task_id: string
    status?: 'pending' | 'running' | 'done' | 'failed'
    result?: {
      output?: string
      outputs?: string[]
      [key: string]: any
    }
    progress?: number
    pending_count?: number
    msg?: string
  }
  msg?: string
}

// 处理结果接口
export interface NeroAIResult {
  task_id: string
  service_type: NeroAIServiceType
  status: 'pending' | 'running' | 'done' | 'failed'
  result?: {
    output?: string
    outputs?: string[]
    processing_time?: number
    credits_consumed?: number
    original_size?: { width: number; height: number }
    processed_size?: { width: number; height: number }
    [key: string]: any
  }
  progress?: number
  pending_count?: number
  error_message?: string
  created_at: string
  completed_at?: string
}

// 批量处理结果
export interface BatchProcessResult {
  total_tasks: number
  completed_tasks: number
  failed_tasks: number
  results: Array<{
    index: number
    success: boolean
    result?: NeroAIResult
    error?: string
  }>
  processing_time: number
}

// Webhook 回调数据
export interface WebhookCallbackData {
  task_id: string
  status: 'done' | 'failed'
  result?: {
    output?: string
    outputs?: string[]
    [key: string]: any
  }
  error_message?: string
}

// 配置接口
export interface NeroAIConfig {
  apiKey: string
  baseUrl?: string
  timeout?: number
  maxRetries?: number
  webhookUrl?: string
}

// 任务状态
export interface TaskInfo {
  id: string
  service_type: NeroAIServiceType
  status: 'pending' | 'running' | 'done' | 'failed'
  created_at: string
  updated_at: string
  progress?: number
  estimated_time?: number
}

// 服务能力映射
export interface ServiceCapability {
  type: NeroAIServiceType
  name: string
  description: string
  category: 'background' | 'enhancement' | 'creative' | 'utility'
  icon: string
  supported_formats: string[]
  max_file_size: number
  average_processing_time: number
  credit_cost: number
  parameters?: Array<{
    name: string
    type: 'number' | 'string' | 'boolean' | 'select'
    required: boolean
    default?: any
    options?: any[]
    min?: number
    max?: number
  }>
}

// 错误类型
export interface NeroAIError {
  code: number
  message: string
  service_type?: NeroAIServiceType
  task_id?: string
  retryable: boolean
}

// 图片分析结果
export interface ImageAnalysis {
  has_faces: boolean
  face_count: number
  image_type: 'photo' | 'illustration' | 'product' | 'unknown'
  quality_score: number
  resolution: { width: number; height: number }
  file_size: number
  dominant_colors: string[]
  suggested_services: NeroAIServiceType[]
}

// 服务推荐
export interface ServiceRecommendation {
  service_type: NeroAIServiceType
  confidence: number
  reason: string
  priority: 'high' | 'medium' | 'low'
  estimated_improvement: string
}
