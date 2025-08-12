/**
 * 精简版认证状态管理 Store
 * 只管理核心认证状态，具体服务逻辑由Service层处理
 */

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 核心认证状态
    user: null,           // Supabase 用户对象
    profile: null,        // 用户配置信息
    session: null,        // 当前会话
    
    // 状态标识
    initialized: false,   // 是否已初始化
    loading: false,       // 操作加载状态
    
    // 错误状态
    error: null
  }),

  getters: {
    // 基础状态
    isAuthenticated: (state) => !!(state.user && state.profile),
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    
    // 用户信息
    userId: (state) => state.user?.id,
    userEmail: (state) => state.user?.email,
    userType: (state) => state.profile?.user_type || 'free',
    
    // 用户显示信息
    displayName: (state) => {
      return state.profile?.username || 
             state.user?.user_metadata?.full_name || 
             state.user?.email?.split('@')[0] || 
             '用户'
    },
    
    avatarUrl: (state) => {
      return state.profile?.avatar_url || 
             state.user?.user_metadata?.avatar_url || 
             `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user?.id}`
    },
    
    // 权限检查
    isEmailVerified: (state) => !!state.user?.email_confirmed_at,
    canUseAI: (state) => state.isAuthenticated || state.profile?.user_type !== 'banned',
    isAdmin: (state) => state.profile?.user_type === 'admin',
    isPremium: (state) => ['premium', 'vip', 'admin'].includes(state.profile?.user_type),
    
    // 配额信息
    credits: (state) => ({
      used: state.profile?.credits_used || 0,
      daily: state.profile?.daily_quota || 3,
      total: state.profile?.total_quota || 3,
      remaining: Math.max(0, (state.profile?.total_quota || 3) - (state.profile?.credits_used || 0))
    })
  },

  actions: {
    // ==========  状态管理  ==========
    
    /**
     * 设置用户状态
     */
    setUser(user) {
      this.user = user
      this._logStateChange('setUser', { hasUser: !!user, email: user?.email })
    },
    
    /**
     * 设置用户资料
     */
    setProfile(profile) {
      this.profile = profile
      this._logStateChange('setProfile', { userType: profile?.user_type })
    },
    
    /**
     * 设置会话
     */
    setSession(session) {
      this.session = session
      if (session?.user) {
        this.setUser(session.user)
      }
    },
    
    /**
     * 设置加载状态
     */
    setLoading(loading) {
      this.loading = loading
    },
    
    /**
     * 设置错误状态
     */
    setError(error) {
      this.error = error
      if (error) {
        console.error('[AuthStore] Error:', error)
      }
    },
    
    /**
     * 清除错误状态
     */
    clearError() {
      this.error = null
    },
    
    /**
     * 标记为已初始化
     */
    setInitialized(initialized = true) {
      this.initialized = initialized
      this._logStateChange('setInitialized', { initialized })
    },
    
    // ==========  认证流程  ==========
    
    /**
     * 初始化认证状态
     * 注意：实际的认证逻辑由注入的AuthService处理
     */
    async initialize() {
      if (this.initialized) return
      
      this.setLoading(true)
      this.clearError()
      
      try {
        console.log('[AuthStore] 开始初始化认证状态')
        
        // 这里只是一个占位符，实际逻辑会由使用依赖注入的组件来处理
        // 具体的认证服务调用会在组合函数中完成
        
        this.setInitialized(true)
        console.log('[AuthStore] 认证状态初始化完成')
        
      } catch (error) {
        console.error('[AuthStore] 初始化失败:', error)
        this.setError(error.message || '初始化认证状态失败')
      } finally {
        this.setLoading(false)
      }
    },
    
    /**
     * 登录成功后的状态更新
     */
    onSignInSuccess(user, profile, session) {
      this.setUser(user)
      this.setProfile(profile)
      this.setSession(session)
      this.clearError()
      
      console.log('[AuthStore] 登录状态已更新:', {
        userId: user.id,
        email: user.email,
        userType: profile?.user_type
      })
    },
    
    /**
     * 登出
     */
    signOut() {
      console.log('[AuthStore] 清除认证状态')
      
      this.user = null
      this.profile = null
      this.session = null
      this.clearError()
      
      // 清除本地存储的认证相关数据
      try {
        localStorage.removeItem('supabase.auth.token')
        sessionStorage.clear()
      } catch (error) {
        console.warn('[AuthStore] 清除本地存储失败:', error)
      }
    },
    
    /**
     * 更新用户资料
     */
    updateProfile(updates) {
      if (!this.profile) return
      
      this.profile = { ...this.profile, ...updates }
      
      console.log('[AuthStore] 用户资料已更新:', updates)
    },
    
    /**
     * 更新配额使用情况
     */
    updateCredits(used, total) {
      if (!this.profile) return
      
      this.profile.credits_used = used
      if (total !== undefined) {
        this.profile.total_quota = total
      }
      
      this._logStateChange('updateCredits', { used, total, remaining: this.credits.remaining })
    },
    
    // ==========  权限检查  ==========
    
    /**
     * 检查是否有指定权限
     */
    hasPermission(permission) {
      if (!this.isAuthenticated) return false
      if (this.isAdmin) return true
      
      const userPermissions = this._getUserPermissions()
      return userPermissions.includes(permission) || userPermissions.includes('*')
    },
    
    /**
     * 检查是否可以使用AI功能
     */
    canUseAIFeature(feature, creditsNeeded = 1) {
      if (!this.canUseAI) return false
      
      // 管理员和高级用户无限制
      if (this.isAdmin || this.isPremium) return true
      
      // 免费用户检查配额
      return this.credits.remaining >= creditsNeeded
    },
    
    // ==========  内部方法  ==========
    
    /**
     * 获取用户权限列表
     * @private
     */
    _getUserPermissions() {
      const permissions = {
        free: ['basic_edit', 'trial_ai'],
        premium: ['basic_edit', 'unlimited_ai', 'batch_process'],
        vip: ['basic_edit', 'unlimited_ai', 'batch_process', 'priority_support'],
        admin: ['*']
      }
      
      return permissions[this.userType] || []
    },
    
    /**
     * 记录状态变化日志
     * @private
     */
    _logStateChange(action, data) {
      if (import.meta.env.DEV) {
        console.log(`[AuthStore] ${action}:`, data)
      }
    }
  }
})
