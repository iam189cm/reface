/**
 * 进度管理器
 * 统一管理异步操作的进度状态
 */
export class ProgressManager {
  constructor() {
    /** @type {Map<string, ProgressState>} 进度状态映射 */
    this.progressStates = new Map()
    
    /** @type {Map<string, Function[]>} 进度监听器映射 */
    this.listeners = new Map()
  }
  
  /**
   * 创建新的进度跟踪
   * @param {string} taskId - 任务ID
   * @param {Object} options - 选项
   * @returns {ProgressTracker} 进度跟踪器
   */
  createTracker(taskId, options = {}) {
    const {
      totalSteps = 100,
      initialMessage = '准备中...',
      autoDestroy = true
    } = options
    
    const state = {
      taskId,
      progress: 0,
      totalSteps,
      currentStep: 0,
      message: initialMessage,
      status: 'pending', // pending, running, completed, failed
      startTime: null,
      endTime: null,
      error: null,
      autoDestroy
    }
    
    this.progressStates.set(taskId, state)
    this.listeners.set(taskId, [])
    
    return new ProgressTracker(this, taskId)
  }
  
  /**
   * 更新进度
   * @param {string} taskId - 任务ID
   * @param {Object} update - 更新内容
   */
  updateProgress(taskId, update) {
    const state = this.progressStates.get(taskId)
    if (!state) {
      console.warn(`Progress task not found: ${taskId}`)
      return
    }
    
    // 更新状态
    Object.assign(state, update)
    
    // 计算进度百分比
    if (update.currentStep !== undefined) {
      state.progress = Math.min(100, (update.currentStep / state.totalSteps) * 100)
    }
    
    // 记录开始时间
    if (update.status === 'running' && !state.startTime) {
      state.startTime = Date.now()
    }
    
    // 记录结束时间
    if ((update.status === 'completed' || update.status === 'failed') && !state.endTime) {
      state.endTime = Date.now()
    }
    
    // 通知监听器
    this._notifyListeners(taskId, state)
    
    // 自动销毁完成的任务
    if (state.autoDestroy && (state.status === 'completed' || state.status === 'failed')) {
      setTimeout(() => this.destroy(taskId), 1000)
    }
  }
  
  /**
   * 获取进度状态
   * @param {string} taskId - 任务ID
   * @returns {ProgressState|null}
   */
  getProgress(taskId) {
    return this.progressStates.get(taskId) || null
  }
  
  /**
   * 获取所有活跃的进度状态
   * @returns {ProgressState[]}
   */
  getActiveProgress() {
    return Array.from(this.progressStates.values())
      .filter(state => state.status === 'running' || state.status === 'pending')
  }
  
  /**
   * 添加进度监听器
   * @param {string} taskId - 任务ID
   * @param {Function} callback - 回调函数
   */
  onProgress(taskId, callback) {
    const listeners = this.listeners.get(taskId)
    if (listeners) {
      listeners.push(callback)
    }
  }
  
  /**
   * 移除进度监听器
   * @param {string} taskId - 任务ID
   * @param {Function} callback - 回调函数
   */
  offProgress(taskId, callback) {
    const listeners = this.listeners.get(taskId)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }
  
  /**
   * 销毁进度跟踪
   * @param {string} taskId - 任务ID
   */
  destroy(taskId) {
    this.progressStates.delete(taskId)
    this.listeners.delete(taskId)
  }
  
  /**
   * 清空所有进度状态
   */
  clear() {
    this.progressStates.clear()
    this.listeners.clear()
  }
  
  /**
   * 通知所有监听器
   * @param {string} taskId - 任务ID
   * @param {ProgressState} state - 进度状态
   * @private
   */
  _notifyListeners(taskId, state) {
    const listeners = this.listeners.get(taskId)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback({ ...state })
        } catch (error) {
          console.error('Progress listener error:', error)
        }
      })
    }
  }
}

/**
 * 进度跟踪器
 * 提供便捷的进度更新接口
 */
export class ProgressTracker {
  constructor(manager, taskId) {
    this.manager = manager
    this.taskId = taskId
  }
  
  /**
   * 开始任务
   * @param {string} message - 开始消息
   */
  start(message = '开始处理...') {
    this.manager.updateProgress(this.taskId, {
      status: 'running',
      message,
      currentStep: 0
    })
  }
  
  /**
   * 更新进度
   * @param {number} step - 当前步骤
   * @param {string} message - 进度消息
   */
  update(step, message) {
    this.manager.updateProgress(this.taskId, {
      currentStep: step,
      message
    })
  }
  
  /**
   * 设置进度百分比
   * @param {number} percentage - 进度百分比(0-100)
   * @param {string} message - 进度消息
   */
  setProgress(percentage, message) {
    this.manager.updateProgress(this.taskId, {
      progress: Math.max(0, Math.min(100, percentage)),
      message
    })
  }
  
  /**
   * 完成任务
   * @param {string} message - 完成消息
   */
  complete(message = '处理完成') {
    this.manager.updateProgress(this.taskId, {
      status: 'completed',
      progress: 100,
      message
    })
  }
  
  /**
   * 任务失败
   * @param {Error|string} error - 错误信息
   * @param {string} message - 失败消息
   */
  fail(error, message = '处理失败') {
    this.manager.updateProgress(this.taskId, {
      status: 'failed',
      error: error instanceof Error ? error.message : error,
      message
    })
  }
  
  /**
   * 获取当前状态
   * @returns {ProgressState|null}
   */
  getState() {
    return this.manager.getProgress(this.taskId)
  }
  
  /**
   * 添加进度监听
   * @param {Function} callback - 回调函数
   */
  onProgress(callback) {
    this.manager.onProgress(this.taskId, callback)
  }
  
  /**
   * 移除进度监听
   * @param {Function} callback - 回调函数
   */
  offProgress(callback) {
    this.manager.offProgress(this.taskId, callback)
  }
  
  /**
   * 销毁跟踪器
   */
  destroy() {
    this.manager.destroy(this.taskId)
  }
}

/**
 * @typedef {Object} ProgressState
 * @property {string} taskId - 任务ID
 * @property {number} progress - 进度百分比(0-100)
 * @property {number} totalSteps - 总步骤数
 * @property {number} currentStep - 当前步骤
 * @property {string} message - 当前消息
 * @property {'pending'|'running'|'completed'|'failed'} status - 任务状态
 * @property {number|null} startTime - 开始时间戳
 * @property {number|null} endTime - 结束时间戳
 * @property {string|null} error - 错误信息
 * @property {boolean} autoDestroy - 是否自动销毁
 */
