<template>
  <div class="max-w-7xl mx-auto">
    <!-- 如果没有图片，显示提示 -->
    <div v-if="!imageData" class="text-center py-20">
      <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-12 border border-pink-100">
        <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">还没有选择图片</h2>
        <p class="text-gray-600 mb-6">请先回到首页上传一张图片</p>
        <router-link 
          to="/" 
          class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          返回首页
        </router-link>
      </div>
    </div>

    <!-- 编辑界面 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 图片预览区域 -->
      <div class="lg:col-span-2">
        <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-pink-100 h-fit">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">图片预览</h2>
            <div class="flex space-x-2">
              <button
                @click="resetAll"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm"
              >
                重置
              </button>
              <button
                @click="downloadImage"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
              >
                下载图片
              </button>
            </div>
          </div>
          
          <!-- Canvas 区域 -->
          <div class="bg-gray-100 rounded-2xl p-4 shadow-inner">
            <div class="relative bg-white rounded-xl shadow-lg overflow-hidden min-h-[300px] flex items-center justify-center">
              <!-- Canvas 渲染区 (主要显示区域) -->
              <canvas 
                ref="canvas"
                v-show="originalImage && !isImageLoading"
                class="max-w-full h-auto block mx-auto"
                :style="canvasStyle"
              ></canvas>
              
              <!-- 图片预览 (用于加载和错误处理) -->
              <img 
                v-if="imageData && imageData.url"
                :src="getImageUrl()"
                alt="图片预览"
                class="max-w-full max-h-[400px] object-contain rounded-lg"
                :class="{ 'opacity-0 absolute': originalImage && !isImageLoading }"
                @load="onImageLoad"
                @error="onImageError"
                style="z-index: -1;"
              >
              
              <!-- 加载状态 -->
              <div v-if="!imageData || isImageLoading" class="text-center text-gray-500">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                <p class="text-sm">{{ !imageData ? '加载图片中...' : '处理图片中...' }}</p>
              </div>
              
              <!-- 图片加载错误 -->
              <div v-if="imageData && !originalImage && !isImageLoading" class="text-center text-gray-500">
                <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p class="text-sm">图片加载失败</p>
                <p class="text-xs text-gray-400 mt-1">请检查网络连接或重新上传</p>
              </div>
              
              <!-- 处理状态覆盖层 -->
              <div v-if="isProcessing" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div class="bg-white rounded-lg p-4 shadow-lg">
                  <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
                    <span class="text-sm text-gray-600">处理中...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4 text-sm text-gray-600 text-center">
            {{ imageData.name }} ({{ formatFileSize(imageData.size) }})
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="space-y-6">
        <!-- AI 背景移除 -->
        <BackgroundRemover
          :imageFile="originalImageFile"
          @result="handleAiResult"
          @error="handleAiError"
        />

        <!-- 磨皮控制 -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-3 h-3 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            磨皮
          </h3>
          <SliderControl
            v-model="adjustments.smoothing"
            :min="0"
            :max="100"
            label="磨皮强度"
            unit="%"
            color="pink"
            @update:model-value="applyAdjustments"
          />
        </div>

        <!-- 美白控制 -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
            </div>
            美白
          </h3>
          <SliderControl
            v-model="adjustments.whitening"
            :min="0"
            :max="100"
            label="美白强度"
            unit="%"
            color="purple"
            @update:model-value="applyAdjustments"
          />
        </div>

        <!-- 亮度控制 -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
            </div>
            亮度
          </h3>
          <SliderControl
            v-model="adjustments.brightness"
            :min="-50"
            :max="50"
            label="亮度调节"
            unit=""
            color="yellow"
            @update:model-value="applyAdjustments"
          />
        </div>

        <!-- 对比度控制 -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            对比度
          </h3>
          <SliderControl
            v-model="adjustments.contrast"
            :min="-50"
            :max="50"
            label="对比度调节"
            unit=""
            color="indigo"
            @update:model-value="applyAdjustments"
          />
        </div>

        <!-- 饱和度控制 -->
        <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
            </div>
            饱和度
          </h3>
          <SliderControl
            v-model="adjustments.saturation"
            :min="-50"
            :max="50"
            label="饱和度调节"
            unit=""
            color="green"
            @update:model-value="applyAdjustments"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive, computed } from 'vue'
import SliderControl from '../components/SliderControl.vue'
import BackgroundRemover from '../components/BackgroundRemover.vue'

