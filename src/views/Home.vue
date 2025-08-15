<template>
  <div class="min-h-screen">
    <!-- Hero区域 -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-20">
        <div class="max-w-4xl mx-auto">
          <!-- 产品标语 -->
          <div class="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <div class="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse" />
            <span class="text-sm font-medium text-gray-700">专为女性打造的AI图片美化工具</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold gradient-text mb-8 leading-tight">
            让每一张照片都<br>
            <span class="relative">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">完美绽放</span>
              <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
            </span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            轻松去除背景、智能放大图片，使用最先进的AI技术让你的照片瞬间提升专业级品质
          </p>
          
          <!-- CTA按钮组 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              class="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              @click="scrollToUpload"
            >
              <span class="relative z-10 flex items-center">
                <svg
                  class="w-6 h-6 mr-2"
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
                立即免费试用
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button 
              class="glass-effect text-gray-700 px-10 py-5 rounded-full font-semibold text-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
              @click="scrollToDemo"
            >
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              查看功能演示
            </button>
          </div>

          <!-- 实时数据展示 -->
          <div class="bg-gradient-to-r from-pink-50/50 to-purple-50/50 backdrop-blur-sm rounded-3xl p-8 mb-10">
            <div class="text-center mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center">
                <svg
                  class="w-5 h-5 mr-2 text-pink-600"
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
                实时处理数据
              </h3>
              <p class="text-sm text-gray-600">
                AI正在为全球用户提供服务
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  12,847+
                </div>
                <div class="text-sm text-gray-600">
                  总处理图片数
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  256+
                </div>
                <div class="text-sm text-gray-600">
                  今日处理数
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  38秒
                </div>
                <div class="text-sm text-gray-600">
                  平均处理时间
                </div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  4.9/5
                </div>
                <div class="text-sm text-gray-600">
                  用户满意度
                </div>
              </div>
            </div>
          </div>
          
          <!-- 试用信息 -->
          <div class="glass-effect rounded-3xl p-8 max-w-2xl mx-auto">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center">
                <span class="text-2xl mr-2">🎉</span>
                免费试用说明
              </h3>
              <p class="text-gray-600">
                真正免费，无套路，无需信用卡
              </p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
              <div class="flex flex-col items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-3">
                  <div class="w-4 h-4 bg-white rounded-full" />
                </div>
                <div class="text-lg font-semibold text-gray-900 mb-1">
                  每日3次
                </div>
                <span class="text-sm text-gray-600">免费使用</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-3">
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
                <div class="text-lg font-semibold text-gray-900 mb-1">
                  无需注册
                </div>
                <span class="text-sm text-gray-600">立即开始</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-3">
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
                <div class="text-lg font-semibold text-gray-900 mb-1">
                  1分钟
                </div>
                <span class="text-sm text-gray-600">快速完成</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-14 h-14 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mb-3">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div class="text-lg font-semibold text-gray-900 mb-1">
                  隐私安全
                </div>
                <span class="text-sm text-gray-600">数据保护</span>
              </div>
            </div>
            
            <!-- 用户群体标识 -->
            <div class="mt-8 pt-6 border-t border-gray-100">
              <p class="text-center text-sm text-gray-500 mb-4">
                已服务用户群体
              </p>
              <div class="flex justify-center space-x-8 text-xs text-gray-400">
                <div class="text-center">
                  <div class="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <svg
                      class="w-4 h-4 text-pink-600"
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
                  <div>个人用户</div>
                </div>
                <div class="text-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <svg
                      class="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div>内容创作者</div>
                </div>
                <div class="text-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <svg
                      class="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                      />
                    </svg>
                  </div>
                  <div>电商卖家</div>
                </div>
                <div class="text-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                    <svg
                      class="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <div>设计师</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 效果演示区域 -->
      <div
        id="demo-section"
        class="mb-24"
      >
        <div class="text-center mb-16">
          <div class="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <svg
              class="w-4 h-4 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span class="text-sm font-medium text-gray-700">真实处理效果展示</span>
          </div>
          
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            看看<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI处理效果</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            真实案例展示，效果一目了然。每一张图片都经过我们的AI技术精心优化。
          </p>
        </div>
        
        <!-- 增强的演示区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <!-- 背景移除效果 -->
          <div class="glass-effect rounded-3xl p-8 hover-lift">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                AI背景移除
              </h3>
              <p class="text-gray-600">
                智能识别主体，精准去除背景，支持人像、物品等各类图片
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 mb-3 relative overflow-hidden">
                  <div class="w-full h-40 bg-gradient-to-br from-blue-200 via-pink-200 to-purple-200 rounded-lg flex items-center justify-center relative">
                    <!-- 模拟人像 -->
                    <div class="w-20 h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-full relative">
                      <div class="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-pink-600 rounded-full" />
                      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-pink-300 rounded-full" />
                    </div>
                    <!-- 背景装饰 -->
                    <div class="absolute top-4 left-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60" />
                    <div class="absolute bottom-4 right-4 w-6 h-6 bg-green-300 rounded-full opacity-60" />
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">处理前</span>
              </div>
              
              <div class="text-center">
                <div class="bg-white rounded-xl p-6 mb-3 border-2 border-dashed border-gray-300 relative">
                  <div class="w-full h-40 flex items-center justify-center">
                    <!-- 只有人像，无背景 -->
                    <div class="w-20 h-24 bg-gradient-to-b from-pink-400 to-pink-500 rounded-full relative">
                      <div class="absolute top-3 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-pink-600 rounded-full" />
                      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-pink-300 rounded-full" />
                    </div>
                  </div>
                  <!-- 透明背景标识 -->
                  <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    PNG
                  </div>
                </div>
                <span class="text-sm font-medium text-pink-600 bg-pink-50 px-3 py-1 rounded-full">处理后</span>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>🎯 识别精度: 99.2%</span>
              <span>⚡ 处理时间: ~30秒</span>
            </div>
          </div>

          <!-- 图片放大效果 -->
          <div class="glass-effect rounded-3xl p-8 hover-lift">
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
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                AI图片放大
              </h3>
              <p class="text-gray-600">
                深度学习算法重建细节，无损放大至8倍，保持清晰度
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 mb-3">
                  <div class="w-full h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg opacity-75 blur-sm relative">
                      <div class="w-full h-full bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg" />
                      <div class="absolute inset-2 bg-white/20 rounded" />
                    </div>
                  </div>
                </div>
                <span class="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">512x512px</span>
              </div>
              
              <div class="text-center">
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-3">
                  <div class="w-full h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                    <div class="w-24 h-24 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg relative">
                      <div class="w-full h-full bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg" />
                      <div class="absolute inset-3 bg-white/20 rounded" />
                      <div class="absolute inset-1 border border-white/30 rounded-lg" />
                    </div>
                  </div>
                </div>
                <span class="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">2048x2048px</span>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>📈 放大倍数: 4x</span>
              <span>⚡ 处理时间: ~45秒</span>
            </div>
          </div>
        </div>

        <!-- 处理场景示例 -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8">
          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-3">
              适用场景
            </h3>
            <p class="text-gray-600">
              无论是个人使用还是商业用途，我们都能为您提供专业级的处理效果
            </p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-10 h-10 text-white"
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
              <h4 class="font-semibold text-gray-900 mb-2">
                人像摄影
              </h4>
              <p class="text-sm text-gray-600">
                证件照、社交媒体头像、个人写真
              </p>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">
                电商产品
              </h4>
              <p class="text-sm text-gray-600">
                商品主图、详情图、营销素材
              </p>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">
                内容创作
              </h4>
              <p class="text-sm text-gray-600">
                视频缩略图、博客配图、社媒内容
              </p>
            </div>
            
            <div class="text-center">
              <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h4 class="font-semibold text-gray-900 mb-2">
                设计素材
              </h4>
              <p class="text-sm text-gray-600">
                Logo设计、海报制作、UI元素
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传区域 -->
      <div
        id="upload-section"
        class="mb-20"
      >
        <ImageUploader />
      </div>

      <!-- 图片预览区域 -->
      <ImagePreview v-if="hasImage" />

      <!-- 功能介绍区域 -->
      <div
        v-if="!hasImage"
        class="mb-20"
      >
        <ProductIntro />
      </div>

      <!-- 工作流程区域 -->
      <div
        v-if="!hasImage"
        class="mb-20"
      >
        <WorkflowSection />
      </div>

      <!-- 定价预览区域 -->
      <div
        v-if="!hasImage"
        class="mb-20"
      >
        <PricingSection />
      </div>
    </div>

    <!-- 信任保障区域 -->
    <TrustSection />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import ImageUploader from '../components/feature/ImageUploader.vue'
