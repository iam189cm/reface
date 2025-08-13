/**
 * 服务层Mock
 * 模拟各种服务的响应
 */

import { vi } from 'vitest'

// Mock ConfigService
export const mockConfigService = {
  getAPIConfig: vi.fn(() => ({
    removeBgKey: 'test-api-key',
    vanceAIToken: 'test-token',
    supabaseUrl: 'https://test.supabase.co',
    supabaseAnonKey: 'test-anon-key'
  })),
  
  validateConfig: vi.fn(() => ({ isValid: true, errors: [] })),
  
  getEnvironment: vi.fn(() => 'test'),
  
  isDevelopment: vi.fn(() => true),
  
  isProduction: vi.fn(() => false)
}

// Mock AIServiceBase
export const mockAIService = {
  processImage: vi.fn().mockResolvedValue({
    success: true,
    outputUrl: 'https://test.example.com/processed.jpg',
    originalUrl: 'https://test.example.com/original.jpg'
  }),
  
  validateInput: vi.fn(() => ({ isValid: true })),
  
  getServiceStatus: vi.fn(() => ({ healthy: true }))
}

// Mock RemoveBackgroundService
export const mockRemoveBackgroundService = {
  ...mockAIService,
  removeBackground: vi.fn().mockResolvedValue({
    success: true,
    outputUrl: 'https://test.example.com/no-bg.jpg',
    credits: { remaining: 2 }
  })
}

// Mock HttpClient
export const mockHttpClient = {
  get: vi.fn().mockResolvedValue({ data: {} }),
  post: vi.fn().mockResolvedValue({ data: {} }),
  put: vi.fn().mockResolvedValue({ data: {} }),
  delete: vi.fn().mockResolvedValue({ data: {} })
}

// Mock ProgressManager
export const mockProgressManager = {
  start: vi.fn(),
  update: vi.fn(),
  finish: vi.fn(),
  error: vi.fn(),
  isRunning: vi.fn(() => false),
  getProgress: vi.fn(() => ({ current: 0, total: 100 }))
}
