/**
 * 背景移除服务类型定义
 */

import type { AIProcessingParams, AIProcessingResult } from './ai-service.types'

// Remove.bg API 尺寸选项
export type RemoveBgSize = 'preview' | 'full' | 'auto'

// Remove.bg API 类型选项
export type RemoveBgType = 'auto' | 'person' | 'product' | 'car'

// 背景移除参数
export interface BackgroundRemoveParams extends AIProcessingParams {
  size?: RemoveBgSize
  type?: RemoveBgType
  crop?: boolean
  position?: 'original' | 'center'
  channels?: 'rgba' | 'alpha'
}

// 背景移除结果
export interface BackgroundRemoveResult extends AIProcessingResult {
  serviceType: 'remove_background'
  metadata: {
    originalSize: { width: number; height: number }
    processedSize: { width: number; height: number }
    detectedType: string
    confidence: number
    apiVersion: string
  }
}

// Remove.bg API 配置
export interface RemoveBgConfig {
  apiKey: string
  baseUrl: string
  timeout: number
  maxRetries: number
  defaultSize: RemoveBgSize
  defaultType: RemoveBgType
}

// Remove.bg API 响应
export interface RemoveBgApiResponse {
  data: {
    result_b64: string
    foreground_top: number
    foreground_left: number
    foreground_width: number
    foreground_height: number
  }
  credits_charged: number
}

// Remove.bg 配额信息
export interface RemoveBgQuota {
  total: number
  remaining: number
  used: number
  resetDate: string
}

// Remove.bg API 错误
export interface RemoveBgError {
  code: string
  title: string
  detail: string
}

// Remove.bg API 错误响应
export interface RemoveBgErrorResponse {
  errors: RemoveBgError[]
}
