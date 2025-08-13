/**
 * Vercel API 路由：管理员统计数据
 * 提供系统统计、使用分析等数据
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

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.user_type !== 'ADMIN') {
      return { error: '权限不足：需要管理员权限' }
    }

    return { user, profile }
  } catch (error) {
    return { error: '认证验证失败' }
  }
}

/**
 * 获取系统概览统计
 */
async function getSystemOverview() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // 并行获取各项统计
    const [
      totalUsersResult,
      dailyActiveResult,
      dailyUsageResult,
      userTypesResult
    ] = await Promise.all([
      // 总用户数
      supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true }),
      
      // 今日活跃用户（有使用记录的用户）
      supabase
        .from('usage_events')
        .select('user_id', { count: 'exact', head: true })
        .gte('created_at', todayISO)
        .not('user_id', 'is', null),
      
      // 今日AI使用总量
      supabase
        .from('usage_events')
        .select('credits_consumed.sum()')
        .gte('created_at', todayISO)
        .eq('status', 'completed'),
      
      // 用户类型分布
      supabase
        .from('user_profiles')
        .select('user_type, count(*)')
        .not('user_type', 'is', null)
    ])

    // 计算今日唯一活跃用户数
    const { data: uniqueActiveUsers } = await supabase
      .from('usage_events')
      .select('user_id')
      .gte('created_at', todayISO)
      .not('user_id', 'is', null)

    const uniqueActiveCount = new Set(uniqueActiveUsers?.map(u => u.user_id) || []).size

    // 系统告警数量（可以根据实际需求定义告警规则）
    const systemAlerts = await calculateSystemAlerts()

    return {
      success: true,
      data: {
        totalUsers: totalUsersResult.count || 0,
        dailyActiveUsers: uniqueActiveCount,
        dailyAIUsage: dailyUsageResult.data?.[0]?.sum || 0,
        systemAlerts: systemAlerts,
        userTypeDistribution: userTypesResult.data || []
      }
    }
  } catch (error) {
    console.error('获取系统概览失败:', error)
    return { success: false, error: '获取统计数据失败' }
  }
}

/**
 * 计算系统告警数量
 */
async function calculateSystemAlerts() {
  try {
    let alertCount = 0
    
    // 检查失败率过高的服务
    const { data: failedEvents } = await supabase
      .from('usage_events')
      .select('id')
      .eq('status', 'failed')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    const { data: totalEvents } = await supabase
      .from('usage_events')
      .select('id')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    
    const failureRate = totalEvents.length > 0 ? (failedEvents.length / totalEvents.length) : 0
    
    if (failureRate > 0.1) { // 失败率超过10%
      alertCount++
    }
    
    // 检查是否有被封禁的用户（近期）
    const { data: bannedUsers } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_type', 'BANNED')
      .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    
    if (bannedUsers.length > 0) {
      alertCount++
    }
    
    // 检查异常的使用模式（可以添加更多规则）
    const { data: heavyUsers } = await supabase
      .from('usage_events')
      .select('user_id, count(*)')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .group('user_id')
      .having('count(*) > 100') // 单日使用超过100次的用户
    
    if (heavyUsers.length > 5) { // 超过5个重度使用用户
      alertCount++
    }
    
    return alertCount
  } catch (error) {
    console.error('计算系统告警失败:', error)
    return 0
  }
}

/**
 * 获取服务使用排行
 */
