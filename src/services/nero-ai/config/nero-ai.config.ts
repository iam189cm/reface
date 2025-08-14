/**
 * Nero AI 配置和常量
 */

import type { NeroAIServiceType, ServiceCapability } from '../types/nero-ai.types'

// API 配置
export const NERO_AI_CONFIG = {
  BASE_URL: 'https://api.nero.com/biz/api',
  ENDPOINTS: {
    TASK: '/task',
    ACCOUNT: '/account',
    WEBHOOK: '/webhook'
  },
  DEFAULT_TIMEOUT: 120000, // 2分钟
  MAX_RETRIES: 3,
  RATE_LIMIT: 10, // 每秒最多10个请求
  
  // 轮询配置
  POLLING: {
    INTERVAL: 2000, // 2秒
    MAX_ATTEMPTS: 150, // 最多轮询5分钟
    TIMEOUT: 300000 // 5分钟总超时
  }
}

// 服务能力定义
export const SERVICE_CAPABILITIES: Record<NeroAIServiceType, ServiceCapability> = {
  'ImageUpscaler:Standard': {
    type: 'ImageUpscaler:Standard',
    name: '标准放大',
    description: '通用图片放大，适合各类图片',
    category: 'enhancement',
    icon: '🔍',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024, // 50MB
    average_processing_time: 30000, // 30秒
    credit_cost: 1,
    parameters: [
      {
        name: 'upscaling_rate',
        type: 'select',
        required: false,
        default: 4,
        options: [2, 4]
      },
      {
        name: 'quality_factor',
        type: 'number',
        required: false,
        default: 95,
        min: 80,
        max: 100
      }
    ]
  },
  
  'ImageUpscaler:Photograph': {
    type: 'ImageUpscaler:Photograph',
    name: '照片放大',
    description: '专为照片优化的放大算法',
    category: 'enhancement',
    icon: '📸',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 35000,
    credit_cost: 1
  },
  
  'ImageUpscaler:Anime': {
    type: 'ImageUpscaler:Anime',
    name: '动漫放大',
    description: '专为动漫、插画优化的放大算法',
    category: 'enhancement',
    icon: '🎨',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 35000,
    credit_cost: 1
  },
  
  'ImageUpscaler:FaceEnhancement': {
    type: 'ImageUpscaler:FaceEnhancement',
    name: '人脸增强',
    description: '专注于人脸细节的增强放大',
    category: 'enhancement',
    icon: '😊',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 40000,
    credit_cost: 1
  },
  
  'BackgroundRemover': {
    type: 'BackgroundRemover',
    name: '背景移除',
    description: '智能识别并移除图片背景',
    category: 'background',
    icon: '✂️',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 25000,
    credit_cost: 1,
    parameters: [
      {
        name: 'size',
        type: 'select',
        required: false,
        default: 'preview',
        options: ['preview', 'small', 'regular', 'medium', 'hd', 'full']
      },
      {
        name: 'type_hint',
        type: 'select',
        required: false,
        default: 'auto',
        options: ['auto', 'person', 'product', 'car']
      },
      {
        name: 'crop',
        type: 'boolean',
        required: false,
        default: false
      }
    ]
  },
  
  'BackgroundChanger': {
    type: 'BackgroundChanger',
    name: '背景更换',
    description: '智能更换图片背景',
    category: 'background',
    icon: '🌄',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 45000,
    credit_cost: 2
  },
  
  'ScratchFix': {
    type: 'ScratchFix',
    name: '划痕修复',
    description: '智能修复图片中的划痕和瑕疵',
    category: 'enhancement',
    icon: '🔧',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'heic', 'heif'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 35000,
    credit_cost: 1
  },
  
  'ColorizePhoto': {
    type: 'ColorizePhoto',
    name: '黑白上色',
    description: '为黑白照片智能添加颜色',
    category: 'creative',
    icon: '🎨',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'heic', 'heif'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 40000,
    credit_cost: 2
  },
  
  'FaceRestoration': {
    type: 'FaceRestoration',
    name: '面部修复',
    description: '修复模糊、损坏的面部细节',
    category: 'enhancement',
    icon: '😊',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'heic', 'heif'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 35000,
    credit_cost: 1,
    parameters: [
      {
        name: 'fidelity',
        type: 'number',
        required: false,
        default: 0.7,
        min: 0,
        max: 1
      }
    ]
  },
  
  'FaceAnimation:Detection': {
    type: 'FaceAnimation:Detection',
    name: '人脸检测',
    description: '检测图片中的人脸位置和特征',
    category: 'utility',
    icon: '👁️',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 10000,
    credit_cost: 0.5
  },
  
  'FaceAnimation:Generation': {
    type: 'FaceAnimation:Generation',
    name: '人脸动画',
    description: '为人脸生成动画效果',
    category: 'creative',
    icon: '🎭',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 60000,
    credit_cost: 3
  },
  
  'FaceDetection': {
    type: 'FaceDetection',
    name: '人脸检测',
    description: '检测并分析图片中的人脸',
    category: 'utility',
    icon: '🔍',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 8000,
    credit_cost: 0.5
  },
  
  'ImageDenoiser': {
    type: 'ImageDenoiser',
    name: '图像降噪',
    description: '降低图片噪点，提升画质',
    category: 'enhancement',
    icon: '✨',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 30000,
    credit_cost: 1,
    parameters: [
      {
        name: 'denoise_level',
        type: 'number',
        required: false,
        default: 5,
        min: 1,
        max: 10
      }
    ]
  },
  
  'ImageCompressor': {
    type: 'ImageCompressor',
    name: '图像压缩',
    description: '智能压缩图片文件大小',
    category: 'utility',
    icon: '📦',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 15000,
    credit_cost: 0.5,
    parameters: [
      {
        name: 'compression_level',
        type: 'number',
        required: false,
        default: 5,
        min: 1,
        max: 10
      }
    ]
  },
  
  'ImageToImage': {
    type: 'ImageToImage',
    name: '图像转换',
    description: '基于AI的图像风格转换',
    category: 'creative',
    icon: '🔄',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 50000,
    credit_cost: 2
  },
  
  'ObjectCounter': {
    type: 'ObjectCounter',
    name: '物体计数',
    description: '智能计数图片中的物体',
    category: 'utility',
    icon: '🔢',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 20000,
    credit_cost: 1
  },
  
  'Cartoon': {
    type: 'Cartoon',
    name: '卡通化',
    description: '将照片转换为卡通风格',
    category: 'creative',
    icon: '🎨',
    supported_formats: ['jpg', 'jpeg', 'png', 'bmp', 'webp'],
    max_file_size: 50 * 1024 * 1024,
    average_processing_time: 35000,
    credit_cost: 1
  }
}

