/**
 * 图片处理相关常量
 */

import type { ImageValidationRule } from '../types/image.types'

// 默认上传配置
export const DEFAULT_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpeg', 'png', 'webp'] as const,
  timeout: 30000,
  maxRetries: 3
} as const

// 图片验证规则
export const IMAGE_VALIDATION_RULES: ImageValidationRule = {
  maxSize: DEFAULT_UPLOAD_CONFIG.maxSize,
  allowedFormats: [...DEFAULT_UPLOAD_CONFIG.allowedFormats],
  maxDimensions: { width: 4000, height: 4000 },
  minDimensions: { width: 10, height: 10 }
}

// 支持的图片格式
export const SUPPORTED_IMAGE_FORMATS = {
  'image/jpeg': { extension: '.jpg', name: 'JPEG' },
  'image/png': { extension: '.png', name: 'PNG' },
  'image/webp': { extension: '.webp', name: 'WebP' },
  'image/gif': { extension: '.gif', name: 'GIF' }
} as const

// 默认编辑器配置
export const DEFAULT_EDITOR_CONFIG = {
  maxHistorySize: 10,
  enableUndo: true,
  enableRedo: true,
  defaultTool: 'select' as const,
  allowedTools: ['select', 'crop', 'rotate', 'flip', 'filter', 'adjust'] as const
}

// 默认图片变换
export const DEFAULT_TRANSFORM = {
  scale: 1,
  rotation: 0,
  flipX: false,
  flipY: false,
  position: { x: 0, y: 0 }
}

// 默认图片滤镜
export const DEFAULT_FILTER = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sharpness: 0
}
