/**
 * 图片上传组合式函数
 * 封装图片上传相关的逻辑
 */

import { ref } from 'vue'
import { useImageStore } from '../stores/imageStore.js'
import { useNotification } from './useNotification.js'

export function useImageUpload() {
  const imageStore = useImageStore()
  const { showNotification, showError, showSuccess } = useNotification()
  
  const isDragging = ref(false)
  const fileInput = ref(null)

  // 触发文件选择
  const triggerFileInput = () => {
    if (fileInput.value) {
      fileInput.value.click()
    }
  }

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  // 处理拖拽上传
  const handleDrop = (event) => {
    isDragging.value = false
    const files = event.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  // 处理拖拽进入
  const handleDragEnter = () => {
    isDragging.value = true
  }

  // 处理拖拽离开
  const handleDragLeave = () => {
    isDragging.value = false
  }

  // 文件验证
  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      showError('请选择图片文件')
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('文件大小不能超过10MB')
      return false
    }

    return true
  }

  // 处理文件
  const processFile = async (file) => {
    if (!validateFile(file)) {
      return false
    }

    try {
      imageStore.setUploading(true)
      
      // 创建本地预览
      const localPreview = await createLocalPreview(file)
      
      // 设置图片基本信息
      imageStore.setCurrentImage({
        file,
        url: localPreview,
        name: file.name,
        size: file.size,
        type: file.type
      })
      
      imageStore.setOriginalImageFile(file)

      // 上传到OSS
      const uploadResult = await uploadToOSS(file)
      
      if (uploadResult.success) {
        imageStore.setOSSInfo({
          url: uploadResult.url,
          key: uploadResult.key
        })
        
        // 保存到session
        imageStore.saveToSession()
        
        showSuccess('图片上传成功')
        return true
      } else {
        throw new Error('OSS上传失败')
      }
      
    } catch (error) {
      console.error('处理图片失败:', error)
      showError('图片处理失败: ' + error.message)
      imageStore.clearImage()
      return false
    } finally {
      imageStore.setUploading(false)
    }
  }

  // 创建本地预览
  const createLocalPreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // 上传到OSS
  const uploadToOSS = async (file) => {
    const { uploadToOSS } = await import('../utils/ossClient.js')
    return uploadToOSS(file, 'original', file.name)
  }

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 清除图片
  const clearImage = () => {
    imageStore.clearImage()
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  return {
    // 响应式数据
    isDragging,
    fileInput,
    isUploading: imageStore.isUploading,
    
    // 方法
    triggerFileInput,
    handleFileSelect,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
    processFile,
    formatFileSize,
    clearImage,
    
    // 图片数据
    selectedImage: imageStore.currentImage,
    imageUrl: imageStore.imageUrl,
    hasImage: imageStore.hasImage
  }
}
