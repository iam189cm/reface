/**
 * 试用管理组合函数
 * 管理用户的试用配额和权限
 */

import { computed } from 'vue'
import { useTrialStore } from '../../stores/trialStore.js'
import { useAuthStore } from '../../stores/modules/auth/authStore.js'
import { useNotification } from '../ui/useNotification.js'

export function useTrialManager() {
  const trialStore = useTrialStore()
  const authStore = useAuthStore()
  const { showError, showWarning, showInfo } = useNotification()
  
  // 计算属性
  const canUseTrial = computed(() => {
    // 已登录用户根据其配额判断
    if (authStore.isAuthenticated) {
      return authStore.credits.remaining > 0
    }
    
    // 未登录用户使用本地试用配额
    return trialStore.remainingTrials > 0
  })
  
  const trialInfo = computed(() => {
    if (authStore.isAuthenticated) {
      return {
        used: authStore.credits.used,
        total: authStore.credits.total,
        remaining: authStore.credits.remaining,
        daily: authStore.credits.daily,
        userType: authStore.userType,
        isAuthenticated: true
      }
    } else {
      return {
        used: trialStore.usedTrials,
        total: trialStore.totalTrials,
        remaining: trialStore.remainingTrials,
        daily: trialStore.totalTrials,
        userType: 'guest',
        isAuthenticated: false
      }
    }
  })
  
  // 尝试使用试用配额
  const attemptUseTrial = (featureName = '功能', creditsNeeded = 1) => {
    console.log(`[TrialManager] 尝试使用试用: ${featureName}, 需要配额: ${creditsNeeded}`)
    
    // 检查是否有足够配额
    if (!canUseTrial.value) {
      if (authStore.isAuthenticated) {
        showError('配额已用完，请升级账户或等待每日配额重置')
      } else {
        showError('今日试用次数已用完，请注册登录获取更多配额')
      }
      return false
    }
    
    if (authStore.isAuthenticated) {
      // 已登录用户：检查配额是否足够
      if (authStore.credits.remaining < creditsNeeded) {
        showError(`配额不足，需要 ${creditsNeeded} 个配额，剩余 ${authStore.credits.remaining} 个`)
        return false
      }
      
      // 这里应该调用后端API扣除配额
      // 由于时间限制，这里先使用本地更新
      authStore.updateCredits(authStore.credits.used + creditsNeeded)
      
      showInfo(`已使用 ${creditsNeeded} 个配额，剩余 ${authStore.credits.remaining} 个`)
      
    } else {
      // 未登录用户：使用本地试用配额
      if (trialStore.remainingTrials < creditsNeeded) {
        showError(`试用次数不足，需要 ${creditsNeeded} 次，剩余 ${trialStore.remainingTrials} 次`)
        return false
      }
      
      trialStore.useTrial(creditsNeeded)
      showInfo(`已使用 ${creditsNeeded} 次试用，剩余 ${trialStore.remainingTrials} 次`)
    }
    
    return true
  }
  
  // 初始化试用数据
  const initializeTrials = () => {
    if (!authStore.isAuthenticated) {
      trialStore.initializeTrialData()
    }
  }
  
  // 重置试用次数（仅限管理员或开发模式）
  const resetTrials = () => {
    if (authStore.isAdmin || import.meta.env.DEV) {
      trialStore.resetTrials()
      showInfo('试用次数已重置')
      return true
    } else {
      showError('权限不足，无法重置试用次数')
      return false
    }
  }
  
  // 获取升级建议
  const getUpgradeRecommendation = () => {
    if (authStore.isAuthenticated) {
      const credits = authStore.credits
      
      if (credits.remaining === 0) {
        return {
          urgent: true,
          title: '配额已用完',
          message: '升级到高级版本，享受无限制AI功能',
          action: '立即升级'
        }
      } else if (credits.remaining <= 2) {
        return {
          urgent: false,
          title: '配额即将用完',
          message: `仅剩 ${credits.remaining} 个配额，建议提前升级`,
          action: '了解升级'
        }
      }
    } else {
      const remaining = trialStore.remainingTrials
      
      if (remaining === 0) {
        return {
          urgent: true,
          title: '试用次数已用完',
          message: '注册账户，获得更多免费配额',
          action: '立即注册'
        }
      } else if (remaining <= 1) {
        return {
          urgent: false,
          title: '试用即将结束',
          message: `仅剩 ${remaining} 次试用，注册后可获得更多配额`,
          action: '注册账户'
        }
      }
    }
    
    return null
  }
  
  return {
    // 状态
    canUseTrial,
    trialInfo,
    
    // 方法
    attemptUseTrial,
    initializeTrials,
    resetTrials,
    getUpgradeRecommendation
  }
}
