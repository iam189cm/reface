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
    <div class="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">免费试用</span>
        <span class="text-sm font-semibold" :class="trialStatus.canUse ? 'text-green-600' : 'text-red-500'">
          {{ trialStatus.remainingTrials }}/{{ trialStatus.maxTrials }} 次
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${(trialStatus.usedTrials / trialStatus.maxTrials) * 100}%` }"
        ></div>
      </div>
      <p class="text-xs text-gray-600 mt-2">
        {{ trialStatus.canUse ? '每天重置试用次数' : '今日试用次数已用完' }}
      </p>
    </div>

    <!-- 操作按钮 -->
    <div class="space-y-3">
      <button
        @click="handleRemoveBackground"
        :disabled="!canProcess"
        class="w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
        :class="buttonClass"
      >
        <div class="flex items-center justify-center space-x-2">
          <div v-if="isProcessing" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>{{ buttonText }}</span>
        </div>
      </button>

      <!-- 升级提示 -->
      <div v-if="!trialStatus.canUse" class="text-center">
        <p class="text-sm text-gray-600 mb-2">试用次数已用完</p>
        <button
          class="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          @click="showUpgradeModal = true"
        >
          ✨ 升级解锁更多次数
        </button>
      </div>

      <!-- API Key 配置（开发模式） -->
      <div v-if="isDevelopment" class="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Remove.bg API Key (开发模式)
        </label>
        <input
          v-model="apiKey"
          type="password"
          placeholder="请输入 Remove.bg API Key"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
        >
        <p class="text-xs text-gray-600 mt-1">
          生产环境将使用服务器端 API Key
        </p>
      </div>
    </div>

    <!-- 升级弹窗 -->
    <div v-if="showUpgradeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showUpgradeModal = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl" @click.stop>
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">解锁更多功能</h3>
          <p class="text-gray-600 text-sm mb-4">
            升级后可享受无限次数的 AI 背景移除功能
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              无限次 AI 背景移除
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              高清图片处理
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              优先客服支持
            </div>
          </div>
          <div class="flex space-x-3">
            <button
              @click="showUpgradeModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              稍后再说
            </button>
            <button
              @click="handleUpgrade"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              立即升级
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { removeBackground, compressImage } from '../utils/aiServices.js'
import { getTrialStatus, useTrial, canUseTrial } from '../utils/trialManager.js'

export default {
  name: 'BackgroundRemover',
  props: {
    imageFile: {
      type: File,
      default: null
    }
  },
  emits: ['result', 'error'],
  setup(props, { emit }) {
    const isProcessing = ref(false)
    const trialStatus = ref(getTrialStatus())
    const showUpgradeModal = ref(false)
    const apiKey = ref('')
    
    const isDevelopment = process.env.NODE_ENV === 'development'

    // 更新试用状态
    const updateTrialStatus = () => {
      trialStatus.value = getTrialStatus()
    }

    const canProcess = computed(() => {
      return !isProcessing.value && props.imageFile && (trialStatus.value.canUse || apiKey.value)
    })

    const buttonClass = computed(() => {
      if (!canProcess.value) {
        return 'bg-gray-400 cursor-not-allowed'
      }
      return 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-xl'
    })

    const buttonText = computed(() => {
      if (isProcessing.value) {
        return '处理中...'
      }
      if (!props.imageFile) {
        return '请先上传图片'
      }
      if (!trialStatus.value.canUse && !apiKey.value) {
        return '试用次数已用完'
      }
      return '移除背景'
    })

    const handleRemoveBackground = async () => {
      if (!canProcess.value) return

      try {
        isProcessing.value = true

        // 检查试用次数
        if (!apiKey.value && !canUseTrial()) {
          throw new Error('试用次数已用完')
        }

        // 压缩图片以节省 API 配额
        const compressedImage = await compressImage(props.imageFile, 800, 0.8)

        // 调用 Remove.bg API
        const currentApiKey = apiKey.value || process.env.VITE_REMOVE_BG_API_KEY
        const resultBlob = await removeBackground(compressedImage, currentApiKey)

        // 使用试用次数
        if (!apiKey.value) {
          useTrial()
          updateTrialStatus()
        }

        // 发送结果
        emit('result', {
          originalFile: props.imageFile,
          processedBlob: resultBlob,
          type: 'background-removal'
        })

        // 成功提示
        // 这里可以添加成功提示的逻辑

      } catch (error) {
        console.error('背景移除失败:', error)
        emit('error', {
          message: error.message || '背景移除失败',
          type: 'background-removal'
        })
      } finally {
        isProcessing.value = false
      }
    }

    const handleUpgrade = () => {
      showUpgradeModal.value = false
      // 这里将来集成支付功能
      alert('支付功能开发中，敬请期待！')
    }

    onMounted(() => {
      updateTrialStatus()
    })

    return {
      isProcessing,
      trialStatus,
      showUpgradeModal,
      apiKey,
      isDevelopment,
      canProcess,
      buttonClass,
      buttonText,
      handleRemoveBackground,
      handleUpgrade,
      updateTrialStatus
    }
  }
}
</script>