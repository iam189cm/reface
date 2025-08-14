<template>
  <div class="max-w-6xl mx-auto">
    <!-- 主要功能介绍 -->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">
        {{ $t('intro.title') }}
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        {{ $t('intro.subtitle') }}
      </p>
    </div>

    <!-- 功能卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- AI 背景移除 -->
      <div class="glass-effect rounded-3xl p-8 hover-lift">
        <div class="flex items-start space-x-6">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2M7 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('tools.removeBackground.name') }}</h3>
            <p class="text-gray-600 leading-relaxed mb-4">
              {{ $t('intro.removeBackgroundDesc') }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-pink-600 font-medium">{{ $t('intro.oneClick') }}</span>
              <button class="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-200 transition-colors">
                立即试用
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI 图片放大 -->
      <div class="glass-effect rounded-3xl p-8 hover-lift">
        <div class="flex items-start space-x-6">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('tools.imageEnlarger.name') }}</h3>
            <p class="text-gray-600 leading-relaxed mb-4">
              {{ $t('intro.imageEnlargerDesc') }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-purple-600 font-medium">{{ $t('intro.highQuality') }}</span>
              <button class="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
                立即试用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductIntro'
}
</script>
