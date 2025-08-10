<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-rainbow px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">注册 Reface</h1>
        <p class="text-gray-600">创建账户，开始你的AI图片处理之旅</p>
      </div>

      <!-- 第三方注册按钮 -->
      <div class="space-y-4 mb-6">
        <button
          @click="signUpWithProvider('google')"
          :disabled="loading"
          class="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          </svg>
          Google 注册
        </button>

        <button
          @click="togglePhoneRegister"
          :disabled="loading"
          class="w-full flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          手机号注册
        </button>

        <!-- 微信注册 - 准备中 -->
        <button
          @click="signUpWithWechat"
          :disabled="true"
          class="w-full flex items-center justify-center px-4 py-3 bg-green-400 text-white rounded-lg opacity-50 cursor-not-allowed"
        >
          <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.162 4.203 2.969 5.522l-.666 2.012 2.343-1.211c.849.173 1.714.262 2.045.262 5.099 0 8.691-3.513 8.691-7.849 0-4.336-3.592-7.849-8.691-7.849M8.8 14.109c-.474 0-.995-.262-1.723-.262-.891 0-1.783.262-2.674.262-3.067 0-5.741-1.97-5.741-4.729 0-2.759 2.674-4.729 5.741-4.729.891 0 1.783.262 2.674.262.728 0 1.249-.262 1.723-.262 3.067 0 5.741 1.97 5.741 4.729s-2.674 4.729-5.741 4.729M24 14.805c0 3.513-3.022 6.365-6.764 6.365-.849 0-1.697-.087-2.546-.262L12 22.119l-.69-1.211C9.617 20.82 8.191 19.88 7.342 18.648c3.67-.349 6.764-2.677 7.613-5.566.849.524 1.697.786 2.546.786 0 0 .849-.087 1.414-.262C21.012 14.283 24 14.805 24 14.805z"/>
          </svg>
          微信注册（即将开放）
        </button>
      </div>

      <!-- 手机号注册面板 -->
      <div v-if="showPhoneRegister" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-medium text-green-800 mb-3">手机号验证码注册</h3>
        
        <!-- 发送验证码 -->
        <div v-if="!otpSent" class="space-y-3">
          <div class="relative">
            <input
              v-model="phone"
              @input="handlePhoneInput"
              type="tel"
              placeholder="请输入手机号"
              class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div v-if="phoneRegion" class="absolute right-3 top-3 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              {{ phoneRegion }}
            </div>
          </div>
          <div class="text-xs text-gray-600">
            支持格式：13800138000 或 +86 13800138000
          </div>
          <button
            @click="sendRegisterOTP"
            :disabled="phoneLoading || !phone || !isValidPhone"
            class="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ phoneLoading ? '发送中...' : '发送验证码' }}
          </button>
        </div>

        <!-- 输入验证码 -->
        <div v-else class="space-y-3">
          <p class="text-sm text-green-600">验证码已发送至 {{ displayPhone }}</p>
          <input
            v-model="otp"
            type="text"
            placeholder="请输入6位验证码"
            maxlength="6"
            class="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div class="flex space-x-2">
            <button
              @click="verifyRegisterOTP"
              :disabled="phoneLoading || !otp || otp.length !== 6"
              class="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {{ phoneLoading ? '验证中...' : '注册' }}
            </button>
            <button
              @click="resetPhoneRegister"
              class="px-4 py-3 border border-green-300 text-green-600 rounded-lg hover:bg-green-50"
            >
              重新发送
            </button>
          </div>
        </div>
      </div>

      <!-- 分割线 -->
      <div v-if="!showPhoneRegister" class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">或使用邮箱注册</span>
        </div>
      </div>

      <!-- 邮箱注册表单 -->
      <form v-if="!showPhoneRegister" @submit.prevent="handleEmailRegister" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="邮箱地址"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="密码（至少6位）"
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="确认密码"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          :disabled="loading || !canSubmit"
          class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {{ loading ? '注册中...' : '邮箱注册' }}
        </button>
      </form>

      <!-- 错误提示 -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- 成功提示 -->
      <div v-if="success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        {{ success }}
      </div>

      <!-- 底部链接 -->
      <div class="mt-6 text-center">
        <router-link to="/auth/login" class="text-blue-500 hover:text-blue-600">
          已有账户？立即登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useNotification } from '@/composables/useNotification.js'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

