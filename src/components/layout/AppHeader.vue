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
        
        <!-- 中间导航区域 -->
        <div class="flex-1 flex justify-center">
          <div class="flex items-center space-x-6">
            <!-- AI工具下拉菜单 -->
            <div class="relative" ref="aiToolsMenuRef">
              <button
                @click="toggleAIToolsMenu"
                class="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                :class="$route.path === '/editor' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-pink-500'"
              >
                <span>{{ $t('navigation.aiTools') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- AI工具下拉菜单 -->
              <div
                v-show="showAIToolsMenu"
                class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-[9999]"
              >
                <div class="px-4 py-2 border-b border-gray-100">
                  <h3 class="text-sm font-semibold text-gray-900">{{ $t('navigation.aiToolsTitle') }}</h3>
                  <p class="text-xs text-gray-500 mt-1">{{ $t('navigation.aiToolsDesc') }}</p>
                </div>
                
                <div class="py-2">
                  <router-link
                    to="/editor?tool=remove-bg"
                    @click="closeAIToolsMenu"
                    class="flex items-center px-4 py-3 hover:bg-pink-50 transition-colors group"
                  >
                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2M7 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ $t('tools.removeBackground.name') }}</div>
                      <div class="text-xs text-gray-500">{{ $t('tools.removeBackground.desc') }}</div>
                    </div>
                  </router-link>
                  
                  <router-link
                    to="/editor?tool=enlarge"
                    @click="closeAIToolsMenu"
                    class="flex items-center px-4 py-3 hover:bg-pink-50 transition-colors group"
                  >
                    <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ $t('tools.imageEnlarger.name') }}</div>
                      <div class="text-xs text-gray-500">{{ $t('tools.imageEnlarger.desc') }}</div>
                    </div>
                  </router-link>
                  
                  <router-link
                    to="/editor?tool=filter"
                    @click="closeAIToolsMenu"
                    class="flex items-center px-4 py-3 hover:bg-pink-50 transition-colors group"
                  >
                    <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200">
                      <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ $t('tools.imageFilter.name') }}</div>
                      <div class="text-xs text-gray-500">{{ $t('tools.imageFilter.desc') }}</div>
                    </div>
                  </router-link>
                </div>
                
                <div class="border-t border-gray-100 pt-2 mt-2">
                  <router-link
                    to="/editor"
                    @click="closeAIToolsMenu"
                    class="flex items-center justify-center px-4 py-2 mx-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    {{ $t('navigation.startEditing') }}
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- 定价 -->
            <NavLink to="/pricing" :active="$route.path === '/pricing'">
              {{ $t('navigation.pricing') }}
            </NavLink>
            

            <!-- 管理后台（仅管理员可见） -->
            <NavLink v-if="authStore.isAdmin" to="/admin" :active="$route.path === '/admin'">
              {{ $t('navigation.admin') }}
            </NavLink>
            
            <!-- 帮助 -->
            <NavLink to="/help" :active="$route.path === '/help'">
              {{ $t('navigation.help') }}
            </NavLink>
          </div>
        </div>

        <!-- 右侧功能区域 -->
        <div class="flex items-center space-x-4">
          <!-- 语言切换器 -->
          <LanguageSwitcher variant="header" />

          <!-- 用户认证区域 -->
            <!-- 未登录状态 -->
            <template v-if="!authStore.isAuthenticated">
              <router-link 
                to="/auth/login"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
              >
                {{ $t('navigation.login') }}
              </router-link>
              <router-link 
                to="/auth/register"
                class="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {{ $t('navigation.register') }}
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
                    {{ $t('navigation.logout') }}
                  </button>
                </div>
              </div>
            </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth/authStore.js'
import { useI18nNotification } from '@/utils/i18nNotification.js'
import { USER_TYPE_CONFIGS } from '@/utils/supabase.js'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

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
    NavLink,
    LanguageSwitcher
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { showLogoutSuccess } = useI18nNotification()
    
    const showUserMenu = ref(false)
    const userMenuRef = ref(null)
    const showAIToolsMenu = ref(false)
    const aiToolsMenuRef = ref(null)

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
    
    // 切换AI工具菜单
    const toggleAIToolsMenu = () => {
      showAIToolsMenu.value = !showAIToolsMenu.value
    }
    
    // 关闭AI工具菜单
    const closeAIToolsMenu = () => {
      showAIToolsMenu.value = false
    }

    // 处理登出
    const handleSignOut = async () => {
      showUserMenu.value = false
      await authStore.signOut()
      showLogoutSuccess()
      router.push('/')
    }

    // 点击外部关闭菜单
    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        showUserMenu.value = false
      }
      if (aiToolsMenuRef.value && !aiToolsMenuRef.value.contains(event.target)) {
        showAIToolsMenu.value = false
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
      showAIToolsMenu,
      aiToolsMenuRef,
      userTypeConfig,
      userTypeBadgeClass,
      toggleUserMenu,
      toggleAIToolsMenu,
      closeAIToolsMenu,
      handleSignOut
    }
  }
}
</script>
