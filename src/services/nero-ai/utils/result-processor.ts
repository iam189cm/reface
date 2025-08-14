/**
 * Nero AI 结果处理器
 * 处理AI服务返回的结果，包括格式转换、缓存、优化等
 */

import type { NeroAIResult, NeroAIServiceType } from '../types/nero-ai.types'

export interface ProcessedResult {
  originalResult: NeroAIResult
  downloadUrl: string
  previewUrl?: string
  thumbnailUrl?: string
  metadata: {
    fileSize: number
    dimensions?: { width: number; height: number }
    format: string
    processingTime: number
    serviceUsed: NeroAIServiceType
    creditsUsed: number
  }
  cacheInfo: {
    cached: boolean
    cacheKey: string
    expiresAt: Date
  }
}

export interface CacheOptions {
  enabled: boolean
  ttl: number // Time to live in milliseconds
  prefix: string
  maxSize?: number // Maximum cache size in MB
}

export class ResultProcessor {
  private cache = new Map<string, ProcessedResult>()
  private cacheOptions: CacheOptions

  constructor(cacheOptions: Partial<CacheOptions> = {}) {
    this.cacheOptions = {
      enabled: true,
      ttl: 2 * 60 * 60 * 1000, // 2 hours default
      prefix: 'nero_ai_result_',
      maxSize: 100, // 100MB default
      ...cacheOptions
    }
  }

  /**
   * 处理AI服务结果
   */
  async processResult(result: NeroAIResult, originalFile?: File): Promise<ProcessedResult> {
    const cacheKey = this.generateCacheKey(result)
    
    // 检查缓存
    if (this.cacheOptions.enabled) {
      const cachedResult = this.getCachedResult(cacheKey)
      if (cachedResult) {
        return cachedResult
      }
    }

    try {
      // 处理结果URL
      const downloadUrl = this.extractDownloadUrl(result)
      if (!downloadUrl) {
        throw new Error('无法获取结果下载URL')
      }

      // 获取结果文件信息
      const metadata = await this.extractMetadata(result, downloadUrl, originalFile)
      
      // 生成预览和缩略图URL
      const previewUrl = await this.generatePreviewUrl(downloadUrl, metadata)
      const thumbnailUrl = await this.generateThumbnailUrl(downloadUrl, metadata)

      const processedResult: ProcessedResult = {
        originalResult: result,
        downloadUrl,
        previewUrl,
        thumbnailUrl,
        metadata,
        cacheInfo: {
          cached: false,
          cacheKey,
          expiresAt: new Date(Date.now() + this.cacheOptions.ttl)
        }
      }

      // 缓存结果
      if (this.cacheOptions.enabled) {
        this.cacheResult(cacheKey, processedResult)
      }

      return processedResult

    } catch (error) {
      console.error('处理AI结果失败:', error)
      throw new Error(`结果处理失败: ${(error as Error).message}`)
    }
  }

  /**
   * 批量处理结果
   */
  async processBatchResults(results: NeroAIResult[], originalFiles?: File[]): Promise<ProcessedResult[]> {
    const processPromises = results.map((result, index) => 
      this.processResult(result, originalFiles?.[index])
    )

    try {
      return await Promise.all(processPromises)
    } catch (error) {
      console.error('批量处理结果失败:', error)
      throw error
    }
  }

  /**
   * 下载结果文件
   */
  async downloadResult(processedResult: ProcessedResult, filename?: string): Promise<Blob> {
    try {
      const response = await fetch(processedResult.downloadUrl)
      
      if (!response.ok) {
        throw new Error(`下载失败: HTTP ${response.status}`)
      }

      const blob = await response.blob()
      
      // 验证文件大小
      if (blob.size !== processedResult.metadata.fileSize) {
        console.warn('下载的文件大小与预期不符')
      }

      return blob
      
    } catch (error) {
      console.error('下载结果失败:', error)
      throw new Error(`下载失败: ${(error as Error).message}`)
    }
  }

  /**
   * 创建下载链接
   */
  createDownloadLink(processedResult: ProcessedResult, filename?: string): HTMLAnchorElement {
    const link = document.createElement('a')
    link.href = processedResult.downloadUrl
    link.download = filename || this.generateFilename(processedResult)
    link.style.display = 'none'
    
    document.body.appendChild(link)
    
    return link
  }

  /**
   * 触发下载
   */
  async triggerDownload(processedResult: ProcessedResult, filename?: string): Promise<void> {
    try {
      const blob = await this.downloadResult(processedResult, filename)
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename || this.generateFilename(processedResult)
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理URL
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      
    } catch (error) {
      console.error('触发下载失败:', error)
      throw error
    }
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): {
    size: number
    itemCount: number
    hitRate: number
    memoryUsage: number
  } {
    const items = Array.from(this.cache.values())
    const totalSize = items.reduce((sum, item) => sum + item.metadata.fileSize, 0)
    
    return {
      size: totalSize,
      itemCount: this.cache.size,
      hitRate: 0, // 简化实现，实际应该跟踪命中率
      memoryUsage: totalSize / (1024 * 1024) // MB
    }
  }

