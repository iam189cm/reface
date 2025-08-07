/**
 * Vercel 函数：处理 OSS 上传
 * 解决 CORS 问题和安全问题
 */

import OSS from 'ali-oss'

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method)
    res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    })
    return
  }

  try {
    // 检查环境变量
    const { VITE_OSS_ACCESS_KEY_ID, VITE_OSS_ACCESS_KEY_SECRET, VITE_OSS_BUCKET, VITE_OSS_REGION } = process.env
    
    console.log('环境变量检查:', {
      hasAccessKey: !!VITE_OSS_ACCESS_KEY_ID,
      hasSecretKey: !!VITE_OSS_ACCESS_KEY_SECRET,
      bucket: VITE_OSS_BUCKET,
      region: VITE_OSS_REGION
    })
    
    if (!VITE_OSS_ACCESS_KEY_ID || !VITE_OSS_ACCESS_KEY_SECRET) {
      console.error('OSS 环境变量缺失')
      return res.status(500).json({ 
        success: false,
        error: 'OSS configuration missing' 
      })
    }

    // 创建 OSS 客户端
    const ossConfig = {
      region: VITE_OSS_REGION || 'oss-cn-shanghai',
      accessKeyId: VITE_OSS_ACCESS_KEY_ID,
      accessKeySecret: VITE_OSS_ACCESS_KEY_SECRET,
      bucket: VITE_OSS_BUCKET || 'reface'
    }
    
    console.log('创建 OSS 客户端，配置:', {
      region: ossConfig.region,
      bucket: ossConfig.bucket,
      accessKeyId: ossConfig.accessKeyId.substring(0, 8) + '...'
    })
    
    const client = new OSS(ossConfig)

    const { filename, folder = 'original', contentType = 'image/jpeg' } = req.body
    
    console.log('上传请求参数:', { filename, folder, contentType })

    if (!filename) {
      console.error('文件名缺失')
      return res.status(400).json({ 
        success: false,
        error: 'Filename is required' 
      })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop()
    const key = `${folder}/${timestamp}_${random}.${extension}`
    
    console.log('生成的文件 key:', key)

    // 生成预签名 URL（客户端直传）
    const uploadUrl = client.signatureUrl(key, {
      method: 'PUT',
      expires: 3600, // 1小时有效期
      'Content-Type': contentType
      // 移除 x-oss-object-acl，因为 RAM 用户可能没有权限
    })
    
    // 生成用于访问的预签名 URL（24小时有效）
    const publicUrl = client.signatureUrl(key, {
      method: 'GET',
      expires: 3600 * 24  // 24小时有效期
    })
    
    console.log('预签名 URL 生成成功:', {
      key,
      publicUrl,
      uploadUrlLength: uploadUrl.length
    })

    res.status(200).json({
      success: true,
      uploadUrl: uploadUrl,
      key: key,
      publicUrl: publicUrl
    })

  } catch (error) {
    console.error('OSS API 错误:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    })
  }
}