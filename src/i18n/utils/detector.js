/**
 * 语言自动检测工具
 * Language Auto Detection Utility
 */

// 支持的语言列表
export const SUPPORTED_LOCALES = ['zh-CN', 'en-US']

// 默认语言
export const DEFAULT_LOCALE = 'zh-CN'

// 本地存储的键名
export const LOCALE_STORAGE_KEY = 'reface_locale'

/**
 * 从浏览器语言中匹配最合适的语言
 * @param {string|string[]} browserLangs - 浏览器语言列表
 * @returns {string} 匹配的语言代码
 */
export function matchBrowserLanguage(browserLangs) {
  // 确保是数组格式
  const langs = Array.isArray(browserLangs) ? browserLangs : [browserLangs]
  
  for (const lang of langs) {
    if (!lang) continue
    
    // 直接匹配完整的locale
    if (SUPPORTED_LOCALES.includes(lang)) {
      return lang
    }
    
    // 匹配语言代码部分 (如 'en' 匹配 'en-US')
    const langCode = lang.split('-')[0].toLowerCase()
    for (const supportedLocale of SUPPORTED_LOCALES) {
      const supportedLangCode = supportedLocale.split('-')[0].toLowerCase()
      if (langCode === supportedLangCode) {
        return supportedLocale
      }
    }
  }
  
  // 没有匹配到，返回默认语言
  return DEFAULT_LOCALE
}

/**
 * 检测浏览器语言设置
 * @returns {string} 检测到的语言代码
 */
export function detectBrowserLanguage() {
  // 检测顺序：
  // 1. navigator.language (首选语言)
  // 2. navigator.languages (语言列表)
  // 3. navigator.userLanguage (IE兼容)
  // 4. navigator.browserLanguage (IE兼容)
  
  const browserLangs = [
    navigator.language,
    ...(navigator.languages || []),
    navigator.userLanguage,
    navigator.browserLanguage
  ].filter(Boolean) // 过滤掉undefined/null值
  
  console.log('🌍 检测到的浏览器语言：', browserLangs)
  
  const detectedLang = matchBrowserLanguage(browserLangs)
  console.log('🎯 匹配到的语言：', detectedLang)
  
  return detectedLang
}

/**
 * 从localStorage获取用户保存的语言偏好
 * @returns {string|null} 保存的语言代码
 */
export function getSavedLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (saved && SUPPORTED_LOCALES.includes(saved)) {
      console.log('💾 从本地存储读取语言偏好：', saved)
      return saved
    }
  } catch (error) {
    console.warn('⚠️ 无法读取本地存储的语言偏好：', error)
  }
  return null
}

/**
 * 保存用户的语言偏好到localStorage
 * @param {string} locale - 语言代码
 */
export function saveLocale(locale) {
  try {
    if (SUPPORTED_LOCALES.includes(locale)) {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
      console.log('💾 保存语言偏好：', locale)
    } else {
      console.warn('⚠️ 尝试保存不支持的语言：', locale)
    }
  } catch (error) {
    console.warn('⚠️ 无法保存语言偏好：', error)
  }
}

/**
 * 获取初始语言设置
 * 优先级：用户设置 > 浏览器语言 > 默认语言
 * @returns {string} 应该使用的语言代码
 */
export function getInitialLocale() {
  // 1. 优先使用用户保存的偏好
  const savedLocale = getSavedLocale()
  if (savedLocale) {
    return savedLocale
  }
  
  // 2. 检测浏览器语言
  const browserLocale = detectBrowserLanguage()
  
  // 3. 如果检测到英文，使用英文；否则使用默认中文
  return browserLocale
}

/**
 * 获取语言显示名称
 * @param {string} locale - 语言代码
 * @returns {string} 语言显示名称
 */
export function getLanguageDisplayName(locale) {
  const displayNames = {
    'zh-CN': '中文',
    'en-US': 'English'
  }
  return displayNames[locale] || locale
}

/**
 * 获取另一种语言的代码（用于切换按钮显示）
 * @param {string} currentLocale - 当前语言代码
 * @returns {string} 另一种语言的代码
 */
export function getAlternativeLocale(currentLocale) {
  return currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN'
}

/**
 * 获取切换按钮应该显示的文本
 * @param {string} currentLocale - 当前语言代码
 * @returns {string} 切换按钮文本
 */
export function getSwitchButtonText(currentLocale) {
  const alternativeLocale = getAlternativeLocale(currentLocale)
  return getLanguageDisplayName(alternativeLocale)
}
