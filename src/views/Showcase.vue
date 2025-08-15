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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700">真实案例展示</span>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">效果展示</span><br>
          见证AI的神奇力量
        </h1>
        
        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          每一张图片都经过我们的AI技术精心处理，从人像抠图到产品优化，从创意设计到专业制作，见证AI带来的惊人效果
        </p>

        <!-- 分类筛选 -->
        <div class="flex flex-wrap justify-center gap-3 mb-16">
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              activeCategory === 'all' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]" 
            @click="activeCategory = 'all'"
          >
            全部案例
          </button>
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              activeCategory === 'portrait' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]" 
            @click="activeCategory = 'portrait'"
          >
            👩‍💼 人像处理
          </button>
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              activeCategory === 'product' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]" 
            @click="activeCategory = 'product'"
          >
            🛍️ 产品图片
          </button>
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              activeCategory === 'creative' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]" 
            @click="activeCategory = 'creative'"
          >
            🎨 创意设计
          </button>
          <button 
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-200',
              activeCategory === 'enlarge' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]" 
            @click="activeCategory = 'enlarge'"
          >
            📈 图片放大
          </button>
        </div>
      </div>

      <!-- 案例展示网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        <div 
          v-for="case_item in filteredCases" 
          :key="case_item.id"
          class="glass-effect rounded-2xl overflow-hidden hover-lift cursor-pointer"
          @click="openModal(case_item)"
        >
          <!-- 图片对比区域 -->
          <div class="relative">
            <div class="grid grid-cols-2">
              <!-- 处理前 -->
              <div class="relative">
                <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div 
                    class="w-full h-full flex items-center justify-center text-gray-400"
                    :style="case_item.beforeStyle"
                  >
                    <span class="text-xs">处理前</span>
                  </div>
                </div>
                <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  处理前
                </div>
              </div>
              
              <!-- 处理后 -->
              <div class="relative">
                <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div 
                    class="w-full h-full flex items-center justify-center text-gray-600"
                    :style="case_item.afterStyle"
                  >
                    <span class="text-xs">处理后</span>
                  </div>
                </div>
                <div class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  处理后
                </div>
              </div>
            </div>
            
            <!-- 分隔线 -->
            <div class="absolute top-0 left-1/2 w-0.5 h-full bg-white/50 transform -translate-x-0.5" />
          </div>

          <!-- 案例信息 -->
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-gray-900">
                {{ case_item.title }}
              </h3>
              <div class="flex items-center space-x-1">
                <span 
                  v-for="star in 5" 
                  :key="star"
                  class="text-yellow-400 text-sm"
                >
                  ★
                </span>
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4">
              {{ case_item.description }}
            </p>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ case_item.category_name }}</span>
              <div class="flex items-center space-x-3">
                <span>⏱️ {{ case_item.processTime }}</span>
                <span>📏 {{ case_item.resolution }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-12 mb-20">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            处理效果统计
          </h2>
          <p class="text-gray-600">
            基于真实用户反馈的数据统计
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="text-3xl font-bold gradient-text mb-2">
              99.2%
            </div>
            <div class="text-sm text-gray-600">
              背景移除准确率
            </div>
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="text-3xl font-bold gradient-text mb-2">
              8倍
            </div>
            <div class="text-sm text-gray-600">
              最高放大倍数
            </div>
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="text-3xl font-bold gradient-text mb-2">
              30秒
            </div>
            <div class="text-sm text-gray-600">
              平均处理时间
            </div>
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <div class="text-3xl font-bold gradient-text mb-2">
              4.9/5
            </div>
            <div class="text-sm text-gray-600">
              用户满意度
            </div>
          </div>
        </div>
      </div>

      <!-- 用户评价 -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            用户真实评价
          </h2>
          <p class="text-gray-600">
            来看看用户们怎么说
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="glass-effect rounded-2xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">李</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  李小姐
                </h4>
                <p class="text-sm text-gray-500">
                  内容创作者
                </p>
              </div>
            </div>
            <div class="flex mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-gray-600 text-sm">
              "真的太方便了！以前做视频缩略图需要花很长时间抠图，现在一键就能完成，效果还特别好。"
            </p>
          </div>
          
          <div class="glass-effect rounded-2xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">张</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  张先生
                </h4>
                <p class="text-sm text-gray-500">
                  电商店主
                </p>
              </div>
            </div>
            <div class="flex mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-gray-600 text-sm">
              "我店铺的产品图片统一用白底背景后，点击率提升了25%！这个工具太实用了。"
            </p>
          </div>
          
          <div class="glass-effect rounded-2xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">王</span>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  王女士
                </h4>
                <p class="text-sm text-gray-500">
                  设计师
                </p>
              </div>
            </div>
            <div class="flex mb-3">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <p class="text-gray-600 text-sm">
              "图片放大功能太强了！老客户的模糊Logo经过放大处理后，清晰度完全不输重新设计的。"
            </p>
          </div>
        </div>
      </div>

      <!-- CTA区域 -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-12 text-white">
          <h2 class="text-3xl font-bold mb-4">
            想要同样的效果？
          </h2>
          <p class="text-green-100 mb-8 max-w-2xl mx-auto">
            立即开始免费试用，体验AI图片处理的神奇效果。无需注册，每天3次免费机会。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all duration-200 hover:scale-105">
              立即免费试用
            </button>
            <button class="border border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-all duration-200">
              查看更多案例
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 案例详情模态框 -->
    <div 
      v-if="selectedCase" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ selectedCase.title }}
            </h2>
            <button 
              class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              @click="closeModal"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">
                处理前
              </h3>
              <div class="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <div 
                  class="w-full h-full flex items-center justify-center"
                  :style="selectedCase.beforeStyle"
                >
                  <span class="text-gray-400">处理前图片</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-3">
                处理后
              </h3>
              <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
                <div 
                  class="w-full h-full flex items-center justify-center"
                  :style="selectedCase.afterStyle"
                >
                  <span class="text-gray-600">处理后图片</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold text-gray-900 mb-2">
                处理详情
              </h4>
              <p class="text-gray-600">
                {{ selectedCase.fullDescription }}
              </p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-900">分类：</span>
                <span class="text-gray-600">{{ selectedCase.category_name }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-900">处理时间：</span>
                <span class="text-gray-600">{{ selectedCase.processTime }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-900">分辨率：</span>
                <span class="text-gray-600">{{ selectedCase.resolution }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-900">评分：</span>
                <span class="text-yellow-500">★★★★★</span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 pt-6 border-t border-gray-100">
            <button class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-full font-bold hover:shadow-lg transition-all">
              立即试用相同效果
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Showcase',
  setup() {
    const activeCategory = ref('all')
    const selectedCase = ref(null)
    
    // 模拟案例数据
    const cases = ref([
      {
        id: 1,
        title: '职业证件照处理',
        description: '专业证件照背景替换，符合各类证件要求',
        fullDescription: '这是一个典型的证件照处理案例，客户需要将原本在家中拍摄的照片背景更换为标准的白色背景。我们的AI技术准确识别了人物轮廓，完美去除了复杂的居家背景，生成了符合证件照标准的专业照片。',
        category: 'portrait',
        category_name: '人像处理',
        processTime: '28秒',
        resolution: '1024x1024',
        beforeStyle: 'background: linear-gradient(45deg, #ffd89b, #19547b)',
        afterStyle: 'background: #ffffff'
      },
      {
        id: 2,
        title: '电商产品主图优化',
        description: '服装产品图片背景统一，提升店铺视觉效果',
        fullDescription: '电商卖家提供的服装照片拍摄环境不统一，影响店铺整体美观度。通过AI背景移除技术，我们将所有产品图片背景统一为纯白色，大大提升了产品的专业性和吸引力，客户反馈转化率提升了30%。',
        category: 'product',
        category_name: '产品图片',
        processTime: '32秒',
        resolution: '2048x2048',
        beforeStyle: 'background: linear-gradient(45deg, #a8e6cf, #dcedc8)',
        afterStyle: 'background: #ffffff'
      },
      {
        id: 3,
        title: 'YouTube视频缩略图制作',
        description: '内容创作者专用，快速制作吸睛缩略图',
        fullDescription: 'YouTube内容创作者需要制作吸引眼球的视频缩略图。原始照片背景杂乱，我们使用AI技术精准抠取人物，并为其添加了专业的渐变背景，使得缩略图更加突出，点击率提升了45%。',
        category: 'creative',
        category_name: '创意设计',
        processTime: '25秒',
        resolution: '1920x1080',
        beforeStyle: 'background: linear-gradient(45deg, #ff9a9e, #fecfef)',
        afterStyle: 'background: linear-gradient(45deg, #667eea, #764ba2)'
      },
      {
        id: 4,
        title: '老照片修复放大',
        description: '童年回忆清晰重现，AI算法智能修复',
        fullDescription: '这是一张30年前的老照片，原始分辨率只有200x200像素，画质模糊。我们使用AI图片放大技术，将图片放大到1600x1600像素，不仅尺寸增大8倍，细节也得到了显著改善，让珍贵回忆重新焕发生机。',
        category: 'enlarge',
        category_name: '图片放大',
        processTime: '45秒',
        resolution: '1600x1600',
        beforeStyle: 'background: linear-gradient(45deg, #ffeaa7, #fab1a0); opacity: 0.7; filter: blur(1px)',
        afterStyle: 'background: linear-gradient(45deg, #ffeaa7, #fab1a0); opacity: 1'
      },
      {
        id: 5,
        title: '社交媒体头像制作',
        description: '个人品牌形象提升，专业头像制作',
        fullDescription: '客户希望为LinkedIn等专业社交平台制作头像。原始照片在咖啡店拍摄，背景较为杂乱。我们移除了背景并添加了简洁的渐变效果，使头像看起来更加专业，符合商务社交的需求。',
        category: 'portrait',
        category_name: '人像处理',
        processTime: '30秒',
        resolution: '512x512',
        beforeStyle: 'background: linear-gradient(45deg, #d63031, #74b9ff)',
        afterStyle: 'background: linear-gradient(45deg, #0984e3, #6c5ce7)'
      },
      {
        id: 6,
        title: '美食产品图片处理',
        description: '餐饮行业专用，菜品图片背景优化',
        fullDescription: '餐厅需要为菜单制作统一风格的菜品图片。原始照片在不同环境下拍摄，背景各异。通过AI技术，我们为所有菜品添加了一致的白色背景，使菜单看起来更加专业和诱人。',
        category: 'product',
        category_name: '产品图片',
        processTime: '35秒',
        resolution: '1536x1536',
        beforeStyle: 'background: linear-gradient(45deg, #fd79a8, #fdcb6e)',
        afterStyle: 'background: #ffffff'
      }
    ])
    
    // 根据分类筛选案例
    const filteredCases = computed(() => {
      if (activeCategory.value === 'all') {
        return cases.value
      }
      return cases.value.filter(c => c.category === activeCategory.value)
    })
    
    // 打开案例详情模态框
    const openModal = (case_item) => {
      selectedCase.value = case_item
    }
    
    // 关闭模态框
    const closeModal = () => {
      selectedCase.value = null
    }
    
    return {
      activeCategory,
      selectedCase,
      cases,
      filteredCases,
      openModal,
      closeModal
    }
  }
}
</script>

<style scoped>
.hover-lift:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
