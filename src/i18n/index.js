/**
 * Vue I18n 配置
 * 国际化核心设置文件
 */

import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'
import { 
  getInitialLocale, 
  saveLocale, 
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE 
} from './utils/detector.js'

// 语言资源
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS
}

// 获取初始语言
const initialLocale = getInitialLocale()

// 创建i18n实例
export const i18n = createI18n({
  // 使用Composition API模式
  legacy: false,
  
  // 默认语言
  locale: initialLocale,
  
  // 回退语言（翻译缺失时使用）
  fallbackLocale: DEFAULT_LOCALE,
  
  // 语言资源
  messages,
  
  // 全局注入（可以在模板中直接使用$t）
  globalInjection: true,
  
  // 在组件中缺少翻译key时的处理
  missingWarn: import.meta.env.DEV,
  fallbackWarn: import.meta.env.DEV,
  
  // 数字和日期格式化
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY',
        currencyDisplay: 'symbol'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    },
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  },
  
  datetimeFormats: {
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
})

// 全局语言切换函数
export function switchLanguage(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) {
    console.warn('⚠️ 不支持的语言：', locale)
    return false
  }
  
  // 更新i18n实例的语言
  i18n.global.locale.value = locale
  
  // 保存用户偏好
  saveLocale(locale)
  
  // 更新HTML lang属性（有助于SEO和无障碍）
  updateHtmlLang(locale)
  
  console.log('🌍 语言已切换至：', locale)
  return true
}

// 获取当前语言
export function getCurrentLocale() {
  return i18n.global.locale.value
}

// 更新HTML元素的lang属性
function updateHtmlLang(locale) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale
  }
}

// 初始化时设置HTML lang属性
updateHtmlLang(initialLocale)

// 导出一些有用的工具函数
export { 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE,
  getInitialLocale
} from './utils/detector.js'

// 导出翻译函数的引用（用于在JS中调用）
export const t = i18n.global.t
export const tc = i18n.global.tc  // 计数翻译
export const te = i18n.global.te  // 检查翻译是否存在

// 开发环境的调试功能
if (import.meta.env.DEV) {
  // 全局暴露i18n实例用于调试
  window.__i18n__ = i18n
  window.__switchLang__ = switchLanguage
  
  console.log('🌍 i18n已初始化')
  console.log('📍 当前语言：', initialLocale)
  console.log('🛠️ 调试：使用 window.__switchLang__(\'en-US\') 切换语言')
}
