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
  
  // 🆕 确保有足够配额（新版本，支持服务端验证）
  const ensureCredits = async (serviceType, creditsNeeded = 1, featureName = '功能') => {
    console.log(`[TrialManager] 确保配额可用: ${serviceType}, 需要配额: ${creditsNeeded}`)
    
    // 检查基本可用性
    if (!canUseTrial.value) {
      if (authStore.isAuthenticated) {
        showError('配额已用完，请升级账户或等待每日配额重置')
      } else {
        showError('今日试用次数已用完，请注册登录获取更多配额')
      }
      return { success: false, error: 'QUOTA_EXHAUSTED' }
    }
    
    if (authStore.isAuthenticated) {
      // 已登录用户：调用服务端API消费配额
      try {
        const token = authStore.session?.access_token
        if (!token) {
          showError('认证令牌无效，请重新登录')
          return { success: false, error: 'AUTH_INVALID' }
        }

        const response = await fetch('/api/usage/consume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            service_type: serviceType,
            credits: creditsNeeded,
            metadata: {
              feature_name: featureName,
              timestamp: new Date().toISOString()
            }
          })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          console.error('[TrialManager] 配额消费失败:', result)
          
          // 根据错误类型显示不同的提示
          switch (result.error_code) {
            case 'INSUFFICIENT_CREDITS':
              showError(`配额不足，需要 ${creditsNeeded} 个，剩余 ${result.available_credits} 个`)
              break
            case 'USER_BANNED':
              showError('账户已被封禁，无法使用服务')
              break
            case 'AUTHENTICATION_FAILED':
              showError('认证失败，请重新登录')
              break
            default:
              showError(result.error || '配额消费失败')
          }
          
          return { success: false, error: result.error_code || 'CONSUME_FAILED' }
        }

        // 更新本地配额状态
        authStore.updateCredits(
          authStore.credits.used + result.data.credits_consumed,
          authStore.profile.total_quota
        )

        showInfo(`${featureName}准备就绪，已消费 ${result.data.credits_consumed} 个配额，剩余 ${result.data.remaining_credits} 个`)
        
        // 显示低配额警告
        if (result.warning_code === 'LOW_CREDITS') {
          showWarning('配额即将用完，建议升级账户')
        }

        return { 
          success: true, 
          data: result.data,
          event_id: result.data.event_id
        }

      } catch (error) {
        console.error('[TrialManager] 调用配额API失败:', error)
        showError('配额验证失败，请检查网络连接')
        return { success: false, error: 'NETWORK_ERROR' }
      }
      
    } else {
      // 未登录用户：使用本地试用配额
      if (trialStore.remainingTrials < creditsNeeded) {
        showError(`试用次数不足，需要 ${creditsNeeded} 次，剩余 ${trialStore.remainingTrials} 次`)
        return { success: false, error: 'INSUFFICIENT_TRIALS' }
      }
      
      trialStore.useTrial(creditsNeeded)
      showInfo(`已使用 ${creditsNeeded} 次试用，剩余 ${trialStore.remainingTrials} 次`)
      
      return { 
        success: true, 
        data: { 
          credits_consumed: creditsNeeded,
          remaining_credits: trialStore.remainingTrials,
          user_type: 'guest'
        }
      }
    }
  }

  // 🔄 兼容旧版本的 attemptUseTrial（调用新的 ensureCredits）
  const attemptUseTrial = async (featureName = '功能', creditsNeeded = 1) => {
    // 映射服务类型（根据功能名称推断）
    let serviceType = 'image_filter' // 默认类型
    
    if (featureName.includes('背景') || featureName.includes('background')) {
      serviceType = 'remove_background'
    } else if (featureName.includes('放大') || featureName.includes('enlarge')) {
      serviceType = 'enlarge_image'  
    }

    const result = await ensureCredits(serviceType, creditsNeeded, featureName)
    return result.success
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
    ensureCredits,      // 🆕 新的配额确保方法（推荐使用）
    attemptUseTrial,    // 🔄 兼容旧版本的方法
    initializeTrials,
    resetTrials,
    getUpgradeRecommendation
  }
}
