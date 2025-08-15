<template>
  <nav class="glass-effect shadow-lg border-b border-pink-100 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo区域 - 可点击回到主页 -->
        <router-link 
          to="/" 
          class="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          :title="$t('nav.backToHome', '返回主页')"
        >
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">R</span>
          </div>
          <h1 class="text-2xl font-bold gradient-text">
            Reface
          </h1>
        </router-link>
        
        <!-- 中间导航 -->
        <div class="hidden md:flex items-center space-x-8">
          <!-- AI工具下拉菜单 -->
          <div class="relative group">
            <button class="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center">
              <Sparkles
                :size="18"
                class="mr-2 text-pink-500 icon-hover"
              />
              {{ $t('nav.aiTools', 'AI工具') }}
              <ChevronDown
                :size="16"
                class="ml-1 transform group-hover:rotate-180 transition-transform duration-200"
              />
            </button>
            
            <!-- AI工具分类下拉菜单 -->
            <div class="absolute top-full left-0 mt-2 w-96 glass-effect rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 scale-95 group-hover:translate-y-0 group-hover:scale-100 z-50">
              <div class="p-4">
                <!-- AI增强分类 -->
                <div class="mb-6">
                  <div class="flex items-center text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                    <Sparkles
                      :size="14"
                      class="mr-2 text-pink-500"
                    />
                    AI增强
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <router-link
                      to="/editor"
                      class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors group"
                    >
                      <div class="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <Sparkles
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-900">AI图片放大</span>
                          <CheckCircle
                            :size="14"
                            class="ml-2 text-green-500"
                          />
                        </div>
                        <div class="text-sm text-gray-500">
                          无损放大至8倍，保持清晰度
                        </div>
                      </div>
                    </router-link>
                    
                    <div class="flex items-center p-3 rounded-lg bg-gray-50 cursor-not-allowed">
                      <div class="w-10 h-10 bg-gradient-to-r from-purple-300 to-purple-400 rounded-lg flex items-center justify-center mr-3 opacity-60">
                        <Sparkles
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-600">AI图像锐化</span>
                          <Timer
                            :size="14"
                            class="ml-2 text-orange-500"
                          />
                        </div>
                        <div class="text-sm text-gray-400">
                          敬请期待
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex items-center p-3 rounded-lg bg-gray-50 cursor-not-allowed">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-300 to-blue-400 rounded-lg flex items-center justify-center mr-3 opacity-60">
                        <Sparkles
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-600">AI老照片修复</span>
                          <Timer
                            :size="14"
                            class="ml-2 text-orange-500"
                          />
                        </div>
                        <div class="text-sm text-gray-400">
                          敬请期待
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI编辑分类 -->
                <div class="mb-6">
                  <div class="flex items-center text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                    <Scissors
                      :size="14"
                      class="mr-2 text-purple-500"
                    />
                    AI编辑
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <router-link
                      to="/editor"
                      class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors group"
                    >
                      <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <Scissors
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-900">AI一键去背景</span>
                          <CheckCircle
                            :size="14"
                            class="ml-2 text-green-500"
                          />
                        </div>
                        <div class="text-sm text-gray-500">
                          智能识别主体，精准抠图
                        </div>
                      </div>
                    </router-link>
                    
                    <div class="flex items-center p-3 rounded-lg bg-gray-50 cursor-not-allowed">
                      <div class="w-10 h-10 bg-gradient-to-r from-green-300 to-green-400 rounded-lg flex items-center justify-center mr-3 opacity-60">
                        <Scissors
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-600">AI智能抠图</span>
                          <Timer
                            :size="14"
                            class="ml-2 text-orange-500"
                          />
                        </div>
                        <div class="text-sm text-gray-400">
                          敬请期待
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI创造分类 -->
                <div class="mb-4">
                  <div class="flex items-center text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                    <Palette
                      :size="14"
                      class="mr-2 text-blue-500"
                    />
                    AI创造
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <div class="flex items-center p-3 rounded-lg bg-gray-50 cursor-not-allowed">
                      <div class="w-10 h-10 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg flex items-center justify-center mr-3 opacity-60">
                        <Palette
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-600">AI照片卡通化</span>
                          <Timer
                            :size="14"
                            class="ml-2 text-orange-500"
                          />
                        </div>
                        <div class="text-sm text-gray-400">
                          敬请期待
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI生产力分类 -->
                <div class="border-t border-gray-100 pt-4">
                  <div class="flex items-center text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">
                    <Zap
                      :size="14"
                      class="mr-2 text-yellow-500"
                    />
                    AI生产力
                  </div>
                  <div class="grid grid-cols-1 gap-2">
                    <div class="flex items-center p-3 rounded-lg bg-gray-50 cursor-not-allowed">
                      <div class="w-10 h-10 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-lg flex items-center justify-center mr-3 opacity-60">
                        <Zap
                          :size="18"
                          class="text-white"
                        />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center">
                          <span class="font-medium text-gray-600">AI批量处理</span>
                          <Timer
                            :size="14"
                            class="ml-2 text-orange-500"
                          />
                        </div>
                        <div class="text-sm text-gray-400">
                          敬请期待
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 解决方案下拉菜单 -->
          <div class="relative group">
            <button class="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center">
              <Users
                :size="18"
                class="mr-2 text-purple-500"
              />
              {{ $t('nav.solutions', '解决方案') }}
              <ChevronDown
                :size="16"
                class="ml-1 transform group-hover:rotate-180 transition-transform duration-200"
              />
            </button>
            
            <!-- 解决方案下拉菜单 -->
            <div class="absolute top-full left-0 mt-2 w-80 glass-effect rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
              <div class="p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-4">
                  用户群体解决方案
                </div>
                
                <router-link
                  to="/solutions/personal"
                  class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2 group"
                >
                  <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <User
                      :size="18"
                      class="text-white"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 group-hover:text-pink-600">
                      个人用户
                    </div>
                    <div class="text-sm text-gray-500">
                      社交媒体，生活照片美化
                    </div>
                  </div>
                </router-link>
                
                <router-link
                  to="/solutions/content-creator"
                  class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2 group"
                >
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Video
                      :size="18"
                      class="text-white"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 group-hover:text-pink-600">
                      内容创作者
                    </div>
                    <div class="text-sm text-gray-500">
                      视频缩略图，内容素材制作
                    </div>
                  </div>
                </router-link>
                
                <router-link
                  to="/solutions/ecommerce"
                  class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2 group"
                >
                  <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <ShoppingCart
                      :size="18"
                      class="text-white"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 group-hover:text-pink-600">
                      电商卖家
                    </div>
                    <div class="text-sm text-gray-500">
                      产品图片优化，背景统一
                    </div>
                  </div>
                </router-link>
                
                <router-link
                  to="/solutions/designer"
                  class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors group"
                >
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <Target
                      :size="18"
                      class="text-white"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 group-hover:text-pink-600">
                      设计师
                    </div>
                    <div class="text-sm text-gray-500">
                      素材快速抠图，专业级处理
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <router-link
            to="/pricing"
            class="text-gray-700 hover:text-pink-600 font-medium transition-colors"
          >
            {{ $t('nav.pricing', '定价') }}
          </router-link>
          <router-link
            to="/help"
            class="text-gray-700 hover:text-pink-600 font-medium transition-colors"
          >
            {{ $t('nav.help', '帮助中心') }}
          </router-link>
        </div>

        <!-- 右侧按钮 -->
        <div class="flex items-center space-x-4">
          <!-- 语言切换器 -->
          <div class="hidden md:flex">
            <LanguageSwitcher variant="header" />
          </div>
          
          <!-- 用户认证按钮 -->
          <div class="hidden md:flex items-center space-x-3">
            <router-link
              to="/auth/login"
              class="flex items-center text-gray-600 hover:text-pink-600 font-medium transition-colors"
            >
              <LogIn
                :size="18"
                class="mr-1"
              />
              {{ $t('auth.login', '登录') }}
            </router-link>
            
            <router-link 
              to="/editor" 
              class="flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Rocket
                :size="18"
                class="mr-2"
              />
              {{ $t('cta.freeTrial', '免费试用') }}
            </router-link>
          </div>
          <!-- 移动端菜单按钮 -->
          <button
            class="md:hidden text-gray-600 hover:text-pink-600 transition-colors p-2"
            :aria-label="$t('nav.mobileMenu', '移动端菜单')"
            @click="toggleMobileMenu"
          >
            <Menu :size="24" />
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        v-show="showMobileMenu"
        class="md:hidden border-t border-pink-100 bg-white/95 backdrop-blur-md"
      >
        <div class="px-4 py-4 space-y-6">
          <!-- AI工具分类 -->
          <div>
            <div class="flex items-center text-sm font-semibold text-gray-900 mb-4">
              <Sparkles
                :size="18"
                class="mr-2 text-pink-600"
              />
              {{ $t('nav.aiTools', 'AI工具') }}
            </div>
            
            <!-- AI增强 -->
            <div class="mb-4">
              <div class="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <Sparkles
                  :size="12"
                  class="mr-1 text-pink-500"
                />
                AI增强
              </div>
              <div class="pl-4 space-y-2">
                <router-link
                  to="/editor"
                  class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  @click="closeMobileMenu"
                >
                  <div class="w-6 h-6 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles
                      :size="12"
                      class="text-white"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center">
                      <span class="font-medium">AI图片放大</span>
                      <CheckCircle
                        :size="12"
                        class="ml-2 text-green-500"
                      />
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            
            <!-- AI编辑 -->
            <div class="mb-4">
              <div class="text-xs font-medium text-gray-500 mb-2 flex items-center">
                <Scissors
                  :size="12"
                  class="mr-1 text-purple-500"
                />
                AI编辑
              </div>
              <div class="pl-4 space-y-2">
                <router-link
                  to="/editor"
                  class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  @click="closeMobileMenu"
                >
                  <div class="w-6 h-6 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Scissors
                      :size="12"
                      class="text-white"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center">
                      <span class="font-medium">AI一键去背景</span>
                      <CheckCircle
                        :size="12"
                        class="ml-2 text-green-500"
                      />
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- 解决方案区域 -->
          <div>
            <div class="flex items-center text-sm font-semibold text-gray-900 mb-4">
              <Users
                :size="18"
                class="mr-2 text-purple-600"
              />
              {{ $t('nav.solutions', '解决方案') }}
            </div>
            <div class="pl-4 grid grid-cols-2 gap-3">
              <router-link
                to="/solutions/personal"
                class="flex flex-col items-center p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg hover:shadow-sm transition-all"
                @click="closeMobileMenu"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-2">
                  <User
                    :size="16"
                    class="text-white"
                  />
                </div>
                <div class="text-xs font-medium text-gray-900">
                  个人用户
                </div>
              </router-link>
              
              <router-link
                to="/solutions/content-creator"
                class="flex flex-col items-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg hover:shadow-sm transition-all"
                @click="closeMobileMenu"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <Video
                    :size="16"
                    class="text-white"
                  />
                </div>
                <div class="text-xs font-medium text-gray-900">
                  内容创作者
                </div>
              </router-link>
              
              <router-link
                to="/solutions/ecommerce"
                class="flex flex-col items-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg hover:shadow-sm transition-all"
                @click="closeMobileMenu"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                  <ShoppingCart
                    :size="16"
                    class="text-white"
                  />
                </div>
                <div class="text-xs font-medium text-gray-900">
                  电商卖家
                </div>
              </router-link>
              
              <router-link
                to="/solutions/designer"
                class="flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-sm transition-all"
                @click="closeMobileMenu"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Target
                    :size="16"
                    class="text-white"
                  />
                </div>
                <div class="text-xs font-medium text-gray-900">
                  设计师
                </div>
              </router-link>
            </div>
          </div>
          
          <!-- 其他导航 -->
          <div class="space-y-3 border-t border-gray-100 pt-4">
            <router-link
              to="/pricing"
              class="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              @click="closeMobileMenu"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <span class="text-gray-600 font-bold text-sm">¥</span>
              </div>
              {{ $t('nav.pricing', '定价') }}
            </router-link>
            
            <router-link
              to="/help"
              class="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              @click="closeMobileMenu"
            >
              <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <span class="text-gray-600 text-lg">?</span>
              </div>
              {{ $t('nav.help', '帮助中心') }}
            </router-link>
          </div>
          
          <!-- 语言切换器 - 移动端 -->
          <div class="pt-4 border-t border-pink-100">
            <div class="flex items-center justify-center">
              <LanguageSwitcher variant="minimal" />
            </div>
          </div>
          
          <!-- 用户认证区域 - 移动端 -->
          <div class="pt-4 border-t border-pink-100 space-y-3">
            <router-link 
              to="/auth/login" 
              class="flex items-center justify-center py-3 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
              @click="closeMobileMenu"
            >
              <LogIn
                :size="18"
                class="mr-2"
              />
              {{ $t('auth.login', '登录') }}
            </router-link>
            
            <router-link 
              to="/editor" 
              class="flex items-center justify-center py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200"
              @click="closeMobileMenu"
            >
              <Rocket
                :size="18"
                class="mr-2"
              />
              {{ $t('cta.freeTrial', '免费试用') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
// 导入图标组件
import {
  Menu, 
  ChevronDown,
  Sparkles,
  Scissors,
  Palette,
  Zap,
  Users,
  User,
  Video,
  ShoppingCart,
  Target,
  LogIn,
  Rocket,
  CheckCircle,
  Timer
} from 'lucide-vue-next'

// 导入组件
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'

export default {
  name: 'AppHeader',
  components: {
    // 图标组件
    Menu,
    ChevronDown,
    Sparkles,
    Scissors,
    Palette,
    Zap,
    Users,
    User,
    Video,
    ShoppingCart,
    Target,
    LogIn,
    Rocket,
    CheckCircle,
    Timer,
    // UI组件
    LanguageSwitcher
  },
  setup() {
    const showMobileMenu = ref(false)
    
    // 切换移动端菜单
    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }
    
    // 关闭移动端菜单
    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    return {
      showMobileMenu,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>
