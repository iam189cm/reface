/**
 * 试用管理组合式函数
 * 封装试用次数管理逻辑
 */

import { computed } from 'vue'
import { useTrialStore } from '../stores/trialStore.js'
import { useNotification } from './useNotification.js'

export function useTrialManager() {
  const trialStore = useTrialStore()
  const { showWarning, showError, showInfo } = useNotification()

  // 计算属性
  const remainingTrials = computed(() => trialStore.remainingTrials)
  const canUseTrial = computed(() => trialStore.canUseTrial)
  const isFirstTime = computed(() => trialStore.isFirstTime)
  const trialProgress = computed(() => trialStore.trialProgress)
  const trialStatusText = computed(() => trialStore.trialStatusText)
  const maxTrials = computed(() => trialStore.maxTrials)
  const usedTrials = computed(() => trialStore.usedTrials)

  // 初始化试用数据
  const initializeTrials = () => {
    trialStore.initializeTrialData()
  }

  // 尝试使用试用次数
  const attemptUseTrial = (description = 'AI处理') => {
    if (!trialStore.canUseTrial) {
      showTrialExhaustedMessage()
      return false
    }

    const success = trialStore.useTrial(description)
    
    if (success) {
      const remaining = trialStore.remainingTrials
      if (remaining > 0) {
        showInfo(`试用成功，今日还可使用 ${remaining} 次`)
      } else {
        showWarning('今日试用次数已用完，明天可继续使用')
      }
    } else {
      showError('试用次数使用失败')
    }
    
    return success
  }

  // 显示试用次数用完的消息
  const showTrialExhaustedMessage = () => {
    const upgradePrompt = trialStore.getUpgradePrompt()
    if (upgradePrompt) {
      showWarning(upgradePrompt.message, upgradePrompt.title)
    }
  }

  // 检查试用状态
  const checkTrialStatus = () => {
    const stats = trialStore.getTrialStats()
    
    if (stats.remainingTrials === 0) {
      return {
        canProceed: false,
        message: '今日试用次数已用完',
        type: 'exhausted'
      }
    }
    
    if (stats.remainingTrials === 1) {
      return {
        canProceed: true,
        message: '这是今日最后一次试用机会',
        type: 'last_chance'
      }
    }
    
    return {
      canProceed: true,
      message: `今日还可试用 ${stats.remainingTrials} 次`,
      type: 'available'
    }
  }

  // 获取试用状态信息
  const getTrialInfo = () => {
    return trialStore.getTrialStats()
  }

  // 获取试用进度条配置
  const getProgressConfig = () => {
    const progress = trialStore.trialProgress
    let colorClass = 'bg-green-500'
    
    if (progress >= 100) {
      colorClass = 'bg-red-500'
    } else if (progress >= 66) {
      colorClass = 'bg-yellow-500'
    }
    
    return {
      progress,
      colorClass,
      text: `${trialStore.usedTrials}/${trialStore.maxTrials}`
    }
  }

  // 重置试用次数（仅开发环境）
  const resetTrialsForDev = () => {
    if (process.env.NODE_ENV === 'development') {
      trialStore.resetTrialsForDev()
      showInfo('开发环境：试用次数已重置')
      return true
    }
    return false
  }

  // 获取升级提示
  const getUpgradePrompt = () => {
    return trialStore.getUpgradePrompt()
  }

  // 显示试用状态提示
  const showTrialStatusTip = () => {
    const status = checkTrialStatus()
    
    switch (status.type) {
      case 'exhausted':
        showWarning(status.message)
        break
      case 'last_chance':
        showWarning(status.message)
        break
      case 'available':
        showInfo(status.message)
        break
    }
  }

  return {
    // 响应式数据
    remainingTrials,
    canUseTrial,
    isFirstTime,
    trialProgress,
    trialStatusText,
    maxTrials,
    usedTrials,
    
    // 方法
    initializeTrials,
    attemptUseTrial,
    checkTrialStatus,
    getTrialInfo,
    getProgressConfig,
    resetTrialsForDev,
    getUpgradePrompt,
    showTrialStatusTip,
    showTrialExhaustedMessage
  }
}
