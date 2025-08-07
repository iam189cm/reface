<template>
  <div class="max-w-4xl mx-auto">
    <!-- 标题区域 -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        让你的照片更美丽
      </h2>
      <p class="text-gray-600 text-lg">
        简单几步，轻松美化你的照片
      </p>
    </div>

    <!-- 上传区域 -->
    <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-8 border border-pink-100">
      <div 
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-pink-300 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-pink-400 hover:bg-pink-50/50"
        :class="{ 'border-pink-400 bg-pink-50/50': isDragging }"
        @dragenter="isDragging = true"
        @dragleave="isDragging = false"
      >
        <div class="flex flex-col items-center space-y-4">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-700 mb-2">
              点击上传或拖拽图片到这里
            </p>
            <p class="text-sm text-gray-500">
              支持 JPG、PNG、WebP 格式，最大 10MB
            </p>
          </div>
        </div>
      </div>
      
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        @change="handleFileSelect"
        class="hidden"
      >
    </div>

    <!-- 图片预览区域 -->
    <div v-if="selectedImage" class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-pink-100">
      <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">图片预览</h3>
      
      <div class="flex flex-col lg:flex-row gap-8 items-center">
        <!-- 预览图片 -->
        <div class="flex-1 max-w-md">
          <div class="bg-gray-100 rounded-2xl p-4 shadow-inner">
            <img 
              :src="selectedImage.url" 
              :alt="selectedImage.name"
              class="w-full h-auto rounded-xl shadow-lg"
            >
          </div>
          <p class="text-sm text-gray-600 mt-3 text-center">{{ selectedImage.name }}</p>
        </div>
        
        <!-- 图片信息和操作 -->
        <div class="flex-1 space-y-6">
          <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <h4 class="font-semibold text-gray-800 mb-4">图片信息</h4>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>文件大小：</span>
                <span>{{ formatFileSize(selectedImage.size) }}</span>
              </div>
              <div class="flex justify-between">
                <span>图片类型：</span>
                <span>{{ selectedImage.type }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="startEditing"
              class="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              开始编辑
            </button>
            <button
              @click="clearImage"
              class="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              重新选择
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能特色展示 -->
    <div v-if="!selectedImage" class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center border border-pink-100 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">智能磨皮</h3>
        <p class="text-sm text-gray-600">自然磨皮，保持肌理细节</p>
      </div>
      
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center border border-pink-100 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">亮度调节</h3>
        <p class="text-sm text-gray-600">精准调节图片亮度对比度</p>
      </div>
      
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center border border-pink-100 hover:shadow-lg transition-all duration-300">
        <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
          </svg>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">一键美白</h3>
        <p class="text-sm text-gray-600">自然美白，提升肌肤光泽</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const fileInput = ref(null)
    const selectedImage = ref(null)
    const isDragging = ref(false)

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        processFile(file)
      }
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const files = event.dataTransfer.files
      if (files.length > 0) {
        processFile(files[0])
      }
    }

    const processFile = (file) => {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过10MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImage.value = {
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type
        }
      }
      reader.readAsDataURL(file)
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const startEditing = () => {
      // 将图片信息存储到 sessionStorage 以便在编辑页面使用
      sessionStorage.setItem('selectedImage', JSON.stringify({
        url: selectedImage.value.url,
        name: selectedImage.value.name,
        size: selectedImage.value.size,
        type: selectedImage.value.type
      }))
      router.push('/editor')
    }

    const clearImage = () => {
      selectedImage.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    return {
      fileInput,
      selectedImage,
      isDragging,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      formatFileSize,
      startEditing,
      clearImage
    }
  }
}
</script>