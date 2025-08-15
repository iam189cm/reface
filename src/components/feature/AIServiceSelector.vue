<template>
  <div class="ai-service-selector">
    <!-- 当前选择的服务 -->
    <div
      v-if="selectedService"
      class="mb-6"
    >
      <div class="glass-effect rounded-2xl p-4 border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
              :class="getCategoryGradient(getServiceCategory(selectedService))"
            >
              <span class="text-xl">{{ getServiceIcon(selectedService) }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ getServiceInfo(selectedService)?.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ getServiceInfo(selectedService)?.description }}
              </p>
            </div>
          </div>
          <Button 
            type="secondary" 
            size="small" 
            class="text-gray-500 hover:text-gray-700"
            @click="clearSelection"
          >
            更换功能
          </Button>
        </div>
      </div>
    </div>

    <!-- 服务分类选择 -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- 智能推荐 -->
      <div
        v-if="recommendations.length > 0"
        class="mb-8"
      >
        <div class="flex items-center mb-4">
          <div class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <svg
              class="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">
            为你推荐
          </h3>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <ServiceCard 
            v-for="service in recommendations" 
            :key="service.type"
            :service="service"
            :is-recommended="true"
            @select="selectService"
          />
        </div>
        <div class="border-t border-gray-200 pt-6">
          <p class="text-center text-sm text-gray-500 mb-4">
            或选择其他功能
          </p>
        </div>
      </div>

      <!-- 功能分类 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySection
          v-for="(category, key) in serviceCategories"
          :key="key"
          :category-key="key"
          :category="category"
          :services="getServicesByCategory(key)"
          @service-select="selectService"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject, onMounted, onUnmounted } from 'vue'
import Button from '../ui/Button.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { SERVICE_CATEGORIES } from '../../services/nero-ai/index.ts'

// 子组件
const ServiceCard = {
  template: `
    <div 
      class="relative bg-white rounded-xl p-4 border border-gray-200 hover:border-pink-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
      :class="{ 'border-yellow-300 bg-yellow-50': isRecommended }"
      @click="$emit('select', service.type)"
    >
      <div v-if="isRecommended" class="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
        推荐
      </div>
      
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
             :class="getCategoryGradient(service.category)">
          <span class="text-lg">{{ service.icon }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-gray-900 group-hover:text-pink-600 transition-colors mb-1">
            {{ service.name }}
          </h4>
          <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ service.description }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ service.credit_cost }} 积分</span>
            <span>~{{ Math.round(service.average_processing_time / 1000) }}秒</span>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['service', 'isRecommended'],
  emits: ['select'],
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
    
    return { getCategoryGradient }
  }
}

const CategorySection = {
  template: `
    <div class="glass-effect rounded-2xl p-6">
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
             :class="getCategoryGradient(categoryKey)">
          <span class="text-xl">{{ category.icon }}</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
          <p class="text-sm text-gray-600">{{ category.description }}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-3">
        <ServiceCard 
          v-for="service in services" 
          :key="service.type"
          :service="service"
          @select="$emit('service-select', $event)"
        />
      </div>
    </div>
  `,
  components: { ServiceCard },
  props: ['categoryKey', 'category', 'services'],
  emits: ['service-select'],
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
    
    return { getCategoryGradient }
  }
}

export default {
  name: 'AIServiceSelector',
  components: {
    Button,
    ServiceCard,
    CategorySection
  },
  
  props: {
    imageFile: {
      type: File,
      default: null
    },
    preSelectedService: {
      type: String,
      default: null
    }
  },
  
  emits: ['service-selected', 'service-cleared'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    
    // 响应式数据
    const selectedService = ref(props.preSelectedService)
    const recommendations = ref([])
    
    // 服务分类和能力
    const serviceCategories = SERVICE_CATEGORIES
    const serviceCapabilities = computed(() => neroAI.serviceCapabilities.value)
    
    // 获取服务信息
    const getServiceInfo = (serviceType) => {
      return serviceCapabilities.value[serviceType]
    }
    
    // 获取服务图标
    const getServiceIcon = (serviceType) => {
      return getServiceInfo(serviceType)?.icon || '🔧'
    }
    
    // 获取服务分类
    const getServiceCategory = (serviceType) => {
      return getServiceInfo(serviceType)?.category || 'utility'
    }
    
    // 获取分类渐变样式
    const getCategoryGradient = (category) => {
      const gradients = {
        background: 'bg-gradient-to-r from-blue-500 to-blue-600',
        enhancement: 'bg-gradient-to-r from-green-500 to-green-600', 
        creative: 'bg-gradient-to-r from-purple-500 to-purple-600',
        utility: 'bg-gradient-to-r from-gray-500 to-gray-600'
      }
      return gradients[category] || gradients.utility
    }
    
    // 按分类获取服务
    const getServicesByCategory = (categoryKey) => {
      const services = Object.values(serviceCapabilities.value || {})
      return services.filter(service => service.category === categoryKey)
    }
    
    // 选择服务
    const selectService = (serviceType) => {
      selectedService.value = serviceType
      emit('service-selected', serviceType)
    }
    
    // 清除选择
    const clearSelection = () => {
      selectedService.value = null
      emit('service-cleared')
    }
    
    // 生成智能推荐
    const generateRecommendations = async () => {
      if (!props.imageFile) {
        // 默认推荐最常用的功能
        recommendations.value = [
          getServiceInfo('BackgroundRemover'),
          getServiceInfo('ImageUpscaler:Standard'),
          getServiceInfo('FaceDetection')
        ].filter(Boolean)
        return
      }
      
      try {
        // 这里可以基于图片分析生成推荐
        // 暂时使用默认推荐
        const defaultRecommendations = [
          'BackgroundRemover',
          'ImageUpscaler:Standard', 
          'FaceRestoration',
          'ImageDenoiser'
        ]
        
        recommendations.value = defaultRecommendations
          .map(type => getServiceInfo(type))
          .filter(Boolean)
          .slice(0, 3)
          
      } catch (error) {
        console.warn('生成推荐失败:', error)
        recommendations.value = []
      }
    }
    
    // 监听图片变化
    const updateRecommendations = () => {
      generateRecommendations()
    }
    
    // 生命周期
    onMounted(() => {
      generateRecommendations()
    })
    
    return {
      selectedService,
      recommendations,
      serviceCategories,
      serviceCapabilities,
      getServiceInfo,
      getServiceIcon,
      getServiceCategory,
      getCategoryGradient,
      getServicesByCategory,
      selectService,
      clearSelection
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
