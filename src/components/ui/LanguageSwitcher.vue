<template>
  <div class="language-switcher">
    <button 
      :class="buttonClass"
      :title="switchTooltip"
      @click="handleSwitchLanguage"
    >
      {{ switchButtonText }}
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  switchLanguage, 
  getCurrentLocale
} from '@/i18n/index.js'
import { 
  getSwitchButtonText 
} from '@/i18n/utils/detector.js'

export default {
  name: 'LanguageSwitcher',
  
  props: {
    // 按钮样式变体
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'header', 'footer', 'minimal'].includes(value)
    },
    
    // 是否显示切换动画
    animated: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['language-changed'],
  
  setup(props, { emit }) {
    const { locale } = useI18n()
    
    // 当前语言
    const currentLocale = computed(() => getCurrentLocale())
    
    // 切换按钮显示的文本
    const switchButtonText = computed(() => {
      return getSwitchButtonText(currentLocale.value)
    })
    
    // 悬停提示文本
    const switchTooltip = computed(() => {
      const currentLang = currentLocale.value
      if (currentLang === 'zh-CN') {
        return '切换到英文'
      } else {
        return 'Switch to Chinese'
      }
    })
    
    // 按钮样式类
    const buttonClass = computed(() => {
      const baseClass = 'lang-switch-btn'
      const variantClass = `lang-switch-btn--${props.variant}`
      const animatedClass = props.animated ? 'lang-switch-btn--animated' : ''
      
      return [baseClass, variantClass, animatedClass].filter(Boolean).join(' ')
    })
    
    // 处理语言切换
    const handleSwitchLanguage = () => {
      const currentLang = getCurrentLocale()
      const targetLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN'
      
      const success = switchLanguage(targetLang)
      
      if (success) {
        // 触发事件通知父组件
        emit('language-changed', {
          from: currentLang,
          to: targetLang
        })
        
        // 显示切换成功的提示（可选）
        if (import.meta.env.DEV) {
          console.log(`🌍 语言已从 ${currentLang} 切换到 ${targetLang}`)
        }
      }
    }
    
    return {
      currentLocale,
      switchButtonText,
      switchTooltip,
      buttonClass,
      handleSwitchLanguage
    }
  }
}
</script>

<style scoped>
/* 基础样式 */
.lang-switch-btn {
  @apply px-3 py-1.5 text-sm font-medium rounded-full;
  @apply bg-white/10 backdrop-blur-sm;
  @apply text-gray-600 hover:text-gray-800;
  @apply border border-gray-200/50;
  @apply cursor-pointer select-none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.lang-switch-btn:hover {
  @apply bg-white/20 shadow-sm;
  @apply border-gray-300/50;
  transform: translateY(-1px);
}

.lang-switch-btn:active {
  @apply scale-95;
  transform: translateY(0);
}

/* 动画效果 */
.lang-switch-btn--animated {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lang-switch-btn--animated:hover {
  animation: languagePulse 0.6s ease-in-out;
}

/* 不同变体样式 */
.lang-switch-btn--header {
  @apply bg-white/90 backdrop-blur-md;
  @apply text-gray-700 hover:text-pink-600;
  @apply border-gray-200/30 hover:border-pink-200/50;
  @apply shadow-sm hover:shadow-md;
}

.lang-switch-btn--footer {
  @apply bg-gray-100 hover:bg-gray-200;
  @apply text-gray-700 hover:text-gray-900;
}

.lang-switch-btn--minimal {
  @apply bg-transparent border-transparent;
  @apply text-gray-500 hover:text-gray-700;
  @apply px-2 py-1;
}

/* 动画关键帧 */
@keyframes languagePulse {
  0% { transform: scale(1) translateY(-1px); }
  50% { transform: scale(1.05) translateY(-2px); }
  100% { transform: scale(1) translateY(-1px); }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .lang-switch-btn {
    @apply px-2 py-1 text-xs;
  }
}

/* 深色模式支持（预留） */
@media (prefers-color-scheme: dark) {
  .lang-switch-btn {
    @apply bg-gray-800/50 text-gray-300 hover:text-gray-100;
    @apply border-gray-700/50 hover:border-gray-600/50;
  }
  
  .lang-switch-btn--header {
    @apply bg-gradient-to-r from-pink-900/20 to-purple-900/20;
    @apply text-pink-400 hover:text-pink-300;
    @apply border-pink-800/50 hover:border-pink-700/50;
  }
}

/* 无障碍优化 */
.lang-switch-btn:focus {
  @apply outline-none ring-2 ring-pink-500/50 ring-offset-2;
}

.lang-switch-btn:focus-visible {
  @apply ring-2 ring-pink-500 ring-offset-2;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .lang-switch-btn {
    @apply border-2 border-gray-800 bg-white text-black;
  }
  
  .lang-switch-btn:hover {
    @apply bg-gray-100;
  }
}
</style>
