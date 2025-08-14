<template>
  <nav class="glass-effect shadow-lg border-b border-pink-100 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo区域 -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-lg">R</span>
          </div>
          <h1 class="text-2xl font-bold gradient-text">Reface</h1>
        </div>
        
        <!-- 中间导航 -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-gray-700 hover:text-pink-600 font-medium transition-colors">首页</a>
          
          <!-- AI工具下拉菜单 -->
          <div class="relative group">
            <a href="#features" class="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center">
              AI工具
              <svg class="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            <!-- AI工具下拉菜单 -->
            <div class="absolute top-full left-0 mt-2 w-80 glass-effect rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div class="p-4">
                <div class="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">当前功能</div>
                <a href="#background-remover" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">AI背景移除</div>
                    <div class="text-sm text-gray-500">智能识别主体，一键去除背景</div>
                  </div>
                </a>
                <a href="#enlarge" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">AI图片放大</div>
                    <div class="text-sm text-gray-500">无损放大至8倍，保持清晰度</div>
                  </div>
                </a>
                <div class="border-t border-gray-100 mt-3 pt-3">
                  <div class="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">即将上线</div>
                  <div class="flex items-center p-3 rounded-lg bg-gray-50 mb-2">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mr-3 opacity-60">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-600">美颜滤镜</div>
                      <div class="text-sm text-gray-400">实时美颜效果预览</div>
                    </div>
                  </div>
                  <div class="flex items-center p-3 rounded-lg bg-gray-50">
                    <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 opacity-60">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-600">批量处理</div>
                      <div class="text-sm text-gray-400">一次处理多张图片</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 解决方案下拉菜单 -->
          <div class="relative group">
            <a href="#solutions" class="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center">
              解决方案
              <svg class="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            <!-- 解决方案下拉菜单 -->
            <div class="absolute top-full left-0 mt-2 w-72 glass-effect rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div class="p-4">
                <a href="#personal" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">个人用户</div>
                    <div class="text-sm text-gray-500">社交媒体，生活照片美化</div>
                  </div>
                </a>
                <a href="#creators" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">内容创作者</div>
                    <div class="text-sm text-gray-500">视频缩略图，内容素材制作</div>
                  </div>
                </a>
                <a href="#ecommerce" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">电商卖家</div>
                    <div class="text-sm text-gray-500">产品图片优化，背景统一</div>
                  </div>
                </a>
                <a href="#designers" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">设计师</div>
                    <div class="text-sm text-gray-500">素材快速抠图，专业级处理</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a href="#pricing" class="text-gray-700 hover:text-pink-600 font-medium transition-colors">定价</a>
          <a href="#showcase" class="text-gray-700 hover:text-pink-600 font-medium transition-colors">案例</a>
          <a href="#help" class="text-gray-700 hover:text-pink-600 font-medium transition-colors">帮助</a>
        </div>

        <!-- 右侧按钮 -->
        <div class="flex items-center space-x-4">
          <div class="hidden md:flex items-center space-x-2">
            <span class="text-sm text-gray-600">中文</span>
            <button class="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
              </svg>
            </button>
          </div>
          <button class="hidden md:block text-gray-600 hover:text-pink-600 font-medium transition-colors">登录</button>
          <button class="hidden md:block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105">
            免费试用
          </button>
          <!-- 移动端菜单按钮 -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden text-gray-600 hover:text-pink-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div 
        v-show="showMobileMenu"
        class="md:hidden border-t border-pink-100 bg-white/95 backdrop-blur-md"
      >
        <div class="px-4 py-4 space-y-4">
          <!-- AI工具区域 -->
          <div>
            <div class="flex items-center text-sm font-semibold text-gray-900 mb-3">
              <svg class="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              AI工具
            </div>
            <div class="pl-6 space-y-3">
              <a href="#background-remover" @click="closeMobileMenu" class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">AI背景移除</div>
                  <div class="text-xs text-gray-400">智能识别主体，一键去除背景</div>
                </div>
              </a>
              
              <a href="#enlarge" @click="closeMobileMenu" class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                <div class="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
                  </svg>
                </div>
                <div>
                  <div class="font-medium">AI图片放大</div>
                  <div class="text-xs text-gray-400">无损放大至8倍，保持清晰度</div>
                </div>
              </a>
            </div>
          </div>

          <!-- 解决方案区域 -->
          <div>
            <div class="flex items-center text-sm font-semibold text-gray-900 mb-3">
              <svg class="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3zM16 3a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              解决方案
            </div>
            <div class="pl-6 grid grid-cols-2 gap-3">
              <a href="#personal" @click="closeMobileMenu" class="flex flex-col items-center p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg hover:shadow-sm transition-all">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div class="text-xs font-medium text-gray-900">个人用户</div>
              </a>
              <a href="#creators" @click="closeMobileMenu" class="flex flex-col items-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg hover:shadow-sm transition-all">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </div>
                <div class="text-xs font-medium text-gray-900">内容创作者</div>
              </a>
              <a href="#ecommerce" @click="closeMobileMenu" class="flex flex-col items-center p-3 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg hover:shadow-sm transition-all">
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"></path>
                  </svg>
                </div>
                <div class="text-xs font-medium text-gray-900">电商卖家</div>
              </a>
              <a href="#designers" @click="closeMobileMenu" class="flex flex-col items-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-sm transition-all">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
                  </svg>
                </div>
                <div class="text-xs font-medium text-gray-900">设计师</div>
              </a>
            </div>
          </div>
          
          <!-- 其他导航 -->
          <div class="space-y-2 border-t border-gray-100 pt-4">
            <a href="#pricing" @click="closeMobileMenu" class="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              定价
            </a>
            <a href="#showcase" @click="closeMobileMenu" class="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              案例展示
            </a>
            <a href="#help" @click="closeMobileMenu" class="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
              <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              帮助中心
            </a>
          </div>
          
          <!-- 语言切换器 -->
          <div class="pt-3 border-t border-pink-100">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">中文</span>
              <button class="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 用户认证区域 - 移动端 -->
          <div class="pt-3 border-t border-pink-100 space-y-3">
            <button class="block text-center py-2 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">登录</button>
            <button class="block w-full text-center py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200">免费试用</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppHeader',
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
