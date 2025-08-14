/**
 * 统一配置管理服务
 * 负责管理所有环境变量和配置项
 */
export class ConfigService {
  constructor(env = import.meta.env) {
    this.env = env
    this._validateConfig()
  }
  
  // ==========  AI 服务配置  ==========
  
  /** Nero AI API 配置 */
  get neroAI() {
    return {
      apiKey: this.env.VITE_NERO_AI_API_KEY,
      baseUrl: 'https://api.nero.com/biz/api',
      timeout: 120000, // 2分钟
      maxRetries: 3,
      webhookUrl: this.env.VITE_NERO_AI_WEBHOOK_URL || '',
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedFormats: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 
        'image/webp', 'image/jfif', 'image/jfi', 'image/jpe', 
        'image/jif', 'image/ico', 'image/heic', 'image/heif'
      ]
    }
  }
  
  // ==========  数据库配置  ==========
  
  /** Supabase 配置 */
  get supabase() {
    return {
      url: this.env.VITE_SUPABASE_URL,
      anonKey: this.env.VITE_SUPABASE_ANON_KEY,
      tables: {
        userProfiles: 'user_profiles',
        smsVerificationCodes: 'sms_verification_codes'
      }
    }
  }
  
  // ==========  存储配置  ==========
  
  /** 阿里云OSS 配置 */
  get oss() {
    return {
      accessKeyId: this.env.VITE_OSS_ACCESS_KEY_ID,
      accessKeySecret: this.env.VITE_OSS_ACCESS_KEY_SECRET,
      bucket: this.env.VITE_OSS_BUCKET,
      region: this.env.VITE_OSS_REGION,
      endpoint: `https://${this.env.VITE_OSS_BUCKET}.${this.env.VITE_OSS_REGION}.aliyuncs.com`
    }
  }
  
  // ==========  应用配置  ==========
  
  /** 应用基础配置 */
  get app() {
    return {
      name: 'Reface',
      version: '1.0.0',
      isDevelopment: this.env.DEV,
      isProduction: this.env.PROD,
      baseUrl: this.env.VITE_APP_BASE_URL || 'https://reface.dataechotech.com',
      supportEmail: 'support@reface.com'
    }
  }
  
  /** 试用配置 */
  get trial() {
    return {
      dailyQuota: 3,
      features: {
        'BackgroundRemover': { quota: 3, creditCost: 1 },
        'ImageUpscaler:Standard': { quota: 3, creditCost: 1 },
        'ImageUpscaler:Photograph': { quota: 2, creditCost: 1 },
        'ImageUpscaler:Anime': { quota: 2, creditCost: 1 },
        'ImageUpscaler:FaceEnhancement': { quota: 2, creditCost: 1 },
        'FaceRestoration': { quota: 2, creditCost: 1 },
        'ImageDenoiser': { quota: 3, creditCost: 1 },
        'ScratchFix': { quota: 2, creditCost: 1 },
        'ColorizePhoto': { quota: 1, creditCost: 2 },
        'FaceDetection': { quota: 5, creditCost: 0.5 },
        'ImageCompressor': { quota: 5, creditCost: 0.5 }
      }
    }
  }
  
  // ==========  验证方法  ==========
  
  /**
   * 验证配置完整性
   * @returns {string[]} 配置错误列表
   */
  validateConfig() {
    const errors = []
    
    // AI服务配置验证
    if (!this.neroAI.apiKey || this.neroAI.apiKey === 'your_nero_ai_api_key_here') {
      errors.push('Missing or invalid VITE_NERO_AI_API_KEY')
    }
    
    // 数据库配置验证
    if (!this.supabase.url) {
      errors.push('Missing VITE_SUPABASE_URL')
    }
    
    if (!this.supabase.anonKey) {
      errors.push('Missing VITE_SUPABASE_ANON_KEY')
    }
    
    // OSS配置验证
    if (!this.oss.accessKeyId) {
      errors.push('Missing VITE_OSS_ACCESS_KEY_ID')
    }
    
    if (!this.oss.accessKeySecret) {
      errors.push('Missing VITE_OSS_ACCESS_KEY_SECRET')
    }
    
    if (!this.oss.bucket) {
      errors.push('Missing VITE_OSS_BUCKET')
    }
    
    if (!this.oss.region) {
      errors.push('Missing VITE_OSS_REGION')
    }
    
    return errors
  }
  
  /**
   * 内部配置验证，在构造函数中调用
   * @private
   */
  _validateConfig() {
    const errors = this.validateConfig()
    
    if (errors.length > 0) {
      console.warn('⚠️ Configuration warnings:', errors)
      
      if (this.app.isDevelopment) {
        console.table(errors.map(error => ({ '配置错误': error })))
      }
    } else {
      console.log('✅ All configurations validated successfully')
    }
  }
  
  /**
   * 获取环境特定配置
   * @param {string} key - 配置键
   * @param {any} defaultValue - 默认值
   * @returns {any} 配置值
   */
  get(key, defaultValue = null) {
    return this.env[key] || defaultValue
  }
  
  /**
   * 检查是否为指定环境
   * @param {string} environment - 环境名称 ('development', 'production', 'test')
   * @returns {boolean}
   */
  isEnvironment(environment) {
    switch (environment) {
      case 'development':
        return this.env.DEV
      case 'production':
        return this.env.PROD
      case 'test':
        return this.env.MODE === 'test'
      default:
        return false
    }
  }
}
