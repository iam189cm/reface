/**
 * 邮箱认证服务
 * 处理邮箱注册、登录、密码重置等功能
 */
export class EmailAuthService {
  constructor(supabaseClient, config) {
    this.supabase = supabaseClient
    this.config = config
  }
  
  /**
   * 邮箱密码注册
   * @param {string} email - 邮箱地址
   * @param {string} password - 密码
   * @param {Object} options - 注册选项
   * @returns {Promise<Object>} 注册结果
   */
  async signUp(email, password, options = {}) {
    const { metadata = {} } = options
    
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: metadata
        }
      })
      
      if (error) throw error
      
      console.log('[EmailAuth] 注册成功:', email)
      
      return {
        success: true,
        data,
        user: data.user,
        needsVerification: !data.user?.email_confirmed_at
      }
      
    } catch (error) {
      console.error('[EmailAuth] 注册失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '注册')
      }
    }
  }
  
  /**
   * 邮箱密码登录
   * @param {string} email - 邮箱地址
   * @param {string} password - 密码
   * @returns {Promise<Object>} 登录结果
   */
  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      console.log('[EmailAuth] 登录成功:', email)
      
      return {
        success: true,
        data,
        user: data.user,
        session: data.session
      }
      
    } catch (error) {
      console.error('[EmailAuth] 登录失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '登录')
      }
    }
  }
  
  /**
   * 发送密码重置邮件
   * @param {string} email - 邮箱地址
   * @returns {Promise<Object>} 重置结果
   */
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      
      console.log('[EmailAuth] 密码重置邮件已发送:', email)
      
      return {
        success: true,
        message: '密码重置邮件已发送，请检查您的邮箱'
      }
      
    } catch (error) {
      console.error('[EmailAuth] 发送密码重置邮件失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '密码重置')
      }
    }
  }
  
  /**
   * 更新密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<Object>} 更新结果
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      console.log('[EmailAuth] 密码更新成功')
      
      return {
        success: true,
        message: '密码更新成功'
      }
      
    } catch (error) {
      console.error('[EmailAuth] 密码更新失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '密码更新')
      }
    }
  }
  
  /**
   * 验证邮箱地址格式
   * @param {string} email - 邮箱地址
   * @returns {Object} 验证结果
   */
  validateEmail(email) {
    if (!email) {
      return { valid: false, error: '请输入邮箱地址' }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: '请输入有效的邮箱地址' }
    }
    
    return { valid: true }
  }
  
  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {Object} 验证结果
   */
  validatePassword(password) {
    if (!password) {
      return { valid: false, error: '请输入密码' }
    }
    
    if (password.length < 6) {
      return { valid: false, error: '密码长度至少6位' }
    }
    
    if (password.length > 128) {
      return { valid: false, error: '密码长度不能超过128位' }
    }
    
    // 检查是否包含基本的复杂度
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    
    if (!hasLetter || !hasNumber) {
      return {
        valid: true, // 仍然允许，但给出建议
        warning: '建议密码包含字母和数字，提高安全性'
      }
    }
    
    return { valid: true }
  }
  
  /**
   * 格式化错误信息
   * @param {Error} error - 原始错误
   * @param {string} operation - 操作名称
   * @returns {string} 格式化后的错误信息
   * @private
   */
  _formatError(error, operation) {
    // Supabase 特定错误处理
    if (error.message) {
      const message = error.message.toLowerCase()
      
      if (message.includes('invalid login credentials')) {
        return '邮箱或密码错误'
      }
      
      if (message.includes('user already registered')) {
        return '该邮箱已被注册'
      }
      
      if (message.includes('email not confirmed')) {
        return '请先验证您的邮箱'
      }
      
      if (message.includes('password')) {
        if (message.includes('weak')) {
          return '密码强度不够'
        }
        if (message.includes('short')) {
          return '密码长度至少6位'
        }
      }
      
      if (message.includes('rate limit')) {
        return '请求过于频繁，请稍后再试'
      }
      
      if (message.includes('network') || message.includes('fetch')) {
        return '网络连接失败，请检查网络状态'
      }
      
      // 返回原始错误信息（去除敏感信息）
      return error.message.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[邮箱]')
    }
    
    return `${operation}失败，请稍后重试`
  }
}
