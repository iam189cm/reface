<template>
  <div class="max-w-7xl mx-auto">
    <!-- 如果没有图片，显示提示 -->
    <EmptyImagePrompt v-if="!hasImage" />

    <!-- 编辑界面 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <!-- 图片预览区域 - 居中 -->
      <div class="col-span-1 md:col-span-1 lg:col-span-2 lg:order-1 order-1">
        <ImageCanvas 
          @ai-result="handleAiResult"
          @ai-error="handleAiError"
        />
      </div>

      <!-- AI功能控制面板 - 右侧 -->
      <div class="col-span-1 md:col-span-1 lg:col-span-1 lg:order-2 order-2 md:order-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            AI 功能
          </h3>
          <div class="space-y-4">
            <!-- AI 图像放大器 -->
            <AIImageEnlarger
              :image-file="originalImageFile"
              @result="handleAiResult"
              @error="handleAiError"
            />

            <!-- AI 背景移除 -->
            <AIBackgroundRemover
              :image-file="originalImageFile"
              @result="handleAiResult"
              @error="handleAiError"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import EmptyImagePrompt from '../components/feature/EmptyImagePrompt.vue'
import ImageCanvas from '../components/feature/ImageCanvas.vue'
import AIImageEnlarger from '../components/feature/AIImageEnlarger.vue'
import AIBackgroundRemover from '../components/feature/AIBackgroundRemover.vue'
import { useImageEditor } from '../composables/useImageEditor.js'

export default {
  name: 'Editor',
  components: {
    EmptyImagePrompt,
    ImageCanvas,
    AIImageEnlarger,
    AIBackgroundRemover
  },
  setup() {
    const {
      imageData,
      originalImageFile,
      initializeEditor,
      handleAiResult,
      handleAiError
    } = useImageEditor()
    
    // 计算属性
    const hasImage = computed(() => !!imageData.value)
    
    // 组件挂载时初始化编辑器
    onMounted(async () => {
      const success = await initializeEditor()
      if (success) {
        console.log('编辑器初始化成功')
      } else {
        console.log('编辑器初始化失败，可能没有图片数据')
      }
    })
    
    return {
      hasImage,
      originalImageFile,
      handleAiResult,
      handleAiError
    }
  }
}
</script>
