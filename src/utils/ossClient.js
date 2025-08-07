/**
 * 阿里云 OSS 客户端工具
 * 处理图片上传、存储和 CDN 加速
 */

import OSS from 'ali-oss'

// OSS 配置
const OSS_CONFIG = {
  region: import.meta.env.VITE_OSS_REGION || 'oss-cn-shanghai',
  accessKeyId: import.meta.env.VITE_OSS_ACCESS_KEY_ID,
  accessKeySecret: import.meta.env.VITE_OSS_ACCESS_KEY_SECRET,
  bucket: import.meta.env.VITE_OSS_BUCKET || 'reface'
}

// 创建 OSS 客户端实例
let ossClient = null

const initOSSClient = () => {
  if (!OSS_CONFIG.accessKeyId || !OSS_CONFIG.accessKeySecret) {
    console.warn('OSS 配置不完整，将使用本地存储')
    return null
  }

  try {
    ossClient = new OSS(OSS_CONFIG)
    return ossClient
  } catch (error) {
    console.error('OSS 客户端初始化失败:', error)
    return null
  }
}

/**
 * 生成唯一的文件名
 * @param {string} originalName - 原始文件名
 * @param {string} prefix - 前缀（如：original/、processed/）
 * @returns {string} 唯一文件名
 */
const generateFileName = (originalName, prefix = '') => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  return `${prefix}${timestamp}_${random}.${extension}`
}

/**
 * 上传图片到 OSS（通过服务端 API）
 * @param {File|Blob} file - 图片文件
 * @param {string} folder - 存储文件夹 (original/processed)
 * @param {string} originalName - 原始文件名
 * @returns {Promise<Object>} 上传结果
 */
export const uploadToOSS = async (file, folder = 'original', originalName = 'image.jpg') => {
  try {
    // 第一步：获取预签名 URL
    const response = await fetch('/api/upload-oss', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: originalName,
        folder: folder,
        contentType: file.type || 'image/jpeg'
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to get upload URL')
    }

    // 第二步：直接上传到 OSS
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'image/jpeg'
      }
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`)
    }

    return {
      success: true,
      url: data.publicUrl,
      key: data.key,
      size: file.size,
      isLocal: false
    }

  } catch (error) {
    console.error('OSS 上传失败:', error)
    
    // 上传失败时降级到本地存储
    return {
      success: false,
      url: URL.createObjectURL(file),
      key: null,
      size: file.size,
      isLocal: true,
      error: error.message
    }
  }
}

/**
 * 删除 OSS 中的文件
 * @param {string} key - 文件 key
 * @returns {Promise<boolean>} 删除是否成功
 */
export const deleteFromOSS = async (key) => {
  const client = ossClient || initOSSClient()
  
  if (!client || !key) {
    return false
  }

  try {
    await client.delete(key)
    return true
  } catch (error) {
    console.error('OSS 删除失败:', error)
    return false
  }
}

/**
 * 获取文件的 CDN URL（带参数处理）
 * @param {string} key - 文件 key
 * @param {Object} options - 处理参数
 * @returns {string} CDN URL
 */
export const getCDNUrl = (key, options = {}) => {
  const client = ossClient || initOSSClient()
  
  if (!client || !key) {
    return ''
  }

  try {
    const baseUrl = `https://${OSS_CONFIG.bucket}.${OSS_CONFIG.region}.aliyuncs.com/${key}`
    
    // 添加图片处理参数
    const params = []
    if (options.width) params.push(`w_${options.width}`)
    if (options.height) params.push(`h_${options.height}`)
    if (options.quality) params.push(`q_${options.quality}`)
    if (options.format) params.push(`f_${options.format}`)
    
    if (params.length > 0) {
      return `${baseUrl}?x-oss-process=image/resize,${params.join(',')}`
    }
    
    return baseUrl
  } catch (error) {
    console.error('生成 CDN URL 失败:', error)
    return ''
  }
}

/**
 * 检查 OSS 连接状态
 * @returns {Promise<boolean>} 连接是否正常
 */
export const checkOSSConnection = async () => {
  const client = ossClient || initOSSClient()
  
  if (!client) {
    return false
  }

  try {
    // 尝试列出 bucket 信息
    await client.getBucketInfo()
    return true
  } catch (error) {
    console.error('OSS 连接检查失败:', error)
    return false
  }
}

/**
 * 压缩并上传图片
 * @param {File} file - 原始文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<Object>} 上传结果
 */
export const compressAndUpload = async (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    folder = 'compressed'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = async () => {
      // 计算压缩尺寸
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // 绘制并压缩
      ctx.fillStyle = '#FFFFFF' // 白色背景
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(async (blob) => {
        try {
          const result = await uploadToOSS(blob, folder, file.name)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, 'image/jpeg', quality)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// 初始化 OSS 客户端
initOSSClient()

export default {
  uploadToOSS,
  deleteFromOSS,
  getCDNUrl,
  checkOSSConnection,
  compressAndUpload
}