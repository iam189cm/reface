/**
 * VanceAI 图像增强服务
 * 提供专业的AI图像放大和增强功能
 */

import { AIServiceBase } from '../base/AIServiceBase.js'

export class VanceAIService extends AIServiceBase {
  constructor(config, httpClient, progressManager) {
    super(config, httpClient, progressManager)
    
    // VanceAI 特定配置
    this.apiToken = config.apiToken
    this.endpoints = config.endpoints
    this.defaultParams = config.defaultParams
    this.polling = config.polling
  }
  
  /**
   * 图像高清放大处理
   * @param {File|Blob} imageFile - 图片文件
   * @param {Function} onProgress - 进度回调
   * @param {Object} params - 处理参数
   * @returns {Promise<Blob>} 处理后的图片
   */
  async enlargeImage(imageFile, onProgress = null, params = {}) {
    // 验证API配置
    if (!this.apiToken || this.apiToken === 'your_vance_ai_api_token_here') {
      throw new Error('VanceAI API Token 未配置')
    }
    
    // 验证图片文件
    const validation = this.validateImageFile(imageFile)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    const {
      scale = this.defaultParams.scale,
      suppress_noise = this.defaultParams.suppress_noise,
      remove_blur = this.defaultParams.remove_blur,
      model_name = 'EnlargeStable'
    } = params
    
    // 参数验证
    this._validateEnlargeParams({ scale, suppress_noise, remove_blur })
    
    this.log('info', 'enlargeImage', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      params: { scale, suppress_noise, remove_blur, model_name }
    })
    
    // 创建进度跟踪器
    const tracker = this.createProgressTracker('图像放大', {
      totalSteps: 100,
      autoDestroy: true
    })
    
    if (onProgress) {
      tracker.onProgress(onProgress)
    }
    
