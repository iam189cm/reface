<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl" @click.stop>
      <div class="text-center">
        <!-- 图标 -->
        <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        
        <!-- 标题 -->
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ $t('trial.upgrade.title') }}</h3>
        <p class="text-gray-600 text-sm mb-4">
          {{ $t('trial.upgrade.description') }}
        </p>
        
        <!-- 功能列表 -->
        <div class="space-y-2 mb-4">
          <FeatureItem :text="$t('trial.upgrade.features.unlimited')" />
          <FeatureItem :text="$t('trial.upgrade.features.quality')" />
          <FeatureItem :text="$t('trial.upgrade.features.support')" />
        </div>
        
        <!-- 定价信息 -->
        <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-4">
          <div class="text-2xl font-bold text-gray-900 mb-1">{{ $t('trial.upgrade.pricing.amount') }}</div>
          <div class="text-sm text-gray-600">{{ $t('trial.upgrade.pricing.description') }}</div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="space-y-2">
          <Button type="primary" block @click="handleUpgrade">
            {{ $t('trial.upgrade.buttons.upgrade') }}
          </Button>
          <Button type="ghost" block @click="$emit('close')">
            {{ $t('trial.upgrade.buttons.notNow') }}
          </Button>
        </div>
        
        <!-- 说明文本 -->
        <p class="text-xs text-gray-500 mt-3">
          {{ $t('trial.upgrade.paymentNote') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../ui/Button.vue'
import { useI18nNotification } from '@/utils/i18nNotification.js'

// 功能项组件
const FeatureItem = {
  props: {
    text: String
  },
  template: `
    <div class="flex items-center text-sm text-gray-600">
      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      {{ text }}
    </div>
  `
}

export default {
  name: 'UpgradeModal',
  components: {
    Button,
    FeatureItem
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { showPaymentDeveloping } = useI18nNotification()
    
    // 处理升级
    const handleUpgrade = () => {
      // 这里将来集成支付功能
      showPaymentDeveloping()
      emit('close')
    }
    
    return {
      handleUpgrade
    }
  }
}
</script>
