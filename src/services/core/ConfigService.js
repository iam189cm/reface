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
  
  /** Remove.bg API 配置 */
  get removeBackground() {
    return {
      apiKey: this.env.VITE_REMOVE_BG_API_KEY,
      apiUrl: 'https://api.remove.bg/v1.0/removebg',
      maxFileSize: 12 * 1024 * 1024, // 12MB
      supportedFormats: ['image/jpeg', 'image/png', 'image/webp']
    }
  }
  
  /** VanceAI API 配置 */
  get vanceAI() {
    return {
      apiToken: this.env.VITE_VANCE_AI_API_TOKEN,
      endpoints: {
        upload: 'https://api-service.vanceai.com/web_api/v1/upload',
        transform: 'https://api-service.vanceai.com/web_api/v1/transform',
        progress: 'https://api-service.vanceai.com/web_api/v1/progress'
      },
      defaultParams: {
        scale: '2x',
        suppress_noise: 50,
        remove_blur: 30
      },
      polling: {
        interval: 3000, // 3秒
        maxAttempts: 40,
        timeout: 120000 // 2分钟
      }
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
        backgroundRemoval: { quota: 3, creditCost: 1 },
        imageEnlarge: { quota: 3, creditCost: 2 }
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
    if (!this.removeBackground.apiKey || this.removeBackground.apiKey === 'your_remove_bg_api_key_here') {
      errors.push('Missing or invalid VITE_REMOVE_BG_API_KEY')
    }
    
    if (!this.vanceAI.apiToken || this.vanceAI.apiToken === 'your_vance_ai_api_token_here') {
      errors.push('Missing or invalid VITE_VANCE_AI_API_TOKEN')
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