// 手机号注册相关
const showPhoneRegister = ref(false)
const phone = ref('')
const otp = ref('')
const otpSent = ref(false)
const phoneLoading = ref(false)
const phoneRegion = ref('')
const isValidPhone = ref(false)
const displayPhone = ref('')

// 表单验证
const canSubmit = computed(() => {
  return email.value && 
         password.value && 
         password.value.length >= 6 && 
         password.value === confirmPassword.value
})

// 邮箱注册
const handleEmailRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = '两次密码输入不一致'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''
  
  const { error: registerError } = await authStore.signUpWithEmail(email.value, password.value)
  
  if (registerError) {
    error.value = registerError
  } else {
    success.value = '注册成功！请检查邮箱验证链接（如不需要验证则可直接登录）'
    // 注册成功后跳转到登录页
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  }
  
  loading.value = false
}

// 第三方注册
const signUpWithProvider = async (provider) => {
  loading.value = true
  error.value = ''
  
  const { error: registerError } = await authStore.signInWithProvider(provider)
  
  if (registerError) {
    error.value = registerError
    loading.value = false
  }
  // 第三方登录会重定向，不需要手动处理成功状态
}

// 切换手机号注册
const togglePhoneRegister = () => {
  showPhoneRegister.value = !showPhoneRegister.value
  error.value = ''
}

// 处理手机号输入
const handlePhoneInput = async () => {
  if (!phone.value) {
    phoneRegion.value = ''
    isValidPhone.value = false
    displayPhone.value = ''
    return
  }
  
  try {
    const { detectPhoneRegion, isValidPhoneNumber, getDisplayPhoneNumber, formatPhoneNumber } = await import('@/utils/phoneUtils.js')
    
    phoneRegion.value = detectPhoneRegion(phone.value)
    isValidPhone.value = isValidPhoneNumber(phone.value)
    displayPhone.value = getDisplayPhoneNumber(phone.value)
    
    // 如果是有效的手机号，自动格式化显示
    if (isValidPhone.value) {
      const formatted = formatPhoneNumber(phone.value)
      if (formatted !== phone.value) {
        // 只在用户停止输入500ms后自动格式化，避免输入过程中的干扰
        setTimeout(() => {
          if (isValidPhone.value && phone.value) {
            displayPhone.value = getDisplayPhoneNumber(formatted)
          }
        }, 500)
      }
    }
  } catch (error) {
    console.error('手机号处理出错:', error)
    phoneRegion.value = '格式错误'
    isValidPhone.value = false
  }
}

// 发送注册验证码
const sendRegisterOTP = async () => {
  if (!phone.value) {
    error.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone.value) {
    error.value = '手机号格式不正确'
    return
  }
  
  phoneLoading.value = true
  error.value = ''
  
  const { error: otpError } = await authStore.sendPhoneOTP(phone.value)
  
  if (otpError) {
    error.value = otpError
  } else {
    otpSent.value = true
    showSuccess('验证码已发送')
  }
  
  phoneLoading.value = false
}

// 验证注册验证码
const verifyRegisterOTP = async () => {
  phoneLoading.value = true
  error.value = ''
  success.value = ''
  
  const { error: registerError } = await authStore.signInWithPhoneOTP(phone.value, otp.value)
  
  if (registerError) {
    error.value = registerError
  } else {
    success.value = '注册成功！正在跳转...'
    setTimeout(() => {
      router.push('/')
    }, 1500)
  }
  
  phoneLoading.value = false
}

// 重置手机号注册状态
const resetPhoneRegister = () => {
  otpSent.value = false
  otp.value = ''
  error.value = ''
}

// 微信注册 (待实现)
const signUpWithWechat = () => {
  showError('微信注册功能即将开放，敬请期待！')
}
</script>
