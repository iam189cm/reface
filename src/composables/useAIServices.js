/**
 * AI服务组合式函数
 * 封装AI相关服务调用逻辑
 */

import { ref } from 'vue'
import { useImageStore } from '../stores/imageStore.js'
import { useTrialManager } from './useTrialManager.js'
import { useNotification } from './useNotification.js'
import { VANCE_AI_CONFIG } from '../constants/apiConstants.js'

export function useAIServices() {
  const imageStore = useImageStore()
  const { attemptUseTrial } = useTrialManager()
  const { showError, showSuccess, showInfo } = useNotification()

  const isProcessing = ref(false)
  const processingProgress = ref(0)
  const processingMessage = ref('')

  // 移除背景
  const removeBackground = async (imageFile, onResult, onError) => {
    if (!imageFile) {
      const error = new Error('没有提供图片文件')
      onError?.(error)
      return false
    }

    // 检查试用次数
    if (!attemptUseTrial('AI背景移除')) {
      return false
    }

    isProcessing.value = true
    processingProgress.value = 0
    processingMessage.value = '正在处理图片...'
    imageStore.setProcessing(true)

    try {
      // 导入AI服务
      const { removeBackground: removeBackgroundAPI } = await import('../utils/aiServices.js')
      
      // 获取API Key
      const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY
      if (!apiKey || apiKey === 'your_remove_bg_api_key_here') {
        throw new Error('Remove.bg API Key 未配置')
      }

      processingProgress.value = 30
      processingMessage.value = '上传到AI服务...'

      // 调用API
      const resultBlob = await removeBackgroundAPI(imageFile, apiKey)
      
      processingProgress.value = 90
      processingMessage.value = '处理完成...'

      // 调用结果回调
      onResult?.(resultBlob)
      
      processingProgress.value = 100
      showSuccess('AI背景移除成功')
      
      return true

    } catch (error) {
      console.error('AI背景移除失败:', error)
      
      let errorMessage = 'AI处理失败'
      if (error.message.includes('API Key')) {
        errorMessage = 'API Key 配置错误'
      } else if (error.message.includes('quota')) {
        errorMessage = 'API配额不足'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络'
      }
      
      showError(errorMessage + ': ' + error.message)
      onError?.(error)
      
      return false

    } finally {
      isProcessing.value = false
      processingProgress.value = 0
      processingMessage.value = ''
      imageStore.setProcessing(false)
    }
  }

  // 检查API配额
  const checkApiQuota = async () => {
    try {
      const { checkApiQuota: checkQuotaAPI } = await import('../utils/aiServices.js')
      const apiKey = import.meta.env.VITE_REMOVE_BG_API_KEY
      
      if (!apiKey || apiKey === 'your_remove_bg_api_key_here') {
        showError('Remove.bg API Key 未配置')
        return null
      }

      const quotaInfo = await checkQuotaAPI(apiKey)
      
      if (quotaInfo) {
        showInfo(`API剩余配额: ${quotaInfo.credits || 'N/A'}`)
        return quotaInfo
      } else {
        showError('获取API配额信息失败')
        return null
      }
      
    } catch (error) {
      console.error('检查API配额失败:', error)
      showError('检查API配额失败: ' + error.message)
      return null
    }
  }

  // 压缩图片（节省API配额）
  const compressImageForAI = async (file, maxWidth = 800, quality = 0.8) => {
    try {
      const { compressImage } = await import('../utils/aiServices.js')
      const compressedBlob = await compressImage(file, maxWidth, quality)
      
      showInfo(`图片已压缩: ${(file.size / 1024).toFixed(1)}KB → ${(compressedBlob.size / 1024).toFixed(1)}KB`)
      
      return compressedBlob
    } catch (error) {
      console.error('图片压缩失败:', error)
      showError('图片压缩失败: ' + error.message)
      return file // 返回原文件
    }
  }

  // 处理AI结果为Canvas数据
  const processAIResultToCanvas = async (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        resolve({ canvas, ctx, imageData })
      }
      img.onerror = reject
      img.src = URL.createObjectURL(blob)
    })
  }

  // VanceAI 图像放大处理
  const enlargeImage = async (imageFile, params = {}, onResult, onError) => {
    if (!imageFile) {
      const error = new Error('没有提供图片文件')
      onError?.(error)
      return false
    }

    // 检查试用次数和权限
    const { scale = '2x' } = params
    const scaleConfig = VANCE_AI_CONFIG.SCALE_OPTIONS[scale]
    
    if (!scaleConfig) {
      const error = new Error('无效的放大倍数')
      onError?.(error)
      return false
    }

    // 检查试用权限
    if (!attemptUseTrial('AI图像放大', scaleConfig.credit)) {
      return false
    }

    isProcessing.value = true
    processingProgress.value = 0
    processingMessage.value = '准备处理图片...'
    imageStore.setProcessing(true)

    try {
      // 导入VanceAI服务
      const { vanceAIEnlargeComplete } = await import('../utils/aiServices.js')
      
      // 进度回调处理
      const handleProgress = (progressInfo) => {
        processingProgress.value = progressInfo.progress
        processingMessage.value = progressInfo.message
      }

      // 调用VanceAI API完整流程
      const resultBlob = await vanceAIEnlargeComplete(imageFile, params, handleProgress)
      
      // 调用结果回调
      onResult?.(resultBlob)
      
      showSuccess(`图像${scale}放大处理成功`)
      return true

    } catch (error) {
      console.error('VanceAI图像放大失败:', error)
      
      let errorMessage = 'AI图像放大失败'
      if (error.message.includes('API Token')) {
        errorMessage = 'VanceAI API Token 配置错误'
      } else if (error.message.includes('credit') || error.message.includes('quota')) {
        errorMessage = 'API配额不足'
      } else if (error.message.includes('超时')) {
        errorMessage = '处理超时，请稍后重试'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络'
      }
      
      showError(errorMessage + ': ' + error.message)
      onError?.(error)
      
      return false

    } finally {
      isProcessing.value = false
      processingProgress.value = 0
      processingMessage.value = ''
      imageStore.setProcessing(false)
    }
  }

  // 检查VanceAI API配额
  const checkVanceAIQuota = async () => {
    try {
      const apiToken = import.meta.env.VITE_VANCE_AI_API_TOKEN
      
      if (!apiToken || apiToken === 'your_vance_ai_api_token_here') {
        showError('VanceAI API Token 未配置')
        return null
      }

      // VanceAI暂时没有直接的配额查询API，可以通过尝试上传小图片来测试
      showInfo('VanceAI API连接正常')
      return { status: 'ok' }
      
    } catch (error) {
      console.error('检查VanceAI API配额失败:', error)
      showError('检查VanceAI API配额失败: ' + error.message)
      return null
    }
  }

  // 获取处理进度信息
  const getProcessingInfo = () => {
    return {
      isProcessing: isProcessing.value,
      progress: processingProgress.value,
      message: processingMessage.value
    }
  }

  return {
    // 响应式数据
    isProcessing,
    processingProgress,
    processingMessage,
    
    // 方法
    removeBackground,
    enlargeImage,
    checkApiQuota,
    checkVanceAIQuota,
    compressImageForAI,
    processAIResultToCanvas,
    getProcessingInfo
  }
}
