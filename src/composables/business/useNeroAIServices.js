/**
 * Nero AI 服务组合式函数
 * 提供统一的AI服务调用接口
 */

import { ref, computed, inject } from 'vue'
import { useImageStore } from '../../stores/imageStore.js'
import { useTrialManager } from './useTrialManager.js'
import { useNotification } from '../ui/useNotification.js'

export function useNeroAIServices() {
  // 注入服务
  const neroAIService = inject('neroAIService')
  const taskManager = inject('taskManager')
  const resultProcessor = inject('resultProcessor')
  
  // 状态管理
  const imageStore = useImageStore()
  const { consumeCredits, canUseTrial, getRemainingTrials } = useTrialManager()
  const { showSuccess, showError, showWarning } = useNotification()
  
  // 响应式状态
  const isProcessing = ref(false)
  const currentTaskId = ref(null)
  const processingProgress = ref(0)
  const processingMessage = ref('')
  const currentService = ref(null)
  const processingResults = ref([])
  
  // 计算属性
  const processingInfo = computed(() => ({
    isProcessing: isProcessing.value,
    taskId: currentTaskId.value,
    progress: processingProgress.value,
    message: processingMessage.value,
    service: currentService.value
  }))
  
  const availableServices = computed(() => {
    if (!neroAIService) return []
    return neroAIService.getSupportedServices()
  })
  
  const serviceCapabilities = computed(() => {
    if (!neroAIService) return {}
    return neroAIService.getServiceCapabilities()
  })
  
  // ==========  核心AI处理方法  ==========
  
  /**
   * 处理AI任务的通用方法
   * @param {string} serviceType - 服务类型
   * @param {File|Blob} imageFile - 图片文件
   * @param {Object} params - 处理参数
   * @param {Function} onResult - 结果回调
   * @param {Function} onError - 错误回调
   * @param {Object} options - 额外选项
   * @returns {Promise<boolean>} 处理是否成功
   */
  const processImage = async (serviceType, imageFile, params = {}, onResult, onError, options = {}) => {
    if (!imageFile) {
      const error = new Error('没有提供图片文件')
      onError?.(error)
      return false
    }
    
    if (!neroAIService) {
      const error = new Error('Nero AI 服务未初始化')
      onError?.(error)
      return false
    }
    
    // 检查服务是否支持
    if (!neroAIService.isServiceSupported(serviceType)) {
      const error = new Error(`不支持的服务类型: ${serviceType}`)
      onError?.(error)
      return false
    }
    
    // 检查试用配额
    const capability = serviceCapabilities.value[serviceType]
    const creditCost = capability?.credit_cost || 1
    
    const creditsResult = await ensureCredits(serviceType, creditCost)
    if (!creditsResult.success) {
      onError?.(new Error(creditsResult.error))
      return false
    }
    
    // 设置处理状态
    startProcessing(serviceType, `正在处理${capability?.name || serviceType}...`)
    imageStore.setProcessing(true)
    
    try {
      console.log(`[NeroAI] 开始处理: ${serviceType}`)
      
      // 准备处理参数
      const processParams = {
        type: serviceType,
        body: {
          image_file: imageFile,
          ...params
        },
        info: {
          user_id: options.userId,
          task_name: options.taskName || `${serviceType}_${Date.now()}`
        }
      }
      
      // 创建任务
      const taskId = await taskManager.addTask(processParams, {
        priority: options.priority || 'medium',
        onProgress: updateProgress,
        onComplete: async (result) => {
          try {
            // 处理结果
            const processedResult = await resultProcessor.processResult(result, imageFile)
            
            // 触发结果回调
            onResult?.(processedResult)
            
            // 添加到结果历史
            processingResults.value.unshift(processedResult)
            
            // 保持历史记录数量
            if (processingResults.value.length > 20) {
              processingResults.value = processingResults.value.slice(0, 20)
            }
            
            showSuccess(`${capability?.name || serviceType} 处理完成`)
            console.log(`[NeroAI] 处理完成: ${serviceType}`)
            
          } catch (error) {
            console.error(`[NeroAI] 结果处理失败:`, error)
            onError?.(error)
            showError('结果处理失败')
          }
        },
        onError: (error) => {
          console.error(`[NeroAI] 处理失败:`, error)
          const errorMessage = formatError(error, serviceType)
          showError(errorMessage)
          onError?.(error)
        }
      })
      
      currentTaskId.value = taskId
      return true
      
    } catch (error) {
      console.error(`[NeroAI] 创建任务失败:`, error)
      
      const errorMessage = formatError(error, serviceType)
      showError(errorMessage)
      onError?.(error)
      
      return false
      
    } finally {
      endProcessing()
      imageStore.setProcessing(false)
    }
  }
  
  // ==========  具体功能方法  ==========
  
  /**
   * AI背景移除
   */
  const removeBackground = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'BackgroundRemover',
      imageFile,
      {
        size: options.size || 'preview',
        type_hint: options.type || 'auto',
        crop: options.crop || false
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * AI图像放大
   */
  const upscaleImage = async (imageFile, onResult, onError, options = {}) => {
    const serviceType = options.mode || 'ImageUpscaler:Standard'
    
    return processImage(
      serviceType,
      imageFile,
      {
        upscaling_rate: options.scale || 2,
        quality_factor: options.quality || 95
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 面部修复
   */
  const restoreFace = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'FaceRestoration',
      imageFile,
      {
        fidelity: options.fidelity || 0.7
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 图像降噪
   */
  const denoiseImage = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'ImageDenoiser',
      imageFile,
      {
        denoise_level: options.level || 5
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 划痕修复
   */
  const fixScratch = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'ScratchFix',
      imageFile,
      {
        mask: options.mask
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 黑白照片上色
   */
  const colorizePhoto = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'ColorizePhoto',
      imageFile,
      {},
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 人脸检测
   */
  const detectFaces = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'FaceDetection',
      imageFile,
      {},
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 图像压缩
   */
  const compressImage = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'ImageCompressor',
      imageFile,
      {
        compression_level: options.level || 5
      },
      onResult,
      onError,
      options
    )
  }
  
  /**
   * 卡通化
   */
  const cartoonizeImage = async (imageFile, onResult, onError, options = {}) => {
    return processImage(
      'Cartoon',
      imageFile,
      {
        style: options.style
      },
      onResult,
      onError,
      options
    )
  }
  
  // ==========  批量处理  ==========
  
  /**
   * 批量处理图片
   */
  const batchProcess = async (files, serviceType, params = {}, onProgress, onComplete, onError) => {
    if (!Array.isArray(files) || files.length === 0) {
      onError?.(new Error('请提供要处理的图片文件'))
      return false
    }
    
    startProcessing(serviceType, `正在批量处理 ${files.length} 张图片...`)
    
    try {
      const tasks = files.map(file => ({
        type: serviceType,
        body: {
          image_file: file,
          ...params
        }
      }))
      
      const result = await neroAIService.batchProcess(tasks, 3) // 最多3个并发
      
      if (result.failed_tasks > 0) {
        showWarning(`批量处理完成，${result.failed_tasks} 张图片处理失败`)
      } else {
        showSuccess(`批量处理完成，全部 ${result.completed_tasks} 张图片处理成功`)
      }
      
      onComplete?.(result)
      return true
      
    } catch (error) {
      console.error('[NeroAI] 批量处理失败:', error)
      onError?.(error)
      showError('批量处理失败')
      return false
      
    } finally {
      endProcessing()
    }
  }
  
  // ==========  任务管理  ==========
  
  /**
   * 取消当前任务
   */
  const cancelCurrentTask = async () => {
    if (currentTaskId.value && taskManager) {
      try {
        await taskManager.cancelTask(currentTaskId.value)
        showSuccess('任务已取消')
        endProcessing()
        return true
      } catch (error) {
        console.error('取消任务失败:', error)
        showError('取消任务失败')
        return false
      }
    }
    return false
  }
  
  /**
   * 获取任务状态
   */
  const getTaskStatus = (taskId) => {
    if (!taskManager) return 'not_found'
    return taskManager.getTaskStatus(taskId)
  }
  
  /**
   * 获取处理历史
   */
  const getProcessingHistory = () => {
    return processingResults.value
  }
  
  /**
   * 清理处理历史
   */
  const clearProcessingHistory = () => {
    processingResults.value = []
  }
  
  // ==========  下载和分享  ==========
  
  /**
   * 下载处理结果
   */
  const downloadResult = async (processedResult, filename) => {
    if (!resultProcessor) {
      showError('结果处理器未初始化')
      return false
    }
    
    try {
      await resultProcessor.triggerDownload(processedResult, filename)
      showSuccess('下载已开始')
      return true
    } catch (error) {
      console.error('下载失败:', error)
      showError('下载失败')
      return false
    }
  }
  
  // ==========  辅助方法  ==========
  
  /**
   * 确保有足够的积分
   */
  const ensureCredits = async (serviceType, creditCost) => {
    if (!canUseTrial.value) {
      return {
        success: false,
        error: '今日试用次数已用完，请明天再试或升级账户'
      }
    }
    
    try {
      const success = await consumeCredits(serviceType, creditCost)
      if (!success) {
        return {
          success: false,
          error: '配额不足，无法处理请求'
        }
      }
      
      return { success: true }
      
    } catch (error) {
      return {
        success: false,
        error: `配额检查失败: ${error.message}`
      }
    }
  }
  
  /**
   * 开始处理
   */
  const startProcessing = (serviceType, message) => {
    isProcessing.value = true
    currentService.value = serviceType
    processingMessage.value = message
    processingProgress.value = 0
  }
  
  /**
   * 结束处理
   */
  const endProcessing = () => {
    isProcessing.value = false
    currentService.value = null
    currentTaskId.value = null
    processingProgress.value = 0
    processingMessage.value = ''
  }
  
  /**
   * 更新进度
   */
  const updateProgress = (progress) => {
    processingProgress.value = progress
  }
  
  /**
   * 格式化错误信息
   */
  const formatError = (error, serviceType) => {
    const serviceCapability = serviceCapabilities.value[serviceType]
    const serviceName = serviceCapability?.name || serviceType
    
    if (error.message.includes('quota') || error.message.includes('credit')) {
      return `${serviceName}配额不足，请稍后重试或升级账户`
    }
    
    if (error.message.includes('timeout')) {
      return `${serviceName}处理超时，请检查网络连接后重试`
    }
    
    if (error.message.includes('file') && error.message.includes('size')) {
      return `文件太大，${serviceName}最大支持${serviceCapability?.max_file_size / 1024 / 1024}MB`
    }
    
    return error.message || `${serviceName}处理失败`
  }
  
  return {
    // 状态
    processingInfo,
    availableServices,
    serviceCapabilities,
    
    // 核心方法
    processImage,
    
    // 具体功能方法
    removeBackground,
    upscaleImage,
    restoreFace,
    denoiseImage,
    fixScratch,
    colorizePhoto,
    detectFaces,
    compressImage,
    cartoonizeImage,
    
    // 批量处理
    batchProcess,
    
    // 任务管理
    cancelCurrentTask,
    getTaskStatus,
    getProcessingHistory,
    clearProcessingHistory,
    
    // 下载和分享
    downloadResult
  }
}
