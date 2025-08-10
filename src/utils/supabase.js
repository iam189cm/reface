/**
 * Supabase 客户端配置
 * 提供统一的 Supabase 访问接口
 */

import { createClient } from '@supabase/supabase-js'

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 环境变量未配置：请检查 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 自动刷新token
    autoRefreshToken: true,
    // 持久化会话
    persistSession: true,
    // 检测会话变化
    detectSessionInUrl: true,
    // 重定向URL配置
    redirectTo: window?.location?.origin || 'http://localhost:5173'
  },
  // 全局配置
  global: {
    headers: {
      'X-Client-Info': 'reface-webapp'
    }
  }
})

// 导出常用的数据库表名
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  USER_QUOTAS: 'user_quotas',
  USAGE_LOGS: 'usage_logs',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments'
}

// 导出用户类型枚举
export const USER_TYPES = {
  FREE: 'FREE',
  STARTER: 'STARTER', 
  PRO: 'PRO',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN'
}

// 用户类型配额配置
export const USER_TYPE_CONFIGS = {
  FREE: {
    displayName: '免费版',
    dailyQuota: 3,
    maxResolution: '1080p',
    hasWatermark: true,
    features: ['基础滤镜', '标准处理速度'],
    price: 0
  },
  STARTER: {
    displayName: '入门版',
    dailyQuota: 30,
    maxResolution: '2K',
    hasWatermark: false,
    features: ['所有滤镜', '无水印输出', '基础客服'],
    price: 9.9
  },
  PRO: {
    displayName: '专业版',
    dailyQuota: 100,
    maxResolution: '4K',
    hasWatermark: false,
    features: ['批量处理', '高级AI背景移除', '优先处理', '专业客服'],
    price: 19.9
  },
  BUSINESS: {
    displayName: '商业版',
    dailyQuota: -1, // 无限制
    maxResolution: '8K',
    hasWatermark: false,
    features: ['无限处理', 'API接口', '白标方案', '专属客服', '高级分析'],
    price: 49.9
  },
  ADMIN: {
    displayName: '管理员',
    dailyQuota: -1,
    maxResolution: '8K',
    hasWatermark: false,
    features: ['所有功能', '系统管理', '用户管理', '数据统计'],
    price: 0
  }
}

// 服务类型枚举
export const SERVICE_TYPES = {
  VANCE_AI: 'vance_ai',
  REMOVE_BG: 'remove_bg',
  IMAGE_FILTERS: 'image_filters'
}

// 日志记录辅助函数
const logSupabaseOperation = (operation, data, error = null) => {
  if (import.meta.env.DEV) {
    console.log(`[Supabase ${operation}]:`, { data, error })
  }
}

// 错误处理辅助函数
export const handleSupabaseError = (error, operation = '操作') => {
  logSupabaseOperation(operation, null, error)
  
  // 常见错误处理
  if (error?.code === 'PGRST301') {
    return '数据不存在'
  } else if (error?.code === 'PGRST116') {
    return '记录未找到'
  } else if (error?.code === '23505') {
    return '数据已存在'
  } else if (error?.message?.includes('JWT')) {
    return '登录已过期，请重新登录'
  } else if (error?.message?.includes('Row Level Security')) {
    return '权限不足'
  }
  
  return error?.message || `${operation}失败`
}

// 检查 Supabase 连接状态
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    logSupabaseOperation('连接检查', '连接正常')
    return { connected: true, error: null }
  } catch (error) {
    logSupabaseOperation('连接检查', null, error)
    return { 
      connected: false, 
      error: handleSupabaseError(error, '连接检查') 
    }
  }
}

// 开发环境调试工具
if (import.meta.env.DEV) {
  window.supabase = supabase
  window.checkSupabaseConnection = checkSupabaseConnection
  console.log('🔧 开发模式：Supabase 调试工具已挂载到 window')
}
