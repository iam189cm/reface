/**
 * 图片处理服务
 */

import type { 
  ImageData, 
  ImageDimensions, 
  ImageFormat 
} from '../types/image.types'
import type { 
  ImageTransform, 
  CropArea, 
  ImageFilter 
} from '../types/editor.types'

// 图片处理器类
export class ImageProcessor {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context not supported')
    }
    this.ctx = ctx
  }

  // 加载图片
  async loadImage(imageData: ImageData): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      
      img.src = imageData.url
    })
  }

  // 调整画布大小
  private resizeCanvas(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }

  // 应用变换
  async applyTransform(
    imageData: ImageData, 
    transform: ImageTransform
  ): Promise<string> {
    const img = await this.loadImage(imageData)
    
    // 计算变换后的尺寸
    const { width, height } = this.calculateTransformedDimensions(
      img.width,
      img.height,
      transform
    )

    this.resizeCanvas(width, height)
    this.ctx.clearRect(0, 0, width, height)

    // 保存上下文
    this.ctx.save()

    // 移动到画布中心
    this.ctx.translate(width / 2, height / 2)

    // 应用缩放
    this.ctx.scale(
      transform.scale * (transform.flipX ? -1 : 1),
      transform.scale * (transform.flipY ? -1 : 1)
    )

    // 应用旋转
    this.ctx.rotate((transform.rotation * Math.PI) / 180)

    // 绘制图片
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2)

    // 恢复上下文
    this.ctx.restore()

    return this.canvas.toDataURL()
  }

  // 裁剪图片
  async cropImage(imageData: ImageData, cropArea: CropArea): Promise<string> {
    const img = await this.loadImage(imageData)

    this.resizeCanvas(cropArea.width, cropArea.height)
    this.ctx.clearRect(0, 0, cropArea.width, cropArea.height)

    // 绘制裁剪区域
    this.ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    )

    return this.canvas.toDataURL()
  }

  // 应用滤镜
  async applyFilter(imageData: ImageData, filter: ImageFilter): Promise<string> {
    const img = await this.loadImage(imageData)

    this.resizeCanvas(img.width, img.height)
    this.ctx.clearRect(0, 0, img.width, img.height)

    // 设置滤镜样式
    this.ctx.filter = this.buildFilterString(filter)

    // 绘制图片
    this.ctx.drawImage(img, 0, 0)

    // 重置滤镜
    this.ctx.filter = 'none'

    return this.canvas.toDataURL()
  }

  // 调整图片大小
  async resizeImage(
    imageData: ImageData, 
    newDimensions: ImageDimensions,
    maintainAspectRatio: boolean = true
  ): Promise<string> {
    const img = await this.loadImage(imageData)

    let { width, height } = newDimensions

    if (maintainAspectRatio) {
      const aspectRatio = img.width / img.height
      if (width / height > aspectRatio) {
        width = height * aspectRatio
      } else {
        height = width / aspectRatio
      }
    }

    this.resizeCanvas(width, height)
    this.ctx.clearRect(0, 0, width, height)

    // 使用高质量缩放算法
    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'

    this.ctx.drawImage(img, 0, 0, width, height)

    return this.canvas.toDataURL()
  }

  // 转换图片格式
  async convertFormat(
    imageData: ImageData, 
    format: ImageFormat,
    quality: number = 0.9
  ): Promise<string> {
    const img = await this.loadImage(imageData)

    this.resizeCanvas(img.width, img.height)
    this.ctx.clearRect(0, 0, img.width, img.height)

    // 如果转换为JPEG，先填充白色背景
    if (format === 'jpeg') {
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, img.width, img.height)
    }

    this.ctx.drawImage(img, 0, 0)

    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`
    return this.canvas.toDataURL(mimeType, quality)
  }

  // 计算变换后的尺寸
  private calculateTransformedDimensions(
    width: number,
    height: number,
    transform: ImageTransform
  ): ImageDimensions {
    // 简化计算，实际项目中需要考虑旋转后的边界框
    const scaledWidth = Math.abs(width * transform.scale)
    const scaledHeight = Math.abs(height * transform.scale)

    // 旋转90度或270度时交换宽高
    const rotation = Math.abs(transform.rotation % 360)
    const needsSwap = (rotation >= 45 && rotation <= 135) || 
                      (rotation >= 225 && rotation <= 315)

    return needsSwap 
      ? { width: scaledHeight, height: scaledWidth }
      : { width: scaledWidth, height: scaledHeight }
  }

  // 构建CSS滤镜字符串
  private buildFilterString(filter: ImageFilter): string {
    const filters = []

    if (filter.brightness !== 100) {
      filters.push(`brightness(${filter.brightness}%)`)
    }
    if (filter.contrast !== 100) {
      filters.push(`contrast(${filter.contrast}%)`)
    }
    if (filter.saturation !== 100) {
      filters.push(`saturate(${filter.saturation}%)`)
    }
    if (filter.hue !== 0) {
      filters.push(`hue-rotate(${filter.hue}deg)`)
    }
    if (filter.blur > 0) {
      filters.push(`blur(${filter.blur}px)`)
    }

    return filters.join(' ') || 'none'
  }

  // 销毁资源
  destroy() {
    // 清理画布
    this.canvas.remove()
  }
}

// 创建图片处理器实例
export function createImageProcessor(): ImageProcessor {
  return new ImageProcessor()
}

// 实用函数：将DataURL转换为Blob
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

// 实用函数：将Blob转换为File
export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type })
}
