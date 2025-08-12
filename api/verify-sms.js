/**
 * Vercel API 路由：验证手机验证码
 * 处理验证码验证和用户注册/登录
 */

const { createClient } = require('@supabase/supabase-js')

// Supabase 客户端
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * 验证验证码
 */
async function verifyOTP(phone, code) {
  try {
    const { data, error } = await supabase
      .from('sms_verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return { success: false, error: '验证码不存在或已过期' }
    }

    // 检查尝试次数
    if (data.attempts >= 5) {
      return { success: false, error: '尝试次数过多，请重新发送验证码' }
    }

    // 验证码不匹配
    if (data.code !== code) {
      // 增加尝试次数
      await supabase
        .from('sms_verification_codes')
        .update({ 
          attempts: data.attempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)

      return { 
        success: false, 
        error: `验证码不正确，还能尝试 ${4 - data.attempts} 次` 
      }
    }

    // 标记验证码为已验证
    await supabase
      .from('sms_verification_codes')
      .update({ 
        verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)

    return { success: true, data }

  } catch (error) {
    console.error('验证验证码失败:', error)
    return { success: false, error: '验证失败' }
  }
}

/**
 * 创建或获取用户
 */
async function createOrGetUser(phone) {
  try {
    // 首先尝试通过手机号找到现有用户
    const { data: existingProfiles } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', phone)
      .limit(1)

    if (existingProfiles && existingProfiles.length > 0) {
      const profile = existingProfiles[0]
      
      // 获取对应的认证用户
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
      
      if (authUser.user) {
        return { 
          success: true, 
          user: authUser.user, 
          profile,
          isNewUser: false 
        }
      }
    }

    // 用户不存在，创建新用户
    // 使用手机号作为邮箱（Supabase要求邮箱）
    const email = `${phone.replace('+', '')}@phone.reface.app`
    const password = Math.random().toString(36) + Date.now().toString(36) // 随机密码

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      phone,
      password,
      email_confirm: true, // 自动确认邮箱
      phone_confirm: true, // 自动确认手机
      user_metadata: {
        phone,
        created_via: 'sms_verification'
      }
    })

    if (authError) {
      console.error('创建认证用户失败:', authError)
      return { success: false, error: '创建用户失败' }
    }

    // 创建用户配置
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        phone,
        user_type: 'FREE',
        credits_used: 0,
        daily_quota: 3,
        total_quota: 3,
        username: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('创建用户配置失败:', profileError)
      // 清理已创建的认证用户
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: '创建用户配置失败' }
    }

    return { 
      success: true, 
      user: authData.user, 
      profile,
      isNewUser: true 
    }

  } catch (error) {
    console.error('创建或获取用户失败:', error)
    return { success: false, error: '用户处理失败' }
  }
}

/**
 * 生成访问令牌
 */
async function generateAccessToken(userId) {
  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${userId}@temp.reface.app`, // 临时邮箱
      options: {
        redirectTo: process.env.VITE_SITE_URL || 'https://reface.vercel.app'
      }
    })

    if (error) {
      console.error('生成访问令牌失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('生成访问令牌异常:', error)
    return null
  }
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
    const { phone, code } = req.body

    // 验证必要参数
    if (!phone || !code) {
      return res.status(400).json({ 
        success: false, 
        error: '手机号和验证码不能为空' 
      })
    }

    // 验证手机号格式
    const phoneRegex = /^\+86[1][3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        error: '手机号格式不正确' 
      })
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ 
        success: false, 
        error: '验证码格式不正确' 
      })
    }

    console.log(`[SMS] 验证码验证: ${phone} -> ${code}`)

    // 验证验证码
    const verifyResult = await verifyOTP(phone, code)
    
    if (!verifyResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: verifyResult.error 
      })
    }

    console.log('[SMS] 验证码验证成功')

    // 创建或获取用户
    const userResult = await createOrGetUser(phone)
    
    if (!userResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: userResult.error 
      })
    }

    console.log(`[SMS] 用户处理成功: ${userResult.isNewUser ? '新用户' : '现有用户'}`)

    // 生成登录会话
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userResult.user.email,
      options: {
        redirectTo: `${process.env.VITE_SITE_URL || 'https://reface.vercel.app'}/auth/callback`
      }
    })

    if (sessionError) {
      console.error('生成登录会话失败:', sessionError)
      return res.status(500).json({ 
        success: false, 
        error: '登录会话生成失败' 
      })
    }

    // 返回成功响应
    return res.status(200).json({ 
      success: true, 
      message: userResult.isNewUser ? '注册成功' : '登录成功',
      user: {
        id: userResult.user.id,
        phone: userResult.user.phone,
        email: userResult.user.email,
        created_at: userResult.user.created_at
      },
      profile: userResult.profile,
      isNewUser: userResult.isNewUser,
      redirectUrl: sessionData.properties.action_link
    })

  } catch (error) {
    console.error('[SMS] 验证请求异常:', error)
    return res.status(500).json({ 
      success: false, 
      error: '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
