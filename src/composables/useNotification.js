/**
 * 通知系统组合式函数
 * 提供统一的通知接口，兼容原有的DOM通知方式
 */

import { useAppStore } from '../stores/appStore.js'

export function useNotification() {
  const appStore = useAppStore()

  // 显示通知（兼容原有代码的简单接口）
  const showNotification = (message, type = 'info') => {
    // 使用新的store方式
    appStore.showNotification(message, type)
    
    // 同时保持原有的DOM通知方式，确保UI完全一致
    createDOMNotification(message, type)
  }

  // 创建DOM通知（保持原有样式和行为）
  const createDOMNotification = (message, type = 'info') => {
    const notification = document.createElement('div')
    
    const typeClassMap = {
      'success': 'bg-green-500',
      'error': 'bg-red-500',
      'warning': 'bg-yellow-500',
      'info': 'bg-blue-500'
    }
    
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
      typeClassMap[type] || 'bg-blue-500'
    }`
    
    notification.textContent = message
    document.body.appendChild(notification)
    
    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 3000)
  }

  // 具体类型的通知方法
  const showSuccess = (message) => showNotification(message, 'success')
  const showError = (message) => showNotification(message, 'error')
  const showWarning = (message) => showNotification(message, 'warning')
  const showInfo = (message) => showNotification(message, 'info')

  // 清除所有通知
  const clearNotifications = () => {
    appStore.clearAllNotifications()
    
    // 同时清除DOM通知
    const domNotifications = document.querySelectorAll('.fixed.top-4.right-4')
    domNotifications.forEach(notification => notification.remove())
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotifications,
    
    // 暴露store以供高级用法
    notifications: appStore.notifications,
    addNotification: appStore.addNotification,
    removeNotification: appStore.removeNotification
  }
}
