<template>
  <div class="max-w-7xl mx-auto">
    <!-- 主要功能介绍 -->
    <div class="text-center mb-16">
      <div class="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6">
        <svg
          class="w-4 h-4 mr-2 text-pink-600"
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
        <span class="text-sm font-medium text-gray-700">AI图片处理功能全览</span>
      </div>
      
      <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">17个强大功能</span><br>
        满足你的所有需求
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        从背景处理到图片修复，从美颜优化到创意转换，一站式AI图片处理平台为你提供专业级的处理能力
      </p>
    </div>

    <!-- 功能分类展示 -->
    <div class="space-y-16">
      <!-- 背景处理类 -->
      <div>
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-sm text-white">🖼️</span>
            </div>
            背景处理
          </h3>
          <p class="text-gray-600">
            智能背景识别和处理技术
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            v-for="service in backgroundServices"
            :key="service.type"
            :service="service"
            @try-now="handleTryService"
          />
        </div>
      </div>

      <!-- 图像增强类 -->
      <div>
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-sm text-white">✨</span>
            </div>
            图像增强
          </h3>
          <p class="text-gray-600">
            提升图片质量和清晰度
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            v-for="service in enhancementServices"
            :key="service.type"
            :service="service"
            @try-now="handleTryService"
          />
        </div>
      </div>

      <!-- 创意效果类 -->
      <div>
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-sm text-white">🎨</span>
            </div>
            创意效果
          </h3>
          <p class="text-gray-600">
            艺术化和创意图片处理
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            v-for="service in creativeServices"
            :key="service.type"
            :service="service"
            @try-now="handleTryService"
          />
        </div>
      </div>

      <!-- 实用工具类 -->
      <div>
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
            <div class="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-sm text-white">🔧</span>
            </div>
            实用工具
          </h3>
          <p class="text-gray-600">
            日常图片处理必备工具
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            v-for="service in utilityServices"
            :key="service.type"
            :service="service"
            @try-now="handleTryService"
          />
        </div>
      </div>
    </div>

    <!-- CTA区域 -->
    <div class="text-center mt-16 p-8 glass-effect rounded-3xl">
      <h3 class="text-2xl font-bold text-gray-900 mb-4">
        准备开始了吗？
      </h3>
      <p class="text-gray-600 mb-6">
        选择任意功能，立即体验AI图片处理的强大威力
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          type="primary"
          size="large"
          @click="scrollToUpload"
        >
          <template #icon>
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </template>
          上传图片开始
        </Button>
        <Button
          type="secondary"
          size="large"
          @click="viewPricing"
        >
          查看定价
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import Button from '../ui/Button.vue'

