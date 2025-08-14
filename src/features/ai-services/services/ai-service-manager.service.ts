/**
 * AI服务管理器
 * 统一管理所有AI服务实例
 */

import type { 
  IAIService,
  IAIServiceManager,
  AIServiceType,
  AIServiceTask,
  AIProcessingResult,
  AIServiceStatus,
  AIServiceEvent,
  AIServiceCallbacks
} from '../types/ai-service.types'

export class AIServiceManager implements IAIServiceManager {
  private services = new Map<AIServiceType, IAIService>()
  private tasks = new Map<string, AIServiceTask>()
  private eventListeners = new Set<(event: AIServiceEvent) => void>()

  constructor() {
    this.setupEventHandling()
  }

  // 注册AI服务
  registerService(service: IAIService): void {
    this.services.set(service.type, service)
    console.log(`[AIServiceManager] Registered service: ${service.type}`)
  }

  // 获取指定类型的AI服务
  getService(type: AIServiceType): IAIService | null {
    return this.services.get(type) || null
  }

  // 获取所有注册的AI服务
  getAllServices(): IAIService[] {
    return Array.from(this.services.values())
  }

  // 获取支持的服务类型
  getSupportedTypes(): AIServiceType[] {
    return Array.from(this.services.keys())
  }

  // 检查服务是否可用
  isServiceAvailable(type: AIServiceType): boolean {
    return this.services.has(type)
  }

  // 处理AI任务
  async processTask(task: AIServiceTask): Promise<AIProcessingResult> {
    const service = this.getService(task.serviceType)
    
    if (!service) {
      throw new Error(`Service not available: ${task.serviceType}`)
    }

    // 保存任务
    this.tasks.set(task.id, { ...task, status: 'processing', startedAt: new Date().toISOString() })

    // 触发任务开始事件
    this.emitEvent({
      type: 'task:started',
      payload: { taskId: task.id }
    })

    try {
      // 执行处理
      const result = await service.process(task.params)
      
      // 更新任务状态
      const completedTask = {
        ...task,
        status: 'completed' as const,
        result,
        completedAt: new Date().toISOString()
      }
      this.tasks.set(task.id, completedTask)

      // 触发完成事件
      this.emitEvent({
        type: 'task:completed',
        payload: { taskId: task.id, result }
      })

      return result

    } catch (error) {
      // 更新任务状态为失败
      const failedTask = {
        ...task,
        status: 'failed' as const,
        error: error as any,
        completedAt: new Date().toISOString()
      }
      this.tasks.set(task.id, failedTask)

      // 触发失败事件
      this.emitEvent({
        type: 'task:failed',
        payload: { taskId: task.id, error: error as any }
      })

      throw error
    }
  }

  // 取消任务
  async cancelTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    const service = this.getService(task.serviceType)
    if (service) {
      try {
        await service.cancel(taskId)
      } catch (error) {
        console.warn(`Failed to cancel service task: ${taskId}`, error)
      }
    }

    // 更新任务状态
    const cancelledTask = {
      ...task,
      status: 'cancelled' as const,
      completedAt: new Date().toISOString()
    }
    this.tasks.set(taskId, cancelledTask)

