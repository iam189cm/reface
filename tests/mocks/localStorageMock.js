/**
 * LocalStorage Mock
 * 用于测试中模拟本地存储
 */

import { vi } from 'vitest'

export class LocalStorageMock {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.get(key) || null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  get length() {
    return this.store.size
  }

  key(index) {
    const keys = Array.from(this.store.keys())
    return keys[index] || null
  }
}

// 创建mock实例
export const localStorageMock = new LocalStorageMock()

// Vitest mock函数
export const mockLocalStorage = () => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn((key) => localStorageMock.getItem(key)),
      setItem: vi.fn((key, value) => localStorageMock.setItem(key, value)),
      removeItem: vi.fn((key) => localStorageMock.removeItem(key)),
      clear: vi.fn(() => localStorageMock.clear()),
      get length() {
        return localStorageMock.length
      },
      key: vi.fn((index) => localStorageMock.key(index))
    }
  })
}
