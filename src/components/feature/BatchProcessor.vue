<template>
  <div class="batch-processor">
    <!-- 批量处理头部 -->
    <div class="glass-effect rounded-2xl p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">批量处理</h3>
            <p class="text-sm text-gray-600">同时处理多张图片，提升工作效率</p>
          </div>
        </div>
        <div v-if="files.length > 0" class="text-right">
          <div class="text-2xl font-bold text-gray-900">{{ files.length }}</div>
          <div class="text-sm text-gray-500">张图片</div>
        </div>
      </div>
      
      <!-- 批量上传区域 -->
      <div 
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        :class="[
          'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
          isDragging 
            ? 'border-pink-400 bg-pink-50' 
            : 'border-gray-300 hover:border-pink-300'
        ]"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          @change="handleFileSelect"
          class="hidden"
        >
        
        <div v-if="files.length === 0">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">添加图片进行批量处理</h4>
          <p class="text-gray-600 mb-4">拖拽图片到这里，或点击选择文件</p>
          <Button type="primary" @click="$refs.fileInput.click()">
            选择图片
          </Button>
          <p class="text-xs text-gray-500 mt-2">
            支持 JPG、PNG、WebP 等格式，单个文件最大 50MB
          </p>
        </div>
        
        <div v-else>
          <p class="text-gray-600 mb-2">拖拽更多图片到这里，或</p>
          <Button type="secondary" size="small" @click="$refs.fileInput.click()">
            继续添加
          </Button>
        </div>
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="files.length > 0" class="glass-effect rounded-2xl p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold text-gray-900">文件列表</h4>
        <div class="flex items-center space-x-2">
          <Button type="secondary" size="small" @click="clearAll">
            清空列表
          </Button>
          <Button 
            type="secondary" 
            size="small" 
            @click="removeSelected"
            :disabled="selectedFiles.length === 0"
          >
            删除选中 ({{ selectedFiles.length }})
          </Button>
        </div>
      </div>
      
      <!-- 文件网格 -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
        <FileCard
          v-for="(file, index) in files"
          :key="`${file.name}-${index}`"
          :file="file"
          :index="index"
          :isSelected="selectedFiles.includes(index)"
          :status="getFileStatus(index)"
          :result="results[index]"
          @select="toggleFileSelection"
          @remove="removeFile"
          @download="downloadResult"
        />
      </div>
      
      <!-- 全选控制 -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <label class="flex items-center">
          <input
            type="checkbox"
            :checked="selectedFiles.length === files.length && files.length > 0"
            :indeterminate="selectedFiles.length > 0 && selectedFiles.length < files.length"
            @change="toggleSelectAll"
            class="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">全选</span>
        </label>
        <div class="text-sm text-gray-500">
          已选中 {{ selectedFiles.length }} / {{ files.length }} 个文件
        </div>
      </div>
    </div>

    <!-- 处理设置 -->
    <div v-if="files.length > 0" class="glass-effect rounded-2xl p-6 mb-6">
      <h4 class="text-lg font-semibold text-gray-900 mb-4">处理设置</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 服务选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">AI功能</label>
          <select
            v-model="selectedService"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="">请选择处理功能</option>
            <optgroup 
              v-for="(category, key) in servicesByCategory" 
              :key="key"
              :label="category.name"
            >
              <option 
                v-for="service in category.services"
                :key="service.type"
                :value="service.type"
              >
                {{ service.name }} ({{ service.credit_cost }} 积分)
              </option>
            </optgroup>
          </select>
        </div>
        
        <!-- 并发数设置 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            并发处理数 ({{ concurrentLimit }})
          </label>
          <input
            type="range"
            v-model="concurrentLimit"
            min="1"
            max="5"
            step="1"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 (慢)</span>
            <span>5 (快)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 处理控制 -->
    <div v-if="files.length > 0" class="glass-effect rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-lg font-semibold text-gray-900">开始处理</h4>
          <p class="text-sm text-gray-600">
            将使用 {{ selectedService ? getServiceInfo(selectedService)?.name : '未选择' }} 处理 {{ files.length }} 张图片
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <Button
            v-if="isProcessing"
            type="danger"
            @click="cancelBatch"
          >
            取消处理
          </Button>
          <Button
            :disabled="!selectedService || files.length === 0 || isProcessing"
            :loading="isProcessing"
            type="primary"
            @click="startBatchProcess"
          >
            {{ isProcessing ? '处理中...' : '开始批量处理' }}
          </Button>
        </div>
      </div>
      
      <!-- 处理进度 -->
      <div v-if="isProcessing || completedCount > 0" class="space-y-4">
        <!-- 总进度条 -->
        <div>
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>总进度</span>
            <span>{{ completedCount }} / {{ files.length }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              :style="{ width: `${overallProgress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-green-600">{{ successCount }}</div>
            <div class="text-sm text-gray-500">成功</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-600">{{ failedCount }}</div>
            <div class="text-sm text-gray-500">失败</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600">{{ processingCount }}</div>
            <div class="text-sm text-gray-500">处理中</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Button from '../ui/Button.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useNotification } from '../../composables/ui/useNotification.js'
import { SERVICE_CATEGORIES } from '../../services/nero-ai/index.ts'

// 文件卡片组件
const FileCard = {
  template: `
    <div 
      class="relative bg-white rounded-lg border border-gray-200 p-3 hover:border-pink-300 transition-all duration-200"
      :class="{ 'border-pink-400 bg-pink-50': isSelected }"
    >
      <!-- 选择复选框 -->
      <div class="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          :checked="isSelected"
          @change="$emit('select', index)"
          class="rounded border-gray-300 text-pink-600 shadow-sm"
        >
      </div>
      
      <!-- 删除按钮 -->
      <button
        @click="$emit('remove', index)"
        class="absolute top-2 right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
      >
        <svg class="w-3 h-3 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>
      
      <!-- 图片预览 -->
      <div class="w-full h-24 bg-gray-100 rounded-lg mb-2 overflow-hidden">
        <img
          :src="getImageUrl(file)"
          :alt="file.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        >
      </div>
      
      <!-- 文件信息 -->
      <div class="text-xs text-gray-600 mb-2">
        <div class="font-medium truncate" :title="file.name">{{ file.name }}</div>
        <div>{{ formatFileSize(file.size) }}</div>
      </div>
      
      <!-- 状态指示器 -->
      <div class="flex items-center justify-between">
        <StatusBadge :status="status" />
        <button
          v-if="status === 'completed' && result"
          @click="$emit('download', index)"
          class="text-blue-600 hover:text-blue-800 text-xs"
        >
          下载
        </button>
      </div>
    </div>
  `,
  props: ['file', 'index', 'isSelected', 'status', 'result'],
  emits: ['select', 'remove', 'download'],
  setup() {
    const getImageUrl = (file) => {
      return URL.createObjectURL(file)
    }
    
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }
    
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }
    
    return {
      getImageUrl,
      formatFileSize,
      handleImageError
    }
  }
}

