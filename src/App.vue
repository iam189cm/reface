<template>
  <div id="app" class="min-h-screen bg-gradient-rainbow">
    <!-- 导航栏 -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-100">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">R</span>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Reface
            </h1>
          </router-link>
          
          <div class="flex space-x-4">
            <router-link 
              to="/" 
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              :class="$route.path === '/' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-pink-500'"
            >
              首页
            </router-link>
            <router-link 
              to="/editor" 
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
              :class="$route.path === '/editor' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-600 hover:text-pink-500'"
            >
              编辑器
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>