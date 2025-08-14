/**
 * API相关类型定义
 */

import type { BaseResponse, PaginatedData, ID, AIServiceType } from './common.types'

// HTTP方法
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API请求配置
export interface ApiRequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

// 用户认证相关API
export namespace AuthAPI {
  // 登录请求
  export interface LoginRequest {
    email?: string
    phone?: string
    password?: string
    verificationCode?: string
  }

  // 登录响应
  export interface LoginResponse extends BaseResponse {
    data: {
      user: import('./common.types').User
      token: string
      refreshToken: string
    }
  }

  // 注册请求
  export interface RegisterRequest {
    email?: string
    phone?: string
    password?: string
    verificationCode?: string
    provider?: 'google' | 'wechat'
  }

  // 发送验证码请求
  export interface SendVerificationCodeRequest {
    phone: string
    purpose: 'register' | 'login' | 'reset_password'
  }
}

// 用户管理相关API
export namespace UserAPI {
  // 用户列表查询参数
  export interface UserListParams {
    page?: number
    pageSize?: number
    search?: string
    userType?: import('./common.types').UserType
  }

  // 用户列表响应
  export interface UserListResponse extends BaseResponse {
    data: PaginatedData<import('./common.types').User>
  }

  // 用户配额调整请求
  export interface AdjustCreditsRequest {
    userId: ID
    amount: number
    reason: string
  }
}

// AI服务相关API
export namespace AIAPI {
  // AI服务请求基础参数
  export interface AIServiceRequest {
    imageUrl: string
    serviceType: AIServiceType
    options?: Record<string, any>
  }

  // 背景移除请求
  export interface RemoveBackgroundRequest extends AIServiceRequest {
    serviceType: 'remove_background'
    options?: {
      format?: 'png' | 'jpg'
      quality?: number
    }
  }

  // 图片放大请求
  export interface EnlargeImageRequest extends AIServiceRequest {
    serviceType: 'enlarge_image'
    options?: {
      scale?: number
      format?: string
      quality?: number
    }
  }

  // AI服务响应
  export interface AIServiceResponse extends BaseResponse {
    data: {
      resultUrl: string
      creditsConsumed: number
      processTime: number
    }
  }
}

// 文件上传相关API
export namespace UploadAPI {
  // 文件上传请求
  export interface UploadRequest {
    file: File
    folder?: string
  }

  // 文件上传响应
  export interface UploadResponse extends BaseResponse {
    data: {
      url: string
      filename: string
      size: number
    }
  }
}

// 统计数据相关API
export namespace StatsAPI {
  // 系统统计响应
  export interface SystemStatsResponse extends BaseResponse {
    data: {
      totalUsers: number
      dailyActiveUsers: number
      dailyAIUsage: number
      systemAlerts: number
    }
  }

  // 使用统计响应
  export interface UsageStatsResponse extends BaseResponse {
    data: {
      serviceRanking: Array<{
        type: AIServiceType
        name: string
        usage: number
        percentage: number
      }>
      recentEvents: Array<{
        id: ID
        serviceType: AIServiceType
        userEmail: string
        creditsConsumed: number
        status: string
        createdAt: string
      }>
    }
  }
}
