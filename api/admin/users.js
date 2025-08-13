/**
 * Vercel API 路由：管理员用户管理
 * 处理用户搜索、配额管理、用户状态管理等功能
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase 客户端（使用service_role权限）
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 验证管理员权限
 */
async function verifyAdminPermission(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: '缺少认证令牌' }
  }

  const token = authHeader.substring(7)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { error: '无效的认证令牌' }
    }

    // 检查用户资料中的管理员权限
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return { error: '无法获取用户权限信息' }
    }

    if (profile.user_type !== 'ADMIN') {
      return { error: '权限不足：需要管理员权限' }
    }

    return { user, profile }
  } catch (error) {
    return { error: '认证验证失败' }
  }
}

/**
 * 搜索用户
 */
async function searchUsers(query, limit = 20, offset = 0) {
  try {
    let queryBuilder = supabase
      .from('user_profiles')
      .select(`
        id,
        user_type,
        credits_used,
        daily_quota,
        total_quota,
        phone,
        avatar_url,
        created_at,
        updated_at
      `)

    // 根据查询条件搜索
    if (query) {
      // 尝试按邮箱搜索（需要关联auth.users表）
      const { data: authUsers } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 100
      })
      
      const matchedUserIds = authUsers.users
        .filter(user => 
          user.email?.toLowerCase().includes(query.toLowerCase()) ||
          user.id === query
        )
        .map(user => user.id)

      if (matchedUserIds.length > 0) {
        queryBuilder = queryBuilder.in('id', matchedUserIds)
      } else {
        // 按手机号搜索
        queryBuilder = queryBuilder.ilike('phone', `%${query}%`)
      }
    }

    const { data: profiles, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // 获取对应的认证用户信息
    const usersWithEmail = await Promise.all(
      profiles.map(async (profile) => {
        try {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
          return {
            ...profile,
            email: authUser.user?.email || 'N/A',
            email_confirmed_at: authUser.user?.email_confirmed_at,
            last_sign_in_at: authUser.user?.last_sign_in_at
          }
        } catch (error) {
          console.error('获取用户邮箱失败:', profile.id, error)
          return {
            ...profile,
            email: 'N/A'
          }
        }
      })
    )

    return { success: true, data: usersWithEmail }
  } catch (error) {
    console.error('搜索用户失败:', error)
    return { success: false, error: '搜索用户失败' }
  }
}

/**
 * 调整用户配额
 */
async function adjustUserCredits(userId, creditAmount, reason, adminUserId) {
  try {
    // 调用数据库函数
    const { data: result, error } = await supabase
      .rpc('admin_add_credits', {
        target_user_id: userId,
        credit_amount: creditAmount,
        reason: reason,
        admin_user_id: adminUserId
      })

    if (error) {
      console.error('调用配额调整函数失败:', error)
      throw error
    }

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('调整用户配额失败:', error)
    return { success: false, error: '调整配额失败' }
  }
}

/**
 * 更新用户状态（封禁/解封）
 */
async function updateUserStatus(userId, userType, reason, adminUserId) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        user_type: userType,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    // 记录管理员操作日志
    await supabase
      .from('usage_events')
      .insert({
        user_id: userId,
        service_type: 'admin_action',
        action: userType === 'BANNED' ? 'ban_user' : 'unban_user',
        credits_consumed: 0,
        metadata: {
          reason: reason,
          admin_user_id: adminUserId,
          previous_type: userType === 'BANNED' ? 'FREE' : 'BANNED',
          new_type: userType
        },
        status: 'completed'
      })

    return { success: true }
  } catch (error) {
    console.error('更新用户状态失败:', error)
    return { success: false, error: '更新用户状态失败' }
  }
}

/**
 * 获取用户详情
 */
async function getUserDetail(userId) {
  try {
    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    // 获取认证用户信息
    const { data: authUser } = await supabase.auth.admin.getUserById(userId)

    // 获取用户使用记录（最近30天）
    const { data: usageEvents, error: usageError } = await supabase
      .from('usage_events')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(50)

    if (usageError) {
      console.warn('获取使用记录失败:', usageError)
    }

    return {
      success: true,
      data: {
        profile,
        authUser: authUser.user,
        usageEvents: usageEvents || []
      }
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return { success: false, error: '获取用户详情失败' }
  }
}

/**
 * 主处理函数
 */
export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // 验证管理员权限
    const authResult = await verifyAdminPermission(req.headers.authorization)
    if (authResult.error) {
      return res.status(401).json({
        success: false,
        error: authResult.error
      })
    }

    const adminUser = authResult.user

    // 根据请求方法和路径处理不同操作
    switch (req.method) {
      case 'GET': {
        // 搜索用户或获取用户详情
        const { query, limit, offset, userId } = req.query

        if (userId) {
          // 获取用户详情
          const result = await getUserDetail(userId)
          return res.status(result.success ? 200 : 400).json(result)
        } else {
          // 搜索用户
          const result = await searchUsers(query, parseInt(limit) || 20, parseInt(offset) || 0)
          return res.status(result.success ? 200 : 400).json(result)
        }
      }

      case 'POST': {
        // 调整用户配额
        const { userId, creditAmount, reason } = req.body

        if (!userId || creditAmount === undefined) {
          return res.status(400).json({
            success: false,
            error: '缺少必要参数：userId, creditAmount'
          })
        }

        const result = await adjustUserCredits(userId, creditAmount, reason || '管理员调整', adminUser.id)
        return res.status(result.success ? 200 : 400).json(result)
      }

      case 'PUT': {
        // 更新用户状态
        const { userId, userType, reason } = req.body

        if (!userId || !userType) {
          return res.status(400).json({
            success: false,
            error: '缺少必要参数：userId, userType'
          })
        }

        // 验证用户类型
        const validTypes = ['FREE', 'STARTER', 'PRO', 'BUSINESS', 'BANNED']
        if (!validTypes.includes(userType)) {
          return res.status(400).json({
            success: false,
            error: '无效的用户类型'
          })
        }

        const result = await updateUserStatus(userId, userType, reason || '管理员操作', adminUser.id)
        return res.status(result.success ? 200 : 400).json(result)
      }

      default:
        return res.status(405).json({
          success: false,
          error: '方法不允许'
        })
    }

  } catch (error) {
    console.error('[Admin] 用户管理API异常:', error)
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
