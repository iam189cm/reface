<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- 页面标题 -->
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {{ $t('help.title') }}
      </h1>
      <p class="text-gray-600 text-xl max-w-3xl mx-auto">
        {{ $t('help.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- 左侧导航 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
          <h2 class="font-semibold text-gray-900 mb-4">
            {{ $t('help.sections.title') }}
          </h2>
          <nav class="space-y-2">
            <a 
              v-for="section in helpSections" 
              :key="section.id"
              :class="[
                'block px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                activeSection === section.id 
                  ? 'bg-pink-50 text-pink-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              ]"
              @click="activeSection = section.id"
            >
              {{ section.title }}
            </a>
          </nav>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="lg:col-span-3">
        <!-- 快速开始 -->
        <div
          v-show="activeSection === 'getting-started'"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ $t('help.gettingStarted.title') }}
          </h2>
          
          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  {{ $t('help.gettingStarted.step1.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('help.gettingStarted.step1.desc') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  {{ $t('help.gettingStarted.step2.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('help.gettingStarted.step2.desc') }}
                </p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  {{ $t('help.gettingStarted.step3.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('help.gettingStarted.step3.desc') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- AI工具使用 -->
        <div
          v-show="activeSection === 'ai-tools'"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ $t('help.aiTools.title') }}
          </h2>
          
          <div class="space-y-8">
            <!-- AI背景移除 -->
            <div class="border-l-4 border-blue-500 pl-6">
              <h3 class="font-semibold text-gray-900 mb-3">
                {{ $t('help.aiTools.removeBackground.title') }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ $t('help.aiTools.removeBackground.desc') }}
              </p>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('help.aiTools.removeBackground.tip1') }}
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('help.aiTools.removeBackground.tip2') }}
                </li>
              </ul>
            </div>

            <!-- AI图片放大 -->
            <div class="border-l-4 border-green-500 pl-6">
              <h3 class="font-semibold text-gray-900 mb-3">
                {{ $t('help.aiTools.imageEnlarger.title') }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ $t('help.aiTools.imageEnlarger.desc') }}
              </p>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('help.aiTools.imageEnlarger.tip1') }}
                </li>
                <li class="flex items-center">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('help.aiTools.imageEnlarger.tip2') }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div
          v-show="activeSection === 'faq'"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ $t('help.faq.title') }}
          </h2>
          
          <div class="space-y-6">
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.faq.q1') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('help.faq.a1') }}
              </p>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.faq.q2') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('help.faq.a2') }}
              </p>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.faq.q3') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('help.faq.a3') }}
              </p>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.faq.q4') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('help.faq.a4') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 联系支持 -->
        <div
          v-show="activeSection === 'contact'"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-8"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ $t('help.contact.title') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.contact.email.title') }}
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ $t('help.contact.email.desc') }}
              </p>
              <a
                href="mailto:support@reface.com"
                class="text-pink-600 font-medium hover:text-pink-700"
              >
                support@reface.com
              </a>
            </div>
            
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">
                {{ $t('help.contact.chat.title') }}
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                {{ $t('help.contact.chat.desc') }}
              </p>
              <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                {{ $t('help.contact.chat.button') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Help',
  setup() {
    const { t } = useI18n()
    const activeSection = ref('getting-started')
    
    const helpSections = [
      { id: 'getting-started', title: t('help.sections.gettingStarted') },
      { id: 'ai-tools', title: t('help.sections.aiTools') },
      { id: 'faq', title: t('help.sections.faq') },
      { id: 'contact', title: t('help.sections.contact') }
    ]
    
    return {
      activeSection,
      helpSections
    }
  }
}
</script>
