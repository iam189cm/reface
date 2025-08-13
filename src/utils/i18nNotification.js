/**
 * 国际化通知工具
 * 简化的通知系统，支持i18n翻译
 */

import { useNotification } from '@/composables/ui/useNotification.js'

let i18nInstance = null

// 设置i18n实例（从main.js调用）
export function setI18nInstance(instance) {
  i18nInstance = instance
}

// 获取翻译文本的辅助函数
function getTranslatedText(key, fallback, params = {}) {
  if (!i18nInstance) {
    return fallback
  }
  
  try {
    const translated = i18nInstance.global.t(key, params)
    return translated !== key ? translated : fallback
  } catch (error) {
    console.warn('Translation error:', error)
    return fallback
  }
}

// 创建国际化通知函数
export function useI18nNotification() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification()
  
  return {
    // 试用相关通知
    showTrialSuccess: (description, cost, remaining) => {
      const message = getTranslatedText(
        'trial.messages.success',
        `${description}成功，消耗${cost}次试用，今日还可使用 ${remaining} 次`,
        { description, cost, remaining }
      )
      showInfo(message)
    },
    
    showTrialExhausted: () => {
      const message = getTranslatedText(
        'trial.messages.exhausted',
        '今日试用次数已用完，明天可继续使用'
      )
      showWarning(message)
    },
    
    showTrialWarning: (cost, remaining) => {
      const message = getTranslatedText(
        'trial.messages.warning',
        `该功能需要 ${cost} 次试用机会，您只剩 ${remaining} 次`,
        { cost, remaining }
      )
      showWarning(message)
    },
    
    showTrialFailed: () => {
      const message = getTranslatedText(
        'trial.messages.failed',
        '试用次数使用失败'
      )
      showError(message)
    },
    
    // 认证相关通知
    showLoginSuccess: () => {
      const message = getTranslatedText(
        'auth.messages.loginSuccess',
        '登录成功'
      )
      showSuccess(message)
    },
    
    showLogoutSuccess: () => {
      const message = getTranslatedText(
        'auth.messages.logoutSuccess',
        '已成功退出登录'
      )
      showSuccess(message)
    },
    
    // 升级相关通知
    showPaymentDeveloping: () => {
      const message = getTranslatedText(
        'trial.upgrade.paymentDeveloping',
        '支付功能开发中，敬请期待！'
      )
      showInfo(message)
    },
    
    // 通用通知（保持原有接口）
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
