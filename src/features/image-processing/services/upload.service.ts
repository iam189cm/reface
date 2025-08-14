/**
 * 图片上传服务
 */

import type { 
  ImageValidationRule, 
  ImageValidationError, 
  ImageMetadata,
  ImageFormat,
  ImageDimensions
} from '../types/image.types'
import type { UploadTask, UploadConfig } from '../types/upload.types'

// 生成任务ID
export function generateTaskId(): string {
  return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 获取图片元数据
export async function getImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      const dimensions: ImageDimensions = {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
      
      const format = getImageFormat(file.type)
      
      resolve({
        name: file.name,
        size: file.size,
        format,
        dimensions,
        lastModified: file.lastModified
      })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// 获取图片格式
function getImageFormat(mimeType: string): ImageFormat {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpeg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      throw new Error(`Unsupported image format: ${mimeType}`)
  }
}

// 验证图片
export async function validateImage(
  file: File, 
  rules: ImageValidationRule
): Promise<ImageValidationError[]> {
  const errors: ImageValidationError[] = []

  try {
    // 验证文件大小
    if (rules.maxSize && file.size > rules.maxSize) {
      errors.push({
        field: 'size',
        message: `文件大小不能超过 ${formatFileSize(rules.maxSize)}`,
        actualValue: file.size,
        expectedValue: rules.maxSize
      })
    }

    if (rules.minSize && file.size < rules.minSize) {
      errors.push({
        field: 'size',
        message: `文件大小不能小于 ${formatFileSize(rules.minSize)}`,
        actualValue: file.size,
        expectedValue: rules.minSize
      })
    }

    // 验证文件格式
    if (rules.allowedFormats) {
      const allowedMimeTypes = rules.allowedFormats.map(formatToMimeType)
      if (!allowedMimeTypes.includes(file.type)) {
        errors.push({
          field: 'format',
          message: `不支持的文件格式，请选择 ${rules.allowedFormats.join('、')} 格式的图片`,
          actualValue: file.type,
          expectedValue: rules.allowedFormats
        })
      }
    }

    // 获取图片尺寸进行验证
    if (rules.maxDimensions || rules.minDimensions) {
      try {
        const metadata = await getImageMetadata(file)
        
        if (rules.maxDimensions) {
          if (metadata.dimensions.width > rules.maxDimensions.width ||
              metadata.dimensions.height > rules.maxDimensions.height) {
            errors.push({
              field: 'dimensions',
              message: `图片尺寸不能超过 ${rules.maxDimensions.width}x${rules.maxDimensions.height}`,
              actualValue: metadata.dimensions,
              expectedValue: rules.maxDimensions
            })
          }
        }

        if (rules.minDimensions) {
          if (metadata.dimensions.width < rules.minDimensions.width ||
              metadata.dimensions.height < rules.minDimensions.height) {
            errors.push({
              field: 'dimensions',
              message: `图片尺寸不能小于 ${rules.minDimensions.width}x${rules.minDimensions.height}`,
              actualValue: metadata.dimensions,
              expectedValue: rules.minDimensions
            })
          }
        }
      } catch (error) {
        errors.push({
          field: 'format',
          message: '无法读取图片信息，请检查文件是否损坏',
          actualValue: file.type,
          expectedValue: 'valid image file'
        })
      }
    }

  } catch (error) {
    errors.push({
      field: 'format',
      message: '文件验证失败',
      actualValue: file.name,
      expectedValue: 'valid file'
    })
  }

  return errors
}

// 格式转换为MIME类型
function formatToMimeType(format: ImageFormat): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    default:
      throw new Error(`Unknown format: ${format}`)
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 创建缩略图
export async function createThumbnail(
  file: File, 
  maxWidth: number = 200, 
  maxHeight: number = 200,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    if (!ctx) {
      reject(new Error('Canvas not supported'))
      return
    }

    img.onload = () => {
      // 计算缩略图尺寸
      const { width, height } = calculateThumbnailSize(
        img.naturalWidth,
        img.naturalHeight,
        maxWidth,
        maxHeight
      )

      canvas.width = width
      canvas.height = height

      // 绘制缩略图
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为数据URL
      const thumbnailUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(thumbnailUrl)
    }

    img.onerror = () => {
      reject(new Error('Failed to create thumbnail'))
    }

    img.src = URL.createObjectURL(file)
  })
}

// 计算缩略图尺寸
function calculateThumbnailSize(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight

  let width = maxWidth
  let height = maxHeight

  if (aspectRatio > 1) {
    // 宽度大于高度
    height = Math.round(width / aspectRatio)
    if (height > maxHeight) {
      height = maxHeight
      width = Math.round(height * aspectRatio)
    }
  } else {
    // 高度大于宽度
    width = Math.round(height * aspectRatio)
    if (width > maxWidth) {
      width = maxWidth
      height = Math.round(width / aspectRatio)
    }
  }

  return { width, height }
}

// 上传文件到服务器
export async function uploadFile(
  file: File,
  config: UploadConfig,
  onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100)
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage
          })
        }
      })
    }

    // 请求完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            resolve(response.data)
          } else {
            reject(new Error(response.error || 'Upload failed'))
          }
        } catch (error) {
          reject(new Error('Invalid response format'))
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    })

    // 请求错误
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    // 请求超时
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'))
    })

    // 发送请求
    xhr.open(config.method, config.endpoint)
    xhr.timeout = config.timeout
    
    // 设置请求头
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })
    }

    xhr.send(formData)
  })
}
