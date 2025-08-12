/**
 * 通知管理组合函数
 * 提供统一的消息通知接口
 */

import { ref, reactive } from 'vue'

// 全局通知状态
const notifications = reactive([])
const nextId = ref(1)

// 通知类型
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error', 
  WARNING: 'warning',
  INFO: 'info'
}

export function useNotification() {
  /**
   * 添加通知
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型
   * @param {Object} options - 选项
   */
  const addNotification = (message, type = NotificationTypes.INFO, options = {}) => {
    const {
      duration = getDefaultDuration(type),
      persistent = false,
      actions = [],
      title = null
    } = options
    
    const notification = {
      id: nextId.value++,
      message,
      type,
      title,
      actions,
      persistent,
      timestamp: Date.now(),
      visible: true
    }
    
    notifications.push(notification)
    
    // 自动移除（除非是持久化通知）
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }
    
    return notification.id
  }
  
  /**
   * 移除通知
   * @param {number} id - 通知ID
   */
  const removeNotification = (id) => {
    const index = notifications.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.splice(index, 1)
    }
  }
  
  /**
   * 清空所有通知
   */
  const clearAll = () => {
    notifications.length = 0
  }
  
  /**
   * 成功消息
   * @param {string} message - 消息内容
   * @param {Object} options - 选项
   * @returns {number} 通知ID
   */
  const showSuccess = (message, options = {}) => {
    console.log('✅', message)
    return addNotification(message, NotificationTypes.SUCCESS, options)
  }
  
  /**
   * 错误消息
   * @param {string} message - 消息内容
   * @param {Object} options - 选项
   * @returns {number} 通知ID
   */
  const showError = (message, options = {}) => {
    console.error('❌', message)
    return addNotification(message, NotificationTypes.ERROR, {
      duration: 8000, // 错误消息显示更长时间
      ...options
    })
  }
  
  /**
   * 警告消息
   * @param {string} message - 消息内容
   * @param {Object} options - 选项
   * @returns {number} 通知ID
   */
  const showWarning = (message, options = {}) => {
    console.warn('⚠️', message)
    return addNotification(message, NotificationTypes.WARNING, options)
  }
  
  /**
   * 信息消息
   * @param {string} message - 消息内容
   * @param {Object} options - 选项
   * @returns {number} 通知ID
   */
  const showInfo = (message, options = {}) => {
    console.log('ℹ️', message)
    return addNotification(message, NotificationTypes.INFO, options)
  }
  
  /**
   * 带确认的消息
   * @param {string} message - 消息内容
   * @param {Function} onConfirm - 确认回调
   * @param {Function} onCancel - 取消回调
   * @returns {number} 通知ID
   */
  const showConfirm = (message, onConfirm, onCancel = null) => {
    return addNotification(message, NotificationTypes.WARNING, {
      persistent: true,
      actions: [
        {
          text: '确认',
          style: 'primary',
          onClick: (id) => {
            onConfirm?.()
            removeNotification(id)
          }
        },
        {
          text: '取消',
          style: 'secondary',
          onClick: (id) => {
            onCancel?.()
            removeNotification(id)
          }
        }
      ]
    })
  }
  
  /**
   * 显示加载消息
   * @param {string} message - 消息内容
   * @returns {number} 通知ID
   */
  const showLoading = (message) => {
    return addNotification(message, NotificationTypes.INFO, {
      persistent: true, // 需要手动移除
      title: '处理中...'
    })
  }
  
  /**
   * 获取默认显示时长
   * @param {string} type - 消息类型
   * @returns {number} 显示时长（毫秒）
   */
  const getDefaultDuration = (type) => {
    switch (type) {
      case NotificationTypes.SUCCESS:
        return 3000
      case NotificationTypes.ERROR:
        return 6000
      case NotificationTypes.WARNING:
        return 5000
      case NotificationTypes.INFO:
        return 4000
      default:
        return 4000
    }
  }
  
  /**
   * 获取通知样式类
   * @param {string} type - 消息类型
   * @returns {string} CSS类名
   */
  const getNotificationClass = (type) => {
    const baseClass = 'notification'
    const typeClasses = {
      [NotificationTypes.SUCCESS]: 'notification-success',
      [NotificationTypes.ERROR]: 'notification-error',
      [NotificationTypes.WARNING]: 'notification-warning',
      [NotificationTypes.INFO]: 'notification-info'
    }
    
    return `${baseClass} ${typeClasses[type] || typeClasses[NotificationTypes.INFO]}`
  }
  
  /**
   * 获取通知图标
   * @param {string} type - 消息类型
   * @returns {string} 图标
   */
  const getNotificationIcon = (type) => {
    const icons = {
      [NotificationTypes.SUCCESS]: '✅',
      [NotificationTypes.ERROR]: '❌',
      [NotificationTypes.WARNING]: '⚠️',
      [NotificationTypes.INFO]: 'ℹ️'
    }
    
    return icons[type] || icons[NotificationTypes.INFO]
  }
  
  return {
    // 状态
    notifications,
    
    // 方法
    addNotification,
    removeNotification,
    clearAll,
    
    // 快捷方法
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    showLoading,
    
    // 工具方法
    getNotificationClass,
    getNotificationIcon,
    
    // 常量
    NotificationTypes
  }
}
