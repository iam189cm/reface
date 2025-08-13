/**
 * Supabase Edge Function: 短信验证码验证
 * 处理验证码验证和用户注册/登录
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase 客户端（管理员权限）
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// 用户类型配置
const USER_TYPES = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO',
  BUSINESS: 'BUSINESS',
  ADMIN: 'ADMIN'
}

/**
 * 验证验证码
 */
async function verifyOTP(phone: string, code: string) {
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
async function createOrGetUser(phone: string) {
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
      const { data: authData } = await supabase.auth.admin.getUserById(profile.id)
      
      if (authData.user) {
        return { 
          success: true, 
          user: authData.user, 
          profile,
          isNewUser: false 
        }
      }
    }

    // 用户不存在，创建新用户
    // 使用手机号作为邮箱（Supabase要求邮箱）
    const email = `${phone.replace('+', '')}@phone.reface.app`
    const password = crypto.randomUUID() + Date.now().toString(36) // 随机密码

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
        user_type: USER_TYPES.FREE,
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
 * 生成登录会话
 */
async function generateLoginSession(user: any) {
  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL') || 'https://reface.dataechotech.com'}/auth/callback`
      }
    })

    if (error) {
      console.error('生成登录会话失败:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('生成登录会话异常:', error)
    return null
  }
}

/**
 * 记录使用事件
 */
async function logUsageEvent(userId: string, action: string, metadata = {}) {
  try {
    await supabase
      .from('usage_events')
      .insert({
        user_id: userId,
        service_type: 'auth_sms',
        action: action,
        credits_consumed: 0,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        },
        status: 'completed'
      })
  } catch (error) {
    console.error('记录使用事件失败:', error)
    // 不影响主流程，静默处理
  }
}

serve(async (req) => {
  // 设置CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '方法不允许' 
      }),
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    const { phone, code } = await req.json()

    // 验证必要参数
    if (!phone || !code) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '手机号和验证码不能为空' 
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    // 验证手机号格式
    const phoneRegex = /^\+86[1][3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '手机号格式不正确' 
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    // 验证验证码格式
    if (!/^\d{6}$/.test(code)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '验证码格式不正确' 
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log(`[SMS-Verify] 验证码验证: ${phone} -> ${code}`)

    // 验证验证码
    const verifyResult = await verifyOTP(phone, code)
    
    if (!verifyResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: verifyResult.error 
        }),
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('[SMS-Verify] 验证码验证成功')

    // 创建或获取用户
    const userResult = await createOrGetUser(phone)
    
    if (!userResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: userResult.error 
        }),
        { status: 500, headers: corsHeaders }
      )
    }

    console.log(`[SMS-Verify] 用户处理成功: ${userResult.isNewUser ? '新用户' : '现有用户'}`)

    // 生成登录会话
    const sessionData = await generateLoginSession(userResult.user)

    if (!sessionData) {
      console.error('生成登录会话失败')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: '登录会话生成失败' 
        }),
        { status: 500, headers: corsHeaders }
      )
    }

    // 记录认证事件
    await logUsageEvent(userResult.user.id, userResult.isNewUser ? 'register' : 'login', {
      phone: phone,
      method: 'sms_verification'
    })

    // 返回成功响应
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: userResult.isNewUser ? '注册成功' : '登录成功',
        data: {
          user: {
            id: userResult.user.id,
            phone: userResult.user.phone,
            email: userResult.user.email,
            created_at: userResult.user.created_at
          },
          profile: userResult.profile,
          isNewUser: userResult.isNewUser,
          redirectUrl: sessionData.properties.action_link
        }
      }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('[SMS-Verify] 验证请求异常:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: '服务器内部错误',
        details: Deno.env.get('ENVIRONMENT') === 'development' ? error.message : undefined
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
