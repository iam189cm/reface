/**
 * 编辑器状态管理 Store
 * 管理图片编辑相关的状态和操作
 */

import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => ({
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
    canRedo: (state) => state.historyIndex < state.editHistory.length - 1
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
      this.hasChanges = false
    },

    // 更新单个调整参数
    updateAdjustment(key, value) {
      if (key in this.adjustments) {
        this.adjustments[key] = value
        this.hasChanges = true
        this.addToHistory(`调整${key}: ${value}`)
      }
    },

    // 重置所有调整
    resetAllAdjustments() {
      this.adjustments = { ...this.defaultAdjustments }
      this.hasChanges = false
      this.addToHistory('重置所有调整')
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
        // 这里可以根据需要实现撤销逻辑
      }
    },

    // 重做操作
    redo() {
      if (this.canRedo) {
        this.historyIndex++
        // 这里可以根据需要实现重做逻辑
      }
    },

    // 清除编辑器状态
    clearEditor() {
      this.canvas = null
      this.context = null
      this.originalImage = null
      this.editHistory = []
      this.historyIndex = -1
      this.isImageLoading = false
      this.hasChanges = false
    }
  }
})