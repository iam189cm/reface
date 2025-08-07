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
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // 检查环境变量
    const { VITE_OSS_ACCESS_KEY_ID, VITE_OSS_ACCESS_KEY_SECRET, VITE_OSS_BUCKET, VITE_OSS_REGION } = process.env
    
    if (!VITE_OSS_ACCESS_KEY_ID || !VITE_OSS_ACCESS_KEY_SECRET) {
      return res.status(500).json({ error: 'OSS configuration missing' })
    }

    // 创建 OSS 客户端
    const client = new OSS({
      region: VITE_OSS_REGION || 'oss-cn-shanghai',
      accessKeyId: VITE_OSS_ACCESS_KEY_ID,
      accessKeySecret: VITE_OSS_ACCESS_KEY_SECRET,
      bucket: VITE_OSS_BUCKET || 'reface'
    })

    const { filename, folder = 'original', contentType = 'image/jpeg' } = req.body

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = filename.split('.').pop()
    const key = `${folder}/${timestamp}_${random}.${extension}`

    // 生成预签名 URL（客户端直传）
    const url = client.signatureUrl(key, {
      method: 'PUT',
      expires: 3600, // 1小时有效期
      'Content-Type': contentType
    })

    res.status(200).json({
      success: true,
      uploadUrl: url,
      key: key,
      publicUrl: `https://${VITE_OSS_BUCKET}.${VITE_OSS_REGION}.aliyuncs.com/${key}`
    })

  } catch (error) {
    console.error('OSS upload error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Upload failed'
    })
  }
}