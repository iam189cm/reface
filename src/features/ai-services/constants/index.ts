/**
 * AI服务相关常量
 */

import type { AIServiceType, AIServicePriority } from '../types/ai-service.types'
import type { RemoveBgSize, RemoveBgType } from '../types/background-remover.types'
import type { EnlargeScale, EnlargeMode } from '../types/image-enlarger.types'

// 支持的AI服务类型
export const SUPPORTED_AI_SERVICES: AIServiceType[] = [
  'remove_background',
  'enlarge_image'
]

// AI服务优先级
export const AI_SERVICE_PRIORITIES: Record<string, AIServicePriority> = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent'
}

// 默认服务配置
export const DEFAULT_AI_SERVICE_CONFIG = {
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  validateImageAccess: false,
  maxImageSize: 10 * 1024 * 1024 // 10MB
}

// Remove.bg 相关常量
export const REMOVE_BG_CONFIG = {
  API_URL: 'https://api.remove.bg/v1.0/removebg',
  ACCOUNT_URL: 'https://api.remove.bg/v1.0/account',
  DEFAULT_SIZE: 'preview' as RemoveBgSize,
  DEFAULT_TYPE: 'auto' as RemoveBgType,
  SUPPORTED_SIZES: ['preview', 'full', 'auto'] as const,
  SUPPORTED_TYPES: ['auto', 'person', 'product', 'car'] as const,
  MAX_FILE_SIZE: 12 * 1024 * 1024, // 12MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
}

// VanceAI 相关常量
export const VANCE_AI_CONFIG = {
  BASE_URL: 'https://api-service.vanceai.com/web_api/v1',
  DEFAULT_SCALE: 2 as EnlargeScale,
  DEFAULT_MODE: 'enhance' as EnlargeMode,
  SUPPORTED_SCALES: [2, 4, 6, 8] as const,
  SUPPORTED_MODES: ['enhance', 'denoise', 'sharpen'] as const,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_PROCESSING_TIME: 5 * 60 * 1000, // 5分钟
  POLLING_INTERVAL: 3000 // 3秒
}

// 错误码映射
export const AI_SERVICE_ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CANCELLED: 'CANCELLED',

  // 参数错误
  MISSING_IMAGE_URL: 'MISSING_IMAGE_URL',
  INVALID_IMAGE_URL: 'INVALID_IMAGE_URL',
  MISSING_API_KEY: 'MISSING_API_KEY',
  INVALID_SCALE: 'INVALID_SCALE',

  // API错误
  API_ERROR: 'API_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  IMAGE_FETCH_ERROR: 'IMAGE_FETCH_ERROR',
  INVALID_IMAGE_TYPE: 'INVALID_IMAGE_TYPE',

  // 服务特定错误
  REMOVE_BG_ERROR: 'REMOVE_BG_ERROR',
  VANCE_AI_ERROR: 'VANCE_AI_ERROR'
}

// 错误消息映射
export const ERROR_MESSAGES = {
  [AI_SERVICE_ERROR_CODES.UNKNOWN_ERROR]: '未知错误',
  [AI_SERVICE_ERROR_CODES.NETWORK_ERROR]: '网络连接错误',
  [AI_SERVICE_ERROR_CODES.TIMEOUT]: '请求超时',
  [AI_SERVICE_ERROR_CODES.CANCELLED]: '任务已取消',
  [AI_SERVICE_ERROR_CODES.MISSING_IMAGE_URL]: '图片URL不能为空',
  [AI_SERVICE_ERROR_CODES.INVALID_IMAGE_URL]: '无效的图片URL',
  [AI_SERVICE_ERROR_CODES.MISSING_API_KEY]: 'API密钥未配置',
  [AI_SERVICE_ERROR_CODES.INVALID_SCALE]: '无效的缩放比例',
  [AI_SERVICE_ERROR_CODES.API_ERROR]: 'API调用失败',
  [AI_SERVICE_ERROR_CODES.QUOTA_EXCEEDED]: '配额已用完',
  [AI_SERVICE_ERROR_CODES.PROCESSING_FAILED]: '处理失败',
  [AI_SERVICE_ERROR_CODES.IMAGE_FETCH_ERROR]: '无法获取图片',
  [AI_SERVICE_ERROR_CODES.INVALID_IMAGE_TYPE]: '无效的图片类型'
}

// 服务名称映射
export const SERVICE_NAMES = {
  remove_background: '背景移除',
  enlarge_image: '图片放大',
  enhance_image: '图片增强',
  style_transfer: '风格转换'
}

// 任务状态映射
export const TASK_STATUS_NAMES = {
  idle: '空闲',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
  cancelled: '已取消'
}

// 性能指标
export const PERFORMANCE_METRICS = {
  // Remove.bg 平均处理时间（毫秒）
  REMOVE_BG_AVG_TIME: 5000,
  
  // VanceAI 平均处理时间（毫秒）
  VANCE_AI_AVG_TIME: 30000,
  
  // 重试间隔递增因子
  RETRY_BACKOFF_FACTOR: 2,
  
  // 最大重试间隔（毫秒）
  MAX_RETRY_DELAY: 10000
}
