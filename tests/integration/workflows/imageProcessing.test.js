/**
 * 图片处理完整流程集成测试
 * tests/integration/workflows/imageProcessing.test.js
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useImageStore } from '@/stores/imageStore.js'
import { useTrialStore } from '@/stores/trialStore.js'
import { setupTestDI } from '@/services/core/DISetup.js'
import { mockImages, mockAPIResponses, createMockFile } from '../../fixtures/testData.js'

// Mock文件上传API
global.fetch = vi.fn()

describe('图片处理完整流程', () => {
  let pinia
  let imageStore  
  let trialStore
  let serviceContainer
  
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    imageStore = useImageStore()
    trialStore = useTrialStore()
    
    // 设置测试环境的依赖注入容器
    serviceContainer = setupTestDI({
      mockServices: true
    })
    
    // 重置所有mock
    vi.clearAllMocks()
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAPIResponses.removeBackground.success)
    })
  })
  
  describe('用户上传并处理图片', () => {
    test('完整的背景移除流程', async () => {
      // 1. 创建测试用的图片文件
      const testFile = createMockFile(mockImages.validJpeg)
      
      // 2. 用户上传图片
      await imageStore.uploadImage(testFile)
      
      expect(imageStore.hasImage).toBe(true)
      expect(imageStore.originalImage).toBeDefined()
      
      // 3. 检查试用次数
      expect(trialStore.canUseTrial).toBe(true)
      expect(trialStore.remainingTrials).toBe(3)
      
      // 4. 获取AI服务
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      // 5. 处理图片
      const result = await removeBackgroundService.processImage({
        imageUrl: imageStore.originalImage.url,
        format: 'auto'
      })
      
      // 6. 验证处理结果
      expect(result.success).toBe(true)
      expect(result.outputUrl).toBeDefined()
      
      // 7. 更新图片store
      imageStore.setProcessedImage(result.outputUrl)
      
      expect(imageStore.processedImage).toBeDefined()
      expect(imageStore.processedImage.url).toBe(result.outputUrl)
      
      // 8. 验证试用次数被扣除
      expect(trialStore.remainingTrials).toBe(2)
    })
    
    test('试用次数不足时的处理', async () => {
      // 1. 设置试用次数已用完
      trialStore.$patch({
        usedTrials: 3,
        remainingTrials: 0
      })
      
      // 2. 上传图片
      const testFile = createMockFile(mockImages.validJpeg)
      await imageStore.uploadImage(testFile)
      
      // 3. 尝试处理图片
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      // 4. 应该被拒绝
      expect(() => {
        return removeBackgroundService.processImage({
          imageUrl: imageStore.originalImage.url
        })
      }).rejects.toThrow('试用次数已用完')
      
      // 5. 图片状态不应该改变
      expect(imageStore.processedImage).toBeNull()
      expect(trialStore.remainingTrials).toBe(0)
    })
    
    test('API调用失败时的错误处理', async () => {
      // 1. Mock API调用失败
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: () => Promise.resolve(mockAPIResponses.removeBackground.error)
      })
      
      // 2. 上传图片
      const testFile = createMockFile(mockImages.validJpeg)
      await imageStore.uploadImage(testFile)
      
      // 3. 尝试处理图片
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      const result = await removeBackgroundService.processImage({
        imageUrl: imageStore.originalImage.url
      })
      
      // 4. 验证错误处理
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      
      // 5. 试用次数不应该被扣除（因为处理失败）
      expect(trialStore.remainingTrials).toBe(3)
      
      // 6. 图片状态保持不变
      expect(imageStore.processedImage).toBeNull()
    })
  })
  
  describe('文件验证和错误处理', () => {
    test('应该拒绝无效的文件类型', async () => {
      const invalidFile = createMockFile(mockImages.invalidFormat)
      
      await expect(imageStore.uploadImage(invalidFile))
        .rejects.toThrow('不支持的文件格式')
      
      expect(imageStore.hasImage).toBe(false)
    })
    
    test('应该拒绝过大的文件', async () => {
      const largeFile = createMockFile(mockImages.tooLarge)
      
      await expect(imageStore.uploadImage(largeFile))
        .rejects.toThrow('文件大小超过限制')
      
      expect(imageStore.hasImage).toBe(false)
    })
    
    test('应该处理网络错误', async () => {
      // Mock网络错误
      fetch.mockRejectedValueOnce(new Error('Network error'))
      
      const testFile = createMockFile(mockImages.validJpeg)
      await imageStore.uploadImage(testFile)
      
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      const result = await removeBackgroundService.processImage({
        imageUrl: imageStore.originalImage.url
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })
  
  describe('并发处理', () => {
    test('应该处理并发的处理请求', async () => {
      const testFile = createMockFile(mockImages.validJpeg)
      await imageStore.uploadImage(testFile)
      
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      // 发起多个并发请求
      const promises = Array.from({ length: 3 }, () => 
        removeBackgroundService.processImage({
          imageUrl: imageStore.originalImage.url
        })
      )
      
      const results = await Promise.all(promises)
      
      // 所有请求都应该成功
      results.forEach(result => {
        expect(result.success).toBe(true)
      })
      
      // 但只有一个应该真正处理（防重）
      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('进度跟踪', () => {
    test('应该跟踪处理进度', async () => {
      const testFile = createMockFile(mockImages.validJpeg)
      await imageStore.uploadImage(testFile)
      
      const progressManager = serviceContainer.get('progressManager')
      const removeBackgroundService = serviceContainer.get('removeBackgroundService')
      
      // 开始处理
      const processingPromise = removeBackgroundService.processImage({
        imageUrl: imageStore.originalImage.url
      })
      
      // 验证进度管理器被调用
      expect(progressManager.start).toHaveBeenCalled()
      
      await processingPromise
      
      expect(progressManager.finish).toHaveBeenCalled()
    })
  })
})
