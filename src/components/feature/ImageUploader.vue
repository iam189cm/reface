<template>
  <div class="max-w-2xl mx-auto mobile-padding">
    <div class="glass-effect rounded-3xl p-4 md:p-8 text-center">
      <div 
        id="upload-area"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-pink-300 rounded-2xl p-6 md:p-12 hover:border-pink-400 transition-all duration-200 cursor-pointer group touch-feedback mobile-upload-area"
        :class="{ 
          'border-pink-400 bg-pink-50 scale-105': isDragging,
          'border-red-400 bg-red-50': hasError
        }"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- 上传图标 -->
        <div 
          class="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
          :class="{ 'animate-pulse': isUploading }"
        >
          <Loading v-if="isUploading" size="medium" color="white" />
          <svg v-else class="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>

        <!-- 上传文本 -->
        <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2 mobile-title">{{ uploadText }}</h3>
        <p class="text-sm md:text-base text-gray-600 mb-2 mobile-text-base">支持 JPG、PNG、WebP 格式，最大 10MB</p>
        <p class="text-xs md:text-sm text-gray-500 mb-4 mobile-text-sm">图片将在处理完成后自动删除，保护您的隐私</p>
        
        <!-- 移动端按钮组 -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            @click.stop="triggerFileInput"
            class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105 mobile-button touch-feedback"
            :disabled="isUploading"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            {{ isUploading ? '上传中...' : '选择图片' }}
          </button>
          
          <!-- 移动端拍照按钮 -->
          <button 
            v-if="isMobile"
            @click.stop="triggerCameraInput"
            class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105 mobile-button touch-feedback"
            :disabled="isUploading"
          >
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            拍照上传
          </button>
        </div>

        <!-- 移动端快速操作提示 -->
        <div v-if="isMobile" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500">点击上方按钮选择图片或直接拍照</p>
        </div>
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
    
    <!-- 隐藏的相机输入 -->
    <input 
      ref="cameraInput"
      type="file" 
      accept="image/*"
      capture="environment"
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
    const cameraInput = ref(null)
    const isTouching = ref(false)
    
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
    
    // 移动端检测
    const isMobile = computed(() => {
      if (typeof window === 'undefined') return false
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             window.innerWidth <= 768
    })
    
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
    
    // 拍照功能
    const triggerCameraInput = () => {
      if (cameraInput.value) {
        cameraInput.value.click()
      }
    }
    
    // 触摸反馈
    const handleTouchStart = () => {
      if (isMobile.value) {
        isTouching.value = true
      }
    }
    
    const handleTouchEnd = () => {
      if (isMobile.value) {
        isTouching.value = false
      }
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
      cameraInput,
      isDragging,
      isUploading,
      hasError,
      errorMessage,
      uploadText,
      isMobile,
      isTouching,
      triggerFileInput,
      triggerCameraInput,
      handleFileSelect,
      handleDrop,
      handleDragEnter,
      handleDragLeave,
      handleTouchStart,
      handleTouchEnd
    }
  }
}
</script>
