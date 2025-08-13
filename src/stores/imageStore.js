/**
 * 图片状态管理 Store
 * 管理当前图片的基本信息和状态
 */

import { defineStore } from 'pinia'

export const useImageStore = defineStore('image', {
  state: () => ({
    // 当前图片数据
    currentImage: null,
    
    // 原始图片文件
    originalImageFile: null,
    
    // 图片元数据
    imageMetadata: {
      name: '',
      size: 0,
      type: '',
      width: 0,
      height: 0
    },
    
    // OSS 相关信息
    ossInfo: {
      url: null,
      key: null,
      isUploaded: false
    },
    
    // 加载状态
    isLoading: false,
    isUploading: false,
    isProcessing: false,
    
    // 错误状态
    error: null
  }),

  getters: {
    // 是否有图片
    hasImage: (state) => !!state.currentImage,
    
    // 原始图片信息
    originalImage: (state) => state.currentImage,
    
    // 图片URL（优先使用OSS URL）
    imageUrl: (state) => {
      if (state.ossInfo.url) return state.ossInfo.url
      return state.currentImage?.url || null
    },
    
    // 格式化文件大小
    formattedFileSize: (state) => {
      const bytes = state.imageMetadata.size
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    // 是否正在处理中
    isBusy: (state) => state.isLoading || state.isUploading || state.isProcessing
  },

  actions: {
    // 设置当前图片
    setCurrentImage(imageData) {
      this.currentImage = imageData
      if (imageData) {
        this.imageMetadata = {
          name: imageData.name || '',
          size: imageData.size || 0,
          type: imageData.type || '',
          width: imageData.width || 0,
          height: imageData.height || 0
        }
      }
      this.error = null
    },

    // 设置原始图片文件
    setOriginalImageFile(file) {
      this.originalImageFile = file
    },

    // 设置OSS信息
    setOSSInfo(ossData) {
      this.ossInfo = {
        url: ossData.url || null,
        key: ossData.key || null,
        isUploaded: !!ossData.url
      }
    },

    // 设置加载状态
    setLoading(loading) {
      this.isLoading = loading
    },

    // 设置上传状态
    setUploading(uploading) {
      this.isUploading = uploading
    },

    // 设置处理状态
    setProcessing(processing) {
      this.isProcessing = processing
    },

    // 设置错误
    setError(error) {
      this.error = error
    },

    // 上传图片方法
    async uploadImage(file) {
      if (!file) {
        throw new Error('文件不能为空')
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('不支持的文件格式')
      }

      // 验证文件大小 (默认最大12MB)
      const maxSize = 12 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('文件大小超过限制')
      }

      try {
        this.setUploading(true)
        this.setError(null)

        // 创建文件URL用于预览
        const imageUrl = URL.createObjectURL(file)
        
        // 获取图片尺寸
        const { width, height } = await this.getImageDimensions(file)

        // 设置图片数据
        this.setCurrentImage({
          url: imageUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          width,
          height
        })

        // 设置原始文件
        this.setOriginalImageFile(file)

        // 保存到session storage
        this.saveToSession()

        return {
          success: true,
          imageUrl,
          metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            width,
            height
          }
        }
      } catch (error) {
        this.setError(error.message)
        throw error
      } finally {
        this.setUploading(false)
      }
    },

    // 获取图片尺寸的辅助方法
    getImageDimensions(file) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        
        img.onload = () => {
          URL.revokeObjectURL(url)
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight
          })
        }
        
        img.onerror = () => {
          URL.revokeObjectURL(url)
          reject(new Error('无法加载图片'))
        }
        
        img.src = url
      })
    },

    // 清除图片数据
    clearImage() {
      this.currentImage = null
      this.originalImageFile = null
      this.imageMetadata = {
        name: '',
        size: 0,
        type: '',
        width: 0,
        height: 0
      }
      this.ossInfo = {
        url: null,
        key: null,
        isUploaded: false
      }
      this.isLoading = false
      this.isUploading = false
      this.isProcessing = false
      this.error = null
    },

    // 从 sessionStorage 恢复数据
    restoreFromSession() {
      try {
        const savedData = sessionStorage.getItem('selectedImage')
        if (savedData) {
          const imageData = JSON.parse(savedData)
          this.setCurrentImage(imageData)
          this.setOSSInfo({
            url: imageData.ossUrl,
            key: imageData.ossKey
          })
        }

        // 恢复原始文件
        if (window.originalImageFile) {
          this.setOriginalImageFile(window.originalImageFile)
        }
      } catch (error) {
        console.warn('恢复图片数据失败:', error)
        this.setError('恢复图片数据失败')
      }
    },

    // 保存到 sessionStorage
    saveToSession() {
      if (!this.currentImage) return

      try {
        const dataToSave = {
          url: this.currentImage.url,
          name: this.imageMetadata.name,
          size: this.imageMetadata.size,
          type: this.imageMetadata.type,
          ossUrl: this.ossInfo.url,
          ossKey: this.ossInfo.key,
          timestamp: Date.now()
        }

        sessionStorage.setItem('selectedImage', JSON.stringify(dataToSave))

        // 保存原始文件到 window
        if (this.originalImageFile) {
          window.originalImageFile = this.originalImageFile
        }
      } catch (error) {
        console.warn('保存图片数据失败:', error)
        this.setError('保存图片数据失败')
      }
    }
  }
})
