/**
 * 图片处理工具函数
 * 提供图片相关的通用处理方法
 */

/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 验证图片文件
 * @param {File} file - 文件对象
 * @param {Object} options - 验证选项
 * @returns {Object} 验证结果
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    minWidth = 0,
    minHeight = 0,
    maxWidth = Infinity,
    maxHeight = Infinity
  } = options

  const result = {
    valid: true,
    errors: []
  }

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    result.valid = false
    result.errors.push('请选择图片文件')
  }

  // 检查允许的文件类型
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    result.valid = false
    result.errors.push(`支持的格式: ${allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}`)
  }

  // 检查文件大小
  if (file.size > maxSize) {
    result.valid = false
    result.errors.push(`文件大小不能超过 ${formatFileSize(maxSize)}`)
  }

  return result
}

/**
 * 创建图片预览 URL
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 预览 URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 从 URL 加载图片
 * @param {string} url - 图片 URL
 * @param {Object} options - 加载选项
 * @returns {Promise<HTMLImageElement>} 图片元素
 */
export const loadImageFromUrl = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin
    }
    
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(new Error(`图片加载失败: ${url}`))
    img.src = url
  })
}

/**
 * 计算图片显示尺寸（保持宽高比）
 * @param {number} originalWidth - 原始宽度
 * @param {number} originalHeight - 原始高度
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @returns {Object} 计算后的尺寸
 */
export const calculateDisplaySize = (originalWidth, originalHeight, maxWidth = 800, maxHeight = 600) => {
  let width = originalWidth
  let height = originalHeight

  // 按比例缩放
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
  }

  return { width, height, ratio: width / originalWidth }
}

/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @returns {Promise<Blob>} 压缩后的图片
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    outputFormat = 'image/jpeg'
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算压缩尺寸
      const { width, height } = calculateDisplaySize(img.width, img.height, maxWidth, maxHeight)

      canvas.width = width
      canvas.height = height

      // 绘制并压缩
      ctx.fillStyle = '#FFFFFF' // 白色背景
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(resolve, outputFormat, quality)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 获取图片元数据
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} 图片元数据
 */
export const getImageMetadata = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const metadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        lastModified: file.lastModified,
        formattedSize: formatFileSize(file.size)
      }
      
      URL.revokeObjectURL(img.src)
      resolve(metadata)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src)
      reject(new Error('无法读取图片元数据'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 下载图片
 * @param {string|Blob} source - 图片源（URL 或 Blob）
 * @param {string} filename - 文件名
 */
export const downloadImage = (source, filename = 'image.jpg') => {
  let url
  let shouldRevoke = false
  
  if (source instanceof Blob) {
    url = URL.createObjectURL(source)
    shouldRevoke = true
  } else {
    url = source
  }
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  
  if (shouldRevoke) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Canvas 转换为 Blob
 * @param {HTMLCanvasElement} canvas - Canvas 元素
 * @param {Object} options - 转换选项
 * @returns {Promise<Blob>} 图片 Blob
 */
export const canvasToBlob = (canvas, options = {}) => {
  const { quality = 0.95, type = 'image/jpeg' } = options
  
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(resolve, type, quality)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 图片格式转换
 * @param {File} file - 原始图片文件
 * @param {string} targetFormat - 目标格式
 * @param {number} quality - 图片质量
 * @returns {Promise<Blob>} 转换后的图片
 */
export const convertImageFormat = (file, targetFormat = 'image/jpeg', quality = 0.95) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // 如果转换为 JPEG，先填充白色背景
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(resolve, targetFormat, quality)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
