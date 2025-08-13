/**
 * useTrialManager 组合函数测试
 * tests/unit/composables/useTrialManager.test.js
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTrialManager } from '@/composables/business/useTrialManager.js'
import { mockTrialData } from '../../fixtures/testData.js'

// Mock通知系统
vi.mock('@/composables/ui/useNotification.js', () => ({
  useNotification: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
    showInfo: vi.fn()
  })
}))

// 创建真实的localStorage mock
const localStorageData = new Map()
const localStorageMock = {
  getItem: vi.fn((key) => localStorageData.get(key) || null),
  setItem: vi.fn((key, value) => localStorageData.set(key, String(value))),
  removeItem: vi.fn((key) => localStorageData.delete(key)),
  clear: vi.fn(() => localStorageData.clear())
}

describe('useTrialManager', () => {
  beforeEach(() => {
    // 为每个测试创建新的Pinia实例
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // 重新设置localStorage mock
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      configurable: true
    })
    
    // 清除本地存储数据和mock调用
    localStorageData.clear()
    vi.clearAllMocks()
  })
  
  describe('初始化', () => {
    test('应该正确初始化试用数据', () => {
      const { remainingTrials, maxTrials, usedTrials } = useTrialManager()
      
      // 新用户应该有3次试用机会
      expect(remainingTrials.value).toBe(3)
      expect(maxTrials.value).toBe(3)
      expect(usedTrials.value).toBe(0)
    })
    
    test('应该从本地存储恢复试用数据', () => {
      // 模拟已存在的试用数据 - 使用实际的存储键名
      localStorageData.set('reface_trial_count', '1')
      localStorageData.set('reface_trial_reset', new Date().toDateString())
      
      const { remainingTrials, usedTrials } = useTrialManager()
      
      expect(remainingTrials.value).toBe(2)
      expect(usedTrials.value).toBe(1)
    })
  })
  
  describe('试用次数使用', () => {
    test('应该正确消耗试用次数', () => {
      const { attemptUseTrial, remainingTrials, canUseTrial } = useTrialManager()
      
      expect(canUseTrial.value).toBe(true)
      expect(remainingTrials.value).toBe(3)
      
      const result = attemptUseTrial('AI处理', 1)
      
      expect(result).toBe(true)
      expect(remainingTrials.value).toBe(2)
    })
    
    test('应该处理多次试用消耗', () => {
      const { attemptUseTrial, remainingTrials } = useTrialManager()
      
      // 消耗2次试用
      const result = attemptUseTrial('高级AI处理', 2)
      
      expect(result).toBe(true)
      expect(remainingTrials.value).toBe(1)
    })
    
    test('应该拒绝超过剩余次数的请求', () => {
      // 设置只剩1次试用 - 使用实际的存储格式
      localStorageData.set('reface_trial_count', '2') // 已使用2次，剩余1次
      localStorageData.set('reface_trial_reset', new Date().toDateString())
      
      const { attemptUseTrial, remainingTrials } = useTrialManager()
      
      // 尝试消耗2次试用（超过剩余）
      const result = attemptUseTrial('高级AI处理', 2)
      
      expect(result).toBe(false)
      expect(remainingTrials.value).toBe(1) // 应该保持不变
    })
    
    test('应该在试用用完时返回false', () => {
      // 设置试用已用完 - 使用实际的存储格式
      localStorageData.set('reface_trial_count', '3') // 已使用3次，剩余0次
      localStorageData.set('reface_trial_reset', new Date().toDateString())
      
      const { attemptUseTrial, canUseTrial } = useTrialManager()
      
      expect(canUseTrial.value).toBe(false)
      
      const result = attemptUseTrial('AI处理', 1)
      
      expect(result).toBe(false)
    })
  })
  
  describe('试用状态', () => {
    test('应该正确计算试用进度', () => {
      localStorageData.set('reface_trial_count', '1') // 已使用1次
      localStorageData.set('reface_trial_reset', new Date().toDateString())
      
      const { trialProgress } = useTrialManager()
      
      expect(trialProgress.value).toBe(33.33) // 1/3 * 100
    })
    
    test('应该生成正确的状态文本', () => {
      const { trialStatusText } = useTrialManager()
      
      expect(trialStatusText.value).toContain('3')
      expect(trialStatusText.value).toContain('还可试用') // 根据实际store实现
    })
    
    test('应该识别第一次使用', () => {
      const { isFirstTime } = useTrialManager()
      
      expect(isFirstTime.value).toBe(true)
    })
  })
  
  describe('日期重置', () => {
    test('应该在新的一天重置试用次数', () => {
      // 设置昨天的试用数据
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      // 使用实际的存储格式
      localStorageData.set('reface_trial_count', '3') // 已用完
      localStorageData.set('reface_trial_reset', yesterday.toDateString()) // 昨天的重置日期
      
      const { remainingTrials, usedTrials } = useTrialManager()
      
      // 应该重置到初始状态
      expect(remainingTrials.value).toBe(3)
      expect(usedTrials.value).toBe(0)
    })
    
    test('应该保持当天的试用数据不变', () => {
      const today = new Date().toDateString() // 使用实际的日期格式
      
      // 使用实际的存储格式
      localStorageData.set('reface_trial_count', '1') // 已使用1次
      localStorageData.set('reface_trial_reset', today) // 今天的重置日期
      
      const { remainingTrials, usedTrials } = useTrialManager()
      
      // 应该保持当天数据
      expect(remainingTrials.value).toBe(2)
      expect(usedTrials.value).toBe(1)
    })
  })
})
