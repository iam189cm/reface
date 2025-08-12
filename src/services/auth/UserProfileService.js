/**
 * 用户资料管理服务
 * 处理用户资料的创建、更新、查询等操作
 */
export class UserProfileService {
  constructor(supabaseClient, config) {
    this.supabase = supabaseClient
    this.config = config
    this.tables = config.supabase.tables
  }
  
  /**
   * 获取或创建用户资料
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 用户资料
   */
  async getOrCreateProfile(userId) {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }
    
    try {
      // 先尝试获取现有资料
      const { data, error } = await this.supabase
        .from(this.tables.userProfiles)
        .select('*')
        .eq('id', userId)
        .maybeSingle()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      if (data) {
        console.log('[UserProfile] 用户资料已存在:', data.user_type)
        return { success: true, profile: data, isNew: false }
      }
      
      // 资料不存在，创建默认资料
      const newProfile = await this._createDefaultProfile(userId)
      
      return { success: true, profile: newProfile, isNew: true }
      
    } catch (error) {
      console.error('[UserProfile] 获取或创建用户资料失败:', error)
      throw this._formatError(error, '获取用户资料')
    }
  }
  
  /**
   * 更新用户资料
   * @param {string} userId - 用户ID
   * @param {Object} updates - 更新数据
   * @returns {Promise<Object>} 更新结果
   */
  async updateProfile(userId, updates) {
    if (!userId) {
      throw new Error('用户ID不能为空')
    }
    
    try {
      // 验证更新数据
      const validatedUpdates = this._validateProfileUpdates(updates)
      
      console.log('[UserProfile] 更新用户资料:', userId, validatedUpdates)
      
      const { data, error } = await this.supabase
        .from(this.tables.userProfiles)
        .update(validatedUpdates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      
      console.log('[UserProfile] 用户资料更新成功')
      
      return {
        success: true,
        profile: data,
        message: '资料更新成功'
      }
      
    } catch (error) {
      console.error('[UserProfile] 更新用户资料失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '更新用户资料')
      }
    }
  }
  
  /**
   * 获取用户统计信息
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 统计信息
   */
  async getUserStats(userId) {
    try {
      const { data: profile } = await this.supabase
        .from(this.tables.userProfiles)
        .select('credits_used, daily_quota, total_quota, created_at')
        .eq('id', userId)
        .single()
      
      if (!profile) {
        throw new Error('用户资料不存在')
      }
      
      // 计算使用统计
      const stats = {
        // 基础信息
        joinDate: profile.created_at,
        accountAge: this._calculateAccountAge(profile.created_at),
        
        // 使用统计
        creditsUsed: profile.credits_used || 0,
        dailyQuota: profile.daily_quota || 0,
        totalQuota: profile.total_quota || 0,
        remainingQuota: Math.max(0, (profile.total_quota || 0) - (profile.credits_used || 0)),
        
        // 使用率
        usageRate: profile.total_quota > 0 
          ? Math.round((profile.credits_used / profile.total_quota) * 100)
          : 0,
        
        // 用户级别
        level: this._calculateUserLevel(profile.credits_used || 0)
      }
      
      return {
        success: true,
        stats
      }
      
    } catch (error) {
      console.error('[UserProfile] 获取用户统计失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '获取用户统计')
      }
    }
  }
  
  /**
   * 增加用户使用配额
   * @param {string} userId - 用户ID
   * @param {number} amount - 增加数量
   * @param {string} reason - 增加原因
   * @returns {Promise<Object>} 操作结果
   */
  async addCredits(userId, amount, reason = '系统奖励') {
    try {
      if (!userId || amount <= 0) {
        throw new Error('无效的参数')
      }
      
      console.log('[UserProfile] 增加用户配额:', userId, amount, reason)
      
      const { data, error } = await this.supabase
        .rpc('add_user_credits', {
          user_id: userId,
          credit_amount: amount,
          reason: reason
        })
      
      if (error) throw error
      
      console.log('[UserProfile] 配额增加成功')
      
      return {
        success: true,
        data,
        message: `成功增加 ${amount} 个配额`
      }
      
    } catch (error) {
      console.error('[UserProfile] 增加配额失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '增加配额')
      }
    }
  }
  
  /**
   * 消费用户配额
   * @param {string} userId - 用户ID
   * @param {number} amount - 消费数量
   * @param {string} service - 服务类型
   * @returns {Promise<Object>} 操作结果
   */
  async consumeCredits(userId, amount, service = '图片处理') {
    try {
      if (!userId || amount <= 0) {
        throw new Error('无效的参数')
      }
      
      console.log('[UserProfile] 消费用户配额:', userId, amount, service)
      
      const { data, error } = await this.supabase
        .rpc('consume_user_credits', {
          user_id: userId,
          credit_amount: amount,
          service_type: service
        })
      
      if (error) {
        // 配额不足的特殊处理
        if (error.message?.includes('insufficient')) {
          return {
            success: false,
            error: '配额不足',
            code: 'INSUFFICIENT_CREDITS'
          }
        }
        throw error
      }
      
      console.log('[UserProfile] 配额消费成功')
      
      return {
        success: true,
        data,
        remainingCredits: data.remaining_credits
      }
      
    } catch (error) {
      console.error('[UserProfile] 消费配额失败:', error)
      
      return {
        success: false,
        error: this._formatError(error, '消费配额')
      }
    }
  }
  
  /**
   * 检查用户权限
   * @param {string} userId - 用户ID
   * @param {string} permission - 权限名称
   * @returns {Promise<Object>} 检查结果
   */
  async checkPermission(userId, permission) {
    try {
      const { data: profile } = await this.supabase
        .from(this.tables.userProfiles)
        .select('user_type, daily_quota, total_quota, credits_used')
        .eq('id', userId)
        .single()
      
      if (!profile) {
        return { success: false, hasPermission: false, error: '用户资料不存在' }
      }
      
      const permissions = this._getPermissionsByUserType(profile.user_type)
      const hasPermission = permissions.includes(permission)
      
      return {
        success: true,
        hasPermission,
        userType: profile.user_type,
        permissions
      }
      
    } catch (error) {
      console.error('[UserProfile] 检查权限失败:', error)
      
      return {
        success: false,
        hasPermission: false,
        error: this._formatError(error, '检查权限')
      }
    }
  }
  
  /**
   * 创建默认用户资料
   * @param {string} userId - 用户ID
   * @returns {Promise<Object>} 新建的资料
   * @private
   */
  async _createDefaultProfile(userId) {
    const defaultProfile = {
      id: userId,
      user_type: 'free', // 默认免费用户
      credits_used: 0,
      daily_quota: this.config.trial.dailyQuota,
      total_quota: this.config.trial.dailyQuota,
      username: null,
      avatar_url: null,
      phone: null
    }
    
    console.log('[UserProfile] 创建默认用户资料:', userId)
    
    const { data, error } = await this.supabase
      .from(this.tables.userProfiles)
      .insert(defaultProfile)
      .select()
      .single()
    
    if (error) throw error
    
    console.log('[UserProfile] 默认用户资料创建成功')
    
    return data
  }
  
  /**
   * 验证资料更新数据
   * @param {Object} updates - 更新数据
   * @returns {Object} 验证后的数据
   * @private
   */
  _validateProfileUpdates(updates) {
    const validated = {}
    
    // 允许更新的字段
    const allowedFields = ['username', 'avatar_url', 'phone']
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== undefined) {
        validated[key] = value
      }
    }
    
    // 验证用户名
    if (validated.username) {
      if (validated.username.length < 2) {
        throw new Error('用户名长度至少2个字符')
      }
      if (validated.username.length > 50) {
        throw new Error('用户名长度不能超过50个字符')
      }
      if (!/^[a-zA-Z0-9\u4e00-\u9fa5_-]+$/.test(validated.username)) {
        throw new Error('用户名只能包含字母、数字、中文、下划线和短横线')
      }
    }
    
    // 验证头像URL
    if (validated.avatar_url) {
      try {
        new URL(validated.avatar_url)
      } catch {
        throw new Error('头像URL格式不正确')
      }
    }
    
    return validated
  }
  
  /**
   * 计算账户年龄
   * @param {string} createdAt - 创建时间
   * @returns {string} 账户年龄描述
   * @private
   */
  _calculateAccountAge(createdAt) {
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now - created
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 1) {
      return '新用户'
    } else if (diffDays < 30) {
      return `${diffDays} 天`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} 个月`
    } else {
      return `${Math.floor(diffDays / 365)} 年`
    }
  }
  
  /**
   * 计算用户级别
   * @param {number} creditsUsed - 已使用配额
   * @returns {string} 用户级别
   * @private
   */
  _calculateUserLevel(creditsUsed) {
    if (creditsUsed < 10) return '新手'
    if (creditsUsed < 50) return '熟练'
    if (creditsUsed < 200) return '专家'
    return '大师'
  }
  
  /**
   * 根据用户类型获取权限列表
   * @param {string} userType - 用户类型
   * @returns {string[]} 权限列表
   * @private
   */
  _getPermissionsByUserType(userType) {
    const permissions = {
      free: ['basic_edit', 'trial_ai'],
      premium: ['basic_edit', 'unlimited_ai', 'batch_process'],
      vip: ['basic_edit', 'unlimited_ai', 'batch_process', 'priority_support'],
      admin: ['*'] // 所有权限
    }
    
    return permissions[userType] || []
  }
  
  /**
   * 格式化错误信息
   * @param {Error} error - 原始错误
   * @param {string} operation - 操作名称
   * @returns {Error} 格式化后的错误
   * @private
   */
  _formatError(error, operation) {
    let message = `${operation}失败`
    
    if (error.message) {
      if (error.message.includes('duplicate key')) {
        message = '数据已存在'
      } else if (error.message.includes('not found')) {
        message = '用户资料不存在'
      } else if (error.message.includes('permission denied')) {
        message = '权限不足'
      } else if (error.code === 'PGRST116') {
        message = '用户资料不存在'
      } else {
        message = error.message
      }
    }
    
    const formattedError = new Error(message)
    formattedError.originalError = error
    formattedError.operation = operation
    
    return formattedError
  }
}
