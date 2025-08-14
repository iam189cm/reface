<template>
  <div class="max-w-2xl mx-auto">
    <div class="glass-effect rounded-3xl p-8 text-center">
      <div 
        id="upload-area"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-pink-300 rounded-2xl p-12 hover:border-pink-400 transition-all duration-200 cursor-pointer group"
        :class="{ 
          'border-pink-400 bg-pink-50 scale-105': isDragging,
          'border-red-400 bg-red-50': hasError
        }"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- 上传图标 -->
        <div 
          class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
          :class="{ 'animate-pulse': isUploading }"
        >
          <Loading v-if="isUploading" size="medium" color="white" />
          <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>

        <!-- 上传文本 -->
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ uploadText }}</h3>
        <p class="text-gray-600 mb-2">支持 JPG、PNG、WebP 格式，最大 10MB</p>
        <p class="text-sm text-gray-500 mb-4">图片将在处理完成后自动删除，保护您的隐私</p>
        
        <!-- 上传按钮 -->
        <button 
          class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105"
          :disabled="isUploading"
        >
          {{ isUploading ? '上传中...' : '选择图片' }}
        </button>
      </div>
      
      <!-- 文件验证提示区域 -->
      <div v-if="isUploading" class="mt-4 text-sm">
        <div class="flex items-center justify-center space-x-2">
          <div class="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-600">正在验证文件...</span>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="hasError && errorMessage" class="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
        {{ errorMessage }}
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput"
      type="file" 
      accept=".jpg,.jpeg,.png,.webp" 
      @change="handleFileSelect"
      class="hidden"
    >
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import Loading from '../ui/Loading.vue'
import { useImageUpload } from '../../composables/useImageUpload.js'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ImageUploader',
  components: {
    Loading
  },
  setup() {
    const { t } = useI18n()
    const hasError = ref(false)
    const errorMessage = ref('')
    
    const {
      fileInput,
      isDragging,
      isUploading,
      triggerFileInput,
      handleFileSelect: originalHandleFileSelect,
      handleDrop: originalHandleDrop,
      handleDragEnter,
      handleDragLeave
    } = useImageUpload()
    
    // 文件验证函数
    const validateFile = (file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      const maxSize = 10 * 1024 * 1024 // 10MB
      
      if (!validTypes.includes(file.type)) {
        return '请选择 JPG、PNG 或 WebP 格式的图片'
      }
      
      if (file.size > maxSize) {
        return '文件大小不能超过 10MB'
      }
      
      return null
    }
    
    // 增强的文件处理
    const handleFileSelect = (event) => {
      clearError()
      const files = event.target.files
      if (files.length > 0) {
        const error = validateFile(files[0])
        if (error) {
          showError(error)
          return
        }
      }
      originalHandleFileSelect(event)
    }
    
    const handleDrop = (event) => {
      clearError()
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const error = validateFile(files[0])
        if (error) {
          showError(error)
          return
        }
      }
      originalHandleDrop(event)
    }
    
    const showError = (message) => {
      hasError.value = true
      errorMessage.value = message
      setTimeout(() => {
        clearError()
      }, 5000)
    }
    
    const clearError = () => {
      hasError.value = false
      errorMessage.value = ''
    }
    
    // 上传文本
    const uploadText = computed(() => {
      if (isUploading.value) {
        return '正在处理...'
      }
      if (hasError.value) {
        return '文件验证失败'
      }
      return '拖拽或点击上传图片'
    })
    
    // 监听上传状态，清除错误
    watch(isUploading, (newValue) => {
      if (newValue) {
        clearError()
      }
    })
    
    return {
      fileInput,
      isDragging,
      isUploading,
      hasError,
      errorMessage,
      uploadText,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragEnter,
      handleDragLeave
    }
  }
}
</script>
