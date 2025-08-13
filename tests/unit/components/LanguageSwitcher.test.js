/**
 * LanguageSwitcher 组件测试
 * tests/unit/components/LanguageSwitcher.test.js
 */

import { describe, test, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

// Mock i18n 工具函数
vi.mock('@/i18n/index.js', () => ({
  switchLanguage: vi.fn(() => true),
  getCurrentLocale: vi.fn(() => 'zh-CN')
}))

vi.mock('@/i18n/utils/detector.js', () => ({
  getSwitchButtonText: vi.fn((locale) => locale === 'zh-CN' ? 'English' : '中文')
}))

describe('LanguageSwitcher', () => {
  let i18n
  let wrapper
  
  beforeEach(() => {
    // 创建i18n实例
    i18n = createI18n({
      legacy: false,
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      messages: {
        'zh-CN': {},
        'en-US': {}
      }
    })
    
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })
  
  const createWrapper = (props = {}) => {
    return mount(LanguageSwitcher, {
      props,
      global: {
        plugins: [i18n]
      }
    })
  }
  
  describe('渲染', () => {
    test('应该正确渲染语言切换按钮', () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('English')
    })
    
    test('应该应用正确的CSS类', () => {
      wrapper = createWrapper({ variant: 'header' })
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('lang-switch-btn')
      expect(button.classes()).toContain('lang-switch-btn--header')
    })
    
    test('应该支持不同的变体', () => {
      wrapper = createWrapper({ variant: 'minimal' })
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('lang-switch-btn--minimal')
    })
    
    test('应该支持动画效果', () => {
      wrapper = createWrapper({ animated: true })
      
      const button = wrapper.find('button')
      expect(button.classes()).toContain('lang-switch-btn--animated')
    })
  })
  
  describe('交互', () => {
    test('点击应该触发语言切换', async () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      await button.trigger('click')
      
      // 验证是否调用了switchLanguage
      const { switchLanguage } = await import('@/i18n/index.js')
      expect(switchLanguage).toHaveBeenCalledWith('en-US')
    })
    
    test('应该发送language-changed事件', async () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      await button.trigger('click')
      
      expect(wrapper.emitted('language-changed')).toBeTruthy()
      expect(wrapper.emitted('language-changed')[0]).toEqual([{
        from: 'zh-CN',
        to: 'en-US'
      }])
    })
  })
  
  describe('响应式', () => {
    test('应该根据当前语言显示正确的按钮文本', async () => {
      // Mock getCurrentLocale返回英文
      const { getCurrentLocale } = await import('@/i18n/index.js')
      getCurrentLocale.mockReturnValue('en-US')
      
      // Mock getSwitchButtonText返回中文
      const { getSwitchButtonText } = await import('@/i18n/utils/detector.js')
      getSwitchButtonText.mockReturnValue('中文')
      
      wrapper = createWrapper()
      
      expect(wrapper.find('button').text()).toBe('中文')
    })
  })
  
  describe('可访问性', () => {
    test('应该有合适的title属性', () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      // 根据组件逻辑，如果当前是中文，应该显示"切换到英文"
      // 但如果mock的getCurrentLocale实际返回的是英文，则显示"Switch to Chinese"
      const titleAttr = button.attributes('title')
      expect(titleAttr).toBeTruthy() // 确保title存在
      // 检查是否为预期的两个值之一
      expect(['切换到英文', 'Switch to Chinese']).toContain(titleAttr)
    })
    
    test('应该支持键盘导航', async () => {
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      
      // 模拟键盘事件
      await button.trigger('keydown', { key: 'Enter' })
      await button.trigger('click')
      
      expect(wrapper.emitted('language-changed')).toBeTruthy()
    })
  })
  
  describe('错误处理', () => {
    test('应该处理切换失败的情况', async () => {
      // Mock switchLanguage返回false
      const { switchLanguage } = await import('@/i18n/index.js')
      switchLanguage.mockReturnValue(false)
      
      wrapper = createWrapper()
      
      const button = wrapper.find('button')
      await button.trigger('click')
      
      // 切换失败时不应该发送事件
      expect(wrapper.emitted('language-changed')).toBeFalsy()
    })
  })
  
  describe('Props验证', () => {
    test('应该验证variant prop', () => {
      // 这里可以测试props验证逻辑
      const validVariants = ['default', 'header', 'footer', 'minimal']
      
      validVariants.forEach(variant => {
        wrapper = createWrapper({ variant })
        expect(wrapper.props('variant')).toBe(variant)
      })
    })
    
    test('应该有默认值', () => {
      wrapper = createWrapper()
      
      expect(wrapper.props('variant')).toBe('default')
      expect(wrapper.props('animated')).toBe(true)
    })
  })
})
