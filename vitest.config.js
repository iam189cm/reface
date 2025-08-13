import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  
  test: {
    // 测试环境
    environment: 'jsdom',
    
    // 全局变量
    globals: true,
    
    // 设置文件
    setupFiles: ['./tests/setup/vitest.setup.js'],
    
    // 测试文件匹配规则
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'
    ],
    
    // 排除的文件
    exclude: [
      'node_modules/**',
      'dist/**',
      '.vercel/**'
    ],
    
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'tests/coverage',
      include: [
        'src/**/*.{js,vue}'
      ],
      exclude: [
        'src/main.js',
        'src/**/*.d.ts',
        'src/**/{index,main}.{js,ts}',
        'src/**/types/**'
      ],
      thresholds: {
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70
        }
      }
    },
    
    // 测试超时
    testTimeout: 10000,
    
    // 并发运行
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false
      }
    }
  },
  
  // 路径解析
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // 定义全局变量
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  }
})
