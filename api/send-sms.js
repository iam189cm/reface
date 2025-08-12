/**
 * Vercel API 路由：阿里云短信发送
 * 处理手机验证码发送请求
 */

const Core = require('@alicloud/pop-core')
const { createClient } = require('@supabase/supabase-js')

// 配置
const ALIYUN_CONFIG = {
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25',
  signName: process.env.ALIYUN_SMS_SIGN_NAME || 'Reface',
  templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || 'SMS_123456789'
}

// Supabase 客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 发送阿里云短信
 */
async function sendAliyunSMS(phone, code) {
  try {
    const client = new Core({
      accessKeyId: ALIYUN_CONFIG.accessKeyId,
      accessKeySecret: ALIYUN_CONFIG.accessKeySecret,
      endpoint: ALIYUN_CONFIG.endpoint,
      apiVersion: ALIYUN_CONFIG.apiVersion
    })

    const params = {
      'RegionId': 'cn-hangzhou',
      'PhoneNumbers': phone,
      'SignName': ALIYUN_CONFIG.signName,
      'TemplateCode': ALIYUN_CONFIG.templateCode,
      'TemplateParam': JSON.stringify({ code })
    }

    const requestOption = {
      method: 'POST'
    }

    const result = await client.request('SendSms', params, requestOption)
    
    if (result.Code === 'OK') {
      return { success: true, data: result }
    } else {
      return { success: false, error: result.Message || '发送失败', code: result.Code }
    }
    
  } catch (error) {
    console.error('发送阿里云短信失败:', error)
    return { 
      success: false, 
      error: error.message || '发送短信时出错',
      details: error 
    }
  }
}

/**
 * 生成6位数验证码
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * 存储验证码到数据库
 */
async function storeOTP(phone, code) {
  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5分钟过期
    
    const { error } = await supabase
      .from('sms_verification_codes')
      .upsert({
        phone,
        code,
        expires_at: expiresAt,
        attempts: 0,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'phone',
        ignoreDuplicates: false
      })

    if (error) {
      console.error('存储验证码失败:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('存储验证码异常:', error)
    return false
  }
}

/**
 * 检查发送频率限制
 */
async function checkRateLimit(phone) {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
    
    const { data, error } = await supabase
      .from('sms_verification_codes')
      .select('created_at')
      .eq('phone', phone)
      .gte('created_at', oneMinuteAgo)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('检查频率限制失败:', error)
      return false // 出错时允许发送
    }
    
    return data && data.length > 0
  } catch (error) {
    console.error('检查频率限制异常:', error)
    return false
  }
}

/**
 * 验证手机号格式
 */
function validatePhone(phone) {
  if (!phone) return false
  
  // 支持中国大陆手机号：+86开头的11位数字
  const phoneRegex = /^\+86[1][3-9]\d{9}$/
  return phoneRegex.test(phone)
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
    const { phone } = req.body

    // 验证必要参数
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: '手机号不能为空' 
      })
    }

    // 验证手机号格式
    if (!validatePhone(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: '手机号格式不正确，请使用 +86 13800138000 格式' 
      })
    }

    // 检查环境变量
    if (!ALIYUN_CONFIG.accessKeyId || !ALIYUN_CONFIG.accessKeySecret) {
      console.error('阿里云配置缺失')
      return res.status(500).json({ 
        success: false, 
        error: '短信服务配置错误' 
      })
    }

    // 检查发送频率
    const isRateLimited = await checkRateLimit(phone)
    if (isRateLimited) {
      return res.status(429).json({ 
        success: false, 
        error: '发送过于频繁，请稍后再试' 
      })
    }

    // 生成验证码
    const code = generateOTP()
    
    console.log(`[SMS] 准备发送验证码到 ${phone}: ${code}`)

    // 发送短信
    const smsResult = await sendAliyunSMS(phone, code)
    
    if (!smsResult.success) {
      console.error('[SMS] 发送失败:', smsResult)
      return res.status(500).json({ 
        success: false, 
        error: smsResult.error || '发送失败',
        details: process.env.NODE_ENV === 'development' ? smsResult : undefined
      })
    }
    
    console.log('[SMS] 发送成功:', smsResult.data)

    // 存储验证码到数据库
    const stored = await storeOTP(phone, code)
    
    if (!stored) {
      console.error('[SMS] 存储验证码失败')
      return res.status(500).json({ 
        success: false, 
        error: '存储验证码失败' 
      })
    }

    console.log(`[SMS] 验证码已存储: ${phone}`)

    // 返回成功响应
    const response = { 
      success: true, 
      message: '验证码发送成功，请查收短信'
    }

    // 开发环境下返回验证码便于调试
    if (process.env.NODE_ENV === 'development') {
      response.debug = { code, phone }
    }

    return res.status(200).json(response)

  } catch (error) {
    console.error('[SMS] 处理请求异常:', error)
    return res.status(500).json({ 
      success: false, 
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