// 状态标识组件
const StatusBadge = {
  template: `
    <span 
      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      :class="badgeClass"
    >
      <span :class="dotClass" class="w-2 h-2 rounded-full mr-1"></span>
      {{ statusText }}
    </span>
  `,
  props: ['status'],
  computed: {
    badgeClass() {
      const classes = {
        pending: 'bg-gray-100 text-gray-800',
        processing: 'bg-blue-100 text-blue-800', 
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[this.status] || classes.pending
    },
    dotClass() {
      const classes = {
        pending: 'bg-gray-400',
        processing: 'bg-blue-500 animate-pulse',
        completed: 'bg-green-500',
        failed: 'bg-red-500'
      }
      return classes[this.status] || classes.pending
    },
    statusText() {
      const texts = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成', 
        failed: '失败'
      }
      return texts[this.status] || '未知'
    }
  }
}

export default {
  name: 'BatchProcessor',
  components: {
    Button,
    FileCard,
    StatusBadge
  },
  
  setup() {
    const neroAI = useNeroAIServices()
    const { showSuccess, showError, showWarning } = useNotification()
    
    // 响应式数据
    const files = ref([])
    const selectedFiles = ref([])
    const selectedService = ref('')
    const concurrentLimit = ref(3)
    const isDragging = ref(false)
    const isProcessing = ref(false)
    const results = ref({})
    const fileStatuses = ref({})
    
    // 计算属性
    const serviceCapabilities = computed(() => neroAI.serviceCapabilities.value)
    
    const servicesByCategory = computed(() => {
      const categories = {}
      
      Object.entries(SERVICE_CATEGORIES).forEach(([key, category]) => {
        categories[key] = {
          ...category,
          services: Object.values(serviceCapabilities.value || {})
            .filter(service => service.category === key)
        }
      })
      
      return categories
    })
    
    const completedCount = computed(() => {
      return Object.values(fileStatuses.value).filter(status => 
        ['completed', 'failed'].includes(status)
      ).length
    })
    
    const successCount = computed(() => {
      return Object.values(fileStatuses.value).filter(status => 
        status === 'completed'
      ).length
    })
    
    const failedCount = computed(() => {
      return Object.values(fileStatuses.value).filter(status => 
        status === 'failed'
      ).length
    })
    
    const processingCount = computed(() => {
      return Object.values(fileStatuses.value).filter(status => 
        status === 'processing'
      ).length
    })
    
    const overallProgress = computed(() => {
      if (files.value.length === 0) return 0
      return Math.round((completedCount.value / files.value.length) * 100)
    })
    
    // 方法
    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files)
      addFiles(selectedFiles)
    }
    
    const handleDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      
      const droppedFiles = Array.from(event.dataTransfer.files)
      const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length !== droppedFiles.length) {
        showWarning('只能处理图片文件')
      }
      
      addFiles(imageFiles)
    }
    
    const handleDragOver = (event) => {
      event.preventDefault()
    }
    
    const handleDragEnter = (event) => {
      event.preventDefault()
      isDragging.value = true
    }
    
    const handleDragLeave = (event) => {
      event.preventDefault()
      if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragging.value = false
      }
    }
    
    const addFiles = (newFiles) => {
      const validFiles = newFiles.filter(file => {
        // 检查文件大小
        if (file.size > 50 * 1024 * 1024) {
          showWarning(`文件 ${file.name} 超过50MB限制`)
          return false
        }
        
        // 检查是否重复
        const isDuplicate = files.value.some(existingFile => 
          existingFile.name === file.name && existingFile.size === file.size
        )
        if (isDuplicate) {
          showWarning(`文件 ${file.name} 已存在`)
          return false
        }
        
        return true
      })
      
      files.value.push(...validFiles)
      
      if (validFiles.length > 0) {
        showSuccess(`已添加 ${validFiles.length} 个文件`)
      }
    }
    
    const removeFile = (index) => {
      // 清理对象URL
      const file = files.value[index]
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      
      files.value.splice(index, 1)
      selectedFiles.value = selectedFiles.value
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i)
      
      // 清理相关状态
      delete results.value[index]
      delete fileStatuses.value[index]
    }
    
    const clearAll = () => {
      // 清理所有对象URL
      files.value.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      
      files.value = []
      selectedFiles.value = []
      results.value = {}
      fileStatuses.value = {}
    }
    
    const toggleFileSelection = (index) => {
      const selectedIndex = selectedFiles.value.indexOf(index)
      if (selectedIndex > -1) {
        selectedFiles.value.splice(selectedIndex, 1)
      } else {
        selectedFiles.value.push(index)
      }
    }
    
    const toggleSelectAll = () => {
      if (selectedFiles.value.length === files.value.length) {
        selectedFiles.value = []
      } else {
        selectedFiles.value = files.value.map((_, index) => index)
      }
    }
    
    const removeSelected = () => {
      const indicesToRemove = [...selectedFiles.value].sort((a, b) => b - a)
      indicesToRemove.forEach(index => removeFile(index))
    }
    
    const getFileStatus = (index) => {
      return fileStatuses.value[index] || 'pending'
    }
    
    const getServiceInfo = (serviceType) => {
      return serviceCapabilities.value[serviceType]
    }
    
    const startBatchProcess = async () => {
      if (!selectedService.value || files.value.length === 0) return
      
      isProcessing.value = true
      
      // 重置状态
      results.value = {}
      fileStatuses.value = {}
      
      try {
        // 准备批量任务
        const tasks = files.value.map((file, index) => ({
          file,
          index,
          serviceType: selectedService.value
        }))
        
        showSuccess('开始批量处理...')
        
        // 使用并发限制处理任务
        await processBatchWithConcurrency(tasks, concurrentLimit.value)
        
        const successCount = Object.values(fileStatuses.value).filter(s => s === 'completed').length
        const failedCount = files.value.length - successCount
        
        if (failedCount === 0) {
          showSuccess(`批量处理完成！成功处理 ${successCount} 张图片`)
        } else {
          showWarning(`批量处理完成！成功 ${successCount} 张，失败 ${failedCount} 张`)
        }
        
      } catch (error) {
        console.error('批量处理失败:', error)
        showError('批量处理失败')
      } finally {
        isProcessing.value = false
      }
    }
    
    const processBatchWithConcurrency = async (tasks, concurrency) => {
      for (let i = 0; i < tasks.length; i += concurrency) {
        const batch = tasks.slice(i, i + concurrency)
        
        const batchPromises = batch.map(task => processFile(task))
        await Promise.allSettled(batchPromises)
      }
    }
    
    const processFile = async (task) => {
      const { file, index, serviceType } = task
      
      fileStatuses.value[index] = 'processing'
      
      try {
        const result = await neroAI.processImage(
          serviceType,
          file,
          {},
          (processedResult) => {
            results.value[index] = processedResult
            fileStatuses.value[index] = 'completed'
          },
          (error) => {
            console.error(`文件 ${file.name} 处理失败:`, error)
            fileStatuses.value[index] = 'failed'
          }
        )
        
        if (!result) {
          fileStatuses.value[index] = 'failed'
        }
        
      } catch (error) {
        console.error(`文件 ${file.name} 处理失败:`, error)
        fileStatuses.value[index] = 'failed'
      }
    }
    
    const cancelBatch = async () => {
      isProcessing.value = false
      // 这里可以添加取消逻辑
      showWarning('批量处理已取消')
    }
    
    const downloadResult = (index) => {
      const result = results.value[index]
      if (result && neroAI.downloadResult) {
        neroAI.downloadResult(result, files.value[index].name)
      }
    }
    
    return {
      files,
      selectedFiles,
      selectedService,
      concurrentLimit,
      isDragging,
      isProcessing,
      results,
      servicesByCategory,
      completedCount,
      successCount,
      failedCount,
      processingCount,
      overallProgress,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragEnter,
      handleDragLeave,
      removeFile,
      clearAll,
      toggleFileSelection,
      toggleSelectAll,
      removeSelected,
      getFileStatus,
      getServiceInfo,
      startBatchProcess,
      cancelBatch,
      downloadResult
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #ec4899;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
}

.slider::-webkit-slider-track {
  height: 8px;
  cursor: pointer;
  background: #ddd;
  border-radius: 4px;
}
</style>
