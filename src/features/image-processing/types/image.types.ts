/**
 * 图片相关类型定义
 */

import type { ID, Timestamp } from '@/shared/types'

// 图片格式
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'gif'

// 图片尺寸
export interface ImageDimensions {
  width: number
  height: number
}

// 图片基本信息
export interface ImageMetadata {
  name: string
  size: number
  format: ImageFormat
  dimensions: ImageDimensions
  lastModified: number
}

// 图片数据结构
export interface ImageData {
  id: ID
  url: string
  file?: File
  metadata: ImageMetadata
  thumbnail?: string
  createdAt: Timestamp
}

// 图片处理状态
export type ImageProcessingStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

// 图片处理结果
export interface ImageProcessingResult {
  originalImage: ImageData
  processedImage?: ImageData
  status: ImageProcessingStatus
  error?: string
  processingTime?: number
}

// 图片验证规则
export interface ImageValidationRule {
  maxSize?: number
  minSize?: number
  allowedFormats?: ImageFormat[]
  maxDimensions?: ImageDimensions
  minDimensions?: ImageDimensions
}

// 图片验证错误
export interface ImageValidationError {
  field: 'size' | 'format' | 'dimensions'
  message: string
  actualValue: any
  expectedValue: any
}
