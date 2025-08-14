/**
 * 社交登录相关类型定义
 */

import type { BaseResponse, UserProfile, AuthToken } from './auth.types'

// 社交登录提供商
export type SocialProvider = 'google' | 'wechat' | 'github' | 'apple'

// 社交登录配置
export interface SocialAuthConfig {
  provider: SocialProvider
  clientId: string
  clientSecret?: string
  redirectUri: string
  scopes: string[]
  enabled: boolean
}

// 社交用户信息
export interface SocialUserInfo {
  id: string
  email?: string
  name?: string
  avatar?: string
  username?: string
  provider: SocialProvider
  providerData: Record<string, any>
}

// 社交登录请求
export interface SocialLoginRequest {
  provider: SocialProvider
  code?: string
  accessToken?: string
  idToken?: string
  redirectUri?: string
  state?: string
}

// 社交登录响应
export interface SocialLoginResponse extends BaseResponse {
  data: {
    user: UserProfile
    token: AuthToken
    isNewUser: boolean
  }
}

// 社交账号绑定请求
export interface SocialBindRequest {
  provider: SocialProvider
  code?: string
  accessToken?: string
  idToken?: string
}

// 社交账号绑定响应
export interface SocialBindResponse extends BaseResponse {
  data: {
    success: boolean
    provider: SocialProvider
    providerUserId: string
  }
}

// 社交账号解绑请求
export interface SocialUnbindRequest {
  provider: SocialProvider
}

// 用户绑定的社交账号
export interface UserSocialBinding {
  provider: SocialProvider
  providerUserId: string
  providerUsername?: string
  providerEmail?: string
  boundAt: string
}

// 社交登录状态
export interface SocialAuthState {
  provider: SocialProvider | null
  isLoading: boolean
  error: string | null
  redirectUrl: string | null
}

// Google OAuth 特定类型
export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

// 微信小程序登录信息
export interface WechatMiniProgramInfo {
  code: string
  encryptedData?: string
  iv?: string
  signature?: string
  rawData?: string
}

// GitHub 用户信息
export interface GitHubUserInfo {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
  bio: string
  company: string
  location: string
}

// 社交登录错误码
export const SOCIAL_AUTH_ERROR_CODES = {
  PROVIDER_NOT_SUPPORTED: 'PROVIDER_NOT_SUPPORTED',
  AUTHORIZATION_DENIED: 'AUTHORIZATION_DENIED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  ACCOUNT_ALREADY_LINKED: 'ACCOUNT_ALREADY_LINKED',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS'
} as const

export type SocialAuthErrorCode = keyof typeof SOCIAL_AUTH_ERROR_CODES
