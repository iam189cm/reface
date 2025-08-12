/**
 * 依赖注入容器
 * 管理服务的注册、实例化和生命周期
 */
export class ServiceContainer {
  constructor() {
    /** @type {Map<string, ServiceDefinition>} 服务定义映射 */
    this.services = new Map()
    
    /** @type {Map<string, any>} 单例服务实例缓存 */
    this.singletons = new Map()
    
    /** @type {Set<string>} 正在构建的服务（用于检测循环依赖） */
    this.building = new Set()
    
    /** @type {boolean} 是否启用调试模式 */
    this.debug = false
  }
  
  /**
   * 注册服务
   * @param {string} name - 服务名称
   * @param {Function} factory - 服务工厂函数
   * @param {boolean} singleton - 是否为单例模式，默认true
   * @param {string[]} dependencies - 依赖的其他服务名称
   * @returns {ServiceContainer} 返回自身，支持链式调用
   */
  register(name, factory, singleton = true, dependencies = []) {
    if (typeof factory !== 'function') {
      throw new Error(`Service factory for '${name}' must be a function`)
    }
    
    this.services.set(name, {
      factory,
      singleton,
      dependencies,
      registered: Date.now()
    })
    
    if (this.debug) {
      console.log(`📦 Registered service: ${name}${singleton ? ' (singleton)' : ''}`)
    }
    
    return this
  }
  
  /**
   * 获取服务实例
   * @param {string} name - 服务名称
   * @returns {any} 服务实例
   */
  get(name) {
    // 检查循环依赖
    if (this.building.has(name)) {
      throw new Error(`Circular dependency detected: ${Array.from(this.building).join(' -> ')} -> ${name}`)
    }
    
    const service = this.services.get(name)
    if (!service) {
      throw new Error(`Service '${name}' not registered. Available services: ${Array.from(this.services.keys()).join(', ')}`)
    }
    
    // 单例模式处理
    if (service.singleton) {
      if (this.singletons.has(name)) {
        return this.singletons.get(name)
      }
    }
    
    // 开始构建服务
    this.building.add(name)
    
    try {
      // 解析依赖
      const dependencies = service.dependencies.map(dep => this.get(dep))
      
      // 创建服务实例
      const instance = service.factory(...dependencies)
      
      if (this.debug) {
        console.log(`🔨 Created service instance: ${name}`)
      }
      
      // 缓存单例
      if (service.singleton) {
        this.singletons.set(name, instance)
      }
      
      return instance
      
    } finally {
      // 构建完成，移除标记
      this.building.delete(name)
    }
  }
  
  /**
   * 批量注册服务
   * @param {Object} services - 服务定义对象
   * @returns {ServiceContainer} 返回自身，支持链式调用
   */
  registerServices(services) {
    Object.entries(services).forEach(([name, definition]) => {
      const {
        factory,
        singleton = true,
        dependencies = []
      } = definition
      
      this.register(name, factory, singleton, dependencies)
    })
    
    return this
  }
  
  /**
   * 检查服务是否已注册
   * @param {string} name - 服务名称
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name)
  }
  
  /**
   * 注销服务
   * @param {string} name - 服务名称
   * @returns {boolean} 是否成功注销
   */
  unregister(name) {
    const success = this.services.delete(name)
    this.singletons.delete(name)
    
    if (this.debug && success) {
      console.log(`🗑️ Unregistered service: ${name}`)
    }
    
    return success
  }
  
  /**
   * 清空所有服务
   */
  clear() {
    this.services.clear()
    this.singletons.clear()
    this.building.clear()
    
    if (this.debug) {
      console.log('🧹 Cleared all services')
    }
  }
  
  /**
   * 获取所有已注册的服务名称
   * @returns {string[]}
   */
  getServiceNames() {
    return Array.from(this.services.keys())
  }
  
  /**
   * 获取服务注册信息
   * @param {string} name - 服务名称
   * @returns {Object|null} 服务定义
   */
  getServiceInfo(name) {
    const service = this.services.get(name)
    if (!service) return null
    
    return {
      name,
      singleton: service.singleton,
      dependencies: service.dependencies,
      registered: service.registered,
      hasInstance: this.singletons.has(name)
    }
  }
  
  /**
   * 获取所有服务的依赖关系图
   * @returns {Object} 依赖关系图
   */
  getDependencyGraph() {
    const graph = {}
    
    for (const [name, service] of this.services) {
      graph[name] = {
        dependencies: service.dependencies,
        dependents: []
      }
    }
    
    // 构建反向依赖关系
    for (const [name, service] of this.services) {
      for (const dep of service.dependencies) {
        if (graph[dep]) {
          graph[dep].dependents.push(name)
        }
      }
    }
    
    return graph
  }
  
  /**
   * 验证所有服务的依赖关系
   * @returns {string[]} 验证错误列表
   */
  validateDependencies() {
    const errors = []
    
    for (const [name, service] of this.services) {
      for (const dep of service.dependencies) {
        if (!this.services.has(dep)) {
          errors.push(`Service '${name}' depends on unregistered service '${dep}'`)
        }
      }
    }
    
    return errors
  }
  
  /**
   * 启用/禁用调试模式
   * @param {boolean} enabled - 是否启用调试
   */
  setDebug(enabled) {
    this.debug = enabled
    console.log(`🔍 ServiceContainer debug mode: ${enabled ? 'enabled' : 'disabled'}`)
  }
  
  /**
   * 创建子容器（继承父容器的服务定义）
   * @returns {ServiceContainer} 新的子容器
   */
  createChild() {
    const child = new ServiceContainer()
    child.debug = this.debug
    
    // 复制服务定义（不复制实例）
    for (const [name, service] of this.services) {
      child.services.set(name, { ...service })
    }
    
    return child
  }
}

/**
 * @typedef {Object} ServiceDefinition
 * @property {Function} factory - 服务工厂函数
 * @property {boolean} singleton - 是否为单例
 * @property {string[]} dependencies - 依赖的服务名称列表
 * @property {number} registered - 注册时间戳
 */
