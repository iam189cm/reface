/**
 * 通用类型定义
 */

// 基础类型
export type ID = string | number
export type Timestamp = string
export type Language = 'zh-CN' | 'en-US'

// API响应基础结构
export interface BaseResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页数据结构
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 加载状态
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// 用户类型
export type UserType = 'FREE' | 'PREMIUM' | 'ADMIN' | 'BANNED'

// AI服务类型
export type AIServiceType = 'remove_background' | 'enlarge_image' | 'image_filter'

// 文件上传状态
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: any
}

// 用户基础信息
export interface User {
  id: ID
  email: string
  phone?: string
  avatar_url?: string
  user_type: UserType
  credits_used: number
  total_quota: number
  created_at: Timestamp
  updated_at: Timestamp
}

// 图片信息
export interface ImageInfo {
  id: ID
  url: string
  originalName: string
  size: number
  width: number
  height: number
  format: string
  uploadedAt: Timestamp
}

// AI处理结果
export interface AIProcessResult {
  id: ID
  serviceType: AIServiceType
  originalImage: ImageInfo
  processedImage?: ImageInfo
  status: 'processing' | 'completed' | 'failed'
  creditsConsumed: number
  processedAt?: Timestamp
  error?: string
}
