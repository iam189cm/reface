<template>
  <nav class="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-100">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo和品牌 -->
        <router-link to="/" class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">R</span>
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Reface
          </h1>
        </router-link>
        
        <div class="flex items-center space-x-6">
          <!-- 导航菜单 -->
          <div class="flex space-x-4">
            <NavLink to="/" :active="$route.path === '/'">
              首页
            </NavLink>
            <NavLink to="/editor" :active="$route.path === '/editor'">
              编辑器
            </NavLink>
          </div>

          <!-- 用户认证区域 -->
          <div class="flex items-center space-x-4">
            <!-- 未登录状态 -->
            <template v-if="!authStore.isAuthenticated">
              <router-link 
                to="/auth/login"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
              >
                登录
              </router-link>
              <router-link 
                to="/auth/register"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                注册
              </router-link>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <!-- 用户类型标识 -->
              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="userTypeBadgeClass"
                >
                  {{ userTypeConfig.displayName }}
                </span>
              </div>

              <!-- 用户菜单 -->
              <div class="relative" ref="userMenuRef">
                <button
                  @click="toggleUserMenu"
                  class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img
                    :src="authStore.avatarUrl"
                    :alt="authStore.displayName"
                    class="w-8 h-8 rounded-full"
                  />
                  <span class="text-sm font-medium text-gray-700 hidden md:block">
                    {{ authStore.displayName }}
                  </span>
                  <svg class="w-4 h-4 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- 下拉菜单 -->
                <div
                  v-show="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">{{ authStore.displayName }}</p>
                    <p class="text-xs text-gray-500">{{ authStore.userEmail }}</p>
                  </div>
                  
                  <button
                    @click="handleSignOut"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useNotification } from '@/composables/useNotification.js'
import { USER_TYPE_CONFIGS } from '@/utils/supabase.js'

// 导航链接组件
const NavLink = {
  props: {
    to: String,
    active: Boolean
  },
  template: `
    <router-link 
      :to="to"
      class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
      :class="active ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-pink-500'"
    >
      <slot></slot>
    </router-link>
  `
}

export default {
  name: 'AppHeader',
  components: {
    NavLink
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { showSuccess } = useNotification()
    
    const showUserMenu = ref(false)
    const userMenuRef = ref(null)

    // 用户类型配置
    const userTypeConfig = computed(() => {
      return USER_TYPE_CONFIGS[authStore.userType] || USER_TYPE_CONFIGS.FREE
    })

    // 用户类型徽章样式
    const userTypeBadgeClass = computed(() => {
      const type = authStore.userType
      switch (type) {
        case 'FREE':
          return 'bg-gray-100 text-gray-700'
        case 'STARTER':
          return 'bg-blue-100 text-blue-700'
        case 'PRO':
          return 'bg-purple-100 text-purple-700'
        case 'BUSINESS':
          return 'bg-yellow-100 text-yellow-700'
        case 'ADMIN':
          return 'bg-red-100 text-red-700'
        default:
          return 'bg-gray-100 text-gray-700'
      }
    })

    // 切换用户菜单
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    // 处理登出
    const handleSignOut = async () => {
      showUserMenu.value = false
      await authStore.signOut()
      showSuccess('已成功退出登录')
      router.push('/')
    }

    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      authStore,
      showUserMenu,
      userMenuRef,
      userTypeConfig,
      userTypeBadgeClass,
      toggleUserMenu,
      handleSignOut
    }
  }
}
</script>
