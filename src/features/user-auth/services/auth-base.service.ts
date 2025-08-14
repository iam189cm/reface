/**
 * 认证服务基类
 */

import type { 
  AuthState, 
  AuthToken, 
  UserProfile, 
  AuthError,
  LoginRequest,
  RegisterRequest,
  AuthEvent,
  AuthCallbacks
} from '../types/auth.types'
import { useNotification } from '@/shared/composables/useNotification'

export abstract class AuthServiceBase {
  protected readonly notification = useNotification()
  protected eventListeners = new Set<(event: AuthEvent) => void>()

  constructor(
    protected readonly callbacks?: AuthCallbacks
  ) {}

  // 抽象方法，子类必须实现
  abstract login(request: LoginRequest): Promise<{ user: UserProfile; token: AuthToken }>
  abstract register(request: RegisterRequest): Promise<{ user: UserProfile; token: AuthToken }>
  abstract logout(): Promise<void>
  abstract refreshToken(refreshToken: string): Promise<AuthToken>

  // 通用方法
  protected createError(code: string, message: string, field?: string): AuthError {
    return { code, message, field }
  }

  protected validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  protected validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/
    return phoneRegex.test(phone)
  }

  protected validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('密码至少需要8个字符')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('密码需要包含至少一个大写字母')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('密码需要包含至少一个小写字母')
    }
    if (!/\d/.test(password)) {
      errors.push('密码需要包含至少一个数字')
    }

    return { valid: errors.length === 0, errors }
  }

  // 事件处理
  protected emitEvent(event: AuthEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Auth event listener error:', error)
      }
    })
  }

  addEventListener(listener: (event: AuthEvent) => void): void {
    this.eventListeners.add(listener)
  }

  removeEventListener(listener: (event: AuthEvent) => void): void {
    this.eventListeners.delete(listener)
  }

  // 令牌处理
  protected isTokenExpired(token: AuthToken): boolean {
    return Date.now() >= token.expiresAt
  }

  protected willTokenExpireSoon(token: AuthToken, thresholdMs: number = 5 * 60 * 1000): boolean {
    return Date.now() >= (token.expiresAt - thresholdMs)
  }

  protected createTokenFromResponse(data: any): AuthToken {
    return {
      accessToken: data.access_token || data.token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type || 'Bearer',
      expiresIn: data.expires_in || 3600,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
      scope: data.scope ? data.scope.split(' ') : undefined
    }
  }

  // 用户配置处理
  protected normalizeUserProfile(data: any): UserProfile {
    return {
      id: data.id,
      email: data.email,
      phone: data.phone,
      username: data.username,
      displayName: data.display_name || data.name,
      avatarUrl: data.avatar_url || data.picture,
      userType: data.user_type || 'FREE',
      isEmailVerified: data.is_email_verified || false,
      isPhoneVerified: data.is_phone_verified || false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastLoginAt: data.last_login_at
    }
  }

  // 错误处理
  protected handleApiError(response: any): AuthError {
    if (response.error) {
      return this.createError(
        response.error,
        response.error_description || response.message || '认证失败',
        response.field
      )
    }

    if (response.errors && Array.isArray(response.errors)) {
      const firstError = response.errors[0]
      return this.createError(
        firstError.code || 'VALIDATION_ERROR',
        firstError.message || '验证失败',
        firstError.field
      )
    }

    return this.createError('UNKNOWN_ERROR', '未知错误')
  }

  // 存储操作
  protected saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  protected loadFromStorage<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return null
    }
  }

  protected removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from storage:', error)
    }
  }

  // 清理资源
  destroy(): void {
    this.eventListeners.clear()
  }
}
