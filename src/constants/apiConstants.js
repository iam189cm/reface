/**
 * API 相关常量定义
 */

// API 端点
export const API_ENDPOINTS = {
  // Remove.bg API
  REMOVE_BG: 'https://api.remove.bg/v1.0/removebg',
  REMOVE_BG_ACCOUNT: 'https://api.remove.bg/v1.0/account',
  
  // VanceAI API
  VANCE_AI_UPLOAD: 'https://api-service.vanceai.com/web_api/v1/upload',
  VANCE_AI_TRANSFORM: 'https://api-service.vanceai.com/web_api/v1/transform',
  VANCE_AI_PROGRESS: 'https://api-service.vanceai.com/web_api/v1/progress',
  
  // 内部 API
  UPLOAD_OSS: '/api/upload-oss',
  DELETE_OSS: '/api/delete-oss',
  
  // 未来可能的 API
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

// Remove.bg API 配置
export const REMOVE_BG_CONFIG = {
  // 图片大小选项
  SIZES: {
    PREVIEW: 'preview',     // 0.25 megapixel
    SMALL: 'small',         // 0.25 megapixel
    REGULAR: 'regular',     // 4 megapixel
    MEDIUM: 'medium',       // 10 megapixel
    HD: 'hd',              // 25 megapixel
    FULL: 'full'           // original resolution
  },
  
  // 图片格式
  FORMATS: {
    PNG: 'png',
    JPG: 'jpg',
    ZIP: 'zip'
  },
  
  // 图片类型
  TYPES: {
    AUTO: 'auto',
    PERSON: 'person',
    PRODUCT: 'product',
    CAR: 'car'
  },
  
  // 默认配置
  DEFAULT_SIZE: 'preview',
  DEFAULT_TYPE: 'auto',
  DEFAULT_FORMAT: 'png',
  
  // 错误码映射
  ERROR_CODES: {
    400: 'Invalid image format or corrupted image',
    402: 'Insufficient credits',
    403: 'Invalid API key',
    429: 'Rate limit exceeded'
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

// VanceAI API 配置
export const VANCE_AI_CONFIG = {
  // 图像放大模型
  ENLARGE_MODEL: 'EnlargeStable',
  
  // 放大倍数选项
  SCALE_OPTIONS: {
    '2x': { 
      scale: '2x', 
      credit: 1, 
      name: '2倍放大',
      description: '适合日常使用，快速处理'
    },
    '4x': { 
      scale: '4x', 
      credit: 2, 
      name: '4倍放大',
      description: '高清处理，细节丰富'
    },
    '8x': { 
      scale: '8x', 
      credit: 4, 
      name: '8倍放大',
      description: '超高清处理，专业级效果'
    }
  },
  
  // 默认参数
  DEFAULT_PARAMS: {
    suppress_noise: 26,    // 降噪强度
    remove_blur: 26,       // 去模糊强度
    scale: '2x'           // 默认放大倍数
  },
  
  // 参数范围
  PARAM_RANGES: {
    suppress_noise: { min: 0, max: 100, step: 1 },
    remove_blur: { min: 0, max: 100, step: 1 }
  },
  
  // 处理状态
  JOB_STATUS: {
    WAITING: 'waiting',
    PROCESS: 'process', 
    FINISH: 'finish',
    FATAL: 'fatal',
    WEBHOOK: 'webhook'
  },
  
  // 轮询配置
  POLLING: {
    INTERVAL: 2000,        // 2秒轮询一次
    MAX_ATTEMPTS: 150,     // 最多轮询150次（5分钟）
    TIMEOUT: 300000        // 5分钟超时
  },
  
  // 试用限制
  TRIAL_RESTRICTIONS: {
    ALLOWED_SCALES: ['2x'],           // 试用用户只能使用2x
    DAILY_CREDITS: 3,                 // 每日3个credit
    PREMIUM_SCALES: ['4x', '8x']      // 付费用户专享
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
