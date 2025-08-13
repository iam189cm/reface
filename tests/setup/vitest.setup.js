/**
 * Vitest 全局设置文件
 * 配置测试环境和全局工具
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// 创建测试用的i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': {
      common: {
        buttons: {
          confirm: '确认',
          cancel: '取消'
        }
      },
      navigation: {
        home: '首页',
        editor: '编辑器',
        login: '登录',
        register: '注册'
      },
      home: {
        title: '让你的照片更美丽',
        subtitle: '简单几步，轻松美化你的照片'
      }
    },
    'en-US': {
      common: {
        buttons: {
          confirm: 'Confirm',
          cancel: 'Cancel'
        }
      },
      navigation: {
        home: 'Home',
        editor: 'Editor',
        login: 'Login',
        register: 'Sign Up'
      },
      home: {
        title: 'Make Your Photos Beautiful',
        subtitle: 'Beautify your photos in simple steps'
      }
    }
  }
})

// 全局插件配置
config.global.plugins = [i18n]

// 全局 Mocks
config.global.mocks = {
  $t: (key, params) => {
    // 简单的翻译mock
    const keys = key.split('.')
    let result = i18n.global.messages[i18n.global.locale.value]
    
    for (const k of keys) {
      result = result?.[k]
    }
    
    if (typeof result === 'string' && params) {
      return result.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match
      })
    }
    
    return result || key
  }
}

// 全局 stubs
config.global.stubs = {
  'router-link': true,
  'router-view': true
}

// Mock 本地存储
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = vi.fn()

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock FileReader
global.FileReader = vi.fn(() => ({
  readAsDataURL: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  result: null
}))

// Mock Image
global.Image = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  src: '',
  width: 100,
  height: 100
}))

// Mock console.warn for cleaner test output
const originalConsoleWarn = console.warn
beforeEach(() => {
  console.warn = vi.fn()
})

afterEach(() => {
  console.warn = originalConsoleWarn
  vi.clearAllMocks()
})

// 测试工具导出
export { i18n }
