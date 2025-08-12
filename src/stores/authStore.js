/**
 * 用户认证状态管理 Store
 * 基于 Supabase Auth 的用户管理
 */

import { defineStore } from 'pinia'
import { supabase, TABLES, USER_TYPES, handleSupabaseError } from '@/utils/supabase.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 认证状态
    user: null,           // Supabase 用户对象
    profile: null,        // 用户配置信息
    loading: false,       // 操作加载状态
    initialized: false,   // 是否已初始化
    
    // 错误状态
    error: null
  }),

  getters: {
    // 是否已登录
    isAuthenticated: (state) => !!state.user && !!state.profile,
    
    // 用户类型
    userType: (state) => state.profile?.user_type || USER_TYPES.FREE,
    
    // 用户 ID
    userId: (state) => state.user?.id,
    
    // 用户邮箱
    userEmail: (state) => state.user?.email,
    
    // 是否已验证邮箱
    isEmailVerified: (state) => !!state.user?.email_confirmed_at,
    
    // 用户显示名称
    displayName: (state) => {
      return state.profile?.username || 
             state.user?.user_metadata?.full_name || 
             state.user?.email?.split('@')[0] || 
             '用户'
    },
    
    // 是否可以使用 AI 功能
    canUseAI: (state) => {
      const type = state.profile?.user_type
      return Object.values(USER_TYPES).includes(type)
    },
    
    // 是否是管理员
    isAdmin: (state) => state.profile?.user_type === USER_TYPES.ADMIN,
    
    // 获取用户头像
    avatarUrl: (state) => {
      return state.profile?.avatar_url || 
             state.user?.user_metadata?.avatar_url || 
             `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.user?.id}`
    }
  },

  actions: {
    // 初始化认证状态
    async initialize() {
      if (this.initialized) return
      
      this.loading = true
      this.error = null
      
      try {
        // 监听认证状态变化
        supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('[Auth] State changed:', event, session?.user?.email)
          
          this.user = session?.user || null
          
          if (this.user && event === 'SIGNED_IN') {
            await this.fetchOrCreateProfile()
          } else if (event === 'SIGNED_OUT') {
            this.profile = null
            this.error = null
          }
        })
        
        // 获取当前会话
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        
        this.user = session?.user || null
        
        // 如果用户已登录，获取或创建用户配置
        if (this.user) {
          await this.fetchOrCreateProfile()
        }
        
        this.initialized = true
        console.log('[Auth] 初始化完成:', { 
          authenticated: this.isAuthenticated, 
          userType: this.userType 
        })
        
      } catch (error) {
        console.error('[Auth] 初始化失败:', error)
        this.error = handleSupabaseError(error, '初始化认证')
      } finally {
        this.loading = false
      }
    },

    // 获取或创建用户配置
    async fetchOrCreateProfile() {
      if (!this.user) return
      
      try {
        // 先尝试获取现有配置
        const { data, error } = await supabase
          .from(TABLES.USER_PROFILES)
          .select('*')
          .eq('id', this.user.id)
          .maybeSingle()
        
        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        if (data) {
          // 配置存在，直接使用
          this.profile = data
          console.log('[Auth] 用户配置已加载:', data.user_type)
        } else {
          // 配置不存在，创建默认配置
          await this.createDefaultProfile()
        }
        
      } catch (error) {
        console.error('[Auth] 获取用户配置失败:', error)
        this.error = handleSupabaseError(error, '获取用户配置')
      }
    },

    // 创建默认用户配置
    async createDefaultProfile() {
      if (!this.user) return
      
      try {
        const defaultProfile = {
          id: this.user.id,
          user_type: USER_TYPES.FREE,
          credits_used: 0,
          daily_quota: 3,
          total_quota: 3,
          username: null,
          avatar_url: null,
          phone: null
        }
        
        const { data, error } = await supabase
          .from(TABLES.USER_PROFILES)
          .insert(defaultProfile)
          .select()
          .single()
        
        if (error) throw error
        
        this.profile = data
        console.log('[Auth] 默认用户配置已创建:', data.user_type)
        
      } catch (error) {
        console.error('[Auth] 创建用户配置失败:', error)
        this.error = handleSupabaseError(error, '创建用户配置')
      }
    },

    // 邮箱密码注册
    async signUpWithEmail(email, password, options = {}) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: options.metadata || {}
          }
        })
        
        if (error) throw error
        
        console.log('[Auth] 注册成功:', email)
        return { data, error: null }
        
      } catch (error) {
        console.error('[Auth] 注册失败:', error)
        this.error = handleSupabaseError(error, '注册')
        return { data: null, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 邮箱密码登录
    async signInWithEmail(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        
        console.log('[Auth] 登录成功:', email)
        return { data, error: null }
        
      } catch (error) {
        console.error('[Auth] 登录失败:', error)
        this.error = handleSupabaseError(error, '登录')
        return { data: null, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 第三方登录
    async signInWithProvider(provider) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
        
        console.log('[Auth] 第三方登录启动:', provider)
        return { error: null }
        
      } catch (error) {
        console.error('[Auth] 第三方登录失败:', error)
        this.error = handleSupabaseError(error, '第三方登录')
        return { error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 发送密码重置邮件
    async resetPassword(email) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        })
        
        if (error) throw error
        
        console.log('[Auth] 密码重置邮件已发送:', email)
        return { error: null }
        
      } catch (error) {
        console.error('[Auth] 发送密码重置邮件失败:', error)
        this.error = handleSupabaseError(error, '密码重置')
        return { error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 发送手机验证码 (使用阿里云SMS)
    async sendPhoneOTP(phone) {
      this.loading = true
      this.error = null
      
      try {
        // 导入手机号格式化工具
        const { formatPhoneNumber } = await import('@/utils/phoneUtils.js')
        
        // 格式化手机号为国际标准格式
        const formattedPhone = formatPhoneNumber(phone)
        
        console.log('[Auth] 原始手机号:', phone)
        console.log('[Auth] 格式化后:', formattedPhone)
        
        // 调用自定义短信API
        const response = await fetch('/api/send-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone: formattedPhone
          })
        })
        
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || '发送验证码失败')
        }
        
        console.log('[Auth] 验证码已发送至:', formattedPhone)
        return { error: null }
        
      } catch (error) {
        console.error('[Auth] 发送验证码失败:', error)
        this.error = error.message || '发送验证码失败'
        return { error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 手机号验证码登录 (使用阿里云SMS)
    async signInWithPhoneOTP(phone, otp) {
      this.loading = true
      this.error = null
      
      try {
        // 导入手机号格式化工具
        const { formatPhoneNumber } = await import('@/utils/phoneUtils.js')
        
        // 格式化手机号为国际标准格式
        const formattedPhone = formatPhoneNumber(phone)
        
        console.log('[Auth] 验证手机号:', formattedPhone)
        
        // 调用自定义验证API
        const response = await fetch('/api/verify-sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone: formattedPhone,
            code: otp
          })
        })
        
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || '验证码验证失败')
        }
        
        console.log('[Auth] 手机号验证成功:', formattedPhone)
        console.log('[Auth] 用户信息:', result.user)
        
        // 如果返回了重定向URL，则跳转进行自动登录
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl
          return { data: result, error: null }
        }
        
        // 否则手动设置用户状态
        this.user = result.user
        this.profile = result.profile
        
        return { data: result, error: null }
        
      } catch (error) {
        console.error('[Auth] 手机号登录失败:', error)
        this.error = error.message || '验证码验证失败'
        return { data: null, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 登出
    async signOut() {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        // 清空本地状态
        this.user = null
        this.profile = null
        this.error = null
        
        console.log('[Auth] 已登出')
        return { error: null }
        
      } catch (error) {
        console.error('[Auth] 登出失败:', error)
        this.error = handleSupabaseError(error, '登出')
        return { error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 更新用户配置
    async updateProfile(updates) {
      if (!this.user) return { error: '用户未登录' }
      
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from(TABLES.USER_PROFILES)
          .update(updates)
          .eq('id', this.user.id)
          .select()
          .single()
        
        if (error) throw error
        
        this.profile = data
        console.log('[Auth] 用户配置已更新:', updates)
        
        return { data, error: null }
        
      } catch (error) {
        console.error('[Auth] 更新用户配置失败:', error)
        this.error = handleSupabaseError(error, '更新配置')
        return { data: null, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // 清除错误状态
    clearError() {
      this.error = null
    }
  }
})
