<template>
  <div class="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-pink-100">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <div class="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.586 1.414l2.828 2.828A2 2 0 007 9.172V6a2 2 0 012-2h2.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0016 8.828V5a2 2 0 00-2-2H4z" />
          <path d="M16 10a2 2 0 00-2 2v1.172a2 2 0 01-.586 1.414l-2.828 2.828A2 2 0 019 16.828V14a2 2 0 00-2-2H5.828a2 2 0 01-1.414-.586L1.586 8.586A2 2 0 011 7.172V10a2 2 0 002 2h13z" />
        </svg>
      </div>
      AI 背景移除
    </h3>

    <!-- 试用状态显示 -->
    <TrialStatusPanel />

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <Button
        :type="buttonType"
        :disabled="!canProcess"
        :loading="isProcessing"
        block
        @click="handleRemoveBackground"
      >
        <template #icon v-if="!isProcessing">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </template>
        {{ buttonText }}
      </Button>

      <!-- 升级提示 -->
      <div v-if="!canUseTrial" class="text-center">
        <p class="text-sm text-gray-600 mb-2">{{ $t('trial.status.exhausted') }}</p>
        <Button
          type="warning"
          size="small"
          @click="showUpgradeModal = true"
        >
          {{ $t('trial.upgrade.buttons.unlockMore') }}
        </Button>
      </div>

      <!-- API Key 配置（开发模式） -->
      <div v-if="isDevelopment" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('ai.backgroundRemover.apiKeyLabel') }}
        </label>
        <input
          v-model="apiKey"
          type="password"
          :placeholder="$t('ai.backgroundRemover.apiKeyPlaceholder')"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
        <p class="text-xs text-gray-600 mt-1">
          {{ $t('ai.backgroundRemover.apiKeyNote') }}
        </p>
      </div>
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
import { useAIServices } from '../../composables/business/useAIServices.js'
import { useTrialManager } from '../../composables/business/useTrialManager.js'

export default {
  name: 'AIBackgroundRemover',
  components: {
    Button,
    TrialStatusPanel,
    UpgradeModal
  },
  props: {
    // 图片文件
    imageFile: {
      type: File,
      default: null
    }
  },
  
  emits: ['result', 'error'],
  
  setup(props, { emit }) {
    const { removeBackground, isProcessing } = useAIServices()
    const { canUseTrial } = useTrialManager()
    
    const showUpgradeModal = ref(false)
    const apiKey = ref('')
    
    // 开发环境判断
    const isDevelopment = computed(() => {
      return process.env.NODE_ENV === 'development'
    })
    
    // 是否可以处理
    const canProcess = computed(() => {
      return props.imageFile && canUseTrial.value && !isProcessing.value
    })
    
    // 按钮类型
    const buttonType = computed(() => {
      if (!canUseTrial.value) return 'secondary'
      if (isProcessing.value) return 'primary'
      return canProcess.value ? 'primary' : 'secondary'
    })
    
    // 按钮文本
    const buttonText = computed(() => {
      if (isProcessing.value) return '正在处理...'
      if (!props.imageFile) return '请先选择图片'
      if (!canUseTrial.value) return '试用次数已用完'
      return '移除背景'
    })
    
    // 处理背景移除
    const handleRemoveBackground = async () => {
      if (!canProcess.value) return
      
      try {
        const success = await removeBackground(
          props.imageFile,
          (resultBlob) => {
            emit('result', resultBlob)
          },
          (error) => {
            emit('error', error)
          }
        )
        
        if (!success) {
          emit('error', new Error('AI处理失败'))
        }
      } catch (error) {
        emit('error', error)
      }
    }
    
    return {
      showUpgradeModal,
      apiKey,
      isDevelopment,
      canProcess,
      canUseTrial,
      buttonType,
      buttonText,
      isProcessing,
      handleRemoveBackground
    }
  }
}
</script>
