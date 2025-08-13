<template>
  <!-- 🆕 已登录用户：显示服务端配额信息 -->
  <div v-if="trialInfo.isAuthenticated" class="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
    <!-- 用户类型标识 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-1">
          <div :class="userTypeBadgeClass" class="px-2 py-1 rounded-full text-xs font-medium">
            {{ userTypeDisplayName }}
          </div>
          <div v-if="trialInfo.userType === 'free'" class="text-xs text-gray-500">
            (登录用户)
          </div>
        </div>
      </div>
      <span class="text-sm font-semibold" :class="statusTextClass">
        {{ trialInfo.remaining }}/{{ trialInfo.total }} 配额
      </span>
    </div>
    
    <!-- 配额进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
      <div 
        class="h-3 rounded-full transition-all duration-500"
        :class="progressBarClass"
        :style="{ width: `${Math.max(5, (trialInfo.remaining / trialInfo.total) * 100)}%` }"
      ></div>
    </div>
    
    <!-- 配额状态信息 -->
    <div class="space-y-2">
      <div class="flex justify-between items-center text-xs">
        <span class="text-gray-600">已使用: {{ trialInfo.used }} 个配额</span>
        <span class="text-gray-600">每日配额: {{ trialInfo.daily }}</span>
      </div>
      
      <!-- 状态提示 -->
      <div class="flex items-start space-x-2">
        <div :class="statusIconClass" class="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"></div>
        <p class="text-xs" :class="statusTextClass">
          {{ authenticatedStatusText }}
        </p>
      </div>
      
      <!-- 升级建议 -->
      <div v-if="upgradeRecommendation" class="mt-3 p-2 bg-white bg-opacity-60 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium" :class="upgradeRecommendation.urgent ? 'text-red-700' : 'text-amber-700'">
              {{ upgradeRecommendation.title }}
            </p>
            <p class="text-xs text-gray-600 mt-1">{{ upgradeRecommendation.message }}</p>
          </div>
          <button class="text-xs px-2 py-1 rounded-lg font-medium transition-colors"
                  :class="upgradeRecommendation.urgent ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'">
            {{ upgradeRecommendation.action }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 开发模式重置按钮 -->
    <div v-if="isDevelopment" class="mt-3 pt-2 border-t border-blue-200">
      <button
        @click="resetTrials"
        class="text-xs text-blue-600 hover:text-blue-800 underline"
      >
        重置配额 (开发模式)
      </button>
    </div>
  </div>

  <!-- 🔄 未登录用户：显示本地试用信息 -->
  <div v-else class="mb-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700">免费试用</span>
        <div class="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
          访客模式
        </div>
      </div>
      <span class="text-sm font-semibold" :class="guestStatusClass">
        {{ trialInfo.remaining }}/{{ trialInfo.total }} 次
      </span>
    </div>
    
    <!-- 试用进度条 -->
    <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
      <div 
        class="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all duration-300"
        :style="{ width: `${Math.max(5, (trialInfo.remaining / trialInfo.total) * 100)}%` }"
      ></div>
    </div>
    
    <!-- 试用状态提示 -->
    <div class="space-y-2">
      <div class="flex items-start space-x-2">
        <div :class="guestStatusIcon" class="w-4 h-4 rounded-full flex-shrink-0 mt-0.5"></div>
        <p class="text-xs text-gray-600">
          {{ guestStatusText }}
        </p>
      </div>
      
      <!-- 登录提示 -->
      <div class="mt-3 p-2 bg-white bg-opacity-60 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-medium text-purple-700">注册获取更多配额</p>
            <p class="text-xs text-gray-600 mt-1">登录后可获得每日 {{ trialInfo.daily }} 个配额</p>
          </div>
          <button class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            立即注册
          </button>
        </div>
      </div>
    </div>
    
    <!-- 开发模式重置按钮 -->
    <div v-if="isDevelopment" class="mt-3 pt-2 border-t border-pink-200">
      <button
        @click="resetTrials"
        class="text-xs text-pink-600 hover:text-pink-800 underline"
      >
        重置试用 (开发模式)
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTrialManager } from '../../composables/business/useTrialManager.js'

