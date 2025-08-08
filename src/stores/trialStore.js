/**
 * 试用管理状态 Store
 * 管理用户试用次数和相关状态
 */

import { defineStore } from 'pinia'

const TRIAL_KEY = 'reface_trial_count'
const TRIAL_RESET_KEY = 'reface_trial_reset'
const MAX_TRIAL_COUNT = 3

export const useTrialStore = defineStore('trial', {
  state: () => ({
    // 试用配置
    maxTrials: MAX_TRIAL_COUNT,
    
    // 当前状态
    usedTrials: 0,
    lastResetDate: null,
    
    // 试用历史记录
    trialHistory: []
  }),

  getters: {
    // 剩余试用次数
    remainingTrials: (state) => {
      return Math.max(0, state.maxTrials - state.usedTrials)
    },
    
    // 是否可以使用试用
    canUseTrial: (state) => {
      return state.remainingTrials > 0
    },
    
    // 是否是第一次使用
    isFirstTime: (state) => {
      return state.usedTrials === 0
    },
    
    // 试用进度百分比
    trialProgress: (state) => {
      return (state.usedTrials / state.maxTrials) * 100
    },
    
    // 试用状态描述
    trialStatusText: (state) => {
      const remaining = state.remainingTrials
      if (remaining === 0) {
        return '今日试用次数已用完'
      }
      return `今日还可试用 ${remaining} 次`
    }
  },

  actions: {
    // 初始化试用数据
    initializeTrialData() {
      this.checkAndResetDaily()
      this.loadTrialData()
    },

    // 检查是否需要每日重置
    checkAndResetDaily() {
      try {
        const lastReset = localStorage.getItem(TRIAL_RESET_KEY)
        const today = new Date().toDateString()
        
        if (lastReset !== today) {
          // 新的一天，重置试用次数
          this.resetDailyTrials()
          localStorage.setItem(TRIAL_RESET_KEY, today)
          this.lastResetDate = today
        } else {
          this.lastResetDate = lastReset
        }
      } catch (error) {
        console.warn('检查试用重置失败:', error)
      }
    },

    // 从本地存储加载试用数据
    loadTrialData() {
      try {
        const usedCount = parseInt(localStorage.getItem(TRIAL_KEY) || '0')
        this.usedTrials = Math.max(0, Math.min(usedCount, this.maxTrials))
        
        // 加载试用历史
        const historyData = localStorage.getItem('reface_trial_history')
        if (historyData) {
          this.trialHistory = JSON.parse(historyData)
        }
      } catch (error) {
        console.warn('加载试用数据失败:', error)
        this.usedTrials = 0
        this.trialHistory = []
      }
    },

    // 使用一次试用机会
    useTrial(description = 'AI处理') {
      if (!this.canUseTrial) {
        return false
      }

      try {
        this.usedTrials += 1
        localStorage.setItem(TRIAL_KEY, String(this.usedTrials))
        
        // 记录试用历史
        const historyItem = {
          id: Date.now(),
          description,
          timestamp: new Date().toISOString(),
          date: new Date().toDateString()
        }
        
        this.trialHistory.push(historyItem)
        this.saveTrialHistory()
        
        return true
      } catch (error) {
        console.warn('使用试用次数失败:', error)
        return false
      }
    },

    // 重置每日试用次数
    resetDailyTrials() {
      this.usedTrials = 0
      try {
        localStorage.setItem(TRIAL_KEY, '0')
      } catch (error) {
        console.warn('重置试用次数失败:', error)
      }
    },

    // 保存试用历史
    saveTrialHistory() {
      try {
        // 只保留最近30天的历史记录
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const recentHistory = this.trialHistory.filter(item => {
          const itemDate = new Date(item.timestamp)
          return itemDate > thirtyDaysAgo
        })
        
        this.trialHistory = recentHistory
        localStorage.setItem('reface_trial_history', JSON.stringify(recentHistory))
      } catch (error) {
        console.warn('保存试用历史失败:', error)
      }
    },

    // 获取试用统计信息
    getTrialStats() {
      const today = new Date().toDateString()
      const todayHistory = this.trialHistory.filter(item => item.date === today)
      
      return {
        maxTrials: this.maxTrials,
        usedTrials: this.usedTrials,
        remainingTrials: this.remainingTrials,
        canUse: this.canUseTrial,
        isFirstTime: this.isFirstTime,
        progress: this.trialProgress,
        statusText: this.trialStatusText,
        todayHistory,
        totalHistory: this.trialHistory.length
      }
    },

    // 开发环境下重置试用次数
    resetTrialsForDev() {
      if (process.env.NODE_ENV === 'development') {
        this.usedTrials = 0
        this.trialHistory = []
        try {
          localStorage.removeItem(TRIAL_KEY)
          localStorage.removeItem(TRIAL_RESET_KEY)
          localStorage.removeItem('reface_trial_history')
          console.log('开发环境：试用次数已重置')
        } catch (error) {
          console.warn('重置试用次数失败:', error)
        }
      }
    },

    // 获取升级提示信息
    getUpgradePrompt() {
      if (this.canUseTrial) {
        return null
      }
      
      return {
        title: '今日试用次数已用完',
        message: '升级到付费版本，享受无限次数的AI图片处理服务',
        actions: [
          { text: '了解付费版', type: 'primary' },
          { text: '明天再来', type: 'secondary' }
        ]
      }
    }
  }
})
