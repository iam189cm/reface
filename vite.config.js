import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // 支持运行时模板编译
        isCustomElement: (tag) => false
      }
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    // 确保在开发环境中启用模板编译
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // 代理 API 请求到 Vercel 线上环境进行测试
      '/api': {
        target: 'https://reface.dataechotech.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})