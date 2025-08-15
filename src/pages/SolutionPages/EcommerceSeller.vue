<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
    <!-- Hero区域 -->
    <section class="relative overflow-hidden py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <!-- 面包屑导航 -->
          <nav class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
            <router-link
              to="/"
              class="hover:text-green-600 transition-colors"
            >
              首页
            </router-link>
            <ChevronRight :size="16" />
            <span class="text-gray-700">解决方案</span>
            <ChevronRight :size="16" />
            <span class="text-green-600 font-medium">电商卖家</span>
          </nav>

          <!-- 标题区域 -->
          <div class="mb-12">
            <div class="inline-flex items-center bg-gradient-to-r from-green-100 to-teal-100 rounded-full px-6 py-3 mb-6">
              <ShoppingCart
                :size="20"
                class="mr-3 text-green-600"
              />
              <span class="font-semibold text-gray-800">电商卖家专业解决方案</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              让你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">商品图片</span><br>
              更具销售力
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              专为电商卖家打造的商品图片处理工具。统一背景、提升质感、批量处理，让你的商品在竞争中脱颖而出。
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <router-link 
                to="/editor" 
                class="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles
                  :size="20"
                  class="mr-2"
                />
                提升销量
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 电商场景展示 -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              解决你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">电商痛点</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 商品主图 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Package
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                商品主图优化
              </h3>
              <p class="text-gray-600 text-center mb-6">
                去除杂乱背景，突出商品特色，提升主图点击率
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  纯白背景统一
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  商品细节突出
                </div>
              </div>
            </div>

            <!-- 详情页图片 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Grid
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                详情图片处理
              </h3>
              <p class="text-gray-600 text-center mb-6">
                批量处理商品详情图，保持视觉风格统一
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  批量背景处理
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  尺寸标准化
                </div>
              </div>
            </div>

            <!-- 营销素材 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Megaphone
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                营销图片制作
              </h3>
              <p class="text-gray-600 text-center mb-6">
                活动海报、促销图片、品牌宣传图制作
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  活动素材制作
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  品牌风格统一
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能优势 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              专为<span class="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">电商</span>量身定制
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">
                批量处理，效率翻倍
              </h3>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Zap
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      一键批量处理
                    </h4>
                    <p class="text-gray-600">
                      同时上传数百张图片，一次性完成背景去除和优化
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Target
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      风格统一管理
                    </h4>
                    <p class="text-gray-600">
                      保持店铺视觉风格一致，提升专业形象
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <TrendingUp
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      转化率提升
                    </h4>
                    <p class="text-gray-600">
                      优质商品图片平均可提升20-30%的转化率
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 效果演示 -->
            <div class="relative">
              <div class="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl p-8">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-xl p-4">
                    <div class="text-center mb-2">
                      <span class="text-sm font-medium text-gray-500">处理前</span>
                    </div>
                    <div class="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <div class="w-20 h-16 bg-green-400 rounded opacity-70" />
                    </div>
                  </div>
                  <div class="bg-white rounded-xl p-4">
                    <div class="text-center mb-2">
                      <span class="text-sm font-medium text-green-600">处理后</span>
                    </div>
                    <div class="w-full h-32 bg-white rounded-lg border flex items-center justify-center">
                      <div class="w-20 h-16 bg-green-400 rounded shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="py-20 bg-gradient-to-r from-green-600 to-teal-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl md:text-5xl font-bold mb-6">
            提升店铺形象，增加销量
          </h2>
          
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            专业的商品图片是成功的第一步，立即开始优化你的商品展示
          </p>

          <router-link 
            to="/editor" 
            class="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart
              :size="20"
              class="mr-2"
            />
            开始优化商品图
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { 
  ShoppingCart, 
  ChevronRight, 
  Sparkles, 
  Package,
  Grid,
  Megaphone,
  CheckCircle, 
  Zap,
  Target,
  TrendingUp
} from 'lucide-vue-next'

export default {
  name: 'EcommerceSellerSolution',
  components: {
    ShoppingCart,
    ChevronRight,
    Sparkles,
    Package,
    Grid,
    Megaphone,
    CheckCircle,
    Zap,
    Target,
    TrendingUp
  },
  mounted() {
    document.title = '电商卖家解决方案 - Reface AI图片美化工具'
  }
}
</script>
