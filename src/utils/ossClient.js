/**
 * 阿里云 OSS 客户端工具
 * 处理图片上传、存储和 CDN 加速
 * 使用安全的服务端代理模式，前端不直接持有AccessKey
 */

// 前端不再需要直接的OSS配置，所有操作通过API进行
// OSS 配置移至服务端 (/api/upload-oss.js)

console.log('✅ OSS客户端：使用安全的服务端代理模式')

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
 * 上传图片到 OSS（通过服务端 API）- 强制使用 OSS，不降级
 * @param {File|Blob} file - 图片文件
 * @param {string} folder - 存储文件夹 (original/processed)
 * @param {string} originalName - 原始文件名
 * @returns {Promise<Object>} 上传结果
 */
export const uploadToOSS = async (file, folder = 'original', originalName = 'image.jpg') => {
  console.log('开始上传到 OSS:', {
    filename: originalName,
    folder: folder,
    fileSize: file.size,
    fileType: file.type
  })

  try {
    // 第一步：获取预签名 URL
    const apiUrl = '/api/upload-oss'
    console.log('请求预签名 URL:', apiUrl)
    
    const response = await fetch(apiUrl, {
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

    console.log('预签名 API 响应状态:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('预签名 API 错误响应:', errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('预签名 API 响应数据:', data)

    if (!data.success) {
      throw new Error(data.error || 'Failed to get upload URL')
    }

    // 第二步：直接上传到 OSS
    console.log('开始上传到 OSS URL:', data.uploadUrl)
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'image/jpeg'
      }
    })

    console.log('OSS 上传响应状态:', uploadResponse.status)

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('OSS 上传错误:', errorText)
      throw new Error(`OSS Upload failed: ${uploadResponse.status} - ${errorText}`)
    }

    const result = {
      success: true,
      url: data.publicUrl,
      key: data.key,
      size: file.size,
      isLocal: false
    }
    
    console.log('OSS 上传成功:', result)
    return result

  } catch (error) {
    console.error('OSS 上传失败 - 详细错误:', error)
    
    // 不再降级到本地存储，直接抛出错误
    throw new Error(`OSS 上传失败: ${error.message}`)
  }
}

/**
 * 删除 OSS 中的文件（通过服务端API）
 * @param {string} key - 文件 key
 * @returns {Promise<boolean>} 删除是否成功
 */
export const deleteFromOSS = async (key) => {
  console.log('删除功能需要通过服务端API实现以确保安全')
  // TODO: 实现服务端删除API /api/delete-oss
  return false
}

/**
 * 获取文件的 CDN URL（从服务端API响应中获取）
 * @param {string} publicUrl - 服务端返回的公共URL
 * @param {Object} options - 处理参数
 * @returns {string} CDN URL
 */
export const getCDNUrl = (publicUrl, options = {}) => {
  if (!publicUrl) {
    return ''
  }

  try {
    // 添加图片处理参数到已有的URL
    const params = []
    if (options.width) params.push(`w_${options.width}`)
    if (options.height) params.push(`h_${options.height}`)
    if (options.quality) params.push(`q_${options.quality}`)
    if (options.format) params.push(`f_${options.format}`)
    
    if (params.length > 0) {
      const separator = publicUrl.includes('?') ? '&' : '?'
      return `${publicUrl}${separator}x-oss-process=image/resize,${params.join(',')}`
    }
    
    return publicUrl
  } catch (error) {
    console.error('生成 CDN URL 失败:', error)
    return publicUrl || ''
  }
}

/**
 * 检查 OSS 连接状态（通过服务端API测试）
 * @returns {Promise<boolean>} 连接是否正常
 */
export const checkOSSConnection = async () => {
  try {
    // 通过测试上传API来检查连接
    const response = await fetch('/api/upload-oss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: 'connection-test.jpg',
        folder: 'test',
        contentType: 'image/jpeg'
      })
    })
    
    return response.ok
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

// 前端不再需要直接初始化OSS客户端，所有操作通过服务端API进行

export default {
  uploadToOSS,
  deleteFromOSS,
  getCDNUrl,
  checkOSSConnection,
  compressAndUpload
}