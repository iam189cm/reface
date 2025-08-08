<template>
  <div class="max-w-7xl mx-auto">
    <!-- 如果没有图片，显示提示 -->
    <EmptyImagePrompt v-if="!hasImage" />

    <!-- 编辑界面 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 图片预览区域 -->
      <div class="lg:col-span-2">
        <ImageCanvas 
          @ai-result="handleAiResult"
          @ai-error="handleAiError"
        />
      </div>

      <!-- 控制面板 -->
      <div class="space-y-6">
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

        <!-- 滤镜控制面板 -->
        <FilterControlPanel />
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
import FilterControlPanel from '../components/feature/FilterControlPanel.vue'
import { useImageEditor } from '../composables/useImageEditor.js'

export default {
  name: 'Editor',
  components: {
    EmptyImagePrompt,
    ImageCanvas,
    AIImageEnlarger,
    AIBackgroundRemover,
    FilterControlPanel
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
