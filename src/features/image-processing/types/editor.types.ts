/**
 * 图片编辑器类型定义
 */

import type { ImageData } from './image.types'

// 编辑器工具类型
export type EditorTool = 'select' | 'crop' | 'rotate' | 'flip' | 'filter' | 'adjust'

// 图片变换
export interface ImageTransform {
  scale: number
  rotation: number
  flipX: boolean
  flipY: boolean
  position: {
    x: number
    y: number
  }
}

// 裁剪区域
export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

// 图片滤镜
export interface ImageFilter {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  sharpness: number
}

// 编辑器状态
export interface EditorState {
  currentTool: EditorTool
  originalImage?: ImageData
  currentImage?: ImageData
  history: ImageData[]
  historyIndex: number
  transform: ImageTransform
  cropArea?: CropArea
  filter: ImageFilter
  isModified: boolean
}

// 编辑器操作
export type EditorAction = 
  | { type: 'SET_IMAGE'; payload: ImageData }
  | { type: 'SET_TOOL'; payload: EditorTool }
  | { type: 'APPLY_TRANSFORM'; payload: Partial<ImageTransform> }
  | { type: 'APPLY_CROP'; payload: CropArea }
  | { type: 'APPLY_FILTER'; payload: Partial<ImageFilter> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }

// 编辑器配置
export interface EditorConfig {
  maxHistorySize: number
  enableUndo: boolean
  enableRedo: boolean
  defaultTool: EditorTool
  allowedTools: EditorTool[]
}
