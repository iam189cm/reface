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
          <div class="relative group">
            <a href="#features" class="text-gray-700 hover:text-pink-600 font-medium transition-colors flex items-center">
              AI工具
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            <!-- 下拉菜单 -->
            <div class="absolute top-full left-0 mt-2 w-64 glass-effect rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div class="p-4">
                <a href="#remove-bg" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">背景移除</div>
                    <div class="text-sm text-gray-500">一键去除图片背景</div>
                  </div>
                </a>
                <a href="#enlarge" class="flex items-center p-3 hover:bg-pink-50 rounded-lg transition-colors">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">图片放大</div>
                    <div class="text-sm text-gray-500">AI无损放大图片</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <a href="#pricing" class="text-gray-700 hover:text-pink-600 font-medium transition-colors">定价</a>
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
        <div class="px-4 py-4 space-y-3">
          <!-- AI工具区域 -->
          <div class="border-l-3 border-pink-300 pl-4">
            <div class="text-sm font-semibold text-gray-900 mb-2">AI工具</div>
            <div class="space-y-2">
              <a href="#remove-bg" @click="closeMobileMenu" class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2"></path>
                  </svg>
                </div>
                背景移除
              </a>
              
              <a href="#enlarge" @click="closeMobileMenu" class="flex items-center py-2 text-sm text-gray-600 hover:text-pink-600 transition-colors">
                <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5"></path>
                  </svg>
                </div>
                图片放大
              </a>
            </div>
          </div>
          
          <!-- 其他导航 -->
          <div class="space-y-2">
            <a href="#pricing" @click="closeMobileMenu" class="block py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">定价</a>
            <a href="#help" @click="closeMobileMenu" class="block py-2 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">帮助</a>
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
