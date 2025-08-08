/**
 * 应用全局状态管理 Store
 * 管理通知、加载状态等全局状态
 */

import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 通知系统
    notifications: [],
    
    // 全局加载状态
    isGlobalLoading: false,
    globalLoadingMessage: '',
    
    // 模态框状态
    modals: {
      // 可以添加各种模态框的状态
    },
    
    // 应用设置
    settings: {
      theme: 'light',
      language: 'zh-CN'
    }
  }),

  getters: {
    // 获取最新通知
    latestNotification: (state) => {
      return state.notifications.length > 0 
        ? state.notifications[state.notifications.length - 1] 
        : null
    },
    
    // 获取未读通知数量
    unreadNotificationCount: (state) => {
      return state.notifications.filter(n => !n.read).length
    }
  },

  actions: {
    // 添加通知
    addNotification(notification) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        type: 'info', // info, success, warning, error
        title: '',
        message: '',
        duration: 3000, // 自动消失时间，0表示不自动消失
        read: false,
        createdAt: new Date(),
        ...notification
      }
      
      this.notifications.push(newNotification)
      
      // 自动移除通知
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }
      
      return id
    },

    // 添加成功通知
    addSuccessNotification(message, title = '成功') {
      return this.addNotification({
        type: 'success',
        title,
        message
      })
    },

    // 添加错误通知
    addErrorNotification(message, title = '错误') {
      return this.addNotification({
        type: 'error',
        title,
        message,
        duration: 5000 // 错误通知显示更久
      })
    },

    // 添加警告通知
    addWarningNotification(message, title = '警告') {
      return this.addNotification({
        type: 'warning',
        title,
        message
      })
    },

    // 添加信息通知
    addInfoNotification(message, title = '提示') {
      return this.addNotification({
        type: 'info',
        title,
        message
      })
    },

    // 移除通知
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    // 标记通知为已读
    markNotificationAsRead(id) {
      const notification = this.notifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },

    // 清除所有通知
    clearAllNotifications() {
      this.notifications = []
    },

    // 设置全局加载状态
    setGlobalLoading(loading, message = '') {
      this.isGlobalLoading = loading
      this.globalLoadingMessage = message
    },

    // 更新应用设置
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
      
      // 保存到本地存储
      try {
        localStorage.setItem('app_settings', JSON.stringify(this.settings))
      } catch (error) {
        console.warn('保存应用设置失败:', error)
      }
    },

    // 从本地存储恢复设置
    restoreSettings() {
      try {
        const savedSettings = localStorage.getItem('app_settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          this.settings = { ...this.settings, ...settings }
        }
      } catch (error) {
        console.warn('恢复应用设置失败:', error)
      }
    },

    // 显示简单通知（兼容原有代码）
    showNotification(message, type = 'info') {
      const typeMap = {
        'success': 'addSuccessNotification',
        'error': 'addErrorNotification', 
        'warning': 'addWarningNotification',
        'info': 'addInfoNotification'
      }
      
      const method = typeMap[type] || 'addInfoNotification'
      return this[method](message)
    }
  }
})