async function getServiceUsageRanking(days = 7) {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: usageData, error } = await supabase
      .from('usage_events')
      .select('service_type, credits_consumed')
      .gte('created_at', startDate)
      .eq('status', 'completed')
      .not('service_type', 'eq', 'admin_action')

    if (error) throw error

    // 统计各服务的使用量
    const serviceStats = {}
    let totalUsage = 0

    usageData.forEach(event => {
      const service = event.service_type
      const credits = event.credits_consumed || 1
      
      if (!serviceStats[service]) {
        serviceStats[service] = 0
      }
      serviceStats[service] += credits
      totalUsage += credits
    })

    // 转换为排行榜格式
    const ranking = Object.entries(serviceStats)
      .map(([type, usage]) => {
        const serviceNames = {
          'remove_background': '背景移除',
          'enlarge_image': '图像放大',
          'image_filter': '图像滤镜'
        }
        
        const colors = {
          'remove_background': 'bg-blue-500',
          'enlarge_image': 'bg-green-500',
          'image_filter': 'bg-purple-500'
        }

        return {
          type,
          name: serviceNames[type] || type,
          usage,
          percentage: totalUsage > 0 ? Math.round((usage / totalUsage) * 100) : 0,
          color: colors[type] || 'bg-gray-500'
        }
      })
      .sort((a, b) => b.usage - a.usage)

    return { success: true, data: ranking }
  } catch (error) {
    console.error('获取服务使用排行失败:', error)
    return { success: false, error: '获取使用排行失败' }
  }
}

/**
 * 获取最近事件
 */
async function getRecentEvents(limit = 50) {
  try {
    const { data: events, error } = await supabase
      .from('usage_events')
      .select(`
        id,
        user_id,
        service_type,
        action,
        credits_consumed,
        status,
        created_at,
        error_message
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // 获取对应的用户邮箱信息
    const eventsWithUserInfo = await Promise.all(
      events.map(async (event) => {
        try {
          const { data: authUser } = await supabase.auth.admin.getUserById(event.user_id)
          return {
            ...event,
            user_email: authUser.user?.email || 'N/A'
          }
        } catch (error) {
          return {
            ...event,
            user_email: 'N/A'
          }
        }
      })
    )

    return { success: true, data: eventsWithUserInfo }
  } catch (error) {
    console.error('获取最近事件失败:', error)
    return { success: false, error: '获取最近事件失败' }
  }
}

/**
 * 获取使用趋势数据
 */
async function getUsageTrends(days = 30) {
  try {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const { data: usageData, error } = await supabase
      .from('usage_events')
      .select('created_at, service_type, credits_consumed')
      .gte('created_at', startDate.toISOString())
      .eq('status', 'completed')
      .order('created_at', { ascending: true })

    if (error) throw error

    // 按日期分组统计
    const dailyStats = {}
    
    usageData.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          total: 0,
          services: {}
        }
      }
      
      const credits = event.credits_consumed || 1
      dailyStats[date].total += credits
      
      const service = event.service_type
      if (!dailyStats[date].services[service]) {
        dailyStats[date].services[service] = 0
      }
      dailyStats[date].services[service] += credits
    })

    // 转换为数组格式
    const trendData = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date))

    return { success: true, data: trendData }
  } catch (error) {
    console.error('获取使用趋势失败:', error)
    return { success: false, error: '获取使用趋势失败' }
  }
}

/**
 * 主处理函数
 */
export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: '方法不允许'
    })
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

    const { type, days, limit } = req.query

    let result
    
    switch (type) {
      case 'overview':
        result = await getSystemOverview()
        break
      
      case 'service-ranking':
        result = await getServiceUsageRanking(parseInt(days) || 7)
        break
      
      case 'recent-events':
        result = await getRecentEvents(parseInt(limit) || 50)
        break
      
      case 'usage-trends':
        result = await getUsageTrends(parseInt(days) || 30)
        break
      
      case 'all':
        // 获取所有统计数据
        const [overview, ranking, events, trends] = await Promise.all([
          getSystemOverview(),
          getServiceUsageRanking(7),
          getRecentEvents(20),
          getUsageTrends(30)
        ])
        
        if (!overview.success || !ranking.success || !events.success || !trends.success) {
          throw new Error('获取统计数据失败')
        }
        
        result = {
          success: true,
          data: {
            overview: overview.data,
            serviceRanking: ranking.data,
            recentEvents: events.data,
            usageTrends: trends.data
          }
        }
        break
      
      default:
        return res.status(400).json({
          success: false,
          error: '无效的统计类型。支持的类型：overview, service-ranking, recent-events, usage-trends, all'
        })
    }

    return res.status(result.success ? 200 : 400).json(result)

  } catch (error) {
    console.error('[Admin] 统计API异常:', error)
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
