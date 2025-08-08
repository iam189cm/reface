#!/usr/bin/env node

/**
 * OSS 配置和连接诊断工具
 */

// 加载 .env 文件
import dotenv from 'dotenv'
dotenv.config()

// 使用内置 fetch API (Node.js 18+)

console.log('🔍 OSS 诊断工具启动...\n')

// 1. 检查环境变量
console.log('1️⃣ 检查环境变量...')
const requiredEnvVars = [
  'VITE_OSS_ACCESS_KEY_ID',
  'VITE_OSS_ACCESS_KEY_SECRET', 
  'VITE_OSS_BUCKET',
  'VITE_OSS_REGION'
]

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

// 2. 测试 API 端点
console.log('\n2️⃣ 测试 OSS API 端点...')

async function testOSSAPI() {
  try {
    const testData = {
      filename: 'test-diagnostic.jpg',
      folder: 'test',
      contentType: 'image/jpeg'
    }
    
    console.log('   请求数据:', testData)
    
    // 测试本地 API（如果在运行）
    try {
      const localResponse = await fetch('http://localhost:5173/api/upload-oss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (localResponse.ok) {
        const localData = await localResponse.json()
        console.log('   ✅ 本地 API 响应正常')
        console.log('   📝 预签名 URL 长度:', localData.uploadUrl?.length || 0)
        console.log('   🔗 公共 URL:', localData.publicUrl)
        return localData
      }
    } catch (localError) {
      console.log('   ⚠️ 本地 API 不可用 (开发服务器未启动)')
    }
    
    // 测试 Vercel API
    try {
      const vercelResponse = await fetch('https://reface.vercel.app/api/upload-oss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      })
      
      if (vercelResponse.ok) {
        const vercelData = await vercelResponse.json()
        console.log('   ✅ Vercel API 响应正常')
        console.log('   📝 预签名 URL 长度:', vercelData.uploadUrl?.length || 0)
        console.log('   🔗 公共 URL:', vercelData.publicUrl)
        return vercelData
      } else {
        const errorText = await vercelResponse.text()
        console.log('   ❌ Vercel API 错误:', vercelResponse.status, errorText)
      }
    } catch (vercelError) {
      console.log('   ❌ Vercel API 连接失败:', vercelError.message)
    }
    
  } catch (error) {
    console.log('   ❌ API 测试失败:', error.message)
  }
  
  return null
}

// 3. 测试 OSS 连接
async function testOSSConnection(apiData) {
  console.log('\n3️⃣ 测试 OSS 连接...')
  
  if (!apiData || !apiData.uploadUrl) {
    console.log('   ❌ 无法测试 OSS 连接，API 数据缺失')
    return
  }
  
  try {
    // 创建一个小的测试文件
    const testContent = 'OSS 连接测试 - ' + new Date().toISOString()
    const testBlob = new Blob([testContent], { type: 'text/plain' })
    
    const uploadResponse = await fetch(apiData.uploadUrl, {
      method: 'PUT',
      body: testBlob,
      headers: { 'Content-Type': 'text/plain' }
    })
    
    if (uploadResponse.ok) {
      console.log('   ✅ OSS 上传测试成功')
      
      // 测试文件访问
      const accessResponse = await fetch(apiData.publicUrl)
      if (accessResponse.ok) {
        console.log('   ✅ OSS 文件访问测试成功')
        const content = await accessResponse.text()
        console.log('   📄 文件内容:', content.substring(0, 50) + '...')
      } else {
        console.log('   ❌ OSS 文件访问失败:', accessResponse.status)
        console.log('   💡 可能需要设置文件公共读权限')
      }
    } else {
      console.log('   ❌ OSS 上传失败:', uploadResponse.status)
      const errorText = await uploadResponse.text()
      console.log('   📝 错误详情:', errorText)
    }
    
  } catch (error) {
    console.log('   ❌ OSS 连接测试失败:', error.message)
  }
}

// 4. 权限建议
function showPermissionAdvice() {
  console.log('\n4️⃣ OSS 权限配置建议...')
  console.log('   🔐 推荐配置:')
  console.log('   • Bucket 权限: 私有 (Private)')
  console.log('   • 文件权限: 上传时设置为公共读')
  console.log('   • CORS: 允许你的域名访问')
  console.log('')
  console.log('   ⚠️ 如果当前是公共读写:')
  console.log('   • 存在安全风险，建议改为私有')
  console.log('   • 代码已更新为上传时设置文件公共读权限')
  console.log('')
  console.log('   📋 CORS 配置示例:')
  console.log('   • 允许来源: https://reface.vercel.app, http://localhost:5173')
  console.log('   • 允许方法: GET, PUT, POST, DELETE, HEAD')
  console.log('   • 允许头部: *')
  console.log('   • 暴露头部: ETag, x-oss-request-id')
}

// 执行诊断
async function runDiagnostics() {
  const apiData = await testOSSAPI()
  await testOSSConnection(apiData)
  showPermissionAdvice()
  
  console.log('\n📋 诊断完成!')
  console.log('如果发现问题，请参考 oss-config-guide.md 进行配置')
}

runDiagnostics().catch(console.error)