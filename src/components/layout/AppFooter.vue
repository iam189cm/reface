<template>
  <footer class="bg-gradient-to-br from-gray-50 to-pink-50 border-t border-gray-200">
    <div class="container mx-auto px-4 py-16">
      <!-- 主要页脚内容 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- 在线服务 -->
        <div>
          <h3 class="flex items-center font-semibold text-gray-900 mb-4">
            <Sparkles
              :size="18"
              class="mr-2 text-pink-500"
            />
            {{ $t('footer.onlineServices', '在线服务') }}
          </h3>
          <div class="space-y-3">
            <router-link 
              v-for="service in onlineServices" 
              :key="service.key"
              :to="service.path" 
              class="block text-sm text-gray-600 hover:text-pink-600 transition-colors"
            >
              {{ $t(service.label, service.default) }}
            </router-link>
          </div>
        </div>

        <!-- 解决方案 -->
        <div>
          <h3 class="flex items-center font-semibold text-gray-900 mb-4">
            <Users
              :size="18"
              class="mr-2 text-purple-500"
            />
            {{ $t('footer.solutions', '解决方案') }}
          </h3>
          <div class="space-y-3">
            <router-link 
              v-for="solution in solutions" 
              :key="solution.key"
              :to="solution.path" 
              class="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors group"
            >
              <component
                :is="solution.icon"
                :size="14"
                class="mr-2 text-gray-400 group-hover:text-pink-500 transition-colors"
              />
              {{ $t(solution.label, solution.default) }}
            </router-link>
          </div>
        </div>

        <!-- 支持信息 -->
        <div>
          <h3 class="flex items-center font-semibold text-gray-900 mb-4">
            <LifeBuoy
              :size="18"
              class="mr-2 text-blue-500"
            />
            {{ $t('footer.support', '支持') }}
          </h3>
          <div class="space-y-3">
            <router-link 
              v-for="support in supportLinks" 
              :key="support.key"
              :to="support.path" 
              class="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors group"
            >
              <component
                :is="support.icon"
                :size="14"
                class="mr-2 text-gray-400 group-hover:text-pink-500 transition-colors"
              />
              {{ $t(support.label, support.default) }}
            </router-link>
          </div>
        </div>

        <!-- 法律信息 -->
        <div>
          <h3 class="flex items-center font-semibold text-gray-900 mb-4">
            <FileText
              :size="18"
              class="mr-2 text-green-500"
            />
            {{ $t('footer.legal', '法律') }}
          </h3>
          <div class="space-y-3">
            <router-link 
              v-for="legal in legalLinks" 
              :key="legal.key"
              :to="legal.path" 
              class="flex items-center text-sm text-gray-600 hover:text-pink-600 transition-colors group"
            >
              <component
                :is="legal.icon"
                :size="14"
                class="mr-2 text-gray-400 group-hover:text-pink-500 transition-colors"
              />
              {{ $t(legal.label, legal.default) }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- 企业信息区域 -->
      <div class="border-t border-gray-200 pt-8 mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 品牌和描述 -->
          <div>
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">R</span>
              </div>
              <h2 class="text-2xl font-bold gradient-text">
                Reface
              </h2>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">
              {{ $t('footer.brandDescription', '专为女性打造的AI图片美化工具，让每一张照片都完美绽放。使用最先进的AI技术，为您提供专业级的图像处理体验。') }}
            </p>
            
            <!-- 语言切换器 - 页脚版本 -->
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">{{ $t('footer.language', '语言') }}:</span>
              <LanguageSwitcher variant="footer" />
            </div>
          </div>

          <!-- 企业联系信息 -->
          <div>
            <h4 class="flex items-center font-semibold text-gray-900 mb-4">
              <Building
                :size="18"
                class="mr-2 text-gray-500"
              />
              {{ $t('footer.companyInfo', '企业信息') }}
            </h4>
            
            <div class="space-y-3 text-sm">
              <!-- 联系方式 -->
              <div class="flex items-center text-gray-600">
                <Mail
                  :size="14"
                  class="mr-3 text-gray-400"
                />
                <span>{{ $t('footer.email', '邮箱') }}: </span>
                <a
                  href="mailto:contact@reface.ai"
                  class="text-pink-600 hover:text-pink-700 ml-1"
                >
                  contact@reface.ai
                </a>
              </div>
              
              <div class="flex items-center text-gray-600">
                <Phone
                  :size="14"
                  class="mr-3 text-gray-400"
                />
                <span>{{ $t('footer.phone', '电话') }}: </span>
                <a
                  href="tel:+86-400-000-0000"
                  class="text-pink-600 hover:text-pink-700 ml-1"
                >
                  +86 400-000-0000
                </a>
              </div>
              
              <div class="flex items-start text-gray-600">
                <MapPin
                  :size="14"
                  class="mr-3 text-gray-400 mt-0.5"
                />
                <span>{{ $t('footer.address', '地址') }}: {{ $t('footer.addressText', '[待填写公司地址]') }}</span>
              </div>
              
              <!-- 备案信息 -->
              <div class="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                <div>{{ $t('footer.icp', 'ICP备案号') }}: [{{ $t('footer.placeholder', '待填写') }}]</div>
                <div>{{ $t('footer.license', '经营许可证') }}: [{{ $t('footer.placeholder', '待填写') }}]</div>
                <div>{{ $t('footer.businessLicense', '统一社会信用代码') }}: [{{ $t('footer.placeholder', '待填写') }}]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- 版权声明 -->
        <div class="text-sm text-gray-500 text-center md:text-left">
          <p>
            © {{ currentYear }} Reface. {{ $t('footer.allRightsReserved', '保留所有权利') }}.
          </p>
          <p class="mt-1">
            {{ $t('footer.madeWithLove', '用') }} <Heart
              :size="12"
              class="inline text-pink-500 mx-1"
            /> {{ $t('footer.madeIn', '在中国制造') }}
          </p>
        </div>

        <!-- 社交媒体链接 -->
        <div class="flex items-center space-x-6">
          <span class="text-sm text-gray-500">{{ $t('footer.followUs', '关注我们') }}:</span>
          
          <!-- 微信 -->
          <a 
            href="#wechat" 
            class="text-gray-400 hover:text-pink-600 transition-colors"
            :title="$t('footer.wechat', '微信')"
          >
            <MessageCircle :size="20" />
          </a>
          
          <!-- 微博 -->
          <a 
            href="#weibo" 
            class="text-gray-400 hover:text-pink-600 transition-colors"
            :title="$t('footer.weibo', '微博')"
          >
            <Share :size="20" />
          </a>
          
          <!-- GitHub -->
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-400 hover:text-pink-600 transition-colors"
            :title="$t('footer.github', 'GitHub')"
          >
            <Github :size="20" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
// 导入图标组件
import {
  Sparkles,
  Users,
  User,
  Video,
  ShoppingCart,
  Target,
  LifeBuoy,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  ExternalLink,
  Building,
  MapPin,
  Heart,
  Github,
  Share
} from 'lucide-vue-next'

// 导入组件
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'

export default {
  name: 'AppFooter',
  components: {
    // 图标组件
    Sparkles,
    Users,
    User,
    Video,
    ShoppingCart,
    Target,
    LifeBuoy,
    Mail,
    Phone,
    MessageCircle,
    FileText,
    ExternalLink,
    Building,
    MapPin,
    Heart,
    Github,
    Share,
    // UI组件
    LanguageSwitcher
  },
  setup() {
    
    // 在线服务链接
    const onlineServices = [
      { key: 'imageUpscale', path: '/editor', label: 'services.imageUpscale', default: 'AI图片放大' },
      { key: 'backgroundRemoval', path: '/editor', label: 'services.backgroundRemoval', default: 'AI老照片修复' },
      { key: 'imageDenoising', path: '/editor', label: 'services.imageDenoising', default: 'AI图片去噪' },
      { key: 'cartoonize', path: '/editor', label: 'services.cartoonize', default: 'AI照片卡通化' },
      { key: 'smartCrop', path: '/editor', label: 'services.smartCrop', default: 'AI智能抠图' },
      { key: 'removeBackground', path: '/editor', label: 'services.removeBackground', default: 'AI一键去背景' }
    ]

    // 解决方案链接
    const solutions = [
      { key: 'personal', path: '/solutions/personal', icon: 'User', label: 'solutions.personal', default: '个人用户' },
      { key: 'contentCreator', path: '/solutions/content-creator', icon: 'Video', label: 'solutions.contentCreator', default: '内容创作者' },
      { key: 'ecommerce', path: '/solutions/ecommerce', icon: 'ShoppingCart', label: 'solutions.ecommerce', default: '电商卖家' },
      { key: 'designer', path: '/solutions/designer', icon: 'Target', label: 'solutions.designer', default: '设计师' }
    ]

    // 支持链接
    const supportLinks = [
      { key: 'contact', path: '/contact', icon: 'Mail', label: 'support.contact', default: '联系我们' },
      { key: 'help', path: '/help', icon: 'LifeBuoy', label: 'support.help', default: '使用帮助' },
      { key: 'feedback', path: '/feedback', icon: 'MessageCircle', label: 'support.feedback', default: '用户反馈' },
      { key: 'helpCenter', path: '/help', icon: 'ExternalLink', label: 'support.helpCenter', default: '帮助中心' }
    ]

    // 法律链接
    const legalLinks = [
      { key: 'terms', path: '/legal/terms', icon: 'FileText', label: 'legal.terms', default: '使用条款' },
      { key: 'privacy', path: '/legal/privacy', icon: 'FileText', label: 'legal.privacy', default: '隐私政策' }
    ]

    // 当前年份
    const currentYear = computed(() => new Date().getFullYear())

    return {
      onlineServices,
      solutions,
      supportLinks,
      legalLinks,
      currentYear
    }
  }
}
</script>

<style scoped>
/* 渐变文字效果 */
.gradient-text {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 链接悬停效果 */
a {
  transition: all 0.2s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 深色模式支持（预留） */
@media (prefers-color-scheme: dark) {
  footer {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    border-top-color: #374151;
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #f472b6 0%, #c084fc 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
