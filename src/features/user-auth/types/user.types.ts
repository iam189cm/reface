/**
 * 用户相关类型定义
 */

import type { ID, Timestamp } from '@/shared/types'
import type { UserType, UserProfile } from './auth.types'

// 用户详细信息
export interface UserDetail extends UserProfile {
  // 基础信息
  firstName?: string
  lastName?: string
  bio?: string
  website?: string
  location?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  
  // 联系信息
  phoneCountryCode?: string
  backupEmail?: string
  
  // 偏好设置
  language: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  
  // 通知设置
  emailNotifications: UserNotificationSettings
  pushNotifications: UserNotificationSettings
  
  // 隐私设置
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showPhone: boolean
  
  // 安全设置
  twoFactorEnabled: boolean
  securityQuestions: UserSecurityQuestion[]
  
  // 统计信息
  stats: UserStatistics
}

// 用户通知设置
export interface UserNotificationSettings {
  enabled: boolean
  marketing: boolean
  product: boolean
  security: boolean
  social: boolean
}

// 用户安全问题
export interface UserSecurityQuestion {
  id: ID
  question: string
  answer: string // 已加密
  createdAt: Timestamp
}

// 用户统计信息
export interface UserStatistics {
  totalImagesProcessed: number
  totalCreditsUsed: number
  totalSavingsEarned: number
  joinedDaysAgo: number
  lastActiveAt: Timestamp
  favoriteService: string
  averageProcessingTime: number
}

// 用户活动日志
export interface UserActivity {
  id: ID
  userId: ID
  type: UserActivityType
  action: string
  description: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Timestamp
}

// 用户活动类型
export type UserActivityType = 
  | 'auth'      // 认证相关
  | 'profile'   // 资料更新
  | 'security'  // 安全操作
  | 'service'   // 服务使用
  | 'payment'   // 支付相关
  | 'social'    // 社交操作

// 用户会话信息
export interface UserSession {
  id: ID
  userId: ID
  sessionToken: string
  deviceInfo: DeviceInfo
  location?: SessionLocation
  isActive: boolean
  createdAt: Timestamp
  lastAccessAt: Timestamp
  expiresAt: Timestamp
}

// 设备信息
export interface DeviceInfo {
  deviceType: 'desktop' | 'mobile' | 'tablet'
  deviceName?: string
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  isMobile: boolean
  isBot: boolean
}

// 会话位置信息
export interface SessionLocation {
  country: string
  countryCode: string
  region: string
  city: string
  latitude?: number
  longitude?: number
  timezone: string
}

// 用户偏好设置
export interface UserPreferences {
  // 界面设置
  ui: {
    theme: 'light' | 'dark' | 'system'
    language: string
    fontSize: 'small' | 'medium' | 'large'
    compactMode: boolean
  }
  
  // 功能设置
  features: {
    autoSave: boolean
    showTutorials: boolean
    showTips: boolean
    enableKeyboardShortcuts: boolean
  }
  
  // 处理设置
  processing: {
    defaultQuality: 'low' | 'medium' | 'high'
    autoOptimize: boolean
    keepOriginals: boolean
    compressionLevel: number
  }
  
  // 隐私设置
  privacy: {
    allowAnalytics: boolean
    allowPersonalization: boolean
    shareUsageData: boolean
  }
}

// 用户订阅信息
export interface UserSubscription {
  id: ID
  userId: ID
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  cancelAtPeriodEnd: boolean
  canceledAt?: Timestamp
  trialStart?: Timestamp
  trialEnd?: Timestamp
  metadata?: Record<string, any>
}

// 订阅计划
export interface SubscriptionPlan {
  id: ID
  name: string
  displayName: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  quotaLimit: number
  maxFileSize: number
  priority: 'normal' | 'high' | 'urgent'
}

// 订阅状态
export type SubscriptionStatus = 
  | 'active'
  | 'past_due' 
  | 'canceled'
  | 'unpaid'
  | 'trialing'
  | 'incomplete'
  | 'incomplete_expired'

// 用户反馈
export interface UserFeedback {
  id: ID
  userId: ID
  type: 'bug' | 'feature' | 'complaint' | 'praise' | 'other'
  subject: string
  content: string
  rating?: number
  tags: string[]
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
  adminResponse?: string
  attachments: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
