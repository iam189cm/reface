/**
 * 应用级常量定义
 */

// 应用信息
export const APP_CONFIG = {
  NAME: 'Reface',
  VERSION: '1.0.0',
  DESCRIPTION: '专为女性用户打造的 AI 图片美化工具'
} as const

// 支持的语言
export const SUPPORTED_LANGUAGES = {
  'zh-CN': '简体中文',
  'en-US': 'English'
} as const

// 用户配额设置
export const QUOTA_CONFIG = {
  FREE_USER_DAILY_LIMIT: 3,
  PREMIUM_USER_DAILY_LIMIT: 50,
  PROFESSIONAL_USER_DAILY_LIMIT: 200
} as const

// 文件上传限制
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
} as const

// AI服务配置
export const AI_SERVICES = {
  REMOVE_BACKGROUND: {
    name: '背景移除',
    description: '一键去除图片背景',
    credits: 1,
    maxSize: 10 * 1024 * 1024
  },
  ENLARGE_IMAGE: {
    name: '图片放大',
    description: 'AI无损放大图片',
    credits: 2,
    maxSize: 5 * 1024 * 1024
  }
} as const

// 本地存储键名
export const STORAGE_KEYS = {
  USER_TOKEN: 'reface_user_token',
  REFRESH_TOKEN: 'reface_refresh_token',
  USER_PROFILE: 'reface_user_profile',
  TRIAL_DATA: 'reface_trial_data',
  LANGUAGE: 'reface_language',
  THEME: 'reface_theme'
} as const

// 路由路径
export const ROUTES = {
  HOME: '/',
  EDITOR: '/editor',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  ADMIN: '/admin',
  PRICING: '/pricing',
  HELP: '/help'
} as const
