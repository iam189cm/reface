/**
 * Canvas操作组合式函数
 * 封装Canvas相关的操作逻辑
 */

import { ref } from 'vue'

export function useCanvasOperations() {
  const canvas = ref(null)
  const context = ref(null)

  // 初始化Canvas
  const initializeCanvas = (canvasElement) => {
    canvas.value = canvasElement
    context.value = canvasElement?.getContext('2d')
    return context.value !== null
  }

  // 设置Canvas尺寸
  const setCanvasSize = (width, height) => {
    if (canvas.value) {
      canvas.value.width = width
      canvas.value.height = height
      return true
    }
    return false
  }

  // 清空Canvas
  const clearCanvas = () => {
    if (context.value && canvas.value) {
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      return true
    }
    return false
  }

  // 绘制图片到Canvas
  const drawImageToCanvas = (image, options = {}) => {
    if (!context.value || !canvas.value || !image) {
      return false
    }

    const {
      x = 0,
      y = 0,
      width = canvas.value.width,
      height = canvas.value.height,
      clearFirst = true
    } = options

    try {
      if (clearFirst) {
        clearCanvas()
      }
      
      context.value.drawImage(image, x, y, width, height)
      return true
    } catch (error) {
      console.error('绘制图片到Canvas失败:', error)
      return false
    }
  }

  // 获取Canvas的ImageData
  const getImageData = (x = 0, y = 0, width, height) => {
    if (!context.value || !canvas.value) {
      return null
    }

    const w = width || canvas.value.width
    const h = height || canvas.value.height

    try {
      return context.value.getImageData(x, y, w, h)
    } catch (error) {
      console.error('获取ImageData失败:', error)
      return null
    }
  }

  // 设置Canvas的ImageData
  const putImageData = (imageData, x = 0, y = 0) => {
    if (!context.value || !imageData) {
      return false
    }

    try {
      context.value.putImageData(imageData, x, y)
      return true
    } catch (error) {
      console.error('设置ImageData失败:', error)
      return false
    }
  }

  // Canvas转换为Blob
  const canvasToBlob = (quality = 0.95, type = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
      if (!canvas.value) {
        reject(new Error('Canvas未初始化'))
        return
      }

      try {
        canvas.value.toBlob(resolve, type, quality)
      } catch (error) {
        reject(error)
      }
    })
  }

  // Canvas转换为DataURL
  const canvasToDataURL = (type = 'image/jpeg', quality = 0.95) => {
    if (!canvas.value) {
      return null
    }

    try {
      return canvas.value.toDataURL(type, quality)
    } catch (error) {
      console.error('Canvas转换为DataURL失败:', error)
      return null
    }
  }

  // 计算合适的Canvas显示尺寸
  const calculateDisplaySize = (imageWidth, imageHeight, maxWidth = 800, maxHeight = 600) => {
    let width = imageWidth
    let height = imageHeight

    // 按比例缩放
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.floor(width * ratio)
      height = Math.floor(height * ratio)
    }

    return { width, height }
  }



  // 从URL加载图片
  const loadImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  return {
    // 响应式引用
    canvas,
    context,

    // Canvas基础操作
    initializeCanvas,
    setCanvasSize,
    clearCanvas,
    drawImageToCanvas,
    
    // 数据操作
    getImageData,
    putImageData,
    
    // 导出操作
    canvasToBlob,
    canvasToDataURL,
    
    // 工具方法
    calculateDisplaySize,
    loadImageFromURL
  }
}
