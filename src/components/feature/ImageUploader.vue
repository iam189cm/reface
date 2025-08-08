<template>
  <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-pink-100">
    <div 
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="border-2 border-dashed border-pink-300 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-pink-400 hover:bg-pink-50/50"
      :class="{ 'border-pink-400 bg-pink-50/50': isDragging }"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
    >
      <div class="flex flex-col items-center space-y-4">
        <!-- 上传图标 -->
        <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center relative">
          <Loading v-if="isUploading" size="medium" color="white" />
          <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <!-- 上传文本 -->
        <div>
          <p class="text-lg font-semibold text-gray-700 mb-2">
            {{ uploadText }}
          </p>
          <p class="text-sm text-gray-500">
            支持 JPG、PNG、WebP 格式，最大 10MB
          </p>
        </div>
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInput"
      type="file" 
      accept="image/*" 
      @change="handleFileSelect"
      class="hidden"
    >
  </div>
</template>

<script>
import { computed } from 'vue'
import Loading from '../ui/Loading.vue'
import { useImageUpload } from '../../composables/useImageUpload.js'

export default {
  name: 'ImageUploader',
  components: {
    Loading
  },
  setup() {
    const {
      fileInput,
      isDragging,
      isUploading,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragEnter,
      handleDragLeave
    } = useImageUpload()
    
    // 上传文本
    const uploadText = computed(() => {
      if (isUploading.value) {
        return '正在上传...'
      }
      return '点击上传或拖拽图片到这里'
    })
    
    return {
      fileInput,
      isDragging,
      isUploading,
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
