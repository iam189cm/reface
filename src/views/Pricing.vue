<template>
  <div class="min-h-screen">
    <!-- Hero区域 -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-20">
        <div class="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 rounded-full px-4 py-2 mb-6">
          <svg
            class="w-4 h-4 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700">灵活定价，满足所有需求</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">透明定价</span><br>
          无隐藏费用
        </h1>
        
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          从个人免费试用到企业级解决方案，选择最适合你的AI图片处理方案。所有价格均为永久有效配额，无月费压力。
        </p>

        <!-- 计费周期选择 -->
        <div class="inline-flex bg-gray-100 rounded-full p-1 mb-12">
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              billingCycle === 'credits' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="billingCycle = 'credits'"
          >
            💎 按次付费
          </button>
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              billingCycle === 'monthly' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="billingCycle = 'monthly'"
          >
            📅 月度套餐
          </button>
        </div>

        <!-- 价值主张 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">
              即开即用
            </h3>
            <p class="text-sm text-gray-600">
              无需安装软件，在线即可使用
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">
              数据安全
            </h3>
            <p class="text-sm text-gray-600">
              处理完成后自动删除，保护隐私
            </p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">
              品质保证
            </h3>
            <p class="text-sm text-gray-600">
              业界领先的AI技术，效果有保障
            </p>
          </div>
        </div>
      </div>

      <!-- 定价卡片 -->
      <div
        v-show="billingCycle === 'credits'"
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20"
      >
        <!-- 体验包 -->
        <div class="glass-effect rounded-3xl p-8 hover-lift transition-all duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              体验包
            </h3>
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ¥9.9
              <span class="text-lg font-normal text-gray-500">/10次</span>
            </div>
            <p class="text-gray-600">
              适合轻度使用用户
            </p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">每次成本</span>
              <span class="text-lg font-bold text-blue-600">¥0.99</span>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <h4 class="font-semibold text-gray-900 mb-2">
                包含功能
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI背景移除
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI图片放大(2x)
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  高清画质输出
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  配额永久有效
                </li>
              </ul>
            </div>
          </div>
          
          <button class="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105">
            立即购买
          </button>
        </div>

        <!-- 标准包 - 推荐 -->
        <div class="glass-effect rounded-3xl p-8 border-2 border-pink-200 relative hover-lift transition-all duration-300 scale-105">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🔥 推荐
            </span>
          </div>
          
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              标准包
            </h3>
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ¥39.9
              <span class="text-lg font-normal text-gray-500">/50次</span>
            </div>
            <div class="flex items-center justify-center space-x-2 mb-2">
              <span class="text-sm text-gray-500 line-through">¥49.9</span>
              <span class="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">省¥10</span>
            </div>
            <p class="text-gray-600">
              最受欢迎的选择
            </p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">每次成本</span>
              <span class="text-lg font-bold text-pink-600">¥0.80</span>
            </div>
            <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
              <h4 class="font-semibold text-gray-900 mb-2">
                包含功能
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  体验包所有功能
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI图片放大(4x)
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  超高清画质输出
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  优先处理队列
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  邮件技术支持
                </li>
              </ul>
            </div>
          </div>
          
          <button class="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all duration-200 hover:scale-105">
            立即购买
          </button>
        </div>

        <!-- 超值包 -->
        <div class="glass-effect rounded-3xl p-8 hover-lift transition-all duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              超值包
            </h3>
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ¥69.9
              <span class="text-lg font-normal text-gray-500">/100次</span>
            </div>
            <div class="flex items-center justify-center space-x-2 mb-2">
              <span class="text-sm text-gray-500 line-through">¥99.9</span>
              <span class="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">省¥30</span>
            </div>
            <p class="text-gray-600">
              高频使用最划算
            </p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">每次成本</span>
              <span class="text-lg font-bold text-purple-600">¥0.70</span>
            </div>
            <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
              <h4 class="font-semibold text-gray-900 mb-2">
                包含功能
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  标准包所有功能
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI图片放大(8x)
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  批量处理功能
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  专属技术支持
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  API接口访问
                </li>
              </ul>
            </div>
          </div>
          
          <button class="w-full py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200 hover:scale-105">
            立即购买
          </button>
        </div>
      </div>

      <!-- 月度套餐 -->
      <div
        v-show="billingCycle === 'monthly'"
        class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20"
      >
        <!-- 个人月度 -->
        <div class="glass-effect rounded-3xl p-8 hover-lift transition-all duration-300">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              个人版
            </h3>
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ¥29
              <span class="text-lg font-normal text-gray-500">/月</span>
            </div>
            <p class="text-gray-600">
              每月100次处理配额
            </p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 class="font-semibold text-gray-900 mb-3">
                包含功能
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  每月100次AI处理
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI背景移除
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI图片放大(4x)
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  高清画质输出
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  邮件技术支持
                </li>
              </ul>
            </div>
          </div>
          
          <button class="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200">
            选择个人版
          </button>
        </div>

        <!-- 企业月度 -->
        <div class="glass-effect rounded-3xl p-8 border-2 border-blue-200 relative hover-lift transition-all duration-300">
          <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              🚀 企业推荐
            </span>
          </div>
          
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">
              企业版
            </h3>
            <div class="text-4xl font-bold text-gray-900 mb-2">
              ¥99
              <span class="text-lg font-normal text-gray-500">/月</span>
            </div>
            <p class="text-gray-600">
              每月500次处理配额
            </p>
          </div>
          
          <div class="space-y-4 mb-8">
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h4 class="font-semibold text-gray-900 mb-3">
                包含功能
              </h4>
              <ul class="space-y-2 text-sm">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  每月500次AI处理
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  个人版所有功能
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  AI图片放大(8x)
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  API接口访问
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  批量处理功能
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  专属客服支持
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  发票和合同支持
                </li>
              </ul>
            </div>
          </div>
          
          <button class="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition-all duration-200">
            选择企业版
          </button>
        </div>
      </div>

      <!-- 功能对比表格 -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            功能对比一览
          </h2>
          <p class="text-gray-600">
            详细了解不同套餐包含的功能和服务
          </p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full glass-effect rounded-2xl overflow-hidden">
            <thead class="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <tr>
                <th class="p-4 text-left font-bold">
                  功能特性
                </th>
                <th class="p-4 text-center font-bold">
                  免费试用
                </th>
                <th class="p-4 text-center font-bold">
                  体验包
                </th>
                <th class="p-4 text-center font-bold">
                  标准包
                </th>
                <th class="p-4 text-center font-bold">
                  超值包
                </th>
                <th class="p-4 text-center font-bold">
                  企业版
                </th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  AI背景移除
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  AI图片放大
                </td>
                <td class="p-4 text-center">
                  2x
                </td>
                <td class="p-4 text-center">
                  2x
                </td>
                <td class="p-4 text-center">
                  4x
                </td>
                <td class="p-4 text-center">
                  8x
                </td>
                <td class="p-4 text-center">
                  8x
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  处理配额
                </td>
                <td class="p-4 text-center">
                  每日3次
                </td>
                <td class="p-4 text-center">
                  10次
                </td>
                <td class="p-4 text-center">
                  50次
                </td>
                <td class="p-4 text-center">
                  100次
                </td>
                <td class="p-4 text-center">
                  每月500次
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  最大分辨率
                </td>
                <td class="p-4 text-center">
                  2K
                </td>
                <td class="p-4 text-center">
                  2K
                </td>
                <td class="p-4 text-center">
                  4K
                </td>
                <td class="p-4 text-center">
                  8K
                </td>
                <td class="p-4 text-center">
                  8K
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  批量处理
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  API接口
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  优先处理
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ❌
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
                <td class="p-4 text-center">
                  ✅
                </td>
              </tr>
              <tr>
                <td class="p-4 font-medium">
                  技术支持
                </td>
                <td class="p-4 text-center">
                  社区
                </td>
                <td class="p-4 text-center">
                  社区
                </td>
                <td class="p-4 text-center">
                  邮件
                </td>
                <td class="p-4 text-center">
                  邮件+在线
                </td>
                <td class="p-4 text-center">
                  专属客服
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 用户评价 -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            用户怎么说
          </h2>
          <p class="text-gray-600">
            来看看真实用户的使用感受
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="glass-effect rounded-2xl p-6 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">李</span>
            </div>
            <div class="mb-4">
              <div class="flex justify-center mb-2">
                <span class="text-yellow-400 text-lg">★★★★★</span>
              </div>
              <h4 class="font-semibold text-gray-900">
                李小姐
              </h4>
              <p class="text-sm text-gray-500">
                自由设计师
              </p>
            </div>
            <p class="text-gray-600 text-sm italic">
              "每次成本只要0.8元，比其他平台便宜很多。处理效果很满意，已经推荐给同事了。"
            </p>
          </div>
          
          <div class="glass-effect rounded-2xl p-6 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">王</span>
            </div>
            <div class="mb-4">
              <div class="flex justify-center mb-2">
                <span class="text-yellow-400 text-lg">★★★★★</span>
              </div>
              <h4 class="font-semibold text-gray-900">
                王先生
              </h4>
              <p class="text-sm text-gray-500">
                电商店主
              </p>
            </div>
            <p class="text-gray-600 text-sm italic">
              "标准包50次配额很够用，产品图片质量提升明显，转化率提高了20%。"
            </p>
          </div>
          
          <div class="glass-effect rounded-2xl p-6 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-white font-bold text-xl">张</span>
            </div>
            <div class="mb-4">
              <div class="flex justify-center mb-2">
                <span class="text-yellow-400 text-lg">★★★★★</span>
              </div>
              <h4 class="font-semibold text-gray-900">
                张女士
              </h4>
              <p class="text-sm text-gray-500">
                内容创作者
              </p>
            </div>
            <p class="text-gray-600 text-sm italic">
              "超值包的批量处理功能太实用了！一次能处理几十张图，节省了大量时间。"
            </p>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="mb-20 max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            常见问题
          </h2>
          <p class="text-gray-600">
            为你解答定价相关的疑问
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    配额会过期吗？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    购买的配额永久有效，无使用期限。您可以随时使用您的AI处理配额，我们不会强制过期。
                  </p>
                </div>
              </div>
            </div>
            
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    支持什么支付方式？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    支持支付宝、微信支付、银行卡等多种支付方式。企业用户还可以申请发票和合同。
                  </p>
                </div>
              </div>
            </div>
            
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    处理失败会扣配额吗？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    不会。只有处理成功的图片才会消耗配额。如果因为系统原因处理失败，不会扣除您的配额。
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    可以退款吗？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    已使用的配额不支持退款。未使用的配额在购买后7天内可以申请退款，我们会在2个工作日内处理。
                  </p>
                </div>
              </div>
            </div>
            
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    企业版有什么额外服务？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    企业版提供API接口、批量处理、专属客服、发票合同等服务，还可根据需求定制功能。
                  </p>
                </div>
              </div>
            </div>
            
            <div class="glass-effect rounded-2xl p-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm">Q</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">
                    图片数据安全吗？
                  </h3>
                  <p class="text-gray-600 text-sm">
                    非常安全。我们采用企业级加密传输，处理完成后会自动删除图片，绝不保存用户数据。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA区域 -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-white">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            选择最适合的套餐
          </h2>
          <p class="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
            无论你是个人用户还是企业客户，我们都有合适的定价方案。立即开始，让AI为你的图片加分！
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              立即免费试用
            </button>
            <button class="border border-white text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-200">
              联系销售咨询
            </button>
          </div>
          
          <!-- 保障信息 -->
          <div class="mt-8 pt-6 border-t border-white/20">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div class="flex items-center justify-center space-x-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm">7天无理由退款</span>
              </div>
              <div class="flex items-center justify-center space-x-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span class="text-sm">数据安全保护</span>
              </div>
              <div class="flex items-center justify-center space-x-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span class="text-sm">专业技术支持</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Pricing',
  setup() {
    const billingCycle = ref('credits')
    
    return {
      billingCycle
    }
  }
}
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-8px);
  transition: transform 0.3s ease;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
