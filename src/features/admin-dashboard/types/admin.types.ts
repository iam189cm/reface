/**
 * 管理后台相关类型定义
 */

import type { ID, Timestamp, BaseResponse, PaginatedData } from '@/shared/types'
import type { UserType } from '../../user-auth/types/auth.types'

// 管理员权限
export type AdminPermission = 
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'statistics:read'
  | 'system:config'
  | 'audit:read'
  | 'billing:read'
  | 'support:write'

// 系统统计信息
export interface SystemStatistics {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  totalAIUsage: number
  dailyAIUsage: number
  systemAlerts: number
  serverStatus: 'healthy' | 'warning' | 'error'
  uptime: number
  lastUpdateAt: Timestamp
}

// 用户管理查询参数
export interface UserSearchParams {
  query?: string
  userType?: UserType
  status?: 'active' | 'inactive' | 'banned'
  dateFrom?: string
  dateTo?: string
  sortBy?: 'created_at' | 'last_login' | 'usage'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// 用户统计信息
export interface UserStatistics {
  id: ID
  email: string
  phone?: string
  userType: UserType
  creditsUsed: number
  totalQuota: number
  lastLoginAt?: Timestamp
  createdAt: Timestamp
  isActive: boolean
}

// 配额调整记录
export interface CreditAdjustment {
  id: ID
  userId: ID
  adminId: ID
  amount: number
  reason: string
  previousBalance: number
  newBalance: number
  createdAt: Timestamp
}

// 系统配置
export interface SystemConfig {
  id: string
  category: string
  key: string
  value: any
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  isEditable: boolean
  updatedAt: Timestamp
  updatedBy: ID
}

// 审计日志
export interface AuditLog {
  id: ID
  adminId: ID
  adminEmail: string
  action: string
  resource: string
  resourceId?: ID
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: Timestamp
}

// 管理员操作响应
export interface AdminActionResponse extends BaseResponse {
  data?: {
    affected: number
    details?: any
  }
}
