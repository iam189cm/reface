/**
 * Remove.bg 背景移除服务
 * 提供专业的图片背景移除功能
 */

import { AIServiceBase } from '../base/AIServiceBase.js'

export class RemoveBackgroundService extends AIServiceBase {
  constructor(config, httpClient, progressManager) {
    super(config, httpClient, progressManager)
    
    // Remove.bg 特定配置
    this.apiUrl = config.apiUrl
    this.apiKey = config.apiKey
  }
  
  /**
   * 移除图片背景
   * @param {File|Blob} imageFile - 图片文件
   * @param {Function} onProgress - 进度回调
   * @param {Object} options - 处理选项
   * @returns {Promise<Blob>} 处理后的图片
   */
  async removeBackground(imageFile, onProgress = null, options = {}) {
    // 验证API配置
    if (!this.apiKey || this.apiKey === 'your_remove_bg_api_key_here') {
      throw new Error('Remove.bg API Key 未配置')
    }
    
    // 验证图片文件
    const validation = this.validateImageFile(imageFile)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    const {
      size = 'preview',           // 输出尺寸: preview, full, auto
      type = 'auto',              // 图片类型: auto, person, product, car
      format = 'auto',            // 输出格式: auto, png, jpg
      roi = null,                 // 感兴趣区域
      crop = false,               // 是否裁剪
      scale = null,               // 缩放比例
      position = null,            // 位置调整
      compress = true             // 是否压缩上传图片
    } = options
    
    this.log('info', 'removeBackground', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      options: { size, type, format }
    })
    
    // 创建进度跟踪器
    const tracker = this.createProgressTracker('背景移除', {
      totalSteps: 100,
      autoDestroy: true
    })
    
    if (onProgress) {
      tracker.onProgress(onProgress)
    }
    
    try {
      tracker.start('准备上传图片...')
      
      // 可选的图片压缩
      let processedImage = imageFile
      if (compress && imageFile.size > 2 * 1024 * 1024) { // 大于2MB时压缩
        tracker.setProgress(10, '压缩图片中...')
        processedImage = await this.compressImage(imageFile, {
          maxWidth: 2048,
          maxHeight: 2048,
          quality: 0.9
        })
        
        this.log('info', 'imageCompressed', {
          originalSize: imageFile.size,
          compressedSize: processedImage.size,
          ratio: (processedImage.size / imageFile.size).toFixed(2)
        })
      }
      
      // 准备请求数据
      tracker.setProgress(20, '准备请求数据...')
      const formData = new FormData()
      formData.append('image_file', processedImage)
      formData.append('size', size)
      formData.append('type', type)
      formData.append('format', format)
      
      // 可选参数
      if (roi) formData.append('roi', roi)
      if (crop) formData.append('crop', 'true')
      if (scale) formData.append('scale', scale)
      if (position) formData.append('position', position)
      
      // 发送请求
      tracker.setProgress(30, '上传图片并处理...')
      
      const response = await this.httpClient.post(this.apiUrl, formData, {
        headers: {
          'X-Api-Key': this.apiKey
        },
        timeout: 120000, // 2分钟超时
        retries: 2       // 重试2次
      })
      
      tracker.setProgress(80, '接收处理结果...')
      
      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        let errorMessage = `Remove.bg API 错误: ${response.status}`
        if (errorData.errors && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].title || errorData.errors[0].detail || errorMessage
        }
        
        // 特殊错误处理
        if (response.status === 402) {
          errorMessage = 'Remove.bg API 配额不足，请升级账户'
        } else if (response.status === 403) {
          errorMessage = 'Remove.bg API Key 无效'
        } else if (response.status === 429) {
          errorMessage = 'Remove.bg API 请求频率过高，请稍后重试'
        }
        
        throw new Error(errorMessage)
      }
      
      // 获取处理结果
      tracker.setProgress(95, '完成处理...')
      const resultBlob = await response.blob()
      
      if (resultBlob.size === 0) {
        throw new Error('处理结果为空，可能图片格式不支持或处理失败')
      }
      
      this.log('info', 'backgroundRemoved', {
        originalSize: imageFile.size,
        resultSize: resultBlob.size,
        processingTime: Date.now() - tracker.getState().startTime
      })
      
      tracker.complete('背景移除完成')
      
      return resultBlob
      
    } catch (error) {
      this.log('error', 'removeBackground', { error: error.message })
      tracker.fail(error, '背景移除失败')
      throw this.handleError(error, '背景移除')
    }
  }
  
  /**
   * 检查API配额
   * @returns {Promise<Object>} 配额信息
   */
  async checkQuota() {
    if (!this.apiKey) {
      throw new Error('Remove.bg API Key 未配置')
    }
    
    try {
      const response = await this.httpClient.get('https://api.remove.bg/v1.0/account', {
        headers: {
          'X-Api-Key': this.apiKey
        }
      })
      
      if (response.ok) {
        const quota = await response.json()
        
        this.log('info', 'quotaCheck', quota)
        
        return {
          success: true,
          data: {
            credits: quota.data?.attributes?.credits || 'unknown',
            api: quota.data?.attributes?.api || {},
            type: quota.data?.type || 'unknown'
          }
        }
      } else {
        return {
          success: false,
          error: `配额查询失败: ${response.status}`
        }
      }
      
    } catch (error) {
      this.log('error', 'quotaCheck', { error: error.message })
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  /**
   * 批量处理多张图片
   * @param {File[]} imageFiles - 图片文件数组
   * @param {Function} onProgress - 进度回调
   * @param {Object} options - 处理选项
   * @returns {Promise<Blob[]>} 处理结果数组
   */
  async batchRemoveBackground(imageFiles, onProgress = null, options = {}) {
    if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
      throw new Error('请提供要处理的图片文件数组')
    }
    
    const {
      maxConcurrent = 3,    // 最大并发数
      ...removeOptions
    } = options
    
    const tracker = this.createProgressTracker('批量背景移除', {
      totalSteps: imageFiles.length,
      autoDestroy: true
    })
    
    if (onProgress) {
      tracker.onProgress(onProgress)
    }
    
    const results = []
    let completedCount = 0
    
    tracker.start(`开始批量处理 ${imageFiles.length} 张图片...`)
    
    try {
      // 分批处理
      for (let i = 0; i < imageFiles.length; i += maxConcurrent) {
        const batch = imageFiles.slice(i, i + maxConcurrent)
        
        const batchPromises = batch.map(async (file, index) => {
          try {
            const result = await this.removeBackground(file, null, removeOptions)
            completedCount++
            
            tracker.update(completedCount, `已完成 ${completedCount}/${imageFiles.length} 张图片`)
            
            return { success: true, result, index: i + index, file }
          } catch (error) {
            completedCount++
            
            this.log('error', 'batchProcessing', {
              fileName: file.name,
              error: error.message
            })
            
            return { success: false, error, index: i + index, file }
          }
        })
        
        const batchResults = await Promise.all(batchPromises)
        results.push(...batchResults)
      }
      
      const successCount = results.filter(r => r.success).length
      const failCount = results.length - successCount
      
      if (failCount > 0) {
        tracker.complete(`批量处理完成，成功 ${successCount} 张，失败 ${failCount} 张`)
      } else {
        tracker.complete(`批量处理完成，全部 ${successCount} 张图片处理成功`)
      }
      
      return results
      
    } catch (error) {
      tracker.fail(error, '批量处理失败')
      throw this.handleError(error, '批量背景移除')
    }
  }
}
