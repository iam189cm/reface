/**
 * 依赖注入设置
 * 注册所有服务并建立依赖关系
 */

import { ServiceContainer } from './ServiceContainer.js'
import { ConfigService } from './ConfigService.js'
import { ProgressManager } from './ProgressManager.js'
import { HttpClient } from '../network/HttpClient.js'
import { RemoveBackgroundService } from '../ai/removeBackground/RemoveBackgroundService.js'
import { VanceAIService } from '../ai/vanceAI/VanceAIService.js'

/**
 * 设置依赖注入容器
 * @param {Object} options - 配置选项
 * @returns {ServiceContainer} 配置好的服务容器
 */
export function setupDependencyInjection(options = {}) {
  const {
    debug = false,
    mockServices = false,
    customConfig = null
  } = options
  
  const container = new ServiceContainer()
  
  // 启用调试模式
  if (debug) {
    container.setDebug(true)
  }
  
  // ==========  核心服务注册  ==========
  
  container.register(
    'configService',
    () => customConfig || new ConfigService(),
    true // 单例
  )
  
  container.register(
    'httpClient',
    () => new HttpClient({
      timeout: 60000,
      retries: 3,
      retryDelay: 1000
    }),
    true
  )
  
  container.register(
    'progressManager',
    () => new ProgressManager(),
    true
  )
  
  // ==========  AI服务注册  ==========
  
  if (mockServices) {
    // 注册Mock服务（用于测试）
    registerMockServices(container)
  } else {
    // 注册真实服务
    registerRealServices(container)
  }
  
  // ==========  服务聚合器注册  ==========
  
  container.register(
    'aiServiceContainer',
    () => ({
      removeBackground: container.get('removeBackgroundService'),
      enlargeImage: container.get('vanceAIService'),
      // 未来可以添加更多AI服务
      // faceEnhance: container.get('faceEnhanceService'),
      // styleTransfer: container.get('styleTransferService'),
    }),
    true
  )
  
  // ==========  验证依赖关系  ==========
  
  const validationErrors = container.validateDependencies()
  if (validationErrors.length > 0) {
    console.error('❌ 依赖关系验证失败:', validationErrors)
    throw new Error(`依赖关系验证失败: ${validationErrors.join(', ')}`)
  }
  
  if (debug) {
    console.log('✅ 依赖注入容器设置完成')
    console.table(container.getServiceNames().map(name => ({
      'Service Name': name,
      'Type': container.getServiceInfo(name).singleton ? 'Singleton' : 'Transient',
      'Dependencies': container.getServiceInfo(name).dependencies.length
    })))
  }
  
  return container
}

/**
 * 注册真实服务
 * @param {ServiceContainer} container - 服务容器
 */
function registerRealServices(container) {
  // Remove.bg 服务
  container.register(
    'removeBackgroundService',
    () => {
      const config = container.get('configService')
      const httpClient = container.get('httpClient')
      const progressManager = container.get('progressManager')
      
      return new RemoveBackgroundService(
        config.removeBackground,
        httpClient,
        progressManager
      )
    },
    true,
    ['configService', 'httpClient', 'progressManager']
  )
  
  // VanceAI 服务
  container.register(
    'vanceAIService',
    () => {
      const config = container.get('configService')
      const httpClient = container.get('httpClient')
      const progressManager = container.get('progressManager')
      
      return new VanceAIService(
        config.vanceAI,
        httpClient,
        progressManager
      )
    },
    true,
    ['configService', 'httpClient', 'progressManager']
  )
}

/**
 * 注册Mock服务（用于测试）
 * @param {ServiceContainer} container - 服务容器
 */
function registerMockServices(container) {
  // Mock Remove.bg 服务
  container.register(
    'removeBackgroundService',
    () => new MockRemoveBackgroundService(),
    true
  )
  
  // Mock VanceAI 服务
  container.register(
    'vanceAIService',
    () => new MockVanceAIService(),
    true
  )
}

