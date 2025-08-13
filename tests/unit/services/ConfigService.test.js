/**
 * ConfigService 服务测试
 * tests/unit/services/ConfigService.test.js
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { ConfigService } from '@/services/core/ConfigService.js'

// Mock环境变量
const mockEnv = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_REMOVE_BG_API_KEY: 'test-remove-bg-key',
  VITE_VANCE_AI_API_TOKEN: 'test-vance-token',
  VITE_OSS_REGION: 'oss-cn-beijing',
  VITE_OSS_BUCKET: 'test-bucket',
  VITE_OSS_ACCESS_KEY_ID: 'test-access-key',
  VITE_OSS_ACCESS_KEY_SECRET: 'test-secret',
  DEV: true,
  MODE: 'test'
}

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: mockEnv
  }
})

describe('ConfigService', () => {
  let configService
  
  beforeEach(() => {
    configService = new ConfigService(mockEnv)
    vi.clearAllMocks()
  })
  
  describe('Supabase配置', () => {
    test('应该返回正确的Supabase配置', () => {
      const supabaseConfig = configService.supabase
      
      expect(supabaseConfig).toEqual({
        url: 'https://test.supabase.co',
        anonKey: 'test-anon-key',
        tables: {
          userProfiles: 'user_profiles',
          smsVerificationCodes: 'sms_verification_codes'
        }
      })
    })
  })

  describe('Remove.bg配置', () => {
    test('应该返回正确的Remove.bg配置', () => {
      const removeBgConfig = configService.removeBackground
      
      expect(removeBgConfig.apiKey).toBe('test-remove-bg-key')
      expect(removeBgConfig.apiUrl).toBe('https://api.remove.bg/v1.0/removebg')
      expect(removeBgConfig.maxFileSize).toBe(12 * 1024 * 1024)
      expect(removeBgConfig.supportedFormats).toContain('image/jpeg')
    })
    
    test('应该处理缺失的配置', () => {
      const envWithoutKey = { ...mockEnv, VITE_REMOVE_BG_API_KEY: undefined }
      const newConfigService = new ConfigService(envWithoutKey)
      
      expect(newConfigService.removeBackground.apiKey).toBeUndefined()
    })
  })

  describe('VanceAI配置', () => {
    test('应该返回正确的VanceAI配置', () => {
      const vanceConfig = configService.vanceAI
      
      expect(vanceConfig.apiToken).toBe('test-vance-token')
      expect(vanceConfig.endpoints).toHaveProperty('upload')
      expect(vanceConfig.endpoints).toHaveProperty('transform')
      expect(vanceConfig.endpoints).toHaveProperty('progress')
      expect(vanceConfig.defaultParams.scale).toBe('2x')
    })
  })
  
  describe('OSS配置', () => {
    test('应该返回正确的OSS配置', () => {
      const ossConfig = configService.oss
      
      expect(ossConfig).toEqual({
        accessKeyId: 'test-access-key',
        accessKeySecret: 'test-secret',
        bucket: 'test-bucket',
        region: 'oss-cn-beijing',
        endpoint: 'https://test-bucket.oss-cn-beijing.aliyuncs.com'
      })
    })
    
    test('应该处理缺失的OSS配置', () => {
      const envWithoutOSS = { ...mockEnv, VITE_OSS_ACCESS_KEY_ID: undefined }
      const newConfigService = new ConfigService(envWithoutOSS)
      
      expect(newConfigService.oss.accessKeyId).toBeUndefined()
    })
  })
  
  describe('应用配置', () => {
    test('应该返回正确的应用配置', () => {
      const appConfig = configService.app
      
      expect(appConfig.name).toBe('Reface')
      expect(appConfig.version).toBe('1.0.0')
      expect(appConfig.isDevelopment).toBe(true)
      expect(appConfig.isProduction || false).toBe(false) // isProduction可能是undefined
    })
    
    test('应该返回试用配置', () => {
      const trialConfig = configService.trial
      
      expect(trialConfig.dailyQuota).toBe(3)
      expect(trialConfig.features.backgroundRemoval.quota).toBe(3)
      expect(trialConfig.features.imageEnlarge.quota).toBe(3)
    })
  })

  describe('环境检测', () => {
    test('应该正确识别开发环境', () => {
      expect(configService.isEnvironment('development')).toBe(true)
      expect(configService.isEnvironment('production') || false).toBe(false)
      expect(configService.isEnvironment('test')).toBe(true)
    })
    
    test('应该正确识别生产环境', () => {
      const prodEnv = { ...mockEnv, DEV: false, PROD: true, MODE: 'production' }
      const prodConfigService = new ConfigService(prodEnv)
      
      expect(prodConfigService.isEnvironment('development')).toBe(false)
      expect(prodConfigService.isEnvironment('production')).toBe(true)
      expect(prodConfigService.isEnvironment('test')).toBe(false)
    })
  })
  
  describe('配置验证', () => {
    test('应该验证完整的配置', () => {
      const errors = configService.validateConfig()
      
      expect(Array.isArray(errors)).toBe(true)
      expect(errors).toHaveLength(0)
    })
    
    test('应该检测关键配置缺失', () => {
      const incompleteEnv = {
        ...mockEnv,
        VITE_SUPABASE_URL: undefined,
        VITE_REMOVE_BG_API_KEY: undefined
      }
      const invalidConfigService = new ConfigService(incompleteEnv)
      const errors = invalidConfigService.validateConfig()
      
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.some(error => error.includes('VITE_SUPABASE_URL'))).toBe(true)
      expect(errors.some(error => error.includes('VITE_REMOVE_BG_API_KEY'))).toBe(true)
    })
  })

  describe('通用配置方法', () => {
    test('应该获取环境变量', () => {
      expect(configService.get('VITE_SUPABASE_URL')).toBe('https://test.supabase.co')
      expect(configService.get('NONEXISTENT_KEY', 'default')).toBe('default')
      expect(configService.get('NONEXISTENT_KEY')).toBe(null)
    })
    
    test('应该检查环境类型', () => {
      expect(configService.isEnvironment('test')).toBe(true)
      expect(configService.isEnvironment('development')).toBe(true)
      expect(configService.isEnvironment('production') || false).toBe(false)
      expect(configService.isEnvironment('unknown') || false).toBe(false)
    })
  })
})
