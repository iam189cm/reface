<template>
  <div class="min-h-screen">
    <!-- Hero区域 -->
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center mb-16">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-6xl font-bold gradient-text mb-6">
            {{ $t('home.title') }}
            <br>{{ $t('home.subtitle') }}
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ $t('home.description') }}
          </p>
          
          <!-- CTA按钮组 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              @click="scrollToUpload"
              class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 pulse-soft"
            >
              {{ $t('home.startNow') }}
            </button>
            <button 
              @click="scrollToDemo"
              class="glass-effect text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              {{ $t('home.viewDemo') }}
            </button>
          </div>
          
          <!-- 试用信息 -->
          <div class="glass-effect rounded-2xl p-6 max-w-lg mx-auto">
            <div class="text-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">🎉 免费试用说明</h3>
              <p class="text-sm text-gray-600">真正免费，无套路，无需信用卡</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span class="text-sm text-gray-700">每日3次免费</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">无需注册</span>
              </div>
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="text-sm text-gray-700">通常1分钟内完成</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 效果演示区域 -->
      <div id="demo-section" class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('home.demoTitle') }}</h2>
          <p class="text-gray-600 text-lg">{{ $t('home.demoSubtitle') }}</p>
        </div>
        <DemoSection />
      </div>

      <!-- 上传区域 -->
      <div id="upload-section" class="mb-20">
        <ImageUploader />
      </div>

      <!-- 图片预览区域 -->
      <ImagePreview v-if="hasImage" />

      <!-- 功能介绍区域 -->
      <div v-if="!hasImage" class="mb-20">
        <ProductIntro />
      </div>

      <!-- 工作流程区域 -->
      <div v-if="!hasImage" class="mb-20">
        <WorkflowSection />
      </div>

      <!-- 定价预览区域 -->
      <div v-if="!hasImage" class="mb-20">
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
