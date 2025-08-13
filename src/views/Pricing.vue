<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- 页面标题 -->
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {{ $t('pricing.title') }}
      </h1>
      <p class="text-gray-600 text-xl max-w-3xl mx-auto">
        {{ $t('pricing.subtitle') }}
      </p>
    </div>

    <!-- 定价卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
      <!-- 免费试用 -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('pricing.free.name') }}</h3>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            ¥0
            <span class="text-lg font-normal text-gray-500">/{{ $t('pricing.free.period') }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-6">{{ $t('pricing.free.desc') }}</p>
        </div>
        
        <ul class="space-y-3 mb-8">
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.free.features.0') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.free.features.1') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.free.features.2') }}
          </li>
        </ul>
        
        <button class="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          {{ $t('pricing.currentPlan') }}
        </button>
      </div>

      <!-- 体验包 -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('pricing.basic.name') }}</h3>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            ¥{{ $t('pricing.basic.price') }}
            <span class="text-lg font-normal text-gray-500">/{{ $t('pricing.basic.period') }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-6">{{ $t('pricing.basic.desc') }}</p>
        </div>
        
        <ul class="space-y-3 mb-8">
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.basic.features.0') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.basic.features.1') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.basic.features.2') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.basic.features.3') }}
          </li>
        </ul>
        
        <button class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          {{ $t('pricing.choosePlan') }}
        </button>
      </div>

      <!-- 标准包 - 推荐 -->
      <div class="bg-white rounded-2xl shadow-xl border-2 border-pink-200 p-8 relative transform scale-105">
        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
            {{ $t('pricing.recommended') }}
          </span>
        </div>
        
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('pricing.standard.name') }}</h3>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            ¥{{ $t('pricing.standard.price') }}
            <span class="text-lg font-normal text-gray-500">/{{ $t('pricing.standard.period') }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-6">{{ $t('pricing.standard.desc') }}</p>
        </div>
        
        <ul class="space-y-3 mb-8">
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.standard.features.0') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.standard.features.1') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.standard.features.2') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.standard.features.3') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.standard.features.4') }}
          </li>
        </ul>
        
        <button class="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200">
          {{ $t('pricing.choosePlan') }}
        </button>
      </div>

      <!-- 超值包 -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative">
        <div class="text-center">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('pricing.premium.name') }}</h3>
          <div class="text-3xl font-bold text-gray-900 mb-1">
            ¥{{ $t('pricing.premium.price') }}
            <span class="text-lg font-normal text-gray-500">/{{ $t('pricing.premium.period') }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-6">{{ $t('pricing.premium.desc') }}</p>
        </div>
        
        <ul class="space-y-3 mb-8">
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.0') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.1') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.2') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.3') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.4') }}
          </li>
          <li class="flex items-center text-sm">
            <svg class="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ $t('pricing.premium.features.5') }}
          </li>
        </ul>
        
        <button class="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
          {{ $t('pricing.choosePlan') }}
        </button>
      </div>
    </div>

    <!-- 常见问题 -->
    <div class="mt-20 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold text-center text-gray-900 mb-12">{{ $t('pricing.faq.title') }}</h2>
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-2">{{ $t('pricing.faq.q1') }}</h3>
          <p class="text-gray-600">{{ $t('pricing.faq.a1') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-2">{{ $t('pricing.faq.q2') }}</h3>
          <p class="text-gray-600">{{ $t('pricing.faq.a2') }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 class="font-semibold text-gray-900 mb-2">{{ $t('pricing.faq.q3') }}</h3>
          <p class="text-gray-600">{{ $t('pricing.faq.a3') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pricing'
}
</script>
