/**
 * Nero AI 任务管理器
 * 负责任务队列、并发控制和状态管理
 */

import type { NeroAIProcessParams, NeroAIResult, TaskInfo } from '../types/nero-ai.types'
import { NeroAIService } from '../nero-ai.service'

export interface ProcessingTask {
  id: string
  params: NeroAIProcessParams
  priority: 'high' | 'medium' | 'low'
  onProgress?: (progress: number) => void
  onComplete?: (result: NeroAIResult) => void
  onError?: (error: Error) => void
  retryCount: number
  maxRetries: number
  createdAt: Date
}

export class TaskManager {
  private neroAI: NeroAIService
  private taskQueue: ProcessingTask[] = []
  private processingTasks = new Map<string, ProcessingTask>()
  private completedTasks = new Map<string, NeroAIResult>()
  private maxConcurrentTasks: number
  private currentTaskCount = 0
  private isProcessing = false

  constructor(neroAI: NeroAIService, maxConcurrentTasks = 3) {
    this.neroAI = neroAI
    this.maxConcurrentTasks = maxConcurrentTasks
  }

  /**
   * 添加任务到队列
   */
  async addTask(
    params: NeroAIProcessParams,
    options: {
      priority?: 'high' | 'medium' | 'low'
      maxRetries?: number
      onProgress?: (progress: number) => void
      onComplete?: (result: NeroAIResult) => void
      onError?: (error: Error) => void
    } = {}
  ): Promise<string> {
    const taskId = this.generateTaskId()
    
    const task: ProcessingTask = {
      id: taskId,
      params,
      priority: options.priority || 'medium',
      onProgress: options.onProgress,
      onComplete: options.onComplete,
      onError: options.onError,
      retryCount: 0,
      maxRetries: options.maxRetries || 3,
      createdAt: new Date()
    }

    // 根据优先级插入队列
    this.insertTaskByPriority(task)
    
    // 开始处理队列
    this.processQueue()
    
    return taskId
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<boolean> {
    // 从队列中移除
    const queueIndex = this.taskQueue.findIndex(task => task.id === taskId)
    if (queueIndex !== -1) {
      this.taskQueue.splice(queueIndex, 1)
      return true
    }

    // 取消正在处理的任务
    const processingTask = this.processingTasks.get(taskId)
    if (processingTask) {
      try {
        await this.neroAI.cancelTask(taskId)
        this.processingTasks.delete(taskId)
        this.currentTaskCount--
        
        // 触发错误回调
        processingTask.onError?.(new Error('任务已被取消'))
        
        // 继续处理队列
        this.processQueue()
        
        return true
      } catch (error) {
        console.warn('取消任务失败:', error)
        return false
      }
    }

    return false
  }

  /**
   * 获取任务状态
   */
  getTaskStatus(taskId: string): 'queued' | 'processing' | 'completed' | 'failed' | 'not_found' {
    if (this.taskQueue.some(task => task.id === taskId)) {
      return 'queued'
    }
    
    if (this.processingTasks.has(taskId)) {
      return 'processing'
    }
    
    if (this.completedTasks.has(taskId)) {
      return 'completed'
    }
    
    return 'not_found'
  }

  /**
   * 获取任务结果
   */
  getTaskResult(taskId: string): NeroAIResult | null {
    return this.completedTasks.get(taskId) || null
  }

  /**
   * 获取队列统计信息
   */
  getQueueStats(): {
    queued: number
    processing: number
    completed: number
    total: number
  } {
    return {
      queued: this.taskQueue.length,
      processing: this.processingTasks.size,
      completed: this.completedTasks.size,
      total: this.taskQueue.length + this.processingTasks.size + this.completedTasks.size
    }
  }

  /**
   * 清理已完成的任务
   */
  clearCompletedTasks(olderThanMinutes = 60): number {
    const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000)
    let clearedCount = 0

    for (const [taskId, result] of this.completedTasks.entries()) {
      const completedAt = new Date(result.completed_at || result.created_at)
      if (completedAt < cutoffTime) {
        this.completedTasks.delete(taskId)
        clearedCount++
      }
    }

    return clearedCount
  }

  /**
   * 暂停任务处理
   */
  pauseProcessing(): void {
    this.isProcessing = false
  }

  /**
   * 恢复任务处理
   */
  resumeProcessing(): void {
    this.isProcessing = true
    this.processQueue()
  }

  /**
   * 获取所有活动任务
   */
  getAllActiveTasks(): Array<{
    id: string
    status: 'queued' | 'processing'
    serviceType: string
    createdAt: Date
    priority: string
  }> {
    const tasks = []

    // 队列中的任务
    for (const task of this.taskQueue) {
      tasks.push({
        id: task.id,
        status: 'queued' as const,
        serviceType: task.params.type,
        createdAt: task.createdAt,
        priority: task.priority
      })
    }

    // 处理中的任务
    for (const task of this.processingTasks.values()) {
      tasks.push({
        id: task.id,
        status: 'processing' as const,
        serviceType: task.params.type,
        createdAt: task.createdAt,
        priority: task.priority
      })
    }

    return tasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  // 私有方法

  /**
   * 处理任务队列
   */
  private async processQueue(): Promise<void> {
    if (!this.isProcessing || this.currentTaskCount >= this.maxConcurrentTasks || this.taskQueue.length === 0) {
      return
    }

    const task = this.taskQueue.shift()!
    this.currentTaskCount++
    this.processingTasks.set(task.id, task)

    try {
      // 执行任务
      const result = await this.neroAI.processImage(task.params)
      
      // 任务成功完成
      this.processingTasks.delete(task.id)
      this.completedTasks.set(task.id, result)
      this.currentTaskCount--
      
      // 触发完成回调
      task.onComplete?.(result)
      
      console.log(`任务完成: ${task.id}`)
      
    } catch (error) {
      const errorInstance = error as Error
      
      // 检查是否可以重试
      if (task.retryCount < task.maxRetries && this.shouldRetry(errorInstance)) {
        task.retryCount++
        
        console.warn(`任务重试 ${task.retryCount}/${task.maxRetries}: ${task.id}`, errorInstance.message)
        
        // 重新加入队列（降低优先级）
        task.priority = 'low'
        this.insertTaskByPriority(task)
        
        this.processingTasks.delete(task.id)
        this.currentTaskCount--
        
      } else {
        // 任务彻底失败
        this.processingTasks.delete(task.id)
        this.currentTaskCount--
        
        // 触发错误回调
        task.onError?.(errorInstance)
        
        console.error(`任务失败: ${task.id}`, errorInstance.message)
      }
    }

    // 继续处理下一个任务
    setTimeout(() => this.processQueue(), 100)
  }

  /**
   * 根据优先级插入任务
   */
  private insertTaskByPriority(task: ProcessingTask): void {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    
    let insertIndex = this.taskQueue.length
    
    for (let i = 0; i < this.taskQueue.length; i++) {
      const queuedTask = this.taskQueue[i]
      if (priorityOrder[task.priority] < priorityOrder[queuedTask.priority]) {
        insertIndex = i
        break
      }
    }
    
    this.taskQueue.splice(insertIndex, 0, task)
  }

  /**
   * 判断错误是否可以重试
   */
  private shouldRetry(error: Error): boolean {
    const retryableMessages = [
      'timeout',
      'network',
      'rate limit',
      '503',
      '502',
      '429'
    ]
    
    const errorMessage = error.message.toLowerCase()
    return retryableMessages.some(msg => errorMessage.includes(msg))
  }

  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
