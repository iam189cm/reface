<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Hero区域 -->
    <section class="relative overflow-hidden py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <!-- 面包屑导航 -->
          <nav class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
            <router-link
              to="/"
              class="hover:text-purple-600 transition-colors"
            >
              首页
            </router-link>
            <ChevronRight :size="16" />
            <span class="text-gray-700">解决方案</span>
            <ChevronRight :size="16" />
            <span class="text-purple-600 font-medium">内容创作者</span>
          </nav>

          <!-- 标题区域 -->
          <div class="mb-12">
            <div class="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-6">
              <Video
                :size="20"
                class="mr-3 text-purple-600"
              />
              <span class="font-semibold text-gray-800">内容创作者专业工具</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              让你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">创意内容</span><br>
              更加出色
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              专为内容创作者打造的AI图片处理解决方案。提升视频缩略图吸引力，制作高质量素材，让你的内容脱颖而出。
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <router-link 
                to="/editor" 
                class="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles
                  :size="20"
                  class="mr-2"
                />
                开始创作
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 创作场景展示 -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              覆盖你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">各种创作场景</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 视频缩略图 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Play
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                视频缩略图制作
              </h3>
              <p class="text-gray-600 text-center mb-6">
                YouTube、B站、抖音...打造吸睛缩略图，提升视频点击率
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  精准抠图去背景
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  添加吸睛元素
                </div>
              </div>
            </div>

            <!-- 素材制作 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Image
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                内容素材处理
              </h3>
              <p class="text-gray-600 text-center mb-6">
                博客配图、社媒内容、广告素材...快速批量处理
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  批量图片处理
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  统一视觉风格
                </div>
              </div>
            </div>

            <!-- 品牌形象 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Star
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                个人品牌建设
              </h3>
              <p class="text-gray-600 text-center mb-6">
                头像、Logo、品牌素材...打造专业个人形象
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  专业头像制作
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  品牌元素提取
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            为<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">创作者</span>量身定制
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="text-left">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Zap
                    :size="20"
                    class="text-white"
                  />
                </div>
                <h3 class="text-xl font-bold text-gray-900">
                  批量高效处理
                </h3>
              </div>
              <p class="text-gray-600 mb-4">
                一次上传多张图片，批量应用相同效果，大大提升创作效率。
              </p>
            </div>

            <div class="text-left">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Target
                    :size="20"
                    class="text-white"
                  />
                </div>
                <h3 class="text-xl font-bold text-gray-900">
                  精准抠图技术
                </h3>
              </div>
              <p class="text-gray-600 mb-4">
                AI智能识别主体，边缘处理精细，满足专业创作需求。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl md:text-5xl font-bold mb-6">
            释放你的创作潜力
          </h2>
          
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            加入成功创作者的行列，让AI成为你最得力的创作助手
          </p>

          <router-link 
            to="/editor" 
            class="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Video
              :size="20"
              class="mr-2"
            />
            开始创作之旅
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { 
  Video, 
  ChevronRight, 
  Sparkles, 
  Play,
  Image,
  Star,
  CheckCircle, 
  Zap,
  Target
} from 'lucide-vue-next'

export default {
  name: 'ContentCreatorSolution',
  components: {
    Video,
    ChevronRight,
    Sparkles,
    Play,
    Image,
    Star,
    CheckCircle,
    Zap,
    Target
  },
  mounted() {
    document.title = '内容创作者解决方案 - Reface AI图片美化工具'
  }
}
</script>
