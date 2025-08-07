#!/usr/bin/env node

/**
 * 环境变量检查工具
 * 用于验证 OSS 配置是否正确
 */

console.log('🔍 检查环境变量配置...\n')

const requiredEnvVars = [
  'VITE_OSS_ACCESS_KEY_ID',
  'VITE_OSS_ACCESS_KEY_SECRET', 
  'VITE_OSS_BUCKET',
  'VITE_OSS_REGION',
  'VITE_REMOVE_BG_API_KEY'
]

let allPresent = true

requiredEnvVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  const displayValue = value ? 
    (varName.includes('SECRET') || varName.includes('KEY') ? 
      value.substring(0, 8) + '...' : value) : 
    '未设置'
  
  console.log(`${status} ${varName}: ${displayValue}`)
  
  if (!value) {
    allPresent = false
  }
})

console.log('\n📊 检查结果:')
if (allPresent) {
  console.log('✅ 所有必需的环境变量都已设置')
  console.log('\n🚀 可以开始测试 OSS 上传功能')
} else {
  console.log('❌ 部分环境变量缺失')
  console.log('\n💡 解决方案:')
  console.log('1. 本地开发：创建 .env 文件并设置环境变量')
  console.log('2. Vercel 部署：在 Vercel Dashboard 中设置环境变量')
  console.log('   - 访问: https://vercel.com/dashboard')
  console.log('   - 选择项目 > Settings > Environment Variables')
}

console.log('\n📋 OSS 配置说明:')
console.log('- VITE_OSS_ACCESS_KEY_ID: 阿里云访问密钥 ID')
console.log('- VITE_OSS_ACCESS_KEY_SECRET: 阿里云访问密钥 Secret')
console.log('- VITE_OSS_BUCKET: OSS 存储桶名称 (默认: reface)')
console.log('- VITE_OSS_REGION: OSS 区域 (默认: oss-cn-shanghai)')

process.exit(allPresent ? 0 : 1)