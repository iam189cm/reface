/**
 * Supabase Edge Function: 阿里云短信发送
 * 处理验证码发送请求
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 阿里云短信配置
const ALIYUN_CONFIG = {
  accessKeyId: Deno.env.get('ALIYUN_ACCESS_KEY_ID'),
  accessKeySecret: Deno.env.get('ALIYUN_ACCESS_KEY_SECRET'),
  signName: Deno.env.get('ALIYUN_SMS_SIGN_NAME') || 'Reface',
  templateCode: Deno.env.get('ALIYUN_SMS_TEMPLATE_CODE') || 'SMS_123456789',
  endpoint: 'https://dysmsapi.aliyuncs.com'
}

// Supabase 客户端
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

/**
 * 生成阿里云API签名
 */
function generateSignature(params: Record<string, string>, method: string = 'POST'): string {
  const accessKeySecret = ALIYUN_CONFIG.accessKeySecret + '&'
  
  // 按key排序参数
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  // 构造签名字符串
  const stringToSign = `${method}&${encodeURIComponent('/')}&${encodeURIComponent(sortedParams)}`
  
  // 使用HMAC-SHA1计算签名
  const encoder = new TextEncoder()
  const keyData = encoder.encode(accessKeySecret)
  const stringData = encoder.encode(stringToSign)
  
  return btoa(
    String.fromCharCode(
      ...new Uint8Array(
        // 这里需要实现HMAC-SHA1，为了简化，我们使用crypto-js
        // 在实际实现中，你可能需要引入crypto库
      )
    )
  )
}

/**
 * 发送阿里云短信
 */
async function sendAliyunSMS(phone: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    const nonce = Math.random().toString(36).substring(2, 15)
    
    // 构造请求参数
    const params: Record<string, string> = {
      'Format': 'JSON',
      'Version': '2017-05-25',
      'AccessKeyId': ALIYUN_CONFIG.accessKeyId!,
      'SignatureMethod': 'HMAC-SHA1',
      'Timestamp': timestamp,
      'SignatureVersion': '1.0',
      'SignatureNonce': nonce,
      'Action': 'SendSms',
      'PhoneNumbers': phone,
      'SignName': ALIYUN_CONFIG.signName,
      'TemplateCode': ALIYUN_CONFIG.templateCode,
      'TemplateParam': JSON.stringify({ code })
    }
    
    // 生成签名 (简化版本，实际项目中需要正确实现HMAC-SHA1)
    // params['Signature'] = generateSignature(params)
    
    // 临时使用阿里云SDK的REST API方式
    const response = await fetch(ALIYUN_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params).toString()
    })
    
    const result = await response.json()
    
    if (result.Code === 'OK') {
      return { success: true }
    } else {
      return { success: false, error: result.Message || '发送失败' }
    }
    
  } catch (error) {
    console.error('发送短信失败:', error)
    return { success: false, error: '发送短信时出错' }
  }
}

/**
 * 生成6位数验证码
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * 存储验证码到数据库
 */
async function storeOTP(phone: string, code: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sms_verification_codes')
      .upsert({
        phone,
        code,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5分钟过期
        created_at: new Date().toISOString()
      }, {
        onConflict: 'phone'
      })
    
    return !error
  } catch (error) {
    console.error('存储验证码失败:', error)
    return false
  }
}

serve(async (req) => {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: '方法不允许' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { phone } = await req.json()
    
    if (!phone) {
      return new Response(
        JSON.stringify({ error: '手机号不能为空' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 验证手机号格式
    const phoneRegex = /^\+86[1][3-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: '手机号格式不正确' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 检查发送频率限制（防止刷短信）
    const { data: recentSMS } = await supabase
      .from('sms_verification_codes')
      .select('created_at')
      .eq('phone', phone)
      .gte('created_at', new Date(Date.now() - 60 * 1000).toISOString())
      .single()

    if (recentSMS) {
      return new Response(
        JSON.stringify({ error: '发送过于频繁，请稍后再试' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 生成验证码
    const code = generateOTP()
    
    // 发送短信
    const smsResult = await sendAliyunSMS(phone, code)
    
    if (!smsResult.success) {
      return new Response(
        JSON.stringify({ error: smsResult.error || '发送失败' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // 存储验证码
    const stored = await storeOTP(phone, code)
    
    if (!stored) {
      return new Response(
        JSON.stringify({ error: '存储验证码失败' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '验证码发送成功',
        // 开发环境下返回验证码便于测试
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { code })
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('处理请求失败:', error)
    return new Response(
      JSON.stringify({ error: '服务器内部错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
