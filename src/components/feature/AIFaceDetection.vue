<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
        <span class="text-xs">👁️</span>
      </div>
      AI 人脸检测
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 检测选项 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">检测内容</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="detectFaces"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">面部位置</span>
          <span class="ml-auto text-xs text-gray-500">标记人脸边界框</span>
        </label>
        
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="detectLandmarks"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">面部特征点</span>
          <span class="ml-auto text-xs text-gray-500">眼鼻嘴等关键点</span>
        </label>
        
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="detectAttributes"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">面部属性</span>
          <span class="ml-auto text-xs text-gray-500">年龄、性别等信息</span>
        </label>
        
        <label class="flex items-center">
          <input
            type="checkbox"
            v-model="detectEmotions"
            class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
          <span class="ml-2 text-sm text-gray-700">情绪分析</span>
          <span class="ml-auto text-xs text-gray-500">喜怒哀乐等表情</span>
        </label>
      </div>
    </div>

    <!-- 检测精度 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">检测精度</label>
      <div class="grid grid-cols-3 gap-2">
        <Button
          type="secondary"
          size="small"
          @click="setAccuracy('fast')"
          :class="{ 'bg-blue-100 border-blue-300': accuracy === 'fast' }"
        >
          快速
        </Button>
        <Button
          type="secondary"
          size="small"
          @click="setAccuracy('balanced')"
          :class="{ 'bg-blue-100 border-blue-300': accuracy === 'balanced' }"
        >
          平衡
        </Button>
        <Button
          type="secondary"
          size="small"
          @click="setAccuracy('accurate')"
          :class="{ 'bg-blue-100 border-blue-300': accuracy === 'accurate' }"
        >
          精确
        </Button>
      </div>
      <div class="text-xs text-gray-500 mt-2 text-center">
        {{ getAccuracyDescription(accuracy) }}
      </div>
    </div>

    <!-- 输出格式 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">输出格式</label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            v-model="outputFormat"
            value="visual"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm text-gray-700">可视化图片</span>
          <span class="ml-auto text-xs text-gray-500">标记检测结果</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            v-model="outputFormat"
            value="json"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm text-gray-700">JSON数据</span>
          <span class="ml-auto text-xs text-gray-500">原始检测数据</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            v-model="outputFormat"
            value="both"
            class="text-blue-600 focus:ring-blue-500"
          >
          <span class="ml-2 text-sm text-gray-700">图片+数据</span>
          <span class="ml-auto text-xs text-gray-500">同时提供两种</span>
        </label>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleFaceDetection"
      >
        <template #icon v-if="!isProcessing">
          <span class="text-sm">👁️</span>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial" class="text-center">
        <p class="text-sm text-gray-600 mb-2">今日人脸检测次数已用完</p>
        <Button
          type="warning"
          size="small"
          @click="showUpgradeModal = true"
        >
          升级解锁更多
        </Button>
      </div>
      
      <!-- 低消耗提示 -->
      <div class="text-center">
        <p class="text-xs text-green-600">
          💚 此功能仅消耗 0.5 个积分，处理快速
        </p>
      </div>
    </div>

    <!-- 检测结果展示 -->
    <div v-if="detectionResult" class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-3 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        检测结果
      </h4>
      
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="text-center p-2 bg-white/60 rounded">
          <div class="text-xl font-bold text-blue-600">{{ detectionResult.faceCount || 0 }}</div>
          <div class="text-xs text-gray-600">检测到的人脸</div>
        </div>
        <div class="text-center p-2 bg-white/60 rounded">
          <div class="text-xl font-bold text-green-600">{{ detectionResult.confidence || 0 }}%</div>
          <div class="text-xs text-gray-600">平均置信度</div>
        </div>
      </div>
      
      <!-- 详细信息 -->
      <div v-if="detectionResult.faces && detectionResult.faces.length > 0" class="mt-3">
        <div class="text-xs font-medium text-gray-700 mb-2">人脸详情:</div>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div 
            v-for="(face, index) in detectionResult.faces" 
            :key="index"
            class="text-xs bg-white/60 rounded p-2"
          >
            <div class="flex justify-between items-center">
              <span class="font-medium">人脸 {{ index + 1 }}</span>
              <span class="text-blue-600">{{ face.confidence }}% 置信度</span>
            </div>
            <div v-if="face.attributes" class="mt-1 text-gray-600">
              <span v-if="face.attributes.age">年龄: ~{{ face.attributes.age }}岁 </span>
              <span v-if="face.attributes.gender">性别: {{ face.attributes.gender }} </span>
              <span v-if="face.attributes.emotion">表情: {{ face.attributes.emotion }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能说明 -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-900 mb-2 flex items-center">
        <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        功能介绍
      </h4>
      <ul class="text-xs text-gray-600 space-y-1">
        <li>• 高精度检测图片中的人脸位置</li>
        <li>• 分析面部特征点和属性信息</li>
        <li>• 支持多人脸同时检测</li>
        <li>• 可用于后续美颜、修图等应用</li>
      </ul>
    </div>

    <!-- 升级弹窗 -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Button from '../ui/Button.vue'
import TrialStatusPanel from './TrialStatusPanel.vue'
import UpgradeModal from './UpgradeModal.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useTrialManager } from '../../composables/business/useTrialManager.js'

export default {
  name: 'AIFaceDetection',
  components: {
    Button,
    TrialStatusPanel,
    UpgradeModal
  },
  props: {
    imageFile: {
      type: File,
      default: null
    }
  },
  
  emits: ['result', 'error'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    const { canUseTrial } = useTrialManager()
    
    const showUpgradeModal = ref(false)
    const detectFaces = ref(true)
    const detectLandmarks = ref(false)
    const detectAttributes = ref(false)
    const detectEmotions = ref(false)
    const accuracy = ref('balanced')
    const outputFormat = ref('visual')
    const detectionResult = ref(null)
    
    // 计算属性
    const isProcessing = computed(() => neroAI.processingInfo.value.isProcessing)
    
    const canProcess = computed(() => {
      const hasImage = props.imageFile
      const hasOptions = detectFaces.value || detectLandmarks.value || detectAttributes.value || detectEmotions.value
      const hasTrialQuota = canUseTrial.value
      const notProcessing = !isProcessing.value
      
      return hasImage && hasOptions && hasTrialQuota && notProcessing
    })
    
    const buttonType = computed(() => {
      if (!canUseTrial.value) return 'secondary'
      if (isProcessing.value) return 'primary'
      return canProcess.value ? 'primary' : 'secondary'
    })
    
    const buttonText = computed(() => {
      if (isProcessing.value) return '正在检测人脸...'
      if (!props.imageFile) return '请先选择图片'
      if (!detectFaces.value && !detectLandmarks.value && !detectAttributes.value && !detectEmotions.value) {
        return '请选择检测内容'
      }
      if (!canUseTrial.value) return '试用次数已用完'
      return '开始人脸检测'
    })
    
    // 方法
    const setAccuracy = (value) => {
      accuracy.value = value
    }
    
    const getAccuracyDescription = (acc) => {
      const descriptions = {
        fast: '快速处理，适合实时应用',
        balanced: '平衡速度和精度',
        accurate: '最高精度，处理时间稍长'
      }
      return descriptions[acc] || ''
    }
    
    const handleFaceDetection = async () => {
      if (!canProcess.value) return
      
      try {
        // 准备检测参数
        const params = {
          detect_faces: detectFaces.value,
          detect_landmarks: detectLandmarks.value,
          detect_attributes: detectAttributes.value,
          detect_emotions: detectEmotions.value,
          accuracy: accuracy.value,
          output_format: outputFormat.value
        }
        
        const success = await neroAI.detectFaces(
          props.imageFile,
          (result) => {
            // 处理检测结果
            if (result.result && result.result.data) {
              detectionResult.value = {
                faceCount: result.result.data.face_count || 0,
                confidence: Math.round((result.result.data.average_confidence || 0) * 100),
                faces: result.result.data.faces || []
              }
            }
            
            emit('result', result)
          },
          (error) => {
            detectionResult.value = null
            emit('error', error)
          },
          params
        )
        
        if (!success) {
          detectionResult.value = null
          emit('error', new Error('人脸检测处理失败'))
        }
      } catch (error) {
        detectionResult.value = null
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      detectFaces,
      detectLandmarks,
      detectAttributes,
      detectEmotions,
      accuracy,
      outputFormat,
      detectionResult,
      canUseTrial,
      canProcess,
      buttonType,
      buttonText,
      isProcessing,
      setAccuracy,
      getAccuracyDescription,
      handleFaceDetection
    }
  }
}
</script>

<style scoped>
/* 复用之前的滑块样式 */
</style>