// 服务分类
export const SERVICE_CATEGORIES = {
  background: {
    name: '背景处理',
    icon: '🎨',
    description: '背景移除、更换等功能'
  },
  enhancement: {
    name: '图像增强',
    icon: '✨',
    description: '图像放大、修复、降噪等功能'
  },
  creative: {
    name: '创意效果',
    icon: '🎭',
    description: '上色、卡通化、动画等创意功能'
  },
  utility: {
    name: '实用工具',
    icon: '🔧',
    description: '检测、计数、压缩等实用功能'
  }
} as const

// 错误码映射
export const ERROR_CODES = {
  11002: 'API密钥无效',
  11003: 'API密钥已过期',
  11004: 'API配额不足',
  400: '请求参数错误',
  401: '未授权访问',
  403: '访问被拒绝',
  404: '服务不存在',
  429: '请求频率过高',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂不可用'
} as const

// 默认参数配置
export const DEFAULT_PARAMS = {
  'ImageUpscaler:Standard': { upscaling_rate: 2, quality_factor: 95 },
  'ImageUpscaler:Photograph': { upscaling_rate: 2, quality_factor: 95 },
  'ImageUpscaler:Anime': { upscaling_rate: 2, quality_factor: 95 },
  'ImageUpscaler:FaceEnhancement': { upscaling_rate: 2, quality_factor: 95 },
  'BackgroundRemover': { size: 'preview', type_hint: 'auto', crop: false },
  'BackgroundChanger': {},
  'ScratchFix': {},
  'ColorizePhoto': {},
  'FaceRestoration': { fidelity: 0.7 },
  'FaceAnimation:Detection': {},
  'FaceAnimation:Generation': {},
  'FaceDetection': {},
  'ImageDenoiser': { denoise_level: 5 },
  'ImageCompressor': { compression_level: 5 },
  'ImageToImage': {},
  'ObjectCounter': {},
  'Cartoon': {}
} as const
