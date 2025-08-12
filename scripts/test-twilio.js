/**
 * Twilio SMS 测试脚本
 * 用于验证Twilio配置是否正确
 */

import { supabase } from '../src/utils/supabase.js'

async function testTwilioSMS() {
  console.log('🧪 开始测试 Twilio SMS 配置...')
  
  try {
    // 测试手机号（请替换为你的真实手机号）
    const testPhone = '+86 138xxxxxxxx' // 请替换为你的手机号
    
    console.log(`📱 向 ${testPhone} 发送测试验证码...`)
    
    // 发送OTP
    const { error } = await supabase.auth.signInWithOtp({
      phone: testPhone,
      options: {
        shouldCreateUser: true
      }
    })
    
    if (error) {
      console.error('❌ 发送失败:', error.message)
      console.log('\n🔍 可能的原因:')
      console.log('1. Twilio 配置信息不正确')
      console.log('2. Twilio 账户余额不足')
      console.log('3. 手机号格式不正确')
      console.log('4. Supabase Phone 认证未启用')
      return false
    }
    
    console.log('✅ 验证码发送成功！')
    console.log('📲 请查看手机是否收到验证码')
    console.log('\n📋 下一步:')
    console.log('1. 检查手机短信')
    console.log('2. 在登录页面输入收到的验证码')
    console.log('3. 如果收不到，检查垃圾短信文件夹')
    
    return true
    
  } catch (error) {
    console.error('💥 测试过程出错:', error)
    return false
  }
}

// 执行测试
testTwilioSMS().then(success => {
  if (success) {
    console.log('\n🎉 Twilio 配置测试完成！')
  } else {
    console.log('\n❌ Twilio 配置需要检查')
  }
  process.exit(0)
})
