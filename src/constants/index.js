/**
 * 应用主要常量定义
 */

// 应用信息
export const APP_INFO = {
  name: 'Reface',
  version: '1.0.0',
  description: '专为女性用户打造的智能图片美化 SaaS 产品',
  author: 'iam189cm',
  website: 'https://reface.vercel.app'
}

// 路由路径
export const ROUTES = {
  HOME: '/',
  EDITOR: '/editor'
}

// 本地存储键名
export const STORAGE_KEYS = {
  TRIAL_COUNT: 'reface_trial_count',
  TRIAL_RESET: 'reface_trial_reset',
  TRIAL_HISTORY: 'reface_trial_history',
  SELECTED_IMAGE: 'selectedImage',
  APP_SETTINGS: 'app_settings'
}

// 试用相关常量
export const TRIAL = {
  MAX_COUNT: 3,
  RESET_INTERVAL: 'daily' // 每日重置
}

// 文件上传限制
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 4000,
  MAX_HEIGHT: 4000
}



// Canvas 配置
export const CANVAS_CONFIG = {
  MAX_DISPLAY_WIDTH: 800,
  MAX_DISPLAY_HEIGHT: 600,
  DEFAULT_QUALITY: 0.95,
  EXPORT_FORMAT: 'image/jpeg'
}

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// 通知持续时间
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
  PERSISTENT: 0 // 不自动消失
}

// 主题色彩
export const THEME_COLORS = {
  PRIMARY: {
    pink: '#ec4899',
    purple: '#a855f7'
  },
  SECONDARY: {
    gray: '#6b7280'
  },
  STATUS: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }
}

// 断点配置
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// API 相关常量
export const API = {

  OSS_UPLOAD_ENDPOINT: '/api/upload-oss',
  REQUEST_TIMEOUT: 30000 // 30秒
}

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络',
  FILE_TOO_LARGE: '文件大小超过限制',
  INVALID_FILE_TYPE: '不支持的文件格式',
  UPLOAD_FAILED: '图片上传失败',
  PROCESSING_FAILED: '图片处理失败',
  API_KEY_MISSING: 'API Key 未配置',
  QUOTA_EXCEEDED: 'API配额不足',
  TRIAL_EXHAUSTED: '今日试用次数已用完'
}

// 成功消息
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: '图片上传成功',
  PROCESSING_SUCCESS: 'AI处理完成',
  DOWNLOAD_SUCCESS: '图片下载成功',
  SETTINGS_SAVED: '设置保存成功'
}

// 加载消息
export const LOADING_MESSAGES = {
  UPLOADING: '正在上传...',
  PROCESSING: '正在处理...',
  LOADING_IMAGE: '加载图片中...',
  SAVING: '正在保存...',
  INITIALIZING: '正在初始化...'
}

// 功能特色数据
export const FEATURES = [
  {
    id: 'ai-background-remover',
    title: 'AI 背景移除',
    description: '智能识别主体，一键移除背景',
    icon: 'magic',
    color: 'purple'
  },
  {
    id: 'ai-enlarge',
    title: 'AI 图像放大',
    description: '智能放大图片，保持清晰度',
    icon: 'expand',
    color: 'blue'
  },
  {
    id: 'easy-use',
    title: '简单易用',
    description: '拖拽上传，一键处理，即时下载',
    icon: 'check',
    color: 'pink'
  }
]

// 定价方案
export const PRICING_PLANS = [
  {
    id: 'trial',
    name: '免费试用',
    price: 0,
    credits: 3,
    period: 'day',
    features: ['每日3次AI处理', 'AI背景移除', 'AI图片放大']
  },
  {
    id: 'basic',
    name: '体验包',
    price: 9.9,
    credits: 10,
    period: 'once',
    features: ['10次AI处理', 'AI背景移除', 'AI图片放大', '高清画质']
  },
  {
    id: 'standard',
    name: '标准包',
    price: 39.9,
    credits: 50,
    period: 'once',
    features: ['50次AI处理', 'AI背景移除', 'AI图片放大', '高清画质', '优先支持']
  },
  {
    id: 'premium',
    name: '超值包',
    price: 69.9,
    credits: 100,
    period: 'once',
    features: ['100次AI处理', 'AI背景移除', 'AI图片放大', '超高清画质', '优先支持', '批量处理']
  }
]

// 默认设置
export const DEFAULT_SETTINGS = {
  theme: 'light',
  language: 'zh-CN',
  autoSave: true,
  showTips: true,
  quality: 'high'
}