export default {
  name: 'Editor',
  components: {
    SliderControl,
    BackgroundRemover
  },
  setup() {
    const canvas = ref(null)
    const imageData = ref(null)
    const originalImage = ref(null)
    const originalImageFile = ref(null)
    const isProcessing = ref(false)
    const isImageLoading = ref(true)

    const adjustments = reactive({
      smoothing: 0,
      whitening: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0
    })

    const canvasStyle = computed(() => ({
      filter: `brightness(${100 + adjustments.brightness}%) contrast(${100 + adjustments.contrast}%) saturate(${100 + adjustments.saturation}%)`
    }))

    onMounted(() => {
      console.log('编辑页面已挂载')
      
      // 从 sessionStorage 获取图片数据
      const storedImageData = sessionStorage.getItem('selectedImage')
      console.log('从 sessionStorage 获取的数据:', storedImageData)
      
      if (storedImageData) {
        try {
          imageData.value = JSON.parse(storedImageData)
          console.log('解析后的图片数据:', imageData.value)
          loadImageToCanvas()
        } catch (error) {
          console.error('解析图片数据失败:', error)
          showNotification('图片数据解析失败', 'error')
        }
      } else {
        console.error('没有找到图片数据')
        showNotification('没有找到图片数据，请重新上传', 'error')
      }
      
      // 获取原始文件（用于 AI 处理）
      if (window.originalImageFile) {
        originalImageFile.value = window.originalImageFile
        console.log('原始文件已获取:', originalImageFile.value)
      } else {
        console.warn('没有找到原始文件')
      }
    })

    const loadImageToCanvas = () => {
      // 现在图片加载由 <img> 元素和 onImageLoad 处理
      // 这个函数保留用于兼容性，但主要逻辑已移至 onImageLoad
      console.log('loadImageToCanvas 被调用，图片数据:', imageData.value)
      
      if (imageData.value) {
        isImageLoading.value = true
      }
    }

    const applyAdjustments = () => {
      if (!originalImage.value || !canvas.value) return
      
      isProcessing.value = true
      
      // 模拟处理延迟
      setTimeout(() => {
        const ctx = canvas.value.getContext('2d')
        const { width, height } = canvas.value
        
        // 清空画布
        ctx.clearRect(0, 0, width, height)
        
        // 重新绘制原始图片
        ctx.drawImage(originalImage.value, 0, 0, width, height)
        
        // 这里可以添加实际的图像处理逻辑
        // 目前只是通过 CSS filter 来模拟效果
        
        isProcessing.value = false
      }, 300)
    }

    const resetAll = () => {
      adjustments.smoothing = 0
      adjustments.whitening = 0
      adjustments.brightness = 0
      adjustments.contrast = 0
      adjustments.saturation = 0
      applyAdjustments()
    }

    const downloadImage = () => {
      if (!canvas.value) return
      
      // 创建一个临时链接进行下载
      const link = document.createElement('a')
      link.download = `edited_${imageData.value.name}`
      link.href = canvas.value.toDataURL()
      link.click()
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleAiResult = (result) => {
      // 处理 AI 功能结果
      if (result.type === 'background-removal') {
        // 将处理后的图片显示到 canvas 上
        const img = new Image()
        img.onload = () => {
          const ctx = canvas.value.getContext('2d')
          const { width, height } = canvas.value
          
          // 清空画布
          ctx.clearRect(0, 0, width, height)
          
          // 绘制处理后的图片
          ctx.drawImage(img, 0, 0, width, height)
        }
        img.src = URL.createObjectURL(result.processedBlob)
        
        // 显示成功提示
        showNotification('背景移除成功！', 'success')
      }
    }

    const handleAiError = (error) => {
      console.error('AI 处理错误:', error)
      showNotification(error.message || 'AI 处理失败', 'error')
    }

    const showNotification = (message, type = 'info') => {
      // 简单的通知实现，可以后续优化
      const notification = document.createElement('div')
      notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      }`
      notification.textContent = message
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    }

    const getImageUrl = () => {
      if (!imageData.value) {
        console.log('getImageUrl: 没有图片数据')
        return ''
      }
      
      console.log('getImageUrl: 图片数据详情', {
        ossUrl: imageData.value.ossUrl,
        url: imageData.value.url,
        name: imageData.value.name
      })
      
      // 优先使用 OSS URL，降级到本地 URL
      if (imageData.value.ossUrl) {
        console.log('使用 OSS URL:', imageData.value.ossUrl)
        return imageData.value.ossUrl
      } else if (imageData.value.url) {
        console.log('使用本地 URL:', imageData.value.url)
        return imageData.value.url
      }
      
      console.warn('getImageUrl: 没有可用的图片 URL')
      return ''
    }

    const onImageLoad = (event) => {
      console.log('图片加载成功:', event.target.src)
      isImageLoading.value = false
      
      // 图片加载成功后，将其绘制到 Canvas
      const img = event.target
      originalImage.value = img
      
      if (canvas.value) {
        const ctx = canvas.value.getContext('2d')
        
        // 等待图片完全加载
        if (img.complete && img.naturalWidth > 0) {
          drawImageToCanvas(img, ctx)
        } else {
          // 如果图片还没完全加载，等待一下再绘制
          setTimeout(() => {
            if (img.complete && img.naturalWidth > 0) {
              drawImageToCanvas(img, ctx)
            } else {
              console.error('图片加载失败，无法获取尺寸')
              showNotification('图片加载失败', 'error')
            }
          }, 100)
        }
      }
    }

    const drawImageToCanvas = (img, ctx) => {
      // 设置 canvas 尺寸
      const maxWidth = 600
      const maxHeight = 400
      let { naturalWidth: width, naturalHeight: height } = img
      
      if (width === 0 || height === 0) {
        console.error('图片尺寸无效:', width, 'x', height)
        return
      }
      
      // 计算适合的尺寸
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.value.width = width
      canvas.value.height = height
      
      // 清空画布并绘制图片
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      console.log('图片已绘制到 Canvas:', width, 'x', height)
    }

    const onImageError = (event) => {
      console.error('图片加载失败:', event.target.src)
      isImageLoading.value = false
      showNotification('图片加载失败，请重试', 'error')
    }

    return {
      canvas,
      imageData,
      originalImageFile,
      originalImage,
      adjustments,
      canvasStyle,
      isProcessing,
      isImageLoading,
      applyAdjustments,
      resetAll,
      downloadImage,
      formatFileSize,
      handleAiResult,
      handleAiError,
      getImageUrl,
      onImageLoad,
      onImageError,
      drawImageToCanvas
    }
  }
}
</script>