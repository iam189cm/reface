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
    <ImageUploader />

    <!-- 图片预览区域 -->
    <ImagePreview v-if="hasImage" />

    <!-- 功能特色展示 -->
    <FeatureShowcase v-if="!hasImage" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import ImageUploader from '../components/feature/ImageUploader.vue'
import ImagePreview from '../components/feature/ImagePreview.vue'
import FeatureShowcase from '../components/feature/FeatureShowcase.vue'
import { useImageStore } from '../stores/imageStore.js'
import { useTrialManager } from '../composables/useTrialManager.js'

export default {
  name: 'Home',
  components: {
    ImageUploader,
    ImagePreview,
    FeatureShowcase
  },
  setup() {
    const imageStore = useImageStore()
    const { initializeTrials } = useTrialManager()
    
    // 计算属性
    const hasImage = computed(() => imageStore.hasImage)
    
    // 组件挂载时初始化
    onMounted(() => {
      // 初始化试用管理
      initializeTrials()
      
      console.log('Home 页面已加载')
    })
    
    return {
      hasImage
    }
  }
}
</script>
