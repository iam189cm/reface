/**
 * Nero AI 服务模块入口
 * 统一导出所有相关的类型、配置和服务
 */

// 核心服务
export { NeroAIService } from './nero-ai.service'

// 工具类
export { TaskManager } from './utils/task-manager'
export { ResultProcessor } from './utils/result-processor'

// 类型定义
export type {
  NeroAIServiceType,
  NeroAIProcessParams,
  NeroAIResponse,
  NeroAIResult,
  NeroAIConfig,
  NeroAIError,
  BatchProcessResult,
  TaskInfo,
  WebhookCallbackData,
  ServiceCapability,
  ImageAnalysis,
  ServiceRecommendation
} from './types/nero-ai.types'

// 配置和常量
export {
  NERO_AI_CONFIG,
  SERVICE_CAPABILITIES,
  SERVICE_CATEGORIES,
  ERROR_CODES,
  DEFAULT_PARAMS
} from './config/nero-ai.config'

// 工具类型
export type {
  ProcessingTask,
  ProcessedResult,
  CacheOptions
} from './utils/task-manager'

// 创建服务实例的工厂函数
export function createNeroAIService(config: { apiKey: string; [key: string]: any }): NeroAIService {
  return new NeroAIService(config)
}

// 创建任务管理器的工厂函数
export function createTaskManager(neroAI: NeroAIService, maxConcurrent = 3): TaskManager {
  return new TaskManager(neroAI, maxConcurrent)
}

// 创建结果处理器的工厂函数
export function createResultProcessor(cacheOptions?: Partial<CacheOptions>): ResultProcessor {
  return new ResultProcessor(cacheOptions)
}
