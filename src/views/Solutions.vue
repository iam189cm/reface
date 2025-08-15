<template>
  <div class="min-h-screen">
    <!-- Hero区域 -->
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="text-center mb-20">
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3 3 3 0 013 3v2a3 3 0 01-3 3z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700">为不同用户群体定制解决方案</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">专业解决方案</span><br>
          满足每个用户的需求
        </h1>
        
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          无论你是个人用户、内容创作者、电商卖家还是专业设计师，我们都为你准备了最适合的AI图片处理解决方案
        </p>

        <!-- 快速导航 -->
        <div class="flex flex-wrap justify-center gap-4 mb-16">
          <button
            class="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            @click="scrollToSection('personal')"
          >
            👩‍💼 个人用户
          </button>
          <button
            class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            @click="scrollToSection('creators')"
          >
            🎨 内容创作者
          </button>
          <button
            class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            @click="scrollToSection('ecommerce')"
          >
            🛍️ 电商卖家
          </button>
          <button
            class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
            @click="scrollToSection('designers')"
          >
            ✨ 设计师
          </button>
        </div>
      </div>

      <!-- 个人用户解决方案 -->
      <section
        id="personal"
        class="mb-24"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
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
              <div>
                <h2 class="text-3xl font-bold text-gray-900">
                  个人用户解决方案
                </h2>
                <p class="text-gray-600">
                  让你的个人照片更加完美
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    证件照处理
                  </h3>
                  <p class="text-gray-600">
                    一键更换证件照背景，支持红色、蓝色、白色等标准背景
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    社交媒体头像
                  </h3>
                  <p class="text-gray-600">
                    优化个人头像，去除杂乱背景，突出个人形象
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    生活照片优化
                  </h3>
                  <p class="text-gray-600">
                    提升老照片分辨率，恢复珍贵回忆的清晰度
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
              <h4 class="font-semibold text-gray-900 mb-3">
                💝 个人用户特惠
              </h4>
              <p class="text-gray-600 mb-4">
                每天3次免费试用，体验所有基础功能
              </p>
              <button class="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                立即免费试用
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">
                使用场景示例
              </h4>
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="text-xs">证件</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      求职简历照片
                    </div>
                    <div class="text-xs text-gray-500">
                      专业白底证件照
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span class="text-xs">社交</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      微信朋友圈头像
                    </div>
                    <div class="text-xs text-gray-500">
                      突出个人形象
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span class="text-xs">回忆</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">
                      老照片修复
                    </div>
                    <div class="text-xs text-gray-500">
                      提升分辨率和清晰度
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-3">
                👥 用户反馈
              </h4>
              <div class="text-sm text-gray-600 italic mb-2">
                "真的很方便！证件照背景一键就换好了，省了去照相馆的钱。"
              </div>
              <div class="text-xs text-gray-500">
                - 王小姐，职场新人
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 内容创作者解决方案 -->
      <section
        id="creators"
        class="mb-24"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1 space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">
                创作效率提升
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                  <div class="text-2xl font-bold text-purple-600 mb-1">
                    3倍
                  </div>
                  <div class="text-sm text-gray-600">
                    效率提升
                  </div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600 mb-1">
                    90%
                  </div>
                  <div class="text-sm text-gray-600">
                    时间节省
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-3">
                🎥 热门用途
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>YouTube视频缩略图制作</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Instagram故事背景制作</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-pink-500 rounded-full" />
                  <span>博客文章配图优化</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
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
              <div>
                <h2 class="text-3xl font-bold text-gray-900">
                  内容创作者解决方案
                </h2>
                <p class="text-gray-600">
                  提升内容质量，加速创作流程
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    视频缩略图制作
                  </h3>
                  <p class="text-gray-600">
                    快速制作吸引眼球的YouTube、B站视频封面
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    社媒内容素材
                  </h3>
                  <p class="text-gray-600">
                    Instagram、小红书等平台内容配图快速制作
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    品牌素材处理
                  </h3>
                  <p class="text-gray-600">
                    统一品牌视觉风格，批量处理营销素材
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
              <h4 class="font-semibold text-gray-900 mb-3">
                🚀 创作者专属
              </h4>
              <p class="text-gray-600 mb-4">
                高频使用用户可享受批量处理和优先处理特权
              </p>
              <button class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                了解创作者计划
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 电商卖家解决方案 -->
      <section
        id="ecommerce"
        class="mb-24"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4">
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
                    d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900">
                  电商卖家解决方案
                </h2>
                <p class="text-gray-600">
                  提升转化率，统一店铺视觉
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    产品主图优化
                  </h3>
                  <p class="text-gray-600">
                    统一白底背景，符合电商平台规范，提升点击率
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    批量图片处理
                  </h3>
                  <p class="text-gray-600">
                    一次上传多张图片，批量去背景，大幅提升工作效率
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    营销素材制作
                  </h3>
                  <p class="text-gray-600">
                    快速制作促销Banner、详情页配图等营销素材
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl">
              <h4 class="font-semibold text-gray-900 mb-3">
                💰 ROI提升
              </h4>
              <p class="text-gray-600 mb-4">
                专业的产品图片可提升20-30%的转化率
              </p>
              <button class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                查看电商套餐
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">
                效果对比
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="w-full h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 flex items-center justify-center">
                    <div class="text-xs text-gray-500">
                      原图
                    </div>
                  </div>
                  <div class="text-sm font-medium text-gray-600">
                    点击率: 2.3%
                  </div>
                </div>
                <div class="text-center">
                  <div class="w-full h-24 bg-white border-2 border-gray-200 rounded-lg mb-2 flex items-center justify-center">
                    <div class="text-xs text-green-600">
                      优化后
                    </div>
                  </div>
                  <div class="text-sm font-medium text-green-600">
                    点击率: 3.2%
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-3">
                📊 成功案例
              </h4>
              <div class="text-sm text-gray-600 italic mb-2">
                "使用Reface后，我们店铺的主图点击率提升了28%，转化率也明显改善。"
              </div>
              <div class="text-xs text-gray-500">
                - 张先生，服装电商店主
              </div>
            </div>

            <div class="glass-effect rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-3">
                🛍️ 平台支持
              </h4>
              <div class="flex flex-wrap gap-2">
                <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">淘宝</span>
                <span class="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">天猫</span>
                <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">京东</span>
                <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">拼多多</span>
                <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">抖音小店</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 设计师解决方案 -->
      <section
        id="designers"
        class="mb-24"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1 space-y-6">
            <div class="glass-effect rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-4">
                专业工具集成
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Photoshop插件</span>
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">即将推出</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Figma插件</span>
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">开发中</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">API接口</span>
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">已支持</span>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6">
              <h4 class="font-semibold text-gray-900 mb-3">
                ⚡ 专业特性
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>高分辨率输出(最高8K)</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full" />
                  <span>批量API调用</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>自定义参数调节</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-1 lg:order-2">
            <div class="flex items-center mb-6">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900">
                  设计师解决方案
                </h2>
                <p class="text-gray-600">
                  专业级工具，提升设计效率
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    素材快速抠图
                  </h3>
                  <p class="text-gray-600">
                    精确到像素级的抠图效果，节省手动抠图时间
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    高分辨率放大
                  </h3>
                  <p class="text-gray-600">
                    支持最高8K分辨率输出，满足印刷级设计需求
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">
                    API接口集成
                  </h3>
                  <p class="text-gray-600">
                    集成到现有工作流程，支持批量处理和自动化
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <h4 class="font-semibold text-gray-900 mb-3">
                🎯 专业版权益
              </h4>
              <p class="text-gray-600 mb-4">
                享受专业级功能和优先技术支持
              </p>
              <button class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                申请专业版试用
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 对比表格 -->
      <section class="mb-24">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            选择最适合的方案
          </h2>
          <p class="text-gray-600">
            根据使用需求选择对应的解决方案
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full glass-effect rounded-2xl overflow-hidden">
            <thead class="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <tr>
                <th class="p-4 text-left">
                  功能特性
                </th>
                <th class="p-4 text-center">
                  个人用户
                </th>
                <th class="p-4 text-center">
                  内容创作者
                </th>
                <th class="p-4 text-center">
                  电商卖家
                </th>
                <th class="p-4 text-center">
                  专业设计师
                </th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr class="border-b border-gray-100">
                <td class="p-4 font-medium">
                  每日免费次数
                </td>
                <td class="p-4 text-center">
                  3次
                </td>
                <td class="p-4 text-center">
                  10次
                </td>
                <td class="p-4 text-center">
                  20次
                </td>
                <td class="p-4 text-center">
                  50次
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
                  4K
                </td>
                <td class="p-4 text-center">
                  4K
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
                  API接口
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
                  邮件
                </td>
                <td class="p-4 text-center">
                  专线
                </td>
                <td class="p-4 text-center">
                  1对1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="text-center">
        <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white">
          <h2 class="text-3xl font-bold mb-4">
            准备好开始了吗？
          </h2>
          <p class="text-pink-100 mb-8 max-w-2xl mx-auto">
            无论你属于哪个群体，我们都有适合的解决方案。立即开始免费试用，体验AI图片处理的强大功能。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all duration-200 hover:scale-105">
              立即免费试用
            </button>
            <button class="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-all duration-200">
              联系销售咨询
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Solutions',
  setup() {
    // 滚动到指定区域
    const scrollToSection = (sectionId) => {
      document.getElementById(sectionId)?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }
    
    return {
      scrollToSection
    }
  }
}
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