export default {
  name: 'TrialStatusPanel',
  setup() {
    const { 
      trialInfo,
      canUseTrial,
      resetTrials: resetTrialsForDev,
      getUpgradeRecommendation
    } = useTrialManager()
    
    // 开发环境判断
    const isDevelopment = computed(() => {
      return import.meta.env.DEV
    })

    // ==========  已登录用户相关  ==========
    
    // 用户类型显示名称
    const userTypeDisplayName = computed(() => {
      const typeNames = {
        'free': '免费版',
        'starter': '入门版', 
        'pro': '专业版',
        'business': '商业版',
        'admin': '管理员'
      }
      return typeNames[trialInfo.value.userType] || '未知'
    })

    // 用户类型徽章样式
    const userTypeBadgeClass = computed(() => {
      const typeClasses = {
        'free': 'bg-gray-100 text-gray-700',
        'starter': 'bg-blue-100 text-blue-700',
        'pro': 'bg-purple-100 text-purple-700',
        'business': 'bg-green-100 text-green-700',
        'admin': 'bg-red-100 text-red-700'
      }
      return typeClasses[trialInfo.value.userType] || 'bg-gray-100 text-gray-700'
    })

    // 配额状态文本颜色（已登录）
    const statusTextClass = computed(() => {
      if (!trialInfo.value.isAuthenticated) return 'text-pink-600'
      
      const remaining = trialInfo.value.remaining
      if (remaining <= 0) return 'text-red-600'
      if (remaining <= 2) return 'text-amber-600' 
      return 'text-green-600'
    })

    // 配额进度条颜色（已登录）
    const progressBarClass = computed(() => {
      if (!trialInfo.value.isAuthenticated) return 'bg-gradient-to-r from-pink-500 to-purple-600'
      
      const remaining = trialInfo.value.remaining
      if (remaining <= 0) return 'bg-gradient-to-r from-red-400 to-red-600'
      if (remaining <= 2) return 'bg-gradient-to-r from-amber-400 to-orange-500'
      return 'bg-gradient-to-r from-green-400 to-blue-500'
    })

    // 状态图标样式（已登录）
    const statusIconClass = computed(() => {
      if (!trialInfo.value.isAuthenticated) return 'bg-pink-400'
      
      const remaining = trialInfo.value.remaining
      if (remaining <= 0) return 'bg-red-400'
      if (remaining <= 2) return 'bg-amber-400'
      return 'bg-green-400'
    })

    // 已登录状态文本
    const authenticatedStatusText = computed(() => {
      const remaining = trialInfo.value.remaining
      const userType = trialInfo.value.userType
      
      if (remaining <= 0) {
        return userType === 'free' ? '配额已用完，升级账户获取更多配额' : '配额已用完，明日自动重置'
      }
      
      if (remaining <= 2) {
        return `配额即将用完，仅剩 ${remaining} 个配额可用`
      }
      
      if (userType === 'free') {
        return `今日还可使用 ${remaining} 个配额，升级获得更多`
      }
      
      return `今日还可使用 ${remaining} 个配额`
    })

    // ==========  未登录用户相关  ==========
    
    // 访客状态文本颜色
    const guestStatusClass = computed(() => {
      return canUseTrial.value ? 'text-green-600' : 'text-red-500'
    })

    // 访客状态图标
    const guestStatusIcon = computed(() => {
      return canUseTrial.value ? 'bg-green-400' : 'bg-red-400'
    })

    // 访客状态文本
    const guestStatusText = computed(() => {
      const remaining = trialInfo.value.remaining
      if (remaining <= 0) {
        return '今日试用次数已用完，注册登录获取更多配额'
      }
      if (remaining === 1) {
        return '这是今日最后一次试用机会，注册后可获得更多配额'
      }
      return `今日还可试用 ${remaining} 次，注册登录获得每日 ${trialInfo.value.daily} 个配额`
    })

    // 升级建议
    const upgradeRecommendation = computed(() => {
      return getUpgradeRecommendation()
    })
    
    // 重置试用/配额
    const resetTrials = () => {
      resetTrialsForDev()
    }
    
    return {
      // 数据
      trialInfo,
      isDevelopment,
      upgradeRecommendation,
      
      // 已登录用户相关
      userTypeDisplayName,
      userTypeBadgeClass,
      statusTextClass,
      progressBarClass,
      statusIconClass,
      authenticatedStatusText,
      
      // 未登录用户相关
      guestStatusClass,
      guestStatusIcon,
      guestStatusText,
      
      // 方法
      resetTrials
    }
  }
}
</script>
