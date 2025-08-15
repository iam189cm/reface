<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <!-- Hero区域 -->
    <section class="relative overflow-hidden py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <!-- 面包屑导航 -->
          <nav class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
            <router-link
              to="/"
              class="hover:text-blue-600 transition-colors"
            >
              首页
            </router-link>
            <ChevronRight :size="16" />
            <span class="text-gray-700">解决方案</span>
            <ChevronRight :size="16" />
            <span class="text-blue-600 font-medium">设计师</span>
          </nav>

          <!-- 标题区域 -->
          <div class="mb-12">
            <div class="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-6">
              <Target
                :size="20"
                class="mr-3 text-blue-600"
              />
              <span class="font-semibold text-gray-800">设计师专业工具</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              释放你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">设计创意</span><br>
              提升工作效率
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              专为设计师打造的AI图片处理工具。快速抠图、素材处理、批量操作，让你专注于创意本身，而非繁琐的技术操作。
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <router-link 
                to="/editor" 
                class="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles
                  :size="20"
                  class="mr-2"
                />
                加速创作流程
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 设计场景展示 -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              专为<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">设计师</span>而生
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 素材抠图 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Scissors
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                精准素材抠图
              </h3>
              <p class="text-gray-600 text-center mb-6">
                AI智能识别，边缘精细处理，满足专业设计需求
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  像素级精度
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  复杂边缘处理
                </div>
              </div>
            </div>

            <!-- 批量处理 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Layers
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                批量素材处理
              </h3>
              <p class="text-gray-600 text-center mb-6">
                一次处理多个素材，统一风格和尺寸，提升工作效率
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  批量背景移除
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  统一尺寸规格
                </div>
              </div>
            </div>

            <!-- 创意合成 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Palette
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                创意素材制作
              </h3>
              <p class="text-gray-600 text-center mb-6">
                AI辅助创作，快速生成创意素材和设计元素
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  风格化处理
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  创意元素提取
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 专业功能 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">专业级</span>功能特性
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 class="text-2xl font-bold text-gray-900 mb-6">
                为设计师量身打造
              </h3>
              
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Zap
                      :size="16"
                      class="text-blue-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      高精度抠图
                    </h4>
                    <p class="text-gray-600">
                      AI算法经过专业训练，处理复杂边缘和细节
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Settings
                      :size="16"
                      class="text-blue-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      参数可调节
                    </h4>
                    <p class="text-gray-600">
                      支持精细参数调整，满足不同设计需求
                    </p>
                  </div>
                </div>
                
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Download
                      :size="16"
                      class="text-blue-600"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 mb-2">
                      多格式导出
                    </h4>
                    <p class="text-gray-600">
                      支持PNG、JPG、SVG等多种专业格式输出
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 专业效果演示 -->
            <div class="relative">
              <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
                <div class="grid grid-cols-1 gap-4">
                  <div class="bg-white rounded-xl p-6">
                    <div class="text-center mb-4">
                      <h4 class="font-semibold text-gray-900">
                        专业级处理效果
                      </h4>
                    </div>
                    <div class="grid grid-cols-3 gap-2">
                      <div class="h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded" />
                      <div class="h-16 bg-gradient-to-br from-indigo-200 to-indigo-300 rounded" />
                      <div class="h-16 bg-gradient-to-br from-purple-200 to-purple-300 rounded" />
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
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl md:text-5xl font-bold mb-6">
            让AI成为你的设计助手
          </h2>
          
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            专业设计师的选择，提升创作效率，释放更多时间用于创意思考
          </p>

          <router-link 
            to="/editor" 
            class="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Target
              :size="20"
              class="mr-2"
            />
            开始专业创作
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { 
  Target, 
  ChevronRight, 
  Sparkles, 
  Scissors,
  Layers,
  Palette,
  CheckCircle, 
  Zap,
  Settings,
  Download
} from 'lucide-vue-next'

export default {
  name: 'DesignerSolution',
  components: {
    Target,
    ChevronRight,
    Sparkles,
    Scissors,
    Layers,
    Palette,
    CheckCircle,
    Zap,
    Settings,
    Download
  },
  mounted() {
    document.title = '设计师解决方案 - Reface AI图片美化工具'
  }
}
</script>
