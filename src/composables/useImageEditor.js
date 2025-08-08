/**
 * 图片编辑器组合式函数
 * 封装图片编辑相关的核心逻辑
 */

import { ref, computed, nextTick } from 'vue'
import { useImageStore } from '../stores/imageStore.js'
import { useEditorStore } from '../stores/editorStore.js'
import { useNotification } from './useNotification.js'

export function useImageEditor() {
  const imageStore = useImageStore()
  const editorStore = useEditorStore()
  const { showError, showSuccess } = useNotification()

  const canvas = ref(null)
  const originalImage = ref(null)

  // 计算属性
  const imageData = computed(() => imageStore.currentImage)
  const adjustments = computed(() => editorStore.adjustments)
  const hasChanges = computed(() => editorStore.hasChanges)
  const canUndo = computed(() => editorStore.canUndo)
  const canRedo = computed(() => editorStore.canRedo)

  // Canvas样式
  const canvasStyle = computed(() => ({
    maxWidth: '100%',
    maxHeight: '500px',
    borderRadius: '8px'
  }))

  // 初始化编辑器
  const initializeEditor = async () => {
    // 从session恢复图片数据
    imageStore.restoreFromSession()
    
    if (!imageStore.hasImage) {
      return false
    }

    try {
      await loadImageToCanvas()
      return true
    } catch (error) {
      console.error('初始化编辑器失败:', error)
      showError('初始化编辑器失败')
      return false
    }
  }

  // 加载图片到Canvas
  const loadImageToCanvas = async () => {
    if (!imageData.value || !canvas.value) {
      return
    }

    imageStore.setLoading(true)
    
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          originalImage.value = img
          setupCanvas(img)
          editorStore.setOriginalImage(img)
          resolve()
        }
        img.onerror = reject
        img.src = getImageUrl()
      })
      
      // 应用初始滤镜
      await nextTick()
      applyAdjustments()
      
    } catch (error) {
      console.error('图片加载失败:', error)
      showError('图片加载失败')
      throw error
    } finally {
      imageStore.setLoading(false)
    }
  }

  // 设置Canvas
  const setupCanvas = (img) => {
    if (!canvas.value) return
    
    const ctx = canvas.value.getContext('2d')
    const maxWidth = 800
    const maxHeight = 600
    
    let { width, height } = img
    
    // 计算合适的显示尺寸
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width *= ratio
      height *= ratio
    }
    
    canvas.value.width = width
    canvas.value.height = height
    
    // 设置Canvas到store
    editorStore.setCanvas(canvas.value)
    
    // 绘制原始图片
    ctx.drawImage(img, 0, 0, width, height)
  }

  // 获取图片URL
  const getImageUrl = () => {
    return imageStore.imageUrl || imageData.value?.url
  }

  // 应用调整参数
  const applyAdjustments = () => {
    if (!canvas.value || !originalImage.value) {
      return
    }
    
    editorStore.applyFiltersToCanvas()
  }

  // 更新单个调整参数
  const updateAdjustment = (key, value) => {
    editorStore.updateAdjustment(key, value)
    applyAdjustments()
  }

  // 重置所有调整
  const resetAll = () => {
    editorStore.resetAllAdjustments()
    applyAdjustments()
  }

  // 撤销操作
  const undo = () => {
    editorStore.undo()
    applyAdjustments()
  }

  // 重做操作
  const redo = () => {
    editorStore.redo()
    applyAdjustments()
  }

  // 下载图片
  const downloadImage = () => {
    if (!canvas.value) {
      showError('没有可下载的图片')
      return
    }

    try {
      canvas.value.toBlob((blob) => {
        if (!blob) {
          showError('生成图片失败')
          return
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `edited_${imageData.value?.name || 'image.jpg'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        showSuccess('图片下载成功')
      }, 'image/jpeg', 0.95)
    } catch (error) {
      console.error('下载图片失败:', error)
      showError('下载图片失败')
    }
  }

  // 图片加载事件处理
  const onImageLoad = () => {
    loadImageToCanvas()
  }

  // 图片错误事件处理
  const onImageError = () => {
    showError('图片加载失败')
    imageStore.setLoading(false)
  }

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    return imageStore.formattedFileSize
  }

  // 处理AI结果
  const handleAiResult = (resultBlob) => {
    try {
      // 创建新的图片对象
      const img = new Image()
      const url = URL.createObjectURL(resultBlob)
      
      img.onload = () => {
        // 更新Canvas
        if (canvas.value) {
          const ctx = canvas.value.getContext('2d')
          ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
          ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)
        }
        
        // 更新原始图片引用
        originalImage.value = img
        editorStore.setOriginalImage(img)
        editorStore.addToHistory('AI背景移除')
        
        URL.revokeObjectURL(url)
        showSuccess('AI处理完成')
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        showError('AI处理结果加载失败')
      }
      
      img.src = url
    } catch (error) {
      console.error('处理AI结果失败:', error)
      showError('处理AI结果失败')
    }
  }

  // 处理AI错误
  const handleAiError = (error) => {
    console.error('AI处理失败:', error)
    showError('AI处理失败: ' + error.message)
  }

  return {
    // 响应式引用
    canvas,
    originalImage,
    
    // 计算属性
    imageData,
    adjustments,
    hasChanges,
    canUndo,
    canRedo,
    canvasStyle,
    
    // 状态
    isImageLoading: imageStore.isLoading,
    isProcessing: imageStore.isProcessing,
    
    // 方法
    initializeEditor,
    loadImageToCanvas,
    getImageUrl,
    applyAdjustments,
    updateAdjustment,
    resetAll,
    undo,
    redo,
    downloadImage,
    onImageLoad,
    onImageError,
    formatFileSize,
    handleAiResult,
    handleAiError,
    
    // 原始图片文件（用于AI处理）
    originalImageFile: imageStore.originalImageFile
  }
}
