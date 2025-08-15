<template>
  <div class="max-w-7xl mx-auto">
    <!-- 如果没有图片，显示提示 -->
    <EmptyImagePrompt v-if="!hasImage" />

    <!-- 编辑界面 -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
    >
      <!-- 图片预览区域 - 居中 -->
      <div class="col-span-1 md:col-span-1 lg:col-span-2 lg:order-1 order-1">
        <ImageCanvas 
          @ai-result="handleAiResult"
          @ai-error="handleAiError"
        />
      </div>

      <!-- AI功能控制面板 - 右侧 -->
      <div class="col-span-1 md:col-span-1 lg:col-span-1 lg:order-2 order-2 md:order-2 space-y-6">
        <!-- AI功能选择器 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 class="text-base font-semibold text-gray-800 mb-4 flex items-center">
            <svg
              class="w-5 h-5 mr-2 text-pink-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            选择AI功能
          </h3>
          
          <!-- AI服务选择器 -->
          <AIServiceSelector
            :image-file="originalImageFile"
            :pre-selected-service="selectedService"
            @service-selected="handleServiceSelected"
            @service-cleared="handleServiceCleared"
          />
        </div>

        <!-- AI参数调节面板 -->
        <div
          v-if="selectedService"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <AIParameterPanel
            :service-type="selectedService"
            :initial-parameters="serviceParameters"
            @parameters-changed="handleParametersChanged"
            @preset-applied="handlePresetApplied"
          />
        </div>

        <!-- 动态AI功能组件 -->
        <div
          v-if="selectedService"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
        >
          <component
            :is="currentServiceComponent"
            :image-file="originalImageFile"
            :service-parameters="serviceParameters"
            @result="handleAiResult"
            @error="handleAiError"
          />
        </div>

        <!-- 批量处理入口 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-800">
              批量处理
            </h4>
            <Button
              type="secondary"
              size="small"
              @click="showBatchProcessor = true"
            >
              打开
            </Button>
          </div>
          <p class="text-xs text-gray-600">
            同时处理多张图片，提升效率
          </p>
        </div>

        <!-- 处理结果管理 -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-800">
              处理结果
            </h4>
            <Button
              type="secondary"
              size="small"
              @click="showResultManager = true"
            >
              查看
            </Button>
          </div>
          <p class="text-xs text-gray-600">
            管理和下载AI处理结果
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import EmptyImagePrompt from '../components/feature/EmptyImagePrompt.vue'
import ImageCanvas from '../components/feature/ImageCanvas.vue'
import AIServiceSelector from '../components/feature/AIServiceSelector.vue'
import AIParameterPanel from '../components/feature/AIParameterPanel.vue'
import BatchProcessor from '../components/feature/BatchProcessor.vue'
import ResultManager from '../components/feature/ResultManager.vue'
import Button from '../components/ui/Button.vue'

// AI功能组件映射
import AIBackgroundRemover from '../components/feature/AIBackgroundRemover.vue'
import AIImageEnlarger from '../components/feature/AIImageEnlarger.vue'
import AIFaceRestoration from '../components/feature/AIFaceRestoration.vue'
import AIImageDenoiser from '../components/feature/AIImageDenoiser.vue'
import AIScratchFix from '../components/feature/AIScratchFix.vue'
import AIColorizePhoto from '../components/feature/AIColorizePhoto.vue'
import AIFaceDetection from '../components/feature/AIFaceDetection.vue'
import AICartoon from '../components/feature/AICartoon.vue'
import AIImageCompressor from '../components/feature/AIImageCompressor.vue'

import { useImageEditor } from '../composables/useImageEditor.js'

export default {
  name: 'Editor',
  components: {
    EmptyImagePrompt,
    ImageCanvas,
    AIServiceSelector,
    AIParameterPanel,
    BatchProcessor,
    ResultManager,
    Button,
    // AI功能组件
    AIBackgroundRemover,
    AIImageEnlarger,
    AIFaceRestoration,
    AIImageDenoiser,
    AIScratchFix,
    AIColorizePhoto,
    AIFaceDetection,
    AICartoon,
    AIImageCompressor
  },
  setup() {
    const {
      imageData,
      originalImageFile,
      initializeEditor,
      handleAiResult,
      handleAiError
    } = useImageEditor()
    
    // 响应式数据
    const selectedService = ref('')
    const serviceParameters = ref({})
    const showBatchProcessor = ref(false)
    const showResultManager = ref(false)
    
    // AI组件映射
    const serviceComponentMap = {
      'BackgroundRemover': 'AIBackgroundRemover',
      'ImageUpscaler:Standard': 'AIImageEnlarger',
      'ImageUpscaler:Photograph': 'AIImageEnlarger', 
      'ImageUpscaler:Anime': 'AIImageEnlarger',
      'ImageUpscaler:FaceEnhancement': 'AIImageEnlarger',
      'FaceRestoration': 'AIFaceRestoration',
      'ImageDenoiser': 'AIImageDenoiser',
      'ScratchFix': 'AIScratchFix',
      'ColorizePhoto': 'AIColorizePhoto',
      'FaceDetection': 'AIFaceDetection',
      'Cartoon': 'AICartoon',
      'ImageCompressor': 'AIImageCompressor'
    }
    
    // 计算属性
    const hasImage = computed(() => !!imageData.value)
    
    const currentServiceComponent = computed(() => {
      if (!selectedService.value) return null
      return serviceComponentMap[selectedService.value] || 'AIBackgroundRemover'
    })
    
    // 方法
    const handleServiceSelected = (serviceType) => {
      selectedService.value = serviceType
      serviceParameters.value = {} // 重置参数
    }
    
    const handleServiceCleared = () => {
      selectedService.value = ''
      serviceParameters.value = {}
    }
    
    const handleParametersChanged = (params) => {
      serviceParameters.value = { ...params }
    }
    
    const handlePresetApplied = (preset) => {
      console.log('应用预设:', preset)
    }
    
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
      selectedService,
      serviceParameters,
      showBatchProcessor,
      showResultManager,
      currentServiceComponent,
      handleServiceSelected,
      handleServiceCleared,
      handleParametersChanged,
      handlePresetApplied,
      handleAiResult,
      handleAiError
    }
  }
}
</script>
