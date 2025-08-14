/**
 * API 相关常量定义
 */

// API 端点
export const API_ENDPOINTS = {
  // Nero AI API
  NERO_AI_BASE: 'https://api.nero.com/biz/api',
  NERO_AI_TASK: 'https://api.nero.com/biz/api/task',
  NERO_AI_ACCOUNT: 'https://api.nero.com/biz/api/account',
  
  // 内部 API
  UPLOAD_OSS: '/api/upload-oss',
  DELETE_OSS: '/api/delete-oss',
  
  // 后端 API 路由
  NERO_AI_PROXY: '/api/nero-ai',
  USER_AUTH: '/api/auth',
  PAYMENT: '/api/payment',
  ANALYTICS: '/api/analytics'
}

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}

// 请求超时配置
export const TIMEOUT_CONFIG = {
  DEFAULT: 10000,      // 10秒
  UPLOAD: 30000,       // 30秒
  AI_PROCESSING: 60000, // 60秒
  QUICK: 5000          // 5秒
}

// Nero AI API 配置
export const NERO_AI_CONFIG = {
  BASE_URL: 'https://api.nero.com/biz/api',
  
  // 支持的服务类型
  SERVICE_TYPES: {
    IMAGE_UPSCALER_STANDARD: 'ImageUpscaler:Standard',
    IMAGE_UPSCALER_PHOTOGRAPH: 'ImageUpscaler:Photograph',
    IMAGE_UPSCALER_ANIME: 'ImageUpscaler:Anime',
    IMAGE_UPSCALER_FACE: 'ImageUpscaler:FaceEnhancement',
    BACKGROUND_REMOVER: 'BackgroundRemover',
    BACKGROUND_CHANGER: 'BackgroundChanger',
    SCRATCH_FIX: 'ScratchFix',
    COLORIZE_PHOTO: 'ColorizePhoto',
    FACE_RESTORATION: 'FaceRestoration',
    FACE_DETECTION: 'FaceDetection',
    IMAGE_DENOISER: 'ImageDenoiser',
    IMAGE_COMPRESSOR: 'ImageCompressor',
    CARTOON: 'Cartoon'
  },
  
  // 图片大小选项
  SIZES: {
    PREVIEW: 'preview',
    SMALL: 'small',
    REGULAR: 'regular',
    MEDIUM: 'medium',
    HD: 'hd',
    FULL: 'full'
  },
  
  // 图片类型提示
  TYPE_HINTS: {
    AUTO: 'auto',
    PERSON: 'person',
    PRODUCT: 'product',
    CAR: 'car'
  },
  
  // 放大倍数
  UPSCALING_RATES: {
    X2: 2,
    X4: 4
  },
  
  // 默认参数
  DEFAULT_PARAMS: {
    size: 'preview',
    type_hint: 'auto',
    upscaling_rate: 2,
    quality_factor: 95
  },
  
  // 错误码映射
  ERROR_CODES: {
    11002: 'API密钥无效',
    11003: 'API密钥已过期',
    11004: 'API配额不足',
    400: '请求参数错误',
    403: '访问被拒绝',
    429: '请求频率过高'
  }
}

// OSS 配置
export const OSS_CONFIG = {
  // 存储桶文件夹
  FOLDERS: {
    ORIGINAL: 'original',
    PROCESSED: 'processed',
    THUMBNAILS: 'thumbnails',
    TEMP: 'temp'
  },
  
  // 文件命名模式
  NAMING: {
    TIMESTAMP: 'timestamp',
    UUID: 'uuid',
    HASH: 'hash'
  },
  
  // 默认配置
  DEFAULT_FOLDER: 'original',
  DEFAULT_NAMING: 'timestamp',
  
  // URL 有效期（秒）
  URL_EXPIRES: {
    UPLOAD: 3600,      // 1小时
    DOWNLOAD: 86400,   // 24小时
    PREVIEW: 7200      // 2小时
  }
}

// API 错误类型
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  QUOTA_ERROR: 'QUOTA_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// API 重试配置
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,    // 1秒
  BACKOFF_FACTOR: 2,      // 指数退避
  MAX_DELAY: 10000,       // 最大延迟10秒
  
  // 哪些错误码需要重试
  RETRYABLE_STATUS_CODES: [
    HTTP_STATUS.TOO_MANY_REQUESTS,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.BAD_GATEWAY,
    HTTP_STATUS.SERVICE_UNAVAILABLE
  ]
}

// 请求头配置
export const REQUEST_HEADERS = {
  DEFAULT: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  MULTIPART: {
    // Content-Type 会被浏览器自动设置
    'Accept': 'application/json'
  },
  
  REMOVE_BG: {
    'Accept': 'application/json'
    // X-Api-Key 会动态设置
  }
}

// API 响应格式
export const RESPONSE_FORMAT = {
  SUCCESS: {
    success: true,
    data: null,
    message: ''
  },
  
  ERROR: {
    success: false,
    error: '',
    code: '',
    details: null
  }
}




// 缓存配置
export const CACHE_CONFIG = {
  // 缓存键前缀
  PREFIX: 'reface_api_',
  
  // 缓存时间（毫秒）
  TTL: {
    SHORT: 5 * 60 * 1000,      // 5分钟
    MEDIUM: 30 * 60 * 1000,    // 30分钟
    LONG: 2 * 60 * 60 * 1000   // 2小时
  },
  
  // 是否启用缓存
  ENABLED: true
}
