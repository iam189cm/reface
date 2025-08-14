/**
 * AI服务组合函数
 */

import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { getGlobalAIServiceManager } from '../services/ai-service-manager.service'
import { BackgroundRemoverService } from '../services/background-remover.service'
import { ImageEnlargerService } from '../services/image-enlarger.service'
import { useNotification } from '@/shared/composables/useNotification'
import type { 
  AIServiceType,
  AIServiceTask,
  AIProcessingResult,
  AIServiceStatus,
  AIServiceEvent
} from '../types/ai-service.types'
import type { RemoveBgConfig } from '../types/background-remover.types'
import type { VanceAIConfig } from '../types/image-enlarger.types'

interface UseAIServicesOptions {
  removeBgConfig?: RemoveBgConfig
  vanceAIConfig?: VanceAIConfig
  autoSetup?: boolean
}

export function useAIServices(options: UseAIServicesOptions = {}) {
  const { showError, showSuccess } = useNotification()
  const manager = getGlobalAIServiceManager()

  // 响应式状态
  const isInitialized = ref(false)
  const activeTasks: Ref<AIServiceTask[]> = ref([])
  const completedTasks: Ref<AIServiceTask[]> = ref([])
  const serviceStats = ref<Record<AIServiceType, any>>({})

  // 服务可用性状态
  const availableServices = computed(() => manager.getSupportedTypes())
  
  const isServiceAvailable = (type: AIServiceType) => {
    return manager.isServiceAvailable(type)
  }

  // 任务状态计算属性
  const processingTasks = computed(() => 
    activeTasks.value.filter(task => task.status === 'processing')
  )

  const failedTasks = computed(() =>
    activeTasks.value.filter(task => task.status === 'failed')
  )

  const hasActiveTasks = computed(() => processingTasks.value.length > 0)

  // 初始化AI服务
  const initializeServices = async () => {
    try {
      // 注册背景移除服务
      if (options.removeBgConfig) {
        const bgRemover = new BackgroundRemoverService(options.removeBgConfig)
        manager.registerService(bgRemover)
      }

      // 注册图片放大服务
      if (options.vanceAIConfig) {
        const imageEnlarger = new ImageEnlargerService(options.vanceAIConfig)
        manager.registerService(imageEnlarger)
      }

      // 设置事件监听
      setupEventListeners()

      // 更新服务统计
      await updateServiceStats()

      isInitialized.value = true
      console.log('[useAIServices] Services initialized:', availableServices.value)

    } catch (error) {
      console.error('[useAIServices] Initialization failed:', error)
      showError('AI服务初始化失败')
      throw error
    }
  }

  // 处理AI任务
  const processImage = async (
    serviceType: AIServiceType,
    params: any
  ): Promise<AIProcessingResult> => {
    if (!isInitialized.value) {
      throw new Error('AI services not initialized')
    }

    if (!manager.isServiceAvailable(serviceType)) {
      throw new Error(`Service not available: ${serviceType}`)
    }

    // 创建任务
    const task: AIServiceTask = {
      id: `${serviceType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      serviceType,
      params,
      status: 'pending',
      priority: 'normal',
      progress: 0,
      retries: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString()
    }

    // 添加到活动任务列表
    activeTasks.value.push(task)

    try {
      // 执行处理
      const result = await manager.processTask(task)
      
      // 更新任务状态
      const taskIndex = activeTasks.value.findIndex(t => t.id === task.id)
      if (taskIndex >= 0) {
        activeTasks.value[taskIndex] = { ...task, status: 'completed', result }
      }

      // 移动到已完成列表
      completedTasks.value.unshift({ ...task, status: 'completed', result })
      
      // 显示成功消息
      const serviceNames = {
        remove_background: '背景移除',
        enlarge_image: '图片放大'
      }
      showSuccess(`${serviceNames[serviceType] || serviceType} 处理完成`)

      return result

    } catch (error) {
      // 更新任务状态为失败
      const taskIndex = activeTasks.value.findIndex(t => t.id === task.id)
      if (taskIndex >= 0) {
        activeTasks.value[taskIndex] = { ...task, status: 'failed', error: error as any }
      }

      showError(`处理失败: ${(error as Error).message}`)
      throw error

    } finally {
      // 从活动任务列表中移除
      const taskIndex = activeTasks.value.findIndex(t => t.id === task.id)
      if (taskIndex >= 0) {
        activeTasks.value.splice(taskIndex, 1)
      }

      // 更新统计信息
      await updateServiceStats()
    }
  }

  // 取消任务
  const cancelTask = async (taskId: string) => {
    try {
      await manager.cancelTask(taskId)
      
      // 从活动任务列表中移除
      const taskIndex = activeTasks.value.findIndex(t => t.id === taskId)
      if (taskIndex >= 0) {
        activeTasks.value.splice(taskIndex, 1)
      }

      showSuccess('任务已取消')

    } catch (error) {
      console.error('Failed to cancel task:', error)
      showError('取消任务失败')
    }
  }

  // 重试失败的任务
  const retryTask = async (taskId: string) => {
    const task = manager.getTask(taskId)
    if (!task) {
      showError('任务不存在')
      return
    }

    if (task.retries >= task.maxRetries) {
      showError('任务重试次数已达上限')
      return
    }

    try {
      return await processImage(task.serviceType, task.params)
    } catch (error) {
      console.error('Retry failed:', error)
    }
  }

  // 获取任务状态
  const getTaskStatus = async (taskId: string): Promise<AIServiceStatus> => {
    return await manager.getTaskStatus(taskId)
  }

  // 批量处理
  const processBatch = async (tasks: Array<{ serviceType: AIServiceType; params: any }>) => {
    const batchTasks: AIServiceTask[] = tasks.map((task, index) => ({
      id: `batch_${Date.now()}_${index}`,
      serviceType: task.serviceType,
      params: task.params,
      status: 'pending',
      priority: 'normal',
      progress: 0,
      retries: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString()
    }))

    // 添加到活动任务列表
    activeTasks.value.push(...batchTasks)

    try {
      const results = await manager.processBatch(batchTasks)
      showSuccess(`批量处理完成：${results.length}个任务`)
      return results

    } catch (error) {
      showError(`批量处理失败: ${(error as Error).message}`)
      throw error

    } finally {
      // 清理活动任务列表
      batchTasks.forEach(task => {
        const index = activeTasks.value.findIndex(t => t.id === task.id)
        if (index >= 0) {
          activeTasks.value.splice(index, 1)
        }
      })

      await updateServiceStats()
    }
  }

  // 设置事件监听器
  const setupEventListeners = () => {
    const handleEvent = (event: AIServiceEvent) => {
      switch (event.type) {
        case 'task:started':
          console.log('[useAIServices] Task started:', event.payload.taskId)
          break

        case 'task:progress':
          // 更新任务进度
          const taskIndex = activeTasks.value.findIndex(t => t.id === event.payload.taskId)
          if (taskIndex >= 0) {
            activeTasks.value[taskIndex].progress = event.payload.progress
          }
          break

        case 'task:completed':
          console.log('[useAIServices] Task completed:', event.payload.taskId)
          break

        case 'task:failed':
          console.error('[useAIServices] Task failed:', event.payload.taskId, event.payload.error)
          break

        case 'task:cancelled':
          console.log('[useAIServices] Task cancelled:', event.payload.taskId)
          break
      }
    }

    manager.addEventListener(handleEvent)

    // 在组件卸载时移除监听器
    onUnmounted(() => {
      manager.removeEventListener(handleEvent)
    })
  }

  // 更新服务统计信息
  const updateServiceStats = async () => {
    try {
      serviceStats.value = manager.getServiceStats()
    } catch (error) {
      console.error('Failed to update service stats:', error)
    }
  }

  // 健康检查
  const healthCheck = async () => {
    try {
      const health = await manager.healthCheck()
      console.log('[useAIServices] Health check:', health)
      return health
    } catch (error) {
      console.error('[useAIServices] Health check failed:', error)
      return {}
    }
  }

  // 清理已完成的任务
  const cleanupTasks = (olderThan?: Date) => {
    const cutoffTime = olderThan || new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    completedTasks.value = completedTasks.value.filter(task => 
      !task.completedAt || new Date(task.completedAt) >= cutoffTime
    )

    manager.cleanupCompletedTasks(cutoffTime)
  }

  // 自动初始化
  if (options.autoSetup !== false) {
    onMounted(() => {
      initializeServices().catch(console.error)
    })
  }

  // 定期清理任务（可选）
  onMounted(() => {
    const cleanupInterval = setInterval(() => {
      cleanupTasks()
    }, 60 * 60 * 1000) // 每小时清理一次

    onUnmounted(() => {
      clearInterval(cleanupInterval)
    })
  })

  return {
    // 状态
    isInitialized,
    activeTasks,
    completedTasks,
    serviceStats,
    availableServices,
    processingTasks,
    failedTasks,
    hasActiveTasks,

    // 方法
    initializeServices,
    isServiceAvailable,
    processImage,
    cancelTask,
    retryTask,
    getTaskStatus,
    processBatch,
    healthCheck,
    cleanupTasks,
    updateServiceStats
  }
}
