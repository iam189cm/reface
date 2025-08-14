/**
 * AI 服务组合式函数 (重构为使用 Nero AI)
 * 保持向后兼容性的适配器
 * 
 * @deprecated 推荐直接使用 useNeroAIServices，此文件仅为向后兼容
 */

import { useNeroAIServices } from './useNeroAIServices.js'

export function useAIServices() {
  // 直接使用新的Nero AI服务
  const neroAI = useNeroAIServices()
  
  // 为了向后兼容，保持相同的接口
  return {
    // 状态信息
    processingInfo: neroAI.processingInfo,
    availableServices: neroAI.availableServices,
    isProcessing: neroAI.processingInfo.isProcessing,
    
    // 主要功能方法（保持原有接口）
    removeBackground: neroAI.removeBackground,
    enlargeImage: neroAI.upscaleImage, // 映射到新方法名
    upscaleImage: neroAI.upscaleImage,
    
    // 新增的功能方法
    restoreFace: neroAI.restoreFace,
    denoiseImage: neroAI.denoiseImage,
    fixScratch: neroAI.fixScratch,
    colorizePhoto: neroAI.colorizePhoto,
    detectFaces: neroAI.detectFaces,
    compressImage: neroAI.compressImage,
    cartoonizeImage: neroAI.cartoonizeImage,
    
    // 批量处理
    batchProcess: neroAI.batchProcess,
    
    // 任务管理
    cancelCurrentTask: neroAI.cancelCurrentTask,
    getTaskStatus: neroAI.getTaskStatus,
    
    // 下载功能
    downloadResult: neroAI.downloadResult,
    
    // 历史管理
    getProcessingHistory: neroAI.getProcessingHistory,
    clearProcessingHistory: neroAI.clearProcessingHistory
  }
}