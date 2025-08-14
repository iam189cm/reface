/**
 * 手机认证相关类型定义
 */

import type { BaseResponse } from '@/shared/types'

// 验证码类型
export type VerificationCodeType = 'login' | 'register' | 'reset_password' | 'change_phone'

// 手机验证码发送请求
export interface SendSMSRequest {
  phone: string
  type: VerificationCodeType
  captcha?: string
  captchaToken?: string
}

// 手机验证码发送响应
export interface SendSMSResponse extends BaseResponse {
  data: {
    success: boolean
    expiresIn: number
    rateLimitRemaining: number
    rateLimitReset: number
  }
}

// 手机验证码验证请求
export interface VerifySMSRequest {
  phone: string
  code: string
  type: VerificationCodeType
}

// 手机验证码验证响应
export interface VerifySMSResponse extends BaseResponse {
  data: {
    success: boolean
    token?: string
    expiresIn?: number
  }
}

// 手机号登录请求
export interface PhoneLoginRequest {
  phone: string
  verificationCode: string
  rememberMe?: boolean
}

// 手机号注册请求
export interface PhoneRegisterRequest {
  phone: string
  verificationCode: string
  password?: string
  username?: string
  displayName?: string
  agreedToTerms: boolean
  agreedToPrivacy: boolean
}

// 手机号验证状态
export interface PhoneVerificationState {
  phone: string
  type: VerificationCodeType
  codeSent: boolean
  verified: boolean
  expiresAt: number
  remainingAttempts: number
  rateLimitReset: number
  lastSentAt: number
}

// 手机验证错误码
export const PHONE_AUTH_ERROR_CODES = {
  INVALID_PHONE: 'INVALID_PHONE',
  CODE_EXPIRED: 'CODE_EXPIRED',
  CODE_INVALID: 'CODE_INVALID',
  TOO_MANY_ATTEMPTS: 'TOO_MANY_ATTEMPTS',
  RATE_LIMITED: 'RATE_LIMITED',
  SMS_SEND_FAILED: 'SMS_SEND_FAILED',
  PHONE_ALREADY_REGISTERED: 'PHONE_ALREADY_REGISTERED',
  PHONE_NOT_REGISTERED: 'PHONE_NOT_REGISTERED'
} as const

export type PhoneAuthErrorCode = keyof typeof PHONE_AUTH_ERROR_CODES