// 功能卡片组件
const FeatureCard = {
  template: `
    <div class="glass-effect rounded-2xl p-6 hover-lift transition-all duration-200">
      <div class="flex items-start space-x-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
             :class="getCategoryGradient(service.category)">
          <span class="text-lg">{{ service.icon }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ service.name }}</h4>
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ service.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 text-xs text-gray-500">
              <span class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                {{ service.credit_cost }} 积分
              </span>
              <span class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ~{{ Math.round(service.average_processing_time / 1000) }}秒
              </span>
            </div>
            
            <button
              @click="$emit('try-now', service.type)"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
              :class="getButtonClass(service.category)"
            >
              试用
            </button>
          </div>
          
          <div v-if="service.is_popular" class="mt-2">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              热门
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['service'],
  emits: ['try-now'],
  setup() {
    const getCategoryGradient = (category) => {
      const gradients = {
        background: 'bg-gradient-to-r from-blue-500 to-blue-600',
        enhancement: 'bg-gradient-to-r from-green-500 to-green-600', 
        creative: 'bg-gradient-to-r from-purple-500 to-purple-600',
        utility: 'bg-gradient-to-r from-gray-500 to-gray-600'
      }
      return gradients[category] || gradients.utility
    }
    
    const getButtonClass = (category) => {
      const classes = {
        background: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        enhancement: 'bg-green-100 text-green-700 hover:bg-green-200',
        creative: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
        utility: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
      return classes[category] || classes.utility
    }
    
    return { getCategoryGradient, getButtonClass }
  }
}

export default {
  name: 'ProductIntro',
  components: {
    Button,
    FeatureCard
  },
  
  setup() {
    // 17个AI功能的完整数据
    const allServices = [
      // 背景处理类
      {
        type: 'BackgroundRemover',
        name: 'AI背景移除',
        description: '智能识别主体，精准去除背景，支持人像、物品等各类图片',
        icon: '✂️',
        category: 'background',
        credit_cost: 1,
        average_processing_time: 25000,
        is_popular: true
      },
      {
        type: 'BackgroundChanger',
        name: 'AI背景更换',
        description: '保留主体的同时，智能替换背景为你想要的场景',
        icon: '🖼️',
        category: 'background', 
        credit_cost: 1.5,
        average_processing_time: 30000
      },
      
      // 图像增强类
      {
        type: 'ImageUpscaler:Standard',
        name: '标准图片放大',
        description: '使用标准算法将图片放大2-4倍，适合大部分图片',
        icon: '🔍',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 35000,
        is_popular: true
      },
      {
        type: 'ImageUpscaler:Photograph',
        name: '照片专业放大',
        description: '专为照片优化的放大算法，保持照片质感和细节',
        icon: '📸',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 40000
      },
      {
        type: 'ImageUpscaler:Anime',
        name: '动漫图片放大',
        description: '专为动漫、插画设计的放大算法，保持线条清晰',
        icon: '🎯',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 40000
      },
      {
        type: 'ImageUpscaler:FaceEnhancement',
        name: '人脸增强放大',
        description: '专注面部细节优化，提升人像照片清晰度',
        icon: '😊',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 45000
      },
      {
        type: 'FaceRestoration',
        name: 'AI面部修复',
        description: '修复模糊、损坏的面部，恢复清晰自然的人像',
        icon: '✨',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 35000
      },
      {
        type: 'ImageDenoiser',
        name: 'AI图像降噪',
        description: '去除图片噪点和颗粒，提升整体画质和清晰度',
        icon: '🧹',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 25000
      },
      {
        type: 'ScratchFix',
        name: 'AI划痕修复',
        description: '智能识别并修复老照片中的划痕、折痕等瑕疵',
        icon: '🔧',
        category: 'enhancement',
        credit_cost: 1,
        average_processing_time: 40000
      },
      
      // 创意效果类
      {
        type: 'ColorizePhoto',
        name: 'AI黑白上色',
        description: '为黑白照片智能添加真实自然的色彩',
        icon: '🎨',
        category: 'creative',
        credit_cost: 2,
        average_processing_time: 50000
      },
      {
        type: 'Cartoon',
        name: 'AI卡通化',
        description: '将真实照片转换为各种卡通、动漫风格',
        icon: '🎭',
        category: 'creative',
        credit_cost: 1,
        average_processing_time: 35000,
        is_popular: true
      },
      {
        type: 'FaceAnimation:Generation',
        name: '人脸动画生成',
        description: '为静态人像照片添加生动的面部动画效果',
        icon: '🎬',
        category: 'creative',
        credit_cost: 2,
        average_processing_time: 60000
      },
      {
        type: 'ImageToImage',
        name: 'AI图像转换',
        description: '将图片转换为不同的艺术风格和视觉效果',
        icon: '🔄',
        category: 'creative',
        credit_cost: 1.5,
        average_processing_time: 45000
      },
      
      // 实用工具类
      {
        type: 'FaceDetection',
        name: 'AI人脸检测',
        description: '智能检测人脸位置、特征点和基本属性信息',
        icon: '👁️',
        category: 'utility',
        credit_cost: 0.5,
        average_processing_time: 15000
      },
      {
        type: 'ImageCompressor',
        name: 'AI图像压缩',
        description: '智能压缩图片大小，在保持质量的前提下减少文件体积',
        icon: '🗜️',
        category: 'utility',
        credit_cost: 0.5,
        average_processing_time: 20000
      },
      {
        type: 'ObjectCounter',
        name: 'AI物体计数',
        description: '自动识别并计算图片中特定物体的数量',
        icon: '🔢',
        category: 'utility',
        credit_cost: 0.5,
        average_processing_time: 20000
      },
      {
        type: 'FaceAnimation:Detection',
        name: '人脸分析检测',
        description: '深度分析人脸特征，提供详细的面部数据',
        icon: '🔬',
        category: 'utility',
        credit_cost: 0.5,
        average_processing_time: 18000
      }
    ]
    
    // 按分类分组
    const backgroundServices = computed(() => 
      allServices.filter(service => service.category === 'background')
    )
    
    const enhancementServices = computed(() => 
      allServices.filter(service => service.category === 'enhancement')
    )
    
    const creativeServices = computed(() => 
      allServices.filter(service => service.category === 'creative')
    )
    
    const utilityServices = computed(() => 
      allServices.filter(service => service.category === 'utility')
    )
    
    // 方法
    const handleTryService = (serviceType) => {
      // 滚动到上传区域
      scrollToUpload()
    }
    
    const scrollToUpload = () => {
      document.getElementById('upload-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }
    
    const viewPricing = () => {
      // 可以路由跳转到定价页面，或滚动到定价区域
      const pricingSection = document.querySelector('.pricing-section')
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    return {
      backgroundServices,
      enhancementServices,
      creativeServices,
      utilityServices,
      handleTryService,
      scrollToUpload,
      viewPricing
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
