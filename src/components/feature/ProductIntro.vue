<template>
  <div class="mt-16">
    <!-- 主要功能介绍 -->
    <div class="text-center mb-12">
      <h3 class="text-2xl font-bold text-gray-800 mb-4">
        {{ $t('intro.title') }}
      </h3>
      <p class="text-gray-600 max-w-2xl mx-auto">
        {{ $t('intro.subtitle') }}
      </p>
    </div>

    <!-- 功能卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- AI 背景移除 -->
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center border border-pink-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2M7 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2"></path>
          </svg>
        </div>
        <h4 class="text-xl font-semibold text-gray-800 mb-3">{{ $t('tools.removeBackground.name') }}</h4>
        <p class="text-gray-600 leading-relaxed">{{ $t('intro.removeBackgroundDesc') }}</p>
        <div class="mt-4 text-sm text-blue-600 font-medium">
          {{ $t('intro.oneClick') }}
        </div>
      </div>

      <!-- AI 图片放大 -->
      <div class="bg-white/70 backdrop-blur-md rounded-2xl p-8 text-center border border-pink-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
          </svg>
        </div>
        <h4 class="text-xl font-semibold text-gray-800 mb-3">{{ $t('tools.imageEnlarger.name') }}</h4>
        <p class="text-gray-600 leading-relaxed">{{ $t('intro.imageEnlargerDesc') }}</p>
        <div class="mt-4 text-sm text-green-600 font-medium">
          {{ $t('intro.highQuality') }}
        </div>
      </div>
    </div>

    <!-- 快速开始 -->
    <div class="text-center mt-12">
      <div class="inline-flex items-center bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
        <div class="mr-4">
          <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <div class="text-left">
          <h5 class="font-semibold text-gray-800 mb-1">{{ $t('intro.quickStart') }}</h5>
          <p class="text-gray-600 text-sm">{{ $t('intro.freeTrialInfo') }}</p>
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
