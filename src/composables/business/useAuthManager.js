/**
 * 认证管理组合函数
 * 连接认证服务和Store，提供统一的认证接口
 */

import { inject, computed, ref } from 'vue'
import { useAuthStore } from '../../stores/modules/auth/authStore.js'
import { useNotification } from '../ui/useNotification.js'

// 创建单例Supabase客户端，避免多实例警告
let _supabaseClient = null

const getSupabaseClient = async (configService) => {
  if (!_supabaseClient) {
    const supabaseConfig = configService.supabase
    const { createClient } = await import('@supabase/supabase-js')
    _supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey)
    console.log('[AuthManager] 创建单例Supabase客户端')
  }
  return _supabaseClient
}

export function useAuthManager() {
  const authStore = useAuthStore()
  const { showError, showSuccess, showInfo } = useNotification()
  
  // 注入认证服务（通过依赖注入提供）
  const serviceContainer = inject('serviceContainer')
  const configService = inject('configService')
  
  // 操作状态
  const isProcessing = ref(false)
  const currentOperation = ref('')
  
  // 计算属性
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const profile = computed(() => authStore.profile)
  const loading = computed(() => authStore.loading || isProcessing.value)
  
  // ==========  初始化  ==========
  
  /**
   * 初始化认证系统
   */
  const initialize = async () => {
    if (authStore.initialized) return
    
    authStore.setLoading(true)
    
    try {
      console.log('[AuthManager] 开始初始化认证系统')
      
      // 获取单例Supabase客户端
      const supabase = await getSupabaseClient(configService)
      
      // 监听认证状态变化
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[AuthManager] Auth state changed:', event, session?.user?.email)
        
        authStore.setSession(session)
        
        if (session?.user && event === 'SIGNED_IN') {
          await _fetchOrCreateProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          authStore.signOut()
        }
      })
      
      // 获取当前会话
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session?.user) {
        authStore.setSession(session)
        await _fetchOrCreateProfile(session.user.id)
      }
      
      authStore.setInitialized(true)
      console.log('[AuthManager] 认证系统初始化完成')
      
    } catch (error) {
      console.error('[AuthManager] 初始化失败:', error)
      authStore.setError(error.message || '认证系统初始化失败')
    } finally {
      authStore.setLoading(false)
    }
  }
  
  // ==========  邮箱认证  ==========
  
  /**
   * 邮箱注册
   */
  const signUpWithEmail = async (email, password, options = {}) => {
    return await _withOperation('邮箱注册', async () => {
      // 获取邮箱认证服务
      const emailAuthService = await _getEmailAuthService()
      
      const result = await emailAuthService.signUp(email, password, options)
      
      if (result.success) {
        if (result.needsVerification) {
          showInfo('注册成功！请检查邮箱并点击验证链接')
        } else {
          showSuccess('注册成功！')
          authStore.onSignInSuccess(result.user, result.profile, result.session)
        }
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  /**
   * 邮箱登录
   */
  const signInWithEmail = async (email, password) => {
    return await _withOperation('邮箱登录', async () => {
      const emailAuthService = await _getEmailAuthService()
      
      const result = await emailAuthService.signIn(email, password)
      
      if (result.success) {
        showSuccess('登录成功！')
        // 获取用户资料
        const profile = await _fetchOrCreateProfile(result.user.id)
        authStore.onSignInSuccess(result.user, profile, result.session)
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  /**
   * 密码重置
   */
  const resetPassword = async (email) => {
    return await _withOperation('密码重置', async () => {
      const emailAuthService = await _getEmailAuthService()
      
      const result = await emailAuthService.resetPassword(email)
      
      if (result.success) {
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  // ==========  手机认证  ==========
  
  /**
   * 发送手机验证码
   */
  const sendPhoneOTP = async (phone) => {
    return await _withOperation('发送验证码', async () => {
      const phoneAuthService = await _getPhoneAuthService()
      
      const result = await phoneAuthService.sendOTP(phone)
      
      if (result.success) {
        showSuccess(result.message)
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  /**
   * 手机号登录
   */
  const signInWithPhone = async (phone, otp) => {
    return await _withOperation('手机号登录', async () => {
      const phoneAuthService = await _getPhoneAuthService()
      
      const result = await phoneAuthService.signInWithOTP(phone, otp)
      
      if (result.success) {
        showSuccess('登录成功！')
        
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl
        } else {
          authStore.onSignInSuccess(result.user, result.profile)
        }
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  // ==========  第三方认证  ==========
  
  /**
   * 第三方登录
   */
  const signInWithProvider = async (provider) => {
    return await _withOperation(`${provider}登录`, async () => {
      const socialAuthService = await _getSocialAuthService()
      
      const result = await socialAuthService.signInWithProvider(provider)
      
      if (result.success) {
        showInfo(result.message)
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  // ==========  用户资料管理  ==========
  
  /**
   * 更新用户资料
   */
  const updateProfile = async (updates) => {
    return await _withOperation('更新资料', async () => {
      if (!authStore.userId) {
        throw new Error('用户未登录')
      }
      
      const userProfileService = await _getUserProfileService()
      
      const result = await userProfileService.updateProfile(authStore.userId, updates)
      
      if (result.success) {
        showSuccess(result.message)
        authStore.updateProfile(updates)
      } else {
        showError(result.error)
      }
      
      return result
    })
  }
  
  // ==========  登出  ==========
  
  /**
   * 登出
   */
  const signOut = async () => {
    return await _withOperation('登出', async () => {
      try {
        // 使用单例Supabase客户端
        const supabase = await getSupabaseClient(configService)
        
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        authStore.signOut()
        showSuccess('已成功登出')
        
        return { success: true }
        
      } catch (error) {
        const result = { success: false, error: error.message }
        showError(result.error)
        return result
      }
    })
  }
  
  // ==========  内部方法  ==========
  
  /**
   * 执行带有加载状态的操作
   * @private
   */
  const _withOperation = async (operationName, operation) => {
    isProcessing.value = true
    currentOperation.value = operationName
    authStore.clearError()
    
    try {
      return await operation()
    } catch (error) {
      console.error(`[AuthManager] ${operationName}失败:`, error)
      const errorResult = { 
        success: false, 
        error: error.message || `${operationName}失败` 
      }
      showError(errorResult.error)
      return errorResult
    } finally {
      isProcessing.value = false
      currentOperation.value = ''
    }
  }
  
  /**
   * 获取或创建用户资料
   * @private
   */
  const _fetchOrCreateProfile = async (userId) => {
    try {
      const userProfileService = await _getUserProfileService()
      
      const { profile } = await userProfileService.getOrCreateProfile(userId)
      authStore.setProfile(profile)
      
      return profile
    } catch (error) {
      console.error('[AuthManager] 获取用户资料失败:', error)
      authStore.setError(error.message)
      return null
    }
  }
  
  /**
   * 获取邮箱认证服务
   * @private
   */
  const _getEmailAuthService = async () => {
    if (!serviceContainer) {
      throw new Error('服务容器未注入，请检查依赖注入配置')
    }
    
    // 动态导入邮箱认证服务
    const { EmailAuthService } = await import('../../services/auth/EmailAuthService.js')
    
    // 使用单例Supabase客户端
    const supabase = await getSupabaseClient(configService)
    
    return new EmailAuthService(supabase, configService)
  }
  
  /**
   * 获取手机认证服务
   * @private
   */
  const _getPhoneAuthService = async () => {
    const { PhoneAuthService } = await import('../../services/auth/PhoneAuthService.js')
    
    // 使用单例Supabase客户端
    const supabase = await getSupabaseClient(configService)
    
    const httpClient = serviceContainer.get('httpClient')
    return new PhoneAuthService(supabase, configService, httpClient)
  }
  
  /**
   * 获取第三方认证服务
   * @private
   */
  const _getSocialAuthService = async () => {
    const { SocialAuthService } = await import('../../services/auth/SocialAuthService.js')
    
    // 使用单例Supabase客户端
    const supabase = await getSupabaseClient(configService)
    
    return new SocialAuthService(supabase, configService)
  }
  
  /**
   * 获取用户资料服务
   * @private
   */
  const _getUserProfileService = async () => {
    const { UserProfileService } = await import('../../services/auth/UserProfileService.js')
    
    // 使用单例Supabase客户端
    const supabase = await getSupabaseClient(configService)
    
    return new UserProfileService(supabase, configService)
  }
  
  // ==========  会话管理  ==========
  
  /**
   * 获取当前会话
   */
  const getCurrentSession = async () => {
    try {
      const supabase = await getSupabaseClient(configService)
      
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('[AuthManager] 获取会话失败:', error)
        throw error
      }
      
      if (session?.user) {
        // 更新store状态
        authStore.setSession(session)
        
        // 获取用户资料
        try {
          const userProfileService = await _getUserProfileService()
          const profile = await userProfileService.getOrCreateProfile(session.user.id)
          authStore.setProfile(profile)
          
          console.log('[AuthManager] 会话恢复成功:', {
            userId: session.user.id,
            email: session.user.email
          })
        } catch (profileError) {
          console.warn('[AuthManager] 获取用户资料失败:', profileError)
          // 即使获取资料失败，也保持基本的认证状态
        }
      }
      
      return session
    } catch (error) {
      console.error('[AuthManager] getCurrentSession error:', error)
      throw error
    }
  }

  return {
    // 状态
    isAuthenticated,
    user,
    profile,
    loading,
    isProcessing,
    currentOperation,
    
    // 方法
    initialize,
    signUpWithEmail,
    signInWithEmail,
    resetPassword,
    sendPhoneOTP,
    signInWithPhone,
    signInWithProvider,
    updateProfile,
    signOut,
    getCurrentSession,
    
    // Store actions（直接暴露）
    clearError: authStore.clearError,
    hasPermission: authStore.hasPermission,
    canUseAIFeature: authStore.canUseAIFeature
  }
}