  /**
   * 清理缓存
   */
  clearCache(olderThanMs?: number): number {
    const cutoffTime = olderThanMs ? Date.now() - olderThanMs : 0
    let clearedCount = 0
    
    for (const [key, result] of this.cache.entries()) {
      if (!olderThanMs || result.cacheInfo.expiresAt.getTime() < Date.now() - cutoffTime) {
        this.cache.delete(key)
        clearedCount++
      }
    }
    
    return clearedCount
  }

  // 私有方法

  /**
   * 提取下载URL
   */
  private extractDownloadUrl(result: NeroAIResult): string | null {
    if (result.result?.output) {
      return result.result.output
    }
    
    if (result.result?.outputs && result.result.outputs.length > 0) {
      return result.result.outputs[0]
    }
    
    return null
  }

  /**
   * 提取元数据
   */
  private async extractMetadata(
    result: NeroAIResult, 
    downloadUrl: string, 
    originalFile?: File
  ): Promise<ProcessedResult['metadata']> {
    try {
      // 获取文件信息
      const response = await fetch(downloadUrl, { method: 'HEAD' })
      const fileSize = parseInt(response.headers.get('content-length') || '0')
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      
      // 确定文件格式
      const format = this.extractFormatFromContentType(contentType)
      
      // 获取图片尺寸（如果可能）
      let dimensions: { width: number; height: number } | undefined
      
      if (contentType.startsWith('image/')) {
        dimensions = await this.getImageDimensions(downloadUrl)
      }

      return {
        fileSize,
        dimensions,
        format,
        processingTime: result.result?.processing_time || 0,
        serviceUsed: result.service_type,
        creditsUsed: result.result?.credits_consumed || 1
      }
      
    } catch (error) {
      console.warn('提取元数据失败:', error)
      
      // 返回默认元数据
      return {
        fileSize: 0,
        format: 'unknown',
        processingTime: 0,
        serviceUsed: result.service_type,
        creditsUsed: 1
      }
    }
  }

  /**
   * 获取图片尺寸
   */
  private async getImageDimensions(imageUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      
      img.onerror = () => {
        reject(new Error('无法加载图片获取尺寸'))
      }
      
      img.src = imageUrl
    })
  }

  /**
   * 生成预览URL
   */
  private async generatePreviewUrl(
    downloadUrl: string, 
    metadata: ProcessedResult['metadata']
  ): Promise<string | undefined> {
    // 对于图片，直接使用原URL作为预览
    if (metadata.format && ['jpg', 'jpeg', 'png', 'webp'].includes(metadata.format)) {
      return downloadUrl
    }
    
    return undefined
  }

  /**
   * 生成缩略图URL
   */
  private async generateThumbnailUrl(
    downloadUrl: string, 
    metadata: ProcessedResult['metadata']
  ): Promise<string | undefined> {
    // 简化实现：直接返回原图URL
    // 在实际应用中，可能需要调用缩略图生成服务
    if (metadata.format && ['jpg', 'jpeg', 'png', 'webp'].includes(metadata.format)) {
      return downloadUrl
    }
    
    return undefined
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(result: NeroAIResult): string {
    const key = `${result.service_type}_${result.task_id}`
    return `${this.cacheOptions.prefix}${key}`
  }

  /**
   * 获取缓存结果
   */
  private getCachedResult(cacheKey: string): ProcessedResult | null {
    const cached = this.cache.get(cacheKey)
    
    if (cached && cached.cacheInfo.expiresAt.getTime() > Date.now()) {
      cached.cacheInfo.cached = true
      return cached
    }
    
    // 清理过期缓存
    if (cached) {
      this.cache.delete(cacheKey)
    }
    
    return null
  }

  /**
   * 缓存结果
   */
  private cacheResult(cacheKey: string, result: ProcessedResult): void {
    // 检查缓存大小限制
    if (this.cacheOptions.maxSize) {
      const stats = this.getCacheStats()
      if (stats.memoryUsage > this.cacheOptions.maxSize) {
        this.clearOldestCacheItems()
      }
    }
    
    this.cache.set(cacheKey, result)
  }

  /**
   * 清理最旧的缓存项
   */
  private clearOldestCacheItems(): void {
    const items = Array.from(this.cache.entries())
    
    // 按过期时间排序，删除最旧的25%
    items.sort(([, a], [, b]) => 
      a.cacheInfo.expiresAt.getTime() - b.cacheInfo.expiresAt.getTime()
    )
    
    const deleteCount = Math.ceil(items.length * 0.25)
    
    for (let i = 0; i < deleteCount; i++) {
      this.cache.delete(items[i][0])
    }
  }

  /**
   * 从Content-Type提取格式
   */
  private extractFormatFromContentType(contentType: string): string {
    const formats: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/bmp': 'bmp'
    }
    
    return formats[contentType.toLowerCase()] || 'unknown'
  }

  /**
   * 生成文件名
   */
  private generateFilename(processedResult: ProcessedResult): string {
    const serviceType = processedResult.originalResult.service_type.replace(':', '_')
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const format = processedResult.metadata.format || 'jpg'
    
    return `${serviceType}_${timestamp}.${format}`
  }
}