import ImagePreview from '../components/feature/ImagePreview.vue'
import ProductIntro from '../components/feature/ProductIntro.vue'


import { useImageStore } from '../stores/imageStore.js'
import { useTrialManager } from '../composables/business/useTrialManager.js'

// 新增组件
const DemoSection = {
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- 背景移除效果 -->
      <div class="glass-effect rounded-3xl p-6">
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('demo.removeBackground') }}</h3>
          <p class="text-sm text-gray-600">{{ $t('demo.removeBackgroundDesc') }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 mb-2 relative">
              <div class="w-full h-32 bg-gradient-to-br from-blue-200 via-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                <div class="w-16 h-20 bg-pink-400 rounded-full relative">
                  <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full"></div>
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-pink-300 rounded-full"></div>
                </div>
              </div>
            </div>
            <span class="text-sm text-gray-600">{{ $t('demo.before') }}</span>
          </div>
          <div class="text-center">
            <div class="bg-white rounded-xl p-4 mb-2 border-2 border-dashed border-gray-300">
              <div class="w-full h-32 flex items-center justify-center">
                <div class="w-16 h-20 bg-pink-400 rounded-full relative">
                  <div class="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full"></div>
                  <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-pink-300 rounded-full"></div>
                </div>
              </div>
            </div>
            <span class="text-sm text-pink-600 font-medium">{{ $t('demo.after') }}</span>
          </div>
        </div>
      </div>

      <!-- 图片放大效果 -->
      <div class="glass-effect rounded-3xl p-6">
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('demo.imageEnlarge') }}</h3>
          <p class="text-sm text-gray-600">{{ $t('demo.imageEnlargeDesc') }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 mb-2">
              <div class="w-full h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                <div class="w-12 h-12 bg-purple-400 rounded-lg opacity-75 blur-sm">
                  <div class="w-full h-full bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg"></div>
                </div>
              </div>
            </div>
            <span class="text-sm text-gray-600">{{ $t('demo.blurrySmall') }}</span>
          </div>
          <div class="text-center">
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-2">
              <div class="w-full h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center">
                <div class="w-20 h-20 bg-purple-400 rounded-lg">
                  <div class="w-full h-full bg-gradient-to-br from-purple-300 to-purple-500 rounded-lg"></div>
                </div>
              </div>
            </div>
            <span class="text-sm text-purple-600 font-medium">{{ $t('demo.clearLarge') }}</span>
          </div>
        </div>
      </div>
    </div>
  `
}

const WorkflowSection = {
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('workflow.title') }}</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-xl">1</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('workflow.step1') }}</h3>
          <p class="text-gray-600">{{ $t('workflow.step1Desc') }}</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-xl">2</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('workflow.step2') }}</h3>
          <p class="text-gray-600">{{ $t('workflow.step2Desc') }}</p>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-white font-bold text-xl">3</span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('workflow.step3') }}</h3>
          <p class="text-gray-600">{{ $t('workflow.step3Desc') }}</p>
        </div>
      </div>
    </div>
  `
}

