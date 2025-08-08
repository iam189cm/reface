#!/usr/bin/env node

/**
 * 私有 OSS Bucket 测试工具
 */

import OSS from 'ali-oss'

console.log('🔍 测试私有 OSS Bucket 配置...\n')

// 检查环境变量
const requiredEnvVars = [
  'VITE_OSS_ACCESS_KEY_ID',
  'VITE_OSS_ACCESS_KEY_SECRET', 
  'VITE_OSS_BUCKET',
  'VITE_OSS_REGION'
]

console.log('1️⃣ 检查环境变量...')
let envOk = true
requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const displayValue = value ? 
    (varName.includes('SECRET') ? value.substring(0, 8) + '...' : value) : 
    '未设置'
  
  console.log(`   ${status} ${varName}: ${displayValue}`)
  if (!value) envOk = false
})

if (!envOk) {
  console.log('\n❌ 环境变量缺失，请先设置环境变量')
  process.exit(1)
}

// 测试 OSS 连接和权限
async function testPrivateBucket() {
  console.log('\n2️⃣ 测试 OSS 连接和权限...')
  
  try {
    // 创建 OSS 客户端
    const client = new OSS({
      region: process.env.VITE_OSS_REGION,
      accessKeyId: process.env.VITE_OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.VITE_OSS_ACCESS_KEY_SECRET,
      bucket: process.env.VITE_OSS_BUCKET
    })
    
    console.log('   ✅ OSS 客户端创建成功')
    
    // 生成测试文件信息
    const timestamp = Date.now()
    const testKey = `test/private-bucket-test-${timestamp}.txt`
    const testContent = `私有 Bucket 测试文件\n创建时间: ${new Date().toISOString()}`
    
    console.log('   📝 测试文件 key:', testKey)
    
    // 1. 测试上传（不设置公共读权限，使用预签名 URL 访问）
    console.log('\n3️⃣ 测试上传文件（私有文件）...')
    
    const putResult = await client.put(testKey, Buffer.from(testContent))
    
    if (putResult.res.status === 200) {
      console.log('   ✅ 文件上传成功')
      console.log('   🔗 文件 URL:', putResult.url)
      
      // 2. 测试直接访问
      console.log('\n4️⃣ 测试文件直接访问...')
      
      try {
        // 使用 OSS 客户端获取文件
        const getResult = await client.get(testKey)
        console.log('   ✅ 文件读取成功')
        console.log('   📄 文件内容预览:', getResult.content.toString().substring(0, 50) + '...')
        
        // 3. 测试预签名 URL 生成（用于访问）
        console.log('\n5️⃣ 测试预签名 URL 生成（访问用）...')
        
        const accessUrl = client.signatureUrl(testKey, {
          method: 'GET',
          expires: 3600 * 24  // 24小时有效
        })
        
        console.log('   ✅ 访问预签名 URL 生成成功')
        console.log('   📏 URL 长度:', accessUrl.length)
        console.log('   🔗 预签名 URL:', accessUrl.substring(0, 100) + '...')
        
        // 4. 测试上传预签名 URL 生成
        console.log('\n6️⃣ 测试上传预签名 URL 生成...')
        
        const uploadUrl = client.signatureUrl(testKey + '-upload-test', {
          method: 'PUT',
          expires: 3600,
          'Content-Type': 'text/plain'
        })
        
        console.log('   ✅ 上传预签名 URL 生成成功')
        console.log('   📏 URL 长度:', uploadUrl.length)
        
        // 5. 清理测试文件
        console.log('\n7️⃣ 清理测试文件...')
        await client.delete(testKey)
        console.log('   ✅ 测试文件已删除')
        
      } catch (accessError) {
        console.log('   ❌ 文件访问失败:', accessError.message)
        console.log('   💡 这可能意味着文件权限设置有问题')
      }
      
    } else {
      console.log('   ❌ 文件上传失败，状态码:', putResult.res.status)
    }
    
  } catch (error) {
    console.log('   ❌ OSS 操作失败:', error.message)
    
    if (error.code === 'NoSuchBucket') {
      console.log('   💡 Bucket 不存在，请检查 Bucket 名称')
    } else if (error.code === 'InvalidAccessKeyId') {
      console.log('   💡 AccessKey ID 无效，请检查环境变量')
    } else if (error.code === 'SignatureDoesNotMatch') {
      console.log('   💡 AccessKey Secret 无效，请检查环境变量')
    } else if (error.code === 'AccessDenied') {
      console.log('   💡 访问被拒绝，请检查 RAM 用户权限')
    }
  }
}

// 显示配置建议
function showConfigAdvice() {
  console.log('\n📋 私有 Bucket 配置总结:')
  console.log('   🔐 Bucket 权限: 私有 (已设置)')
  console.log('   📁 文件权限: 私有（通过预签名 URL 访问）')
  console.log('   🔑 访问方式: 预签名 URL（24小时有效期）')
  console.log('')
  console.log('   ✅ 这种配置的优势:')
  console.log('   • 防止恶意用户上传文件')
  console.log('   • 只有通过你的应用才能上传')
  console.log('   • 文件访问通过预签名 URL 控制')
  console.log('   • 更高的安全性')
  console.log('')
  console.log('   📝 如果测试失败，请检查:')
  console.log('   • RAM 用户是否有足够权限')
  console.log('   • Bucket 名称是否正确')
  console.log('   • 区域设置是否正确')
}

// 运行测试
async function runTest() {
  await testPrivateBucket()
  showConfigAdvice()
  console.log('\n🎯 测试完成!')
}

runTest().catch(error => {
  console.error('\n💥 测试过程中发生错误:', error.message)
  process.exit(1)
})