/**
 * 第三方认证服务
 * 处理Google、微信等第三方平台登录
 */
export class SocialAuthService {
  constructor(supabaseClient, config) {
    this.supabase = supabaseClient
    this.config = config
  }
  
  /**
   * 第三方平台登录
   * @param {string} provider - 认证提供商 ('google', 'wechat', 'github' 等)
   * @param {Object} options - 登录选项
   * @returns {Promise<Object>} 登录结果
   */
  async signInWithProvider(provider, options = {}) {
    try {
      const supportedProviders = this.getSupportedProviders()
      
      if (!supportedProviders.includes(provider)) {
        throw new Error(`不支持的认证提供商: ${provider}`)
      }
      
      console.log(`[SocialAuth] 启动${provider}登录`)
      
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...options
        }
      })
      
      if (error) throw error
      
      console.log(`[SocialAuth] ${provider}登录启动成功`)
      
      return {
        success: true,
        provider,
        redirecting: true,
        message: `正在跳转到${this._getProviderDisplayName(provider)}...`
      }
      
    } catch (error) {
      console.error(`[SocialAuth] ${provider}登录失败:`, error)
      
      return {
        success: false,
        provider,
        error: this._formatError(error, `${this._getProviderDisplayName(provider)}登录`)
      }
    }
  }
  
  /**
   * Google登录
   * @param {Object} options - 登录选项
   * @returns {Promise<Object>} 登录结果
   */
  async signInWithGoogle(options = {}) {
    return this.signInWithProvider('google', {
      scopes: 'email profile',
      ...options
    })
  }
  
  /**
   * 微信登录（准备中）
   * @param {Object} options - 登录选项
   * @returns {Promise<Object>} 登录结果
   */
  async signInWithWechat(options = {}) {
    // 微信登录暂时不可用
    return {
      success: false,
      provider: 'wechat',
      error: '微信登录功能正在开发中，敬请期待'
    }
  }
  
  /**
   * GitHub登录
   * @param {Object} options - 登录选项
   * @returns {Promise<Object>} 登录结果
   */
  async signInWithGitHub(options = {}) {
    return this.signInWithProvider('github', options)
  }
  
  /**
   * 处理第三方登录回调
   * @returns {Promise<Object>} 处理结果
   */
  async handleCallback() {
    try {
      console.log('[SocialAuth] 处理认证回调')
      
      const { data, error } = await this.supabase.auth.getSession()
      
      if (error) throw error
      
      if (data.session) {
        console.log('[SocialAuth] 认证回调处理成功')
        
        return {
          success: true,
          session: data.session,
          user: data.session.user,
          provider: this._extractProviderFromSession(data.session)
        }
      } else {
        throw new Error('未找到有效的认证会话')
      }
      
    } catch (error) {
      console.error('[SocialAuth] 认证回调处理失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '第三方登录')
      }
    }
  }
  
  /**
   * 绑定第三方账户到现有用户
   * @param {string} provider - 认证提供商
   * @returns {Promise<Object>} 绑定结果
   */
  async linkAccount(provider) {
    try {
      // 检查用户是否已登录
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        throw new Error('请先登录账户')
      }
      
      console.log(`[SocialAuth] 绑定${provider}账户`)
      
      const { error } = await this.supabase.auth.linkIdentity({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?action=link`
        }
      })
      
      if (error) throw error
      
      return {
        success: true,
        provider,
        message: `正在跳转绑定${this._getProviderDisplayName(provider)}账户...`
      }
      
    } catch (error) {
      console.error(`[SocialAuth] 绑定${provider}账户失败:`, error)
      
      return {
        success: false,
        provider,
        error: this._formatError(error, '账户绑定')
      }
    }
  }
  
  /**
   * 解绑第三方账户
   * @param {string} identityId - 身份标识ID
   * @returns {Promise<Object>} 解绑结果
   */
  async unlinkAccount(identityId) {
    try {
      console.log('[SocialAuth] 解绑第三方账户:', identityId)
      
      const { error } = await this.supabase.auth.unlinkIdentity({
        identity_id: identityId
      })
      
      if (error) throw error
      
      console.log('[SocialAuth] 账户解绑成功')
      
      return {
        success: true,
        message: '账户解绑成功'
      }
      
    } catch (error) {
      console.error('[SocialAuth] 账户解绑失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '账户解绑')
      }
    }
  }
  
  /**
   * 获取用户绑定的第三方账户列表
   * @returns {Promise<Object>} 绑定账户列表
   */
  async getLinkedAccounts() {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: '用户未登录' }
      }
      
      const identities = user.identities || []
      
      const linkedAccounts = identities.map(identity => ({
        id: identity.id,
        provider: identity.provider,
        email: identity.identity_data?.email,
        name: identity.identity_data?.name || identity.identity_data?.full_name,
        avatar: identity.identity_data?.avatar_url,
        createdAt: identity.created_at,
        lastSignInAt: identity.last_sign_in_at
      }))
      
      return {
        success: true,
        accounts: linkedAccounts,
        count: linkedAccounts.length
      }
      
    } catch (error) {
      console.error('[SocialAuth] 获取绑定账户失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '获取绑定账户')
      }
    }
  }
  
  /**
   * 获取支持的认证提供商列表
   * @returns {string[]} 提供商列表
   */
  getSupportedProviders() {
    return [
      'google',
      // 'wechat', // 暂时不可用
      'github'
      // 可以根据需要添加更多提供商
    ]
  }
  
  /**
   * 获取可用的认证提供商详细信息
   * @returns {Object[]} 提供商信息列表
   */
  getAvailableProviders() {
    return [
      {
        id: 'google',
        name: 'Google',
        displayName: 'Google',
        available: true,
        icon: '📧', // 可以用实际图标替换
        description: '使用Google账户登录'
      },
      {
        id: 'wechat',
        name: 'WeChat',
        displayName: '微信',
        available: false, // 暂时不可用
        icon: '💬',
        description: '微信登录功能正在开发中'
      },
      {
        id: 'github',
        name: 'GitHub',
        displayName: 'GitHub',
        available: true,
        icon: '🐙',
        description: '使用GitHub账户登录'
      }
    ]
  }
  
  /**
   * 获取提供商显示名称
   * @param {string} provider - 提供商ID
   * @returns {string} 显示名称
   * @private
   */
  _getProviderDisplayName(provider) {
    const names = {
      google: 'Google',
      wechat: '微信',
      github: 'GitHub'
    }
    return names[provider] || provider
  }
  
  /**
   * 从会话中提取提供商信息
   * @param {Object} session - 会话对象
   * @returns {string} 提供商名称
   * @private
   */
  _extractProviderFromSession(session) {
    if (session.user?.app_metadata?.provider) {
      return session.user.app_metadata.provider
    }
    
    if (session.user?.identities?.length > 0) {
      return session.user.identities[0].provider
    }
    
    return 'unknown'
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
      
      if (message.includes('popup blocked')) {
        return '弹窗被阻止，请允许弹窗后重试'
      }
      
      if (message.includes('cancelled') || message.includes('canceled')) {
        return '用户取消了登录'
      }
      
      if (message.includes('invalid_request')) {
        return '登录请求无效'
      }
      
      if (message.includes('access_denied')) {
        return '用户拒绝了授权'
      }
      
      if (message.includes('network') || message.includes('fetch')) {
        return '网络连接失败，请检查网络状态'
      }
      
      if (message.includes('identity') && message.includes('already linked')) {
        return '该账户已被绑定到其他用户'
      }
      
      return error.message
    }
    
    return `${operation}失败，请稍后重试`
  }
}
