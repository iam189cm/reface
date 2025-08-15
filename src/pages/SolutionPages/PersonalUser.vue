<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
    <!-- Hero区域 -->
    <section class="relative overflow-hidden py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <!-- 面包屑导航 -->
          <nav class="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8">
            <router-link
              to="/"
              class="hover:text-pink-600 transition-colors"
            >
              首页
            </router-link>
            <ChevronRight :size="16" />
            <span class="text-gray-700">解决方案</span>
            <ChevronRight :size="16" />
            <span class="text-pink-600 font-medium">个人用户</span>
          </nav>

          <!-- 标题区域 -->
          <div class="mb-12">
            <div class="inline-flex items-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-6 py-3 mb-6">
              <User
                :size="20"
                class="mr-3 text-pink-600"
              />
              <span class="font-semibold text-gray-800">个人用户专属解决方案</span>
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              让你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">每张照片</span><br>
              都成为精彩回忆
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              专为个人用户打造的AI图片处理工具。无论是朋友圈分享、头像制作，还是生活记录，让AI帮你轻松打造完美照片。
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <router-link 
                to="/editor" 
                class="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles
                  :size="20"
                  class="mr-2"
                />
                立即免费试用
              </router-link>
              
              <button 
                class="inline-flex items-center text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/50 transition-all duration-300"
                @click="scrollToFeatures"
              >
                <Eye
                  :size="20"
                  class="mr-2"
                />
                查看功能特色
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用场景展示 -->
    <section
      id="use-cases"
      class="py-20"
    >
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              适用于你的<span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">各种需求</span>
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              从社交分享到个人收藏，AI帮你处理各种图片需求
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- 社交媒体场景 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Camera
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                社交媒体分享
              </h3>
              <p class="text-gray-600 text-center mb-6">
                朋友圈、微博、小红书...让每一张分享的照片都完美无瑕
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  一键去除杂乱背景
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  智能美化人像
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  完美构图调整
                </div>
              </div>
            </div>

            <!-- 个人头像制作 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <User
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                个人头像制作
              </h3>
              <p class="text-gray-600 text-center mb-6">
                职场、社交、游戏...不同场合的专业头像，一键生成
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  专业证件照效果
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  多种风格选择
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  完美抠图效果
                </div>
              </div>
            </div>

            <!-- 生活记录美化 -->
            <div class="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Heart
                  :size="32"
                  class="text-white"
                />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4 text-center">
                生活记录美化
              </h3>
              <p class="text-gray-600 text-center mb-6">
                旅行、聚会、日常...珍贵回忆值得更好的呈现
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  老照片修复
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  图片清晰度提升
                </div>
                <div class="flex items-center">
                  <CheckCircle
                    :size="16"
                    class="mr-2 text-green-500"
                  />
                  色彩增强效果
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色展示 -->
    <section
      id="features"
      class="py-20 bg-white"
    >
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">强大功能</span>，简单操作
            </h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              专业级AI技术，零学习成本，让每个人都能轻松制作精美图片
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <!-- AI背景处理 -->
            <div>
              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                  <Scissors
                    :size="24"
                    class="text-white"
                  />
                </div>
                <h3 class="text-2xl font-bold text-gray-900">
                  AI智能背景处理
                </h3>
              </div>
              
              <p class="text-gray-600 mb-6 text-lg">
                一键去除复杂背景，或替换为你喜欢的场景。无需复杂操作，AI自动识别主体并精准抠图。
              </p>
              
              <div class="space-y-4">
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <span class="text-gray-700">99.5% 精确识别率</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <span class="text-gray-700">30秒快速处理</span>
                </div>
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle
                      :size="16"
                      class="text-green-600"
                    />
                  </div>
                  <span class="text-gray-700">支持人像、物品、宠物</span>
                </div>
              </div>
            </div>

            <!-- 功能演示图 -->
            <div class="relative">
              <div class="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white rounded-xl p-4">
                    <div class="text-center mb-2">
                      <span class="text-sm font-medium text-gray-500">处理前</span>
                    </div>
                    <div class="w-full h-32 bg-gradient-to-br from-blue-200 via-pink-200 to-purple-200 rounded-lg flex items-center justify-center">
                      <div class="w-16 h-20 bg-pink-400 rounded-full opacity-80" />
                    </div>
                  </div>
                  <div class="bg-white rounded-xl p-4">
                    <div class="text-center mb-2">
                      <span class="text-sm font-medium text-pink-600">处理后</span>
                    </div>
                    <div class="w-full h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div class="w-16 h-20 bg-pink-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 用户评价 -->
    <section class="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            用户<span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">真实评价</span>
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-pink-600 font-bold">小</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">
                    小美
                  </div>
                  <div class="text-sm text-gray-500">
                    自媒体博主
                  </div>
                </div>
              </div>
              <p class="text-gray-600 italic">
                "太方便了！以前修图要用PS，现在一键就能去背景，效果还很自然。朋友圈的照片质量瞬间提升！"
              </p>
              <div class="flex mt-4">
                {/* 5星评价 */}
                <div class="flex space-x-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-purple-600 font-bold">李</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">
                    李同学
                  </div>
                  <div class="text-sm text-gray-500">
                    大学生
                  </div>
                </div>
              </div>
              <p class="text-gray-600 italic">
                "作为学生党，这个工具真的太实用了！免费额度够用，制作简历头像、社团海报都很方便。"
              </p>
              <div class="flex mt-4">
                <div class="flex space-x-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg">
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span class="text-blue-600 font-bold">王</span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">
                    王女士
                  </div>
                  <div class="text-sm text-gray-500">
                    宝妈
                  </div>
                </div>
              </div>
              <p class="text-gray-600 italic">
                "给宝宝拍的照片用这个处理一下，背景干净了很多。操作简单，连我这种技术小白都会用！"
              </p>
              <div class="flex mt-4">
                <div class="flex space-x-1">
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                  <Star class="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA区域 -->
    <section class="py-20 bg-gradient-to-r from-pink-600 to-purple-600">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center text-white">
          <h2 class="text-3xl md:text-5xl font-bold mb-6">
            开始你的AI图片之旅
          </h2>
          
          <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            加入数万用户，体验AI带来的图片处理魔法。现在注册即可获得免费试用额度！
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <router-link 
              to="/editor" 
              class="inline-flex items-center bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles
                :size="20"
                class="mr-2"
              />
              免费开始使用
            </router-link>
            
            <router-link 
              to="/pricing" 
              class="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300"
            >
              查看更多套餐
            </router-link>
          </div>

          <div class="mt-8 text-sm opacity-75">
            <p>✨ 无需信用卡 • 🚀 即刻体验 • 💝 新用户专享</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { 
  User, 
  ChevronRight, 
  Sparkles, 
  Eye, 
  Camera, 
  CheckCircle, 
  Heart, 
  Scissors,
  Star
} from 'lucide-vue-next'

export default {
  name: 'PersonalUserSolution',
  components: {
    User,
    ChevronRight,
    Sparkles,
    Eye,
    Camera,
    CheckCircle,
    Heart,
    Scissors,
    Star
  },
  setup() {
    // 滚动到功能区域
    const scrollToFeatures = () => {
      document.getElementById('features')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }

    return {
      scrollToFeatures
    }
  },
  mounted() {
    // 设置页面标题
    document.title = '个人用户解决方案 - Reface AI图片美化工具'
  }
}
</script>

<style scoped>
/* 确保星星图标正确填充 */
.fill-current {
  fill: currentColor;
}
</style>