    try {
      // 步骤1: 上传图片
      tracker.start('正在上传图片到VanceAI...')
      const uid = await this._uploadImage(imageFile, tracker)
      
      // 步骤2: 提交处理任务
      tracker.setProgress(20, '正在提交处理任务...')
      const processResult = await this._submitEnlargeTask(uid, {
        scale, suppress_noise, remove_blur, model_name
      }, tracker)
      
      // 检查是同步还是异步模式
      if (processResult.mode === 'sync') {
        // 同步模式，直接返回结果
        tracker.complete('处理完成！')
        return processResult.result
      }
      
      // 异步模式，轮询检查进度
      const transId = processResult.trans_id
      tracker.setProgress(30, '正在处理图片，请稍候...')
      
      const resultBlob = await this._pollProcessingProgress(transId, tracker)
      
      this.log('info', 'enlargeCompleted', {
        originalSize: imageFile.size,
        resultSize: resultBlob.size,
        processingTime: Date.now() - tracker.getState().startTime
      })
      
      tracker.complete('图像放大完成！')
      
      return resultBlob
      
    } catch (error) {
      this.log('error', 'enlargeImage', { error: error.message })
      tracker.fail(error, '图像放大失败')
      throw this.handleError(error, '图像放大')
    }
  }
  
  /**
   * 上传图片到VanceAI
   * @param {File|Blob} imageFile - 图片文件
   * @param {ProgressTracker} tracker - 进度跟踪器
   * @returns {Promise<string>} 图片uid
   * @private
   */
  async _uploadImage(imageFile, tracker) {
    // 诊断图片信息
    const diagnosis = this._diagnoseImageFile(imageFile)
    
    if (!diagnosis.is_likely_valid) {
      this.log('warn', 'imageDiagnosis', {
        fileName: imageFile.name,
        issues: diagnosis.potential_issues
      })
    }
    
    const formData = new FormData()
    formData.append('api_token', this.apiToken)
    formData.append('file', imageFile)
    
    const response = await this.httpClient.post(this.endpoints.upload, formData, {
      timeout: 60000, // 1分钟超时
      retries: 3
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息')
      throw new Error(`上传失败: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    
    if (result.code !== 200) {
      throw new Error(result.message || `上传失败，错误码: ${result.code}`)
    }
    
    const uid = result.data.uid
    this.log('info', 'imageUploaded', { uid, fileName: imageFile.name })
    
    return uid
  }
  
  /**
   * 提交图像放大任务
   * @param {string} uid - 图片uid
   * @param {Object} params - 处理参数
   * @param {ProgressTracker} tracker - 进度跟踪器
   * @returns {Promise<Object>} 任务结果
   * @private
   */
  async _submitEnlargeTask(uid, params, tracker) {
    const { scale, suppress_noise, remove_blur, model_name } = params
    
    // 构建处理配置
    const jconfig = {
      job: 'enlarge',
      config: {
        module: 'enlarge',
        module_params: {
          model_name,
          scale
        },
        out_params: {}
      }
    }
    
    // 添加可选参数
    if (suppress_noise !== undefined && suppress_noise !== null) {
      jconfig.config.module_params.suppress_noise = Number(suppress_noise)
    }
    
    if (remove_blur !== undefined && remove_blur !== null) {
      jconfig.config.module_params.remove_blur = Number(remove_blur)
    }
    
    this.log('info', 'submitTask', {
      uid,
      config: jconfig
    })
    
    const formData = new FormData()
    formData.append('api_token', this.apiToken)
    formData.append('uid', uid)
    formData.append('jconfig', JSON.stringify(jconfig))
    
    const response = await this.httpClient.post(this.endpoints.transform, formData, {
      timeout: 60000,
      retries: 3
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息')
      throw new Error(`处理任务提交失败: ${response.status} - ${errorText}`)
    }
    
    // 检查响应类型
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.startsWith('image/')) {
      // 同步模式，直接返回图片
      const imageBlob = await response.blob()
      return { mode: 'sync', result: imageBlob }
    }
    
    if (contentType.includes('json')) {
      // 异步模式，返回任务ID
      const result = await response.json()
      
      if (result.code !== 200) {
        throw new Error(result.message || `处理任务提交失败，错误码: ${result.code}`)
      }
      
      return { mode: 'async', trans_id: result.data.trans_id }
    }
    
    // 不确定的类型，尝试作为图片数据处理
    const imageBlob = await response.blob()
    if (imageBlob.size > 1000) { // 假设真实图片至少1KB
      return { mode: 'sync', result: imageBlob }
    } else {
      throw new Error('响应数据格式无法识别')
    }
  }
  
  /**
   * 轮询检查处理进度
   * @param {string} transId - 任务ID
   * @param {ProgressTracker} tracker - 进度跟踪器
   * @returns {Promise<Blob>} 处理结果
   * @private
   */
  async _pollProcessingProgress(transId, tracker) {
    let attempts = 0
    const maxAttempts = this.polling.maxAttempts
    
    while (attempts < maxAttempts) {
      await this.delay(this.polling.interval)
      attempts++
      
      try {
        const progressData = await this._checkProgress(transId)
        const status = progressData.status
        
        this.log('info', 'pollingProgress', {
          transId,
          attempt: attempts,
          status,
          progress: progressData
        })
        
        // 计算进度百分比 (30% - 90%)
        const progressPercent = 30 + (attempts / maxAttempts) * 60
        
        if (status === 'finish') {
          // 处理完成，下载结果
          tracker.setProgress(95, '正在下载处理结果...')
          
          const downloadUrl = this._extractDownloadUrl(progressData)
          if (!downloadUrl) {
            // 尝试其他方式获取结果
            const result = await this._tryAlternativeDownload(transId, progressData)
            return result
          }
          
          const resultResponse = await this.httpClient.get(downloadUrl)
          if (!resultResponse.ok) {
            throw new Error(`下载处理结果失败: ${resultResponse.status}`)
          }
          
          const resultBlob = await resultResponse.blob()
          return resultBlob
          
        } else if (status === 'fatal') {
          // 处理失败
          this._handleProcessingError(progressData, transId)
          
        } else if (status === 'waiting' || status === 'process') {
          // 继续等待
          tracker.setProgress(
            Math.min(progressPercent, 90),
            `正在处理图片... (${attempts}/${maxAttempts})`
          )
          
        } else {
          // 未知状态，继续等待
          this.log('warn', 'unknownStatus', { status, transId })
        }
        
      } catch (error) {
        this.log('error', 'pollingError', { 
          transId, 
          attempt: attempts, 
          error: error.message 
        })
        
        // 如果是最后一次尝试，抛出错误
        if (attempts >= maxAttempts) {
          throw error
        }
      }
    }
    
    throw new Error('处理超时，请稍后重试')
  }
  
  /**
   * 检查处理进度
   * @param {string} transId - 任务ID
   * @returns {Promise<Object>} 进度数据
   * @private
   */
  async _checkProgress(transId) {
    const formData = new FormData()
    formData.append('api_token', this.apiToken)
    formData.append('trans_id', transId)
    
    const response = await this.httpClient.post(this.endpoints.progress, formData, {
      timeout: 30000,
      retries: 2
    })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息')
      throw new Error(`进度查询失败: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    
    if (result.code !== 200) {
      throw new Error(result.message || `进度查询失败，错误码: ${result.code}`)
    }
    
    return result.data
  }
  
  /**
   * 提取下载URL
   * @param {Object} progressData - 进度数据
   * @returns {string|null} 下载URL
   * @private
   */
  _extractDownloadUrl(progressData) {
    return progressData.result_url || 
           progressData.download_url || 
           progressData.url || 
           progressData.output_url ||
           progressData.result ||
           null
  }
  
  /**
   * 尝试其他方式下载结果
   * @param {string} transId - 任务ID
   * @param {Object} progressData - 进度数据
   * @returns {Promise<Blob>} 处理结果
   * @private
   */
  async _tryAlternativeDownload(transId, progressData) {
    // 方法1: 尝试通过download端点获取结果
    try {
      const downloadFormData = new FormData()
      downloadFormData.append('api_token', this.apiToken)
      downloadFormData.append('trans_id', transId)
      
      const downloadResponse = await this.httpClient.post(
        'https://api-service.vanceai.com/web_api/v1/download',
        downloadFormData
      )
      
      if (downloadResponse.ok) {
        const downloadResult = await downloadResponse.json()
        
        if (downloadResult.code === 200 && downloadResult.data?.download_url) {
          const resultResponse = await this.httpClient.get(downloadResult.data.download_url)
          if (resultResponse.ok) {
            return await resultResponse.blob()
          }
        }
      }
    } catch (error) {
      this.log('warn', 'alternativeDownloadFailed', { error: error.message })
    }
    
    throw new Error('处理完成但无法获取结果文件，API可能缺少下载URL')
  }
  
  /**
   * 处理处理错误
   * @param {Object} progressData - 进度数据
   * @param {string} transId - 任务ID
   * @private
   */
  _handleProcessingError(progressData, transId) {
    const diagnosticInfo = {
      status: progressData.status,
      filesize: progressData.filesize,
      message: progressData.message,
      error: progressData.error,
      error_message: progressData.error_message,
      trans_id: transId,
      full_response: progressData
    }
    
    this.log('error', 'processingFailed', diagnosticInfo)
    
    let errorMessage = 'VanceAI图像处理失败'
    
    // 构建用户友好的错误信息
    if (progressData.message && progressData.message !== 'fatal') {
      errorMessage += `：${progressData.message}`
    } else if (progressData.error) {
      errorMessage += `：${progressData.error}`
    } else if (progressData.error_message) {
      errorMessage += `：${progressData.error_message}`
    } else if (progressData.filesize === 0) {
      errorMessage += '：处理结果文件大小为0，可能原因：图片格式不支持、图片质量过低或损坏、图片尺寸过大或过小、处理参数设置错误'
    } else {
      errorMessage += '：服务器处理异常，建议稍后重试或尝试其他图片'
    }
    
    errorMessage += '\n\n⚠️ Credit已被扣除，建议联系VanceAI客服处理退款'
    
    const error = new Error(errorMessage)
    error.diagnosticInfo = diagnosticInfo
    
    throw error
  }
  
  /**
   * 验证放大参数
   * @param {Object} params - 参数对象
   * @private
   */
  _validateEnlargeParams(params) {
    const { scale, suppress_noise, remove_blur } = params
    
    if (!['2x', '4x', '8x'].includes(scale)) {
      throw new Error(`无效的放大倍数: ${scale}，应为 2x, 4x, 或 8x`)
    }
    
    if (suppress_noise !== undefined && (suppress_noise < 0 || suppress_noise > 100)) {
      throw new Error(`suppress_noise 参数超出范围: ${suppress_noise}，应在 0-100 之间`)
    }
    
    if (remove_blur !== undefined && (remove_blur < 0 || remove_blur > 100)) {
      throw new Error(`remove_blur 参数超出范围: ${remove_blur}，应在 0-100 之间`)
    }
  }
  
  /**
   * 诊断图片文件
   * @param {File|Blob} imageFile - 图片文件
   * @returns {Object} 诊断结果
   * @private
   */
  _diagnoseImageFile(imageFile) {
    const diagnosis = {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
      size_mb: (imageFile.size / (1024 * 1024)).toFixed(2),
      potential_issues: []
    }
    
    // 检查文件大小
    if (imageFile.size === 0) {
      diagnosis.potential_issues.push('文件大小为0，文件可能损坏')
    } else if (imageFile.size > 10 * 1024 * 1024) {
      diagnosis.potential_issues.push('文件过大，建议压缩后上传')
    } else if (imageFile.size < 1024) {
      diagnosis.potential_issues.push('文件过小，可能不是有效图片')
    }
    
    // 检查文件格式
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!supportedTypes.includes(imageFile.type.toLowerCase())) {
      diagnosis.potential_issues.push(`不支持的图片格式: ${imageFile.type}，建议使用 JPG 或 PNG`)
    }
    
    // 检查文件扩展名
    const extension = imageFile.name.split('.').pop()?.toLowerCase()
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      diagnosis.potential_issues.push(`不支持的文件扩展名: ${extension}`)
    }
    
    diagnosis.is_likely_valid = diagnosis.potential_issues.length === 0
    
    return diagnosis
  }
}