/**
 * Mock Remove.bg 服务（用于测试）
 */
class MockRemoveBackgroundService {
  async removeBackground(imageFile, onProgress = null) {
    console.log('🧪 Mock: 移除背景', imageFile.name)
    
    if (onProgress) {
      onProgress({ progress: 50, message: 'Mock处理中...' })
      await new Promise(resolve => setTimeout(resolve, 1000))
      onProgress({ progress: 100, message: 'Mock处理完成' })
    }
    
    // 返回一个模拟的Blob
    return new Blob(['mock processed image'], { type: 'image/png' })
  }
  
  async checkQuota() {
    return {
      success: true,
      data: { credits: 999, type: 'mock' }
    }
  }
}

/**
 * Mock VanceAI 服务（用于测试）
 */
class MockVanceAIService {
  async enlargeImage(imageFile, onProgress = null, params = {}) {
    console.log('🧪 Mock: 图像放大', imageFile.name, params)
    
    if (onProgress) {
      onProgress({ progress: 25, message: 'Mock上传中...' })
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onProgress({ progress: 50, message: 'Mock处理中...' })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onProgress({ progress: 100, message: 'Mock处理完成' })
    }
    
    // 返回一个模拟的Blob
    return new Blob(['mock enlarged image'], { type: 'image/jpeg' })
  }
}

/**
 * 创建开发环境的依赖注入容器
 * @param {Object} options - 选项
 * @returns {ServiceContainer} 开发环境容器
 */
export function setupDevelopmentDI(options = {}) {
  return setupDependencyInjection({
    debug: true,
    mockServices: options.useMockServices || false,
    ...options
  })
}

/**
 * 创建生产环境的依赖注入容器
 * @param {Object} options - 选项
 * @returns {ServiceContainer} 生产环境容器
 */
export function setupProductionDI(options = {}) {
  return setupDependencyInjection({
    debug: false,
    mockServices: false,
    ...options
  })
}

/**
 * 创建测试环境的依赖注入容器
 * @param {Object} options - 选项
 * @returns {ServiceContainer} 测试环境容器
 */
export function setupTestDI(options = {}) {
  return setupDependencyInjection({
    debug: false,
    mockServices: true,
    ...options
  })
}

/**
 * 验证服务容器健康状态
 * @param {ServiceContainer} container - 服务容器
 * @returns {Promise<Object>} 健康检查结果
 */
export async function healthCheck(container) {
  const results = {
    healthy: true,
    services: {},
    errors: []
  }
  
  try {
    // 检查配置服务
    const configService = container.get('configService')
    const configErrors = configService.validateConfig()
    results.services.config = {
      status: configErrors.length === 0 ? 'healthy' : 'warning',
      errors: configErrors
    }
    
    if (configErrors.length > 0) {
      results.healthy = false
      results.errors.push(...configErrors)
    }
    
    // 检查网络服务
    try {
      const httpClient = container.get('httpClient')
      results.services.http = { status: 'healthy' }
    } catch (error) {
      results.services.http = { status: 'error', error: error.message }
      results.healthy = false
      results.errors.push('HTTP服务不可用')
    }
    
    // 检查进度管理器
    try {
      const progressManager = container.get('progressManager')
      results.services.progress = { status: 'healthy' }
    } catch (error) {
      results.services.progress = { status: 'error', error: error.message }
      results.healthy = false
      results.errors.push('进度管理器不可用')
    }
    
    // 检查AI服务
    try {
      const aiServices = container.get('aiServiceContainer')
      results.services.ai = { 
        status: 'healthy',
        services: Object.keys(aiServices)
      }
    } catch (error) {
      results.services.ai = { status: 'error', error: error.message }
      results.healthy = false
      results.errors.push('AI服务不可用')
    }
    
  } catch (error) {
    results.healthy = false
    results.errors.push(`健康检查失败: ${error.message}`)
  }
  
  return results
}
