/**
 * 手机认证服务
 * 处理手机号注册、登录、验证码发送等功能
 */
export class PhoneAuthService {
  constructor(supabaseClient, config, httpClient) {
    this.supabase = supabaseClient
    this.config = config
    this.httpClient = httpClient
  }
  
  /**
   * 发送手机验证码
   * @param {string} phone - 手机号
   * @returns {Promise<Object>} 发送结果
   */
  async sendOTP(phone) {
    try {
      // 格式化手机号
      const formattedPhone = this._formatPhone(phone)
      const validation = this.validatePhone(formattedPhone)
      
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }
      
      console.log('[PhoneAuth] 发送验证码到:', formattedPhone)
      
      // 调用自定义短信API
      const response = await this.httpClient.post('/api/send-sms', {
        phone: formattedPhone
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || '发送验证码失败')
      }
      
      console.log('[PhoneAuth] 验证码发送成功')
      
      return {
        success: true,
        phone: formattedPhone,
        message: `验证码已发送至 ${this._maskPhone(formattedPhone)}`
      }
      
    } catch (error) {
      console.error('[PhoneAuth] 发送验证码失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '发送验证码')
      }
    }
  }
  
  /**
   * 手机号验证码登录
   * @param {string} phone - 手机号
   * @param {string} otp - 验证码
   * @returns {Promise<Object>} 登录结果
   */
  async signInWithOTP(phone, otp) {
    try {
      const formattedPhone = this._formatPhone(phone)
      
      // 验证手机号和验证码
      const phoneValidation = this.validatePhone(formattedPhone)
      if (!phoneValidation.valid) {
        return { success: false, error: phoneValidation.error }
      }
      
      const otpValidation = this.validateOTP(otp)
      if (!otpValidation.valid) {
        return { success: false, error: otpValidation.error }
      }
      
      console.log('[PhoneAuth] 验证手机号登录:', formattedPhone)
      
      // 调用自定义验证API
      const response = await this.httpClient.post('/api/verify-sms', {
        phone: formattedPhone,
        code: otp
      })
      
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || '验证码验证失败')
      }
      
      console.log('[PhoneAuth] 手机号验证成功')
      
      return {
        success: true,
        user: result.user,
        profile: result.profile,
        redirectUrl: result.redirectUrl
      }
      
    } catch (error) {
      console.error('[PhoneAuth] 手机号登录失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '验证码验证')
      }
    }
  }
  
  /**
   * 绑定手机号到现有账户
   * @param {string} phone - 手机号
   * @param {string} otp - 验证码
   * @returns {Promise<Object>} 绑定结果
   */
  async bindPhone(phone, otp) {
    try {
      const formattedPhone = this._formatPhone(phone)
      
      // 先验证验证码
      const verifyResult = await this.signInWithOTP(formattedPhone, otp)
      if (!verifyResult.success) {
        return verifyResult
      }
      
      // 更新用户信息
      const { error } = await this.supabase.auth.updateUser({
        phone: formattedPhone
      })
      
      if (error) throw error
      
      console.log('[PhoneAuth] 手机号绑定成功')
      
      return {
        success: true,
        phone: formattedPhone,
        message: '手机号绑定成功'
      }
      
    } catch (error) {
      console.error('[PhoneAuth] 手机号绑定失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '手机号绑定')
      }
    }
  }
  
  /**
   * 验证手机号格式
   * @param {string} phone - 手机号
   * @returns {Object} 验证结果
   */
  validatePhone(phone) {
    if (!phone) {
      return { valid: false, error: '请输入手机号' }
    }
    
    // 移除所有非数字字符
    const cleanPhone = phone.replace(/\D/g, '')
    
    // 中国大陆手机号验证
    if (cleanPhone.length === 11 && /^1[3-9]\d{9}$/.test(cleanPhone)) {
      return { valid: true, region: '中国大陆' }
    }
    
    // 国际格式验证（简化版）
    if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
      return { valid: true, region: '国际' }
    }
    
    return { 
      valid: false, 
      error: '请输入有效的手机号' 
    }
  }
  
  /**
   * 验证验证码格式
   * @param {string} otp - 验证码
   * @returns {Object} 验证结果
   */
  validateOTP(otp) {
    if (!otp) {
      return { valid: false, error: '请输入验证码' }
    }
    
    if (!/^\d{6}$/.test(otp)) {
      return { valid: false, error: '请输入6位数字验证码' }
    }
    
    return { valid: true }
  }
  
  /**
   * 格式化手机号为国际标准格式
   * @param {string} phone - 原始手机号
   * @returns {string} 格式化后的手机号
   * @private
   */
  _formatPhone(phone) {
    if (!phone) return ''
    
    // 移除所有非数字字符
    const cleanPhone = phone.replace(/\D/g, '')
    
    // 如果是11位数字且以1开头，假设是中国大陆手机号
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      return `+86${cleanPhone}`
    }
    
    // 如果已经有国际区号
    if (cleanPhone.length > 11) {
      return `+${cleanPhone}`
    }
    
    // 其他情况，原样返回
    return cleanPhone
  }
  
  /**
   * 遮蔽手机号中间部分
   * @param {string} phone - 手机号
   * @returns {string} 遮蔽后的手机号
   * @private
   */
  _maskPhone(phone) {
    if (!phone) return ''
    
    // 移除国际区号前缀进行遮蔽
    const cleanPhone = phone.replace(/^\+\d{1,3}/, '')
    
    if (cleanPhone.length >= 7) {
      const start = cleanPhone.slice(0, 3)
      const end = cleanPhone.slice(-2)
      const middle = '*'.repeat(cleanPhone.length - 5)
      return `${start}${middle}${end}`
    }
    
    return phone
  }
  
  /**
   * 格式化错误信息
   * @param {Error} error - 原始错误
   * @param {string} operation - 操作名称
   * @returns {string} 格式化后的错误信息
   * @private
   */
  _formatError(error, operation) {
    if (error.message) {
      const message = error.message.toLowerCase()
      
      if (message.includes('verification code') || message.includes('验证码')) {
        if (message.includes('expired')) {
          return '验证码已过期，请重新获取'
        }
        if (message.includes('invalid')) {
          return '验证码错误，请重新输入'
        }
        if (message.includes('too many attempts')) {
          return '验证失败次数过多，请稍后再试'
        }
      }
      
      if (message.includes('phone number') || message.includes('手机号')) {
        if (message.includes('invalid')) {
          return '手机号格式不正确'
        }
        if (message.includes('already exists')) {
          return '该手机号已被使用'
        }
      }
      
      if (message.includes('rate limit')) {
        return '发送过于频繁，请稍后再试'
      }
      
      if (message.includes('network') || message.includes('fetch')) {
        return '网络连接失败，请检查网络状态'
      }
      
      // 移除敏感信息
      return error.message.replace(/\+?\d{10,}/g, '[手机号]')
    }
    
    return `${operation}失败，请稍后重试`
  }
}
