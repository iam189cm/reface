/**
 * Vercel API 路由：配额消费
 * 安全地消费用户AI配额并记录使用事件
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase 客户端（使用service_role权限）
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 验证JWT令牌并获取用户ID
 */
async function getUserFromToken(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: '缺少认证令牌' }
  }

  const token = authHeader.substring(7)
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return { error: '无效的认证令牌' }
    }

    return { user }
  } catch (error) {
    return { error: '认证验证失败' }
  }
}

/**
 * 获取客户端IP地址
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         null
}

/**
 * 服务类型映射和验证
 */
const VALID_SERVICE_TYPES = {
  'remove_background': { name: '背景移除', defaultCredits: 1 },
  'enlarge_image': { name: '图像放大', defaultCredits: 2 },
  'image_filter': { name: '图像滤镜', defaultCredits: 1 }
}

/**
 * 主处理函数
 */
export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '方法不允许'
    })
  }

  try {
    const { service_type, credits, metadata = {} } = req.body

    // 参数验证
    if (!service_type) {
      return res.status(400).json({
        success: false,
        error: '缺少服务类型参数',
        error_code: 'MISSING_SERVICE_TYPE'
      })
    }

    if (!VALID_SERVICE_TYPES[service_type]) {
      return res.status(400).json({
        success: false,
        error: '无效的服务类型',
        error_code: 'INVALID_SERVICE_TYPE',
        valid_types: Object.keys(VALID_SERVICE_TYPES)
      })
    }

    // 验证用户认证
    const authResult = await getUserFromToken(req.headers.authorization)
    if (authResult.error) {
      return res.status(401).json({
        success: false,
        error: authResult.error,
        error_code: 'AUTHENTICATION_FAILED'
      })
    }

    const user = authResult.user
    const creditsToConsume = credits || VALID_SERVICE_TYPES[service_type].defaultCredits

    // 验证配额数量
    if (creditsToConsume <= 0 || creditsToConsume > 10) {
      return res.status(400).json({
        success: false,
        error: '配额数量必须在1-10之间',
        error_code: 'INVALID_CREDIT_AMOUNT'
      })
    }

    console.log(`[Usage] 用户 ${user.email} 尝试消费 ${creditsToConsume} 个配额用于 ${service_type}`)

    // 获取客户端信息
    const clientIP = getClientIP(req)
    const userAgent = req.headers['user-agent']

    // 调用数据库函数消费配额
    const { data: result, error } = await supabase
      .rpc('consume_user_credits', {
        user_id: user.id,
        credit_amount: creditsToConsume,
        service_type: service_type,
        metadata: {
          ...metadata,
          service_name: VALID_SERVICE_TYPES[service_type].name,
          request_timestamp: new Date().toISOString()
        },
        ip_address: clientIP,
        user_agent: userAgent
      })

    if (error) {
      console.error('[Usage] 数据库函数调用失败:', error)
      return res.status(500).json({
        success: false,
        error: '配额消费失败',
        error_code: 'DATABASE_ERROR'
      })
    }

    // 检查函数返回结果
    if (!result.success) {
      const statusCode = result.error_code === 'INSUFFICIENT_CREDITS' ? 402 :
                        result.error_code === 'USER_BANNED' ? 403 : 400

      return res.status(statusCode).json({
        success: false,
        error: result.error,
        error_code: result.error_code,
        required_credits: result.required_credits,
        available_credits: result.available_credits,
        event_id: result.event_id
      })
    }

    console.log(`[Usage] 配额消费成功: ${user.email}, 剩余配额: ${result.remaining_credits}`)

    // 返回成功响应
    const response = {
      success: true,
      message: `成功消费 ${result.credits_consumed} 个配额`,
      data: {
        service_type: service_type,
        service_name: VALID_SERVICE_TYPES[service_type].name,
        credits_consumed: result.credits_consumed,
        remaining_credits: result.remaining_credits,
        user_type: result.user_type,
        event_id: result.event_id
      }
    }

    // 添加警告信息（如果配额不足）
    if (result.warning) {
      response.warning = result.warning
      response.warning_code = result.warning_code
    }

    return res.status(200).json(response)

  } catch (error) {
    console.error('[Usage] 配额消费异常:', error)
    
    return res.status(500).json({
      success: false,
      error: '服务器内部错误',
      error_code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// 导出配置
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
