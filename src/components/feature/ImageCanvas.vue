<template>
  <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-pink-100 h-fit">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">
        图片预览
      </h2>
      <ActionToolbar 
        :can-undo="canUndo"
        :can-redo="canRedo"
        @reset="resetAll"
        @download="downloadImage"
        @undo="undo"
        @redo="redo"
      />
    </div>
    
    <!-- Canvas 区域 -->
    <div class="bg-gray-100 rounded-2xl p-4 shadow-inner">
      <div class="relative bg-white rounded-xl shadow-lg overflow-hidden min-h-[300px] flex items-center justify-center">
        <!-- Canvas 渲染区 (主要显示区域) -->
        <canvas 
          v-show="originalImage && !isImageLoading"
          ref="canvas"
          class="max-w-full h-auto block mx-auto"
          :style="canvasStyle"
        />
        
        <!-- 图片预览 (用于加载和错误处理) -->
        <img 
          v-if="imageData && imageData.url"
          :src="getImageUrl()"
          alt="图片预览"
          class="max-w-full max-h-[400px] object-contain rounded-lg"
          :class="{ 'opacity-0 absolute': originalImage && !isImageLoading }"
          style="z-index: -1;"
          @load="onImageLoad"
          @error="onImageError"
        >
        
        <!-- 加载状态 -->
        <Loading 
          v-if="!imageData || isImageLoading" 
          :message="!imageData ? '加载图片中...' : '处理图片中...'"
        />
        
        <!-- 图片加载错误 -->
        <div
          v-if="imageData && !originalImage && !isImageLoading"
          class="text-center text-gray-500"
        >
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              class="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p class="text-sm">
            图片加载失败
          </p>
          <p class="text-xs text-gray-400 mt-1">
            请检查网络连接或重新上传
          </p>
        </div>
        
        <!-- 处理状态覆盖层 -->
        <div
          v-if="isProcessing"
          class="absolute inset-0 bg-black/20 flex items-center justify-center"
        >
          <div class="bg-white rounded-lg p-4 shadow-lg">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500" />
              <span class="text-sm text-gray-600">处理中...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 text-sm text-gray-600 text-center">
      {{ imageData?.name }} ({{ formatFileSize(imageData?.size) }})
    </div>
  </div>
</template>

<script>
import { onMounted, nextTick } from 'vue'
import Loading from '../ui/Loading.vue'
import ActionToolbar from './ActionToolbar.vue'
import { useImageEditor } from '../../composables/useImageEditor.js'

export default {
  name: 'ImageCanvas',
  components: {
    Loading,
    ActionToolbar
  },
  emits: ['ai-result', 'ai-error'],
  setup(props, { emit }) {
    const {
      canvas,
      originalImage,
      imageData,
      canvasStyle,
      isImageLoading,
      isProcessing,
      canUndo,
      canRedo,
      getImageUrl,
      onImageLoad,
      onImageError,
      formatFileSize,
      resetAll,
      downloadImage,
      undo,
      redo,
      handleAiResult,
      handleAiError
    } = useImageEditor()
    
    // 将AI事件转发给父组件
    const forwardAiResult = (result) => {
      handleAiResult(result)
      emit('ai-result', result)
    }
    
    const forwardAiError = (error) => {
      handleAiError(error)
      emit('ai-error', error)
    }
    
    return {
      canvas,
      originalImage,
      imageData,
      canvasStyle,
      isImageLoading,
      isProcessing,
      canUndo,
      canRedo,
      getImageUrl,
      onImageLoad,
      onImageError,
      formatFileSize,
      resetAll,
      downloadImage,
      undo,
      redo,
      handleAiResult: forwardAiResult,
      handleAiError: forwardAiError
    }
  }
}
</script>
