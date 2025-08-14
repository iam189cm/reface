/**
 * 用户认证基础类型定义
 */

import type { ID, Timestamp, BaseResponse } from '@/shared/types'

// 认证状态
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'failed' | 'expired'

// 认证方式
export type AuthMethod = 'email' | 'phone' | 'google' | 'wechat' | 'github'

// 用户类型
export type UserType = 'FREE' | 'PREMIUM' | 'PROFESSIONAL' | 'ADMIN' | 'BANNED'

// 认证令牌
export interface AuthToken {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  expiresAt: number
  scope?: string[]
}

// 用户基础信息
export interface UserProfile {
  id: ID
  email?: string
  phone?: string
  username?: string
  displayName?: string
  avatarUrl?: string
  userType: UserType
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
}

// 用户配额信息
export interface UserQuota {
  userId: ID
  totalQuota: number
  usedQuota: number
  remainingQuota: number
  dailyLimit: number
  dailyUsed: number
  resetDate: Timestamp
}

// 认证状态信息
export interface AuthState {
  status: AuthStatus
  user: UserProfile | null
  token: AuthToken | null
  quota: UserQuota | null
  lastError: string | null
  isLoading: boolean
  isInitialized: boolean
}

// 登录请求
export interface LoginRequest {
  method: AuthMethod
  email?: string
  phone?: string
  password?: string
  verificationCode?: string
  provider?: string
  providerToken?: string
  rememberMe?: boolean
}

// 登录响应
export interface LoginResponse extends BaseResponse {
  data: {
    user: UserProfile
    token: AuthToken
    quota: UserQuota
  }
}

// 注册请求
export interface RegisterRequest {
  method: AuthMethod
  email?: string
  phone?: string
  password?: string
  username?: string
  displayName?: string
  verificationCode?: string
  provider?: string
  providerToken?: string
  agreedToTerms: boolean
  agreedToPrivacy: boolean
}

// 注册响应
export interface RegisterResponse extends BaseResponse {
  data: {
    user: UserProfile
    token: AuthToken
    quota: UserQuota
  }
}

// 密码重置请求
export interface ResetPasswordRequest {
  method: 'email' | 'phone'
  email?: string
  phone?: string
  newPassword: string
  verificationCode: string
}

// 令牌刷新请求
export interface RefreshTokenRequest {
  refreshToken: string
}

// 令牌刷新响应
export interface RefreshTokenResponse extends BaseResponse {
  data: {
    token: AuthToken
  }
}

// 用户配置更新请求
export interface UpdateProfileRequest {
  username?: string
  displayName?: string
  avatarUrl?: string
  currentPassword?: string
  newPassword?: string
}

// 用户配置更新响应
export interface UpdateProfileResponse extends BaseResponse {
  data: {
    user: UserProfile
  }
}

// 认证错误
export interface AuthError {
  code: string
  message: string
  field?: string
  details?: any
}

// 认证事件
export type AuthEvent =
  | { type: 'auth:login:start'; payload: { method: AuthMethod } }
  | { type: 'auth:login:success'; payload: { user: UserProfile } }
  | { type: 'auth:login:error'; payload: { error: AuthError } }
  | { type: 'auth:register:start'; payload: { method: AuthMethod } }
  | { type: 'auth:register:success'; payload: { user: UserProfile } }
  | { type: 'auth:register:error'; payload: { error: AuthError } }
  | { type: 'auth:logout'; payload: {} }
  | { type: 'auth:token:refresh'; payload: { token: AuthToken } }
  | { type: 'auth:token:expired'; payload: {} }
  | { type: 'auth:profile:update'; payload: { user: UserProfile } }

// 认证回调函数
export interface AuthCallbacks {
  onLogin?: (user: UserProfile) => void
  onLogout?: () => void
  onRegister?: (user: UserProfile) => void
  onError?: (error: AuthError) => void
  onTokenRefresh?: (token: AuthToken) => void
}
