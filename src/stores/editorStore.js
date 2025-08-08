/**
 * 编辑器状态管理 Store
 * 管理图片编辑相关的状态和操作
 */

import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
    // 当前调整参数
    adjustments: {
      smoothing: 0,     // 磨皮 0-100
      whitening: 0,     // 美白 0-100
      brightness: 0,    // 亮度 -50 到 50
      contrast: 0,      // 对比度 -50 到 50
      saturation: 0     // 饱和度 -50 到 50
    },

    // 默认调整参数（用于重置）
    defaultAdjustments: {
      smoothing: 0,
      whitening: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0
    },

    // Canvas 相关
    canvas: null,
    context: null,
    originalImage: null,
    
    // 编辑历史（用于撤销/重做）
    editHistory: [],
    historyIndex: -1,
    maxHistoryLength: 20,

    // Canvas 样式
    canvasStyle: {
      maxWidth: '100%',
      maxHeight: '500px',
      borderRadius: '8px'
    },

    // 编辑状态
    isImageLoading: false,
    hasChanges: false
  }),

  getters: {
    // 是否可以撤销
    canUndo: (state) => state.historyIndex > 0,
    
    // 是否可以重做
    canRedo: (state) => state.historyIndex < state.editHistory.length - 1,
    
    // 是否有任何调整
    hasAnyAdjustments: (state) => {
      return Object.keys(state.adjustments).some(key => 
        state.adjustments[key] !== state.defaultAdjustments[key]
      )
    },

    // 获取调整参数的变化
    adjustmentChanges: (state) => {
      const changes = {}
      Object.keys(state.adjustments).forEach(key => {
        if (state.adjustments[key] !== state.defaultAdjustments[key]) {
          changes[key] = state.adjustments[key]
        }
      })
      return changes
    }
  },

  actions: {
    // 设置Canvas引用
    setCanvas(canvas) {
      this.canvas = canvas
      this.context = canvas?.getContext('2d')
    },

    // 设置原始图片
    setOriginalImage(image) {
      this.originalImage = image
      this.addToHistory('原始图片')
    },

    // 更新调整参数
    updateAdjustment(key, value) {
      if (key in this.adjustments) {
        this.adjustments[key] = value
        this.hasChanges = true
      }
    },

    // 批量更新调整参数
    updateAdjustments(newAdjustments) {
      Object.keys(newAdjustments).forEach(key => {
        if (key in this.adjustments) {
          this.adjustments[key] = newAdjustments[key]
        }
      })
      this.hasChanges = true
    },

    // 重置所有调整
    resetAllAdjustments() {
      this.adjustments = { ...this.defaultAdjustments }
      this.hasChanges = false
      this.addToHistory('重置所有调整')
    },

    // 重置单个调整
    resetAdjustment(key) {
      if (key in this.adjustments) {
        this.adjustments[key] = this.defaultAdjustments[key]
        this.addToHistory(`重置${key}`)
      }
    },

    // 设置图片加载状态
    setImageLoading(loading) {
      this.isImageLoading = loading
    },

    // 添加到历史记录
    addToHistory(description = '编辑操作') {
      // 移除当前索引之后的历史记录
      this.editHistory = this.editHistory.slice(0, this.historyIndex + 1)
      
      // 添加新的历史记录
      const historyItem = {
        adjustments: { ...this.adjustments },
        description,
        timestamp: Date.now()
      }
      
      this.editHistory.push(historyItem)
      this.historyIndex = this.editHistory.length - 1
      
      // 限制历史记录长度
      if (this.editHistory.length > this.maxHistoryLength) {
        this.editHistory.shift()
        this.historyIndex--
      }
    },

    // 撤销操作
    undo() {
      if (this.canUndo) {
        this.historyIndex--
        const historyItem = this.editHistory[this.historyIndex]
        this.adjustments = { ...historyItem.adjustments }
        this.hasChanges = this.hasAnyAdjustments
      }
    },

    // 重做操作
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        const historyItem = this.editHistory[this.historyIndex]
        this.adjustments = { ...historyItem.adjustments }
        this.hasChanges = this.hasAnyAdjustments
      }
    },

    // 清除编辑器状态
    clearEditor() {
      this.adjustments = { ...this.defaultAdjustments }
      this.canvas = null
      this.context = null
      this.originalImage = null
      this.editHistory = []
      this.historyIndex = -1
      this.isImageLoading = false
      this.hasChanges = false
    },

    // 应用滤镜到Canvas
    applyFiltersToCanvas() {
      if (!this.canvas || !this.context || !this.originalImage) {
        return
      }

      const { canvas, context, originalImage } = this

      // 清除画布
      context.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制原始图片
      context.drawImage(originalImage, 0, 0, canvas.width, canvas.height)

      // 获取图像数据
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // 应用滤镜效果
      this.applyImageFilters(data)

      // 将处理后的数据绘制回画布
      context.putImageData(imageData, 0, 0)
    },

    // 应用图像滤镜算法
    applyImageFilters(data) {
      const { smoothing, whitening, brightness, contrast, saturation } = this.adjustments

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // 应用亮度调整
        if (brightness !== 0) {
          const brightnessFactor = brightness * 2.55 // 将 -50~50 转换为 -127.5~127.5
          r = Math.max(0, Math.min(255, r + brightnessFactor))
          g = Math.max(0, Math.min(255, g + brightnessFactor))
          b = Math.max(0, Math.min(255, b + brightnessFactor))
        }

        // 应用对比度调整
        if (contrast !== 0) {
          const contrastFactor = (259 * (contrast * 2.55 + 255)) / (255 * (259 - contrast * 2.55))
          r = Math.max(0, Math.min(255, contrastFactor * (r - 128) + 128))
          g = Math.max(0, Math.min(255, contrastFactor * (g - 128) + 128))
          b = Math.max(0, Math.min(255, contrastFactor * (b - 128) + 128))
        }

        // 应用饱和度调整
        if (saturation !== 0) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b
          const satFactor = (saturation + 50) / 50 // 将 -50~50 转换为 0~2
          r = Math.max(0, Math.min(255, gray + satFactor * (r - gray)))
          g = Math.max(0, Math.min(255, gray + satFactor * (g - gray)))
          b = Math.max(0, Math.min(255, gray + satFactor * (b - gray)))
        }

        // 应用美白效果
        if (whitening > 0) {
          const whiteningFactor = whitening / 100
          r = r + (255 - r) * whiteningFactor * 0.3
          g = g + (255 - g) * whiteningFactor * 0.3
          b = b + (255 - b) * whiteningFactor * 0.3
        }

        // 应用磨皮效果（简化版）
        if (smoothing > 0) {
          const smoothingFactor = smoothing / 100 * 0.2
          const avg = (r + g + b) / 3
          r = r + (avg - r) * smoothingFactor
          g = g + (avg - g) * smoothingFactor
          b = b + (avg - b) * smoothingFactor
        }

        data[i] = Math.round(r)
        data[i + 1] = Math.round(g)
        data[i + 2] = Math.round(b)
      }
    }
  }
})
