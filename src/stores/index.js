/**
 * Pinia Store 入口文件（重构版）
 * 统一导出所有 stores
 */

export { useImageStore } from './imageStore.js'
export { useEditorStore } from './editorStore.js'
export { useAppStore } from './appStore.js'
export { useTrialStore } from './trialStore.js'

// 新的模块化 stores
export { useAuthStore } from './modules/auth/authStore.js'
