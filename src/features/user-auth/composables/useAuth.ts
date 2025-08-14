/**
 * 用户认证组合函数
 */

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@/shared/composables/useNotification'
import type { 
  AuthState,
  UserProfile, 
  AuthToken, 
  LoginRequest,
  RegisterRequest,
  AuthError,
  AuthEvent,
  UserQuota
} from '../types/auth.types'
import { STORAGE_KEYS } from '@/shared/constants'

interface UseAuthOptions {
  redirectAfterLogin?: string
  redirectAfterLogout?: string
  autoRefreshToken?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter()
  const { showError, showSuccess } = useNotification()

  // 响应式状态
  const authState: Ref<AuthState> = ref({
    status: 'idle',
    user: null,
    token: null,
    quota: null,
    lastError: null,
    isLoading: false,
    isInitialized: false
  })

  // 计算属性
  const isAuthenticated = computed(() => 
    authState.value.status === 'authenticated' && authState.value.user !== null
  )

  const isLoading = computed(() => authState.value.isLoading)

  const user = computed(() => authState.value.user)

  const userType = computed(() => authState.value.user?.userType || 'FREE')

  const quota = computed(() => authState.value.quota)

  const isAdmin = computed(() => userType.value === 'ADMIN')

  const isPremium = computed(() => 
    ['PREMIUM', 'PROFESSIONAL', 'ADMIN'].includes(userType.value)
  )

  const hasValidToken = computed(() => {
    const token = authState.value.token
    return token && Date.now() < token.expiresAt
  })

  // 登录
  const login = async (request: LoginRequest): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      setStatus('authenticating')
      
      // 模拟API调用 - 实际项目中调用认证服务
      const mockResponse = await mockAuthAPI(request, 'login')
      
      // 保存认证信息
      saveAuthData(mockResponse.user, mockResponse.token, mockResponse.quota)
      
      // 更新状态
      setStatus('authenticated')
      setUser(mockResponse.user)
      setToken(mockResponse.token)
      setQuota(mockResponse.quota)

      showSuccess('登录成功')

      // 重定向
      if (options.redirectAfterLogin) {
        router.push(options.redirectAfterLogin)
      }

    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
      setStatus('failed')
      showError(authError.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 注册
  const register = async (request: RegisterRequest): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      setStatus('authenticating')
      
      // 模拟API调用
      const mockResponse = await mockAuthAPI(request, 'register')
      
      // 保存认证信息
      saveAuthData(mockResponse.user, mockResponse.token, mockResponse.quota)
      
      // 更新状态
      setStatus('authenticated')
      setUser(mockResponse.user)
      setToken(mockResponse.token)
      setQuota(mockResponse.quota)

      showSuccess('注册成功')

      // 重定向
      if (options.redirectAfterLogin) {
        router.push(options.redirectAfterLogin)
      }

    } catch (error) {
      const authError = error as AuthError
      setError(authError.message)
      setStatus('failed')
      showError(authError.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      setLoading(true)
      
      // 清除认证信息
      clearAuthData()
      
      // 重置状态
      setStatus('idle')
      setUser(null)
      setToken(null)
      setQuota(null)
      setError(null)

      showSuccess('已安全退出')

      // 重定向
      if (options.redirectAfterLogout) {
        router.push(options.redirectAfterLogout)
      }

    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 刷新令牌
  const refreshToken = async (): Promise<void> => {
    const currentToken = authState.value.token
    if (!currentToken?.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      // 模拟刷新令牌API
      const newToken = await mockRefreshToken(currentToken.refreshToken)
      
      setToken(newToken)
      saveToken(newToken)

    } catch (error) {
      // 刷新失败，强制登出
      await logout()
      throw error
    }
  }

  // 初始化认证状态
  const initialize = async (): Promise<void> => {
    if (authState.value.isInitialized) return

    try {
      setLoading(true)
      
      // 从存储中恢复状态
      const savedUser = loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE)
      const savedToken = loadFromStorage<AuthToken>(STORAGE_KEYS.USER_TOKEN)
      const savedQuota = loadFromStorage<UserQuota>('reface_user_quota')

      if (savedUser && savedToken) {
        // 检查令牌是否过期
        if (Date.now() < savedToken.expiresAt) {
          setUser(savedUser)
          setToken(savedToken)
          setQuota(savedQuota)
          setStatus('authenticated')
        } else if (savedToken.refreshToken) {
          // 尝试刷新令牌
          try {
            await refreshToken()
          } catch {
            // 刷新失败，清除过期数据
            clearAuthData()
          }
        } else {
          // 没有刷新令牌，清除过期数据
          clearAuthData()
        }
      }

    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
      authState.value.isInitialized = true
    }
  }

  // 检查权限
  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated.value) return false
    
