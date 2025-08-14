/**
 * 图片上传相关类型定义
 */

import type { ImageData, ImageValidationRule } from './image.types'

// 上传状态
export type UploadStatus = 'idle' | 'pending' | 'uploading' | 'success' | 'error' | 'cancelled'

// 上传进度信息
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
  speed: number // bytes per second
  remainingTime: number // seconds
}

// 上传配置
export interface UploadConfig {
  endpoint: string
  method: 'POST' | 'PUT'
  headers?: Record<string, string>
  timeout: number
  chunkSize?: number
  maxRetries: number
  validationRules: ImageValidationRule
}

// 上传任务
export interface UploadTask {
  id: string
  file: File
  status: UploadStatus
  progress: UploadProgress
  result?: ImageData
  error?: string
  retries: number
  createdAt: number
  startedAt?: number
  completedAt?: number
}

// 拖拽上传状态
export interface DragDropState {
  isDragging: boolean
  isOver: boolean
  draggedFiles: File[]
}

// 上传事件
export type UploadEvent = 
  | { type: 'upload:start'; payload: { taskId: string; file: File } }
  | { type: 'upload:progress'; payload: { taskId: string; progress: UploadProgress } }
  | { type: 'upload:success'; payload: { taskId: string; result: ImageData } }
  | { type: 'upload:error'; payload: { taskId: string; error: string } }
  | { type: 'upload:cancel'; payload: { taskId: string } }
  | { type: 'upload:retry'; payload: { taskId: string } }

// 上传回调函数类型
export interface UploadCallbacks {
  onStart?: (task: UploadTask) => void
  onProgress?: (task: UploadTask) => void
  onSuccess?: (task: UploadTask) => void
  onError?: (task: UploadTask) => void
  onCancel?: (task: UploadTask) => void
}