const PricingSection = {
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">选择适合你的套餐</h2>
        <p class="text-gray-600 text-lg">灵活定价，满足不同需求</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <!-- 免费版 -->
        <div class="glass-effect rounded-2xl p-6 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">免费试用</h3>
          <div class="text-3xl font-bold text-gray-900 mb-4">¥0</div>
          <ul class="space-y-2 mb-6 text-sm text-gray-600">
            <li>每日3次免费试用</li>
            <li>基础功能</li>
            <li>标准画质输出</li>
          </ul>
          <button class="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
            当前方案
          </button>
        </div>

        <!-- 标准版 - 推荐 -->
        <div class="glass-effect rounded-2xl p-6 text-center border-2 border-pink-200 relative transform scale-105">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">
            推荐
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">标准版</h3>
          <div class="text-3xl font-bold text-gray-900 mb-4">¥29<span class="text-lg font-normal text-gray-500">/月</span></div>
          <ul class="space-y-2 mb-6 text-sm text-gray-600">
            <li>每日50个配额</li>
            <li>全部AI功能</li>
            <li>高清画质输出</li>
            <li>批量处理</li>
          </ul>
          <button class="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            立即升级
          </button>
        </div>

        <!-- 专业版 -->
        <div class="glass-effect rounded-2xl p-6 text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">专业版</h3>
          <div class="text-3xl font-bold text-gray-900 mb-4">¥99<span class="text-lg font-normal text-gray-500">/月</span></div>
          <ul class="space-y-2 mb-6 text-sm text-gray-600">
            <li>每日200个配额</li>
            <li>所有功能</li>
            <li>超高清输出</li>
            <li>API接口</li>
            <li>优先处理</li>
          </ul>
          <button class="w-full py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            了解更多
          </button>
        </div>
      </div>
    </div>
  `
}

const TrustSection = {
  template: `
    <section class="bg-gradient-to-r from-pink-50 to-purple-50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('trust.title') }}</h2>
          <p class="text-gray-600 text-lg">{{ $t('trust.subtitle') }}</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('trust.privacy') }}</h3>
            <p class="text-gray-600 text-sm">{{ $t('trust.privacyDesc') }}</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('trust.technology') }}</h3>
            <p class="text-gray-600 text-sm">{{ $t('trust.technologyDesc') }}</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('trust.service') }}</h3>
            <p class="text-gray-600 text-sm">{{ $t('trust.serviceDesc') }}</p>
          </div>
        </div>
      </div>
    </section>
  `
}

export default {
  name: 'Home',
  components: {
    ImageUploader,
    ImagePreview,
    ProductIntro,

    DemoSection,
    WorkflowSection,
    PricingSection,
    TrustSection
  },
  setup() {
    const imageStore = useImageStore()
    const { initializeTrials } = useTrialManager()
    
    // 计算属性
    const hasImage = computed(() => imageStore.hasImage)
    
    // 滚动到指定区域
    const scrollToUpload = () => {
      document.getElementById('upload-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }
    
    const scrollToDemo = () => {
      document.getElementById('demo-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }
    
    // 组件挂载时初始化
    onMounted(() => {
      // 初始化试用管理
      initializeTrials()
      
      console.log('Home 页面已加载')
    })
    
    return {
      hasImage,
      scrollToUpload,
      scrollToDemo
    }
  }
}
</script>