    // 管理员拥有所有权限
    if (isAdmin.value) return true
    
    // 这里可以实现更复杂的权限检查逻辑
    const userPermissions: Record<string, string[]> = {
      FREE: ['basic'],
      PREMIUM: ['basic', 'premium'],
      PROFESSIONAL: ['basic', 'premium', 'professional']
    }
    
    return userPermissions[userType.value]?.includes(permission) || false
  }

  // 自动刷新令牌
  const setupAutoRefresh = () => {
    if (!options.autoRefreshToken) return

    const checkAndRefresh = async () => {
      const token = authState.value.token
      if (!token || !isAuthenticated.value) return

      // 令牌即将过期前5分钟自动刷新
      const fiveMinutes = 5 * 60 * 1000
      if (Date.now() >= (token.expiresAt - fiveMinutes)) {
        try {
          await refreshToken()
        } catch (error) {
          console.error('Auto refresh failed:', error)
        }
      }
    }

    // 每分钟检查一次
    const intervalId = setInterval(checkAndRefresh, 60 * 1000)
    
    onUnmounted(() => {
      clearInterval(intervalId)
    })
  }

  // 状态更新函数
  const setLoading = (loading: boolean) => {
    authState.value.isLoading = loading
  }

  const setStatus = (status: AuthState['status']) => {
    authState.value.status = status
  }

  const setUser = (user: UserProfile | null) => {
    authState.value.user = user
  }

  const setToken = (token: AuthToken | null) => {
    authState.value.token = token
  }

  const setQuota = (quota: UserQuota | null) => {
    authState.value.quota = quota
  }

  const setError = (error: string | null) => {
    authState.value.lastError = error
  }

  // 存储操作
  const saveAuthData = (user: UserProfile, token: AuthToken, quota?: UserQuota | null) => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, user)
    saveToStorage(STORAGE_KEYS.USER_TOKEN, token)
    if (quota) {
      saveToStorage('reface_user_quota', quota)
    }
  }

  const saveToken = (token: AuthToken) => {
    saveToStorage(STORAGE_KEYS.USER_TOKEN, token)
  }

  const clearAuthData = () => {
    removeFromStorage(STORAGE_KEYS.USER_PROFILE)
    removeFromStorage(STORAGE_KEYS.USER_TOKEN)
    removeFromStorage('reface_user_quota')
  }

  const saveToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  const loadFromStorage = <T>(key: string): T | null => {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return null
    }
  }

  const removeFromStorage = (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from storage:', error)
    }
  }

  // 模拟API函数（实际项目中应该调用真实API）
  const mockAuthAPI = async (request: LoginRequest | RegisterRequest, type: 'login' | 'register') => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟响应
    const mockUser: UserProfile = {
      id: '1',
      email: (request as any).email || 'user@example.com',
      phone: (request as any).phone,
      username: (request as any).username || 'user',
      displayName: (request as any).displayName || '用户',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      userType: 'FREE',
      isEmailVerified: true,
      isPhoneVerified: !!(request as any).phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const mockToken: AuthToken = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: Date.now() + 3600 * 1000
    }

    const mockQuota: UserQuota = {
      userId: '1',
      totalQuota: 100,
      usedQuota: 0,
      remainingQuota: 100,
      dailyLimit: 3,
      dailyUsed: 0,
      resetDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    return { user: mockUser, token: mockToken, quota: mockQuota }
  }

  const mockRefreshToken = async (refreshToken: string): Promise<AuthToken> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      accessToken: 'new_mock_access_token',
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      expiresAt: Date.now() + 3600 * 1000
    }
  }

  // 初始化
  onMounted(async () => {
    await initialize()
    setupAutoRefresh()
  })

  return {
    // 状态
    authState,
    isAuthenticated,
    isLoading,
    user,
    userType,
    quota,
    isAdmin,
    isPremium,
    hasValidToken,

    // 方法
    login,
    register,
    logout,
    refreshToken,
    initialize,
    hasPermission
  }
}
