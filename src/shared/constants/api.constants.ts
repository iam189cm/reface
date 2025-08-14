/**
 * API相关常量定义
 */

// API基础配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000,
  RETRIES: 3,
  RETRY_DELAY: 1000
} as const

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    SEND_SMS: '/send-sms',
    VERIFY_SMS: '/verify-sms',
    PROFILE: '/auth/profile'
  },

  // 文件上传
  UPLOAD: {
    OSS: '/upload-oss'
  },

  // AI服务
  AI: {
    REMOVE_BACKGROUND: '/ai/remove-background',
    ENLARGE_IMAGE: '/ai/enlarge-image'
  },

  // 用户管理
  USER: {
    LIST: '/users',
    PROFILE: '/user/profile',
    CREDITS: '/user/credits',
    USAGE: '/user/usage'
  },

  // 管理后台
  ADMIN: {
    STATS: '/admin/statistics',
    USERS: '/admin/users',
    USAGE: '/admin/usage'
  },

  // 试用配额
  TRIAL: {
    CONSUME: '/usage/consume',
    STATUS: '/usage/status'
  }
} as const

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// 错误码定义
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 认证错误
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // 文件上传错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  
  // AI服务错误
  AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  
  // 用户相关错误
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  DUPLICATE_PHONE: 'DUPLICATE_PHONE',
  
  // 验证错误
  INVALID_VERIFICATION_CODE: 'INVALID_VERIFICATION_CODE',
  VERIFICATION_CODE_EXPIRED: 'VERIFICATION_CODE_EXPIRED'
} as const

// HTTP请求头
export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  X_REQUESTED_WITH: 'X-Requested-With'
} as const

// 内容类型
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded'
} as const