    // 触发取消事件
    this.emitEvent({
      type: 'task:cancelled',
      payload: { taskId }
    })
  }

  // 获取任务状态
  async getTaskStatus(taskId: string): Promise<AIServiceStatus> {
    const task = this.tasks.get(taskId)
    if (!task) {
      throw new Error(`Task not found: ${taskId}`)
    }

    // 如果任务已完成或失败，返回本地状态
    if (['completed', 'failed', 'cancelled'].includes(task.status)) {
      return task.status
    }

    // 否则查询服务状态
    const service = this.getService(task.serviceType)
    if (service) {
      try {
        const status = await service.getStatus(taskId)
        
        // 更新本地任务状态
        if (status !== task.status) {
          this.tasks.set(taskId, { ...task, status })
        }
        
        return status
      } catch (error) {
        console.warn(`Failed to get service task status: ${taskId}`, error)
        return task.status
      }
    }

    return task.status
  }

  // 获取任务信息
  getTask(taskId: string): AIServiceTask | null {
    return this.tasks.get(taskId) || null
  }

  // 获取所有任务
  getAllTasks(): AIServiceTask[] {
    return Array.from(this.tasks.values())
  }

  // 获取指定状态的任务
  getTasksByStatus(status: AIServiceStatus): AIServiceTask[] {
    return this.getAllTasks().filter(task => task.status === status)
  }

  // 获取指定服务类型的任务
  getTasksByService(serviceType: AIServiceType): AIServiceTask[] {
    return this.getAllTasks().filter(task => task.serviceType === serviceType)
  }

  // 清理已完成的任务（可选，用于内存管理）
  cleanupCompletedTasks(olderThan?: Date): void {
    const cutoffTime = olderThan || new Date(Date.now() - 24 * 60 * 60 * 1000) // 默认24小时前

    for (const [taskId, task] of this.tasks.entries()) {
      if (['completed', 'failed', 'cancelled'].includes(task.status) &&
          task.completedAt &&
          new Date(task.completedAt) < cutoffTime) {
        this.tasks.delete(taskId)
      }
    }
  }

  // 事件监听
  addEventListener(listener: (event: AIServiceEvent) => void): void {
    this.eventListeners.add(listener)
  }

  // 移除事件监听
  removeEventListener(listener: (event: AIServiceEvent) => void): void {
    this.eventListeners.delete(listener)
  }

  // 触发事件
  private emitEvent(event: AIServiceEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event)
      } catch (error) {
        console.error('Error in AI service event listener:', error)
      }
    })
  }

  // 设置事件处理
  private setupEventHandling(): void {
    // 这里可以添加全局事件处理逻辑
    this.addEventListener((event) => {
      // 记录所有事件用于调试
      console.log('[AIServiceManager] Event:', event)
    })
  }

  // 批量处理任务
  async processBatch(tasks: AIServiceTask[]): Promise<AIProcessingResult[]> {
    const results: AIProcessingResult[] = []
    const errors: { task: AIServiceTask; error: any }[] = []

    // 并发处理任务（可配置并发数量）
    const concurrency = 3
    const batches = this.chunkArray(tasks, concurrency)

    for (const batch of batches) {
      const batchPromises = batch.map(async (task) => {
        try {
          const result = await this.processTask(task)
          results.push(result)
        } catch (error) {
          errors.push({ task, error })
        }
      })

      await Promise.all(batchPromises)
    }

    // 如果有错误，可以选择抛出或记录
    if (errors.length > 0) {
      console.warn(`Batch processing completed with ${errors.length} errors:`, errors)
    }

    return results
  }

  // 数组分块工具函数
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize))
    }
    return chunks
  }

  // 获取服务统计信息
  getServiceStats(): Record<AIServiceType, {
    total: number
    completed: number
    failed: number
    processing: number
  }> {
    const stats: Record<string, any> = {}

    for (const serviceType of this.getSupportedTypes()) {
      const serviceTasks = this.getTasksByService(serviceType)
      
      stats[serviceType] = {
        total: serviceTasks.length,
        completed: serviceTasks.filter(t => t.status === 'completed').length,
        failed: serviceTasks.filter(t => t.status === 'failed').length,
        processing: serviceTasks.filter(t => t.status === 'processing').length
      }
    }

    return stats
  }

  // 健康检查
  async healthCheck(): Promise<Record<AIServiceType, boolean>> {
    const healthStatus: Record<string, boolean> = {}

    for (const [serviceType, service] of this.services.entries()) {
      try {
        // 简单的参数验证测试
        await service.validateParams({ imageUrl: 'https://example.com/test.jpg' })
        healthStatus[serviceType] = true
      } catch {
        healthStatus[serviceType] = false
      }
    }

    return healthStatus
  }

  // 销毁管理器
  destroy(): void {
    // 取消所有进行中的任务
    const processingTasks = this.getTasksByStatus('processing')
    processingTasks.forEach(task => {
      this.cancelTask(task.id).catch(console.error)
    })

    // 清理资源
    this.services.clear()
    this.tasks.clear()
    this.eventListeners.clear()
  }
}

// 创建全局单例实例
let globalServiceManager: AIServiceManager | null = null

export function getGlobalAIServiceManager(): AIServiceManager {
  if (!globalServiceManager) {
    globalServiceManager = new AIServiceManager()
  }
  return globalServiceManager
}

// 重置全局实例（主要用于测试）
export function resetGlobalAIServiceManager(): void {
  if (globalServiceManager) {
    globalServiceManager.destroy()
    globalServiceManager = null
  }
}
