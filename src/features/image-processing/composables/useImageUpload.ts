/**
 * 图片上传组合函数
 */

import { ref, computed, type Ref } from 'vue'
import type { 
  UploadStatus, 
  UploadTask, 
  DragDropState, 
  UploadCallbacks,
  UploadConfig
} from '../types/upload.types'
import type { ImageValidationRule, ImageValidationError } from '../types/image.types'
import { useNotification } from '@/shared/composables/useNotification'
import { validateImage, generateTaskId } from '../services/upload.service'

interface UseImageUploadOptions extends Partial<UploadCallbacks> {
  maxSize?: number
  allowedFormats?: string[]
  endpoint?: string
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { showError } = useNotification()

  // Refs
  const fileInputRef: Ref<HTMLInputElement | null> = ref(null)
  const uploadStatus: Ref<UploadStatus> = ref('idle')
  const currentTask: Ref<UploadTask | null> = ref(null)
  const validationError: Ref<string> = ref('')

  // 拖拽状态
  const dragState: Ref<DragDropState> = ref({
    isDragging: false,
    isOver: false,
    draggedFiles: []
  })

  // 验证规则
  const validationRules: ImageValidationRule = {
    maxSize: options.maxSize || 10 * 1024 * 1024,
    allowedFormats: (options.allowedFormats || ['image/jpeg', 'image/png', 'image/webp']) as any
  }

  // 上传配置
  const uploadConfig: UploadConfig = {
    endpoint: options.endpoint || '/api/upload-oss',
    method: 'POST',
    timeout: 30000,
    maxRetries: 3,
    validationRules
  }

  // 清除错误
  const clearError = () => {
    validationError.value = ''
  }

  // 显示错误
  const showValidationError = (error: string) => {
    validationError.value = error
    uploadStatus.value = 'error'
    setTimeout(clearError, 5000)
  }

  // 验证文件
  const validateFile = async (file: File): Promise<ImageValidationError[]> => {
    try {
      return await validateImage(file, validationRules)
    } catch (error) {
      console.error('File validation error:', error)
      return [{
        field: 'format',
        message: 'File validation failed',
        actualValue: file.type,
        expectedValue: validationRules.allowedFormats
      }]
    }
  }

  // 创建上传任务
  const createUploadTask = (file: File): UploadTask => {
    return {
      id: generateTaskId(),
      file,
      status: 'pending',
      progress: {
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        remainingTime: 0
      },
      retries: 0,
      createdAt: Date.now()
    }
  }

  // 处理文件上传
  const processFile = async (file: File) => {
    clearError()
    
    // 验证文件
    const errors = await validateFile(file)
    if (errors.length > 0) {
      showValidationError(errors[0].message)
      return
    }

    // 创建上传任务
    const task = createUploadTask(file)
    currentTask.value = task
    uploadStatus.value = 'uploading'

    try {
      // 触发开始事件
      options.onStart?.(task)

      // 模拟上传进度 (实际项目中这里会调用真实的上传服务)
      const mockUpload = new Promise<void>((resolve, reject) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            resolve()
          }
          
          task.progress = {
            ...task.progress,
            loaded: (progress / 100) * file.size,
            percentage: Math.round(progress),
            speed: Math.random() * 1000000,
            remainingTime: Math.max(0, (100 - progress) / 10)
          }
        }, 200)

        // 模拟可能的错误
        setTimeout(() => {
          if (Math.random() > 0.9) {
            clearInterval(interval)
            reject(new Error('Upload failed'))
          }
        }, 1000)
      })

      await mockUpload

      // 上传成功
      task.status = 'success'
      task.completedAt = Date.now()
      uploadStatus.value = 'success'
      
      options.onSuccess?.(task)

    } catch (error) {
      // 上传失败
      task.status = 'error'
      task.error = error instanceof Error ? error.message : 'Upload failed'
      uploadStatus.value = 'error'
      showValidationError(task.error)
      
      options.onError?.(task)
    }
  }

  // 触发文件选择
  const triggerFileInput = () => {
    if (uploadStatus.value === 'uploading') return
    fileInputRef.value?.click()
  }

  // 处理文件选择
  const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = target.files
    
    if (files && files.length > 0) {
      processFile(files[0])
    }
    
    // 清空input值，允许重复选择同一文件
    target.value = ''
  }

  // 拖拽处理
  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault()
    dragState.value.isDragging = true
    dragState.value.isOver = true
  }

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault()
    dragState.value.isOver = false
    // 延迟重置拖拽状态，避免在拖拽元素间移动时闪烁
    setTimeout(() => {
      if (!dragState.value.isOver) {
        dragState.value.isDragging = false
      }
    }, 50)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    dragState.value.isDragging = false
    dragState.value.isOver = false

    if (uploadStatus.value === 'uploading') return

    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  // 重试上传
  const retryUpload = () => {
    if (currentTask.value && currentTask.value.retries < uploadConfig.maxRetries) {
      currentTask.value.retries++
      processFile(currentTask.value.file)
    }
  }

  // 取消上传
  const cancelUpload = () => {
    if (currentTask.value) {
      currentTask.value.status = 'cancelled'
      uploadStatus.value = 'idle'
      options.onCancel?.(currentTask.value)
      currentTask.value = null
    }
  }

  return {
    // Refs
    fileInputRef,
    uploadStatus,
    currentTask,
    dragState,
    validationError,

    // Computed
    isUploading: computed(() => uploadStatus.value === 'uploading'),
    hasError: computed(() => uploadStatus.value === 'error'),
    canRetry: computed(() => 
      currentTask.value && 
      currentTask.value.status === 'error' && 
      currentTask.value.retries < uploadConfig.maxRetries
    ),

    // Methods
    triggerFileInput,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    retryUpload,
    cancelUpload,
    clearError
  }
}
