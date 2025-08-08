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
        
        <!-- 导航菜单 -->
        <div class="flex space-x-4">
          <NavLink to="/" :active="$route.path === '/'">
            首页
          </NavLink>
          <NavLink to="/editor" :active="$route.path === '/editor'">
            编辑器
          </NavLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
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
  }
}
</script>
