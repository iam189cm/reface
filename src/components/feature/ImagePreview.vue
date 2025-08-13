<template>
  <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-pink-100">
    <h3 class="text-xl font-semibold text-gray-800 mb-6 text-center">图片预览</h3>
    
    <div class="flex flex-col lg:flex-row gap-8 items-center">
      <!-- 预览图片 -->
      <div class="flex-1 max-w-md">
        <div class="bg-gray-100 rounded-2xl p-4 shadow-inner">
          <img 
            :src="imageUrl" 
            :alt="imageName"
            class="w-full h-auto rounded-xl shadow-lg"
            @load="onImageLoad"
            @error="onImageError"
          >
        </div>
        <p class="text-sm text-gray-600 mt-3 text-center">{{ imageName }}</p>
      </div>
      
      <!-- 图片信息和操作 -->
      <div class="flex-1 space-y-6">
        <!-- 图片信息 -->
        <ImageInfo 
          :size="imageSize"
          :type="imageType"
          :formatted-size="formattedSize"
        />
        
        <!-- 操作按钮 -->
        <div class="flex flex-col sm:flex-row gap-4">
          <Button
            type="primary"
            block
            @click="startEditing"
          >
            开始编辑
          </Button>
          <Button
            type="secondary"
            block
            @click="clearImage"
          >
            重新选择
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../ui/Button.vue'
import { useImageStore } from '../../stores/imageStore.js'
import { useImageUpload } from '../../composables/useImageUpload.js'
import { useNotification } from '../../composables/ui/useNotification.js'

// 图片信息组件
const ImageInfo = {
  props: {
    size: Number,
    type: String,
    formattedSize: String
  },
  template: `
    <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
      <h4 class="font-semibold text-gray-800 mb-4">图片信息</h4>
      <div class="space-y-2 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>文件大小：</span>
          <span>{{ formattedSize }}</span>
        </div>
        <div class="flex justify-between">
          <span>图片类型：</span>
          <span>{{ type }}</span>
        </div>
      </div>
    </div>
  `
}

export default {
  name: 'ImagePreview',
  components: {
    Button,
    ImageInfo
  },
  setup() {
    const router = useRouter()
    const imageStore = useImageStore()
    const { clearImage, formatFileSize } = useImageUpload()
    const { showError, showNotification } = useNotification()
    
    // 计算属性
    const imageUrl = computed(() => imageStore.imageUrl)
    const imageName = computed(() => imageStore.imageMetadata.name)
    const imageSize = computed(() => imageStore.imageMetadata.size)
    const imageType = computed(() => imageStore.imageMetadata.type)
    const formattedSize = computed(() => imageStore.formattedFileSize)
    
    // 开始编辑
    const startEditing = () => {
      if (!imageStore.hasImage) {
        showError('请先选择图片')
        return
      }

      console.log('开始编辑，图片数据:', imageStore.currentImage)
      
      // 验证图片数据完整性
      if (!imageStore.imageUrl) {
        showError('图片数据不完整，请重新上传')
        return
      }
      
      // 保存到 session（确保数据持久化）
      imageStore.saveToSession()
      
      console.log('数据已保存，跳转到编辑页面')
      
      // 小延迟确保数据存储完成
      setTimeout(() => {
        router.push('/editor')
      }, 100)
    }
    
    // 图片加载成功
    const onImageLoad = () => {
      console.log('图片预览加载成功')
    }
    
    // 图片加载失败
    const onImageError = () => {
      console.error('图片预览加载失败')
      showError('图片预览加载失败')
    }
    
    return {
      imageUrl,
      imageName,
      imageSize,
      imageType,
      formattedSize,
      startEditing,
      clearImage,
      onImageLoad,
      onImageError
    }
  }
}
</script>
