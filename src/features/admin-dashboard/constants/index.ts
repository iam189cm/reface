/**
 * 管理后台相关常量
 */

// 管理员权限
export const ADMIN_PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  STATISTICS_READ: 'statistics:read',
  SYSTEM_CONFIG: 'system:config',
  AUDIT_READ: 'audit:read',
  BILLING_READ: 'billing:read',
  SUPPORT_WRITE: 'support:write'
} as const

// 用户状态
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned'
} as const

// 排序选项
export const SORT_OPTIONS = {
  CREATED_AT: 'created_at',
  LAST_LOGIN: 'last_login',
  USAGE: 'usage',
  EMAIL: 'email'
} as const

// 系统状态
export const SYSTEM_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  ERROR: 'error'
} as const

// 审计操作类型
export const AUDIT_ACTIONS = {
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_BAN: 'user:ban',
  CREDIT_ADJUST: 'credit:adjust',
  CONFIG_UPDATE: 'config:update',
  SYSTEM_BACKUP: 'system:backup'
} as const

// 默认分页配置
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const
