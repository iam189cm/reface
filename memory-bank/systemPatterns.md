# 系统架构模式 - Reface

## 整体架构设计

### 架构原则
- **模块化设计**: Feature模块清晰分离，单一职责
- **类型安全**: TypeScript全覆盖，编译时错误检测
- **依赖注入**: 松耦合设计，便于测试和扩展
- **响应式架构**: 支持移动端和桌面端

### 技术栈架构
```
前端层 (Vue 3 + TypeScript)
├── 表现层: Vue组件 + Tailwind CSS
├── 状态层: Pinia Store
├── 业务层: Composables + Services
└── 数据层: API Services + Local Storage

后端层 (Serverless)
├── API层: Vercel Functions
├── 数据层: Supabase PostgreSQL
├── 存储层: 阿里云OSS
└── 外部服务: NeroAI API
```

## 前端架构模式

### Feature模块化架构
每个Feature模块包含完整的业务逻辑：
```
features/[module-name]/
├── types/          # TypeScript类型定义
├── components/     # 业务组件
├── composables/    # 业务逻辑组合函数
├── services/       # 业务服务
├── constants/      # 业务常量
├── stores/         # 模块状态管理
└── index.ts        # 统一导出
```

### 核心Feature模块
1. **image-processing**: 图片处理核心功能
2. **ai-services**: AI服务集成和管理
3. **user-auth**: 用户认证和权限管理
4. **user-trial**: 试用系统和配额管理
5. **admin-dashboard**: 管理后台功能

### 组件架构模式
```
src/components/
├── ui/             # 通用UI组件
│   ├── Button.vue           # 基础按钮组件
│   ├── Loading.vue          # 加载组件
│   ├── Toast.vue            # 通知组件
│   ├── LanguageSwitcher.vue # 语言切换
│   ├── GlobalLoading.vue    # 🆕 全局加载状态
│   └── LazyImage.vue        # 🆕 懒加载图片组件
├── feature/        # 业务功能组件
└── layout/         # 布局组件
    ├── AppHeader.vue    # 导航栏组件 (重组AI工具分类)
    └── AppFooter.vue    # 页脚组件 (企业信息+双语言)
```

### 🆕 解决方案页面模式
```
src/pages/SolutionPages/
├── PersonalUser.vue      # 个人用户解决方案
├── ContentCreator.vue    # 内容创作者解决方案  
├── EcommerceSeller.vue   # 电商卖家解决方案
└── Designer.vue          # 设计师解决方案

页面结构模式:
- Hero区域 (标题+CTA)
- 使用场景展示
- 功能特色说明
- 用户评价(可选)
- 底部CTA区域
```

### 状态管理模式
- **全局状态**: Pinia Store管理应用级状态
- **组件状态**: Vue Composition API管理局部状态
- **业务状态**: Feature模块内的专用Store
- **🆕 统一接口**: useGlobalState composable统一状态访问

## 后端架构模式

### Serverless函数架构
```
api/
├── auth/           # 认证相关API
├── admin/          # 管理后台API
├── usage/          # 使用统计API
├── send-sms.js     # 短信发送
├── upload-oss.js   # 文件上传
└── verify-sms.js   # 短信验证
```

### 数据库设计模式
- **用户表**: 用户基本信息和认证数据
- **使用记录表**: AI服务使用记录和配额跟踪
- **短信验证表**: 短信验证码管理
- **管理日志表**: 管理操作审计记录

## 关键设计模式

### 🆕 1. 全局状态管理模式
```typescript
// 统一全局状态管理 - /src/composables/ui/useGlobalState.js
export function useGlobalState() {
  const appStore = useAppStore()
  
  return {
    // 状态访问
    isGlobalLoading: computed(() => appStore.isGlobalLoading),
    notifications: computed(() => appStore.notifications),
    
    // 操作方法
    setGlobalLoading: (loading, message) => appStore.setGlobalLoading(loading, message),
    showSuccess: (message, title) => appStore.addSuccessNotification(message, title),
    showError: (message, title) => appStore.addErrorNotification(message, title)
  }
}

// 异步操作包装器
export function useAsyncOperation() {
  const executeAsync = async (operation, options = {}) => {
    try {
      setGlobalLoading(true, options.loadingMessage)
      const result = await operation()
      return { success: true, data: result }
    } catch (error) {
      handleError(error, options.errorType)
      return { success: false, error }
    } finally {
      setGlobalLoading(false)
    }
  }
  
  return { executeAsync }
}
```

### 🆕 2. 统一错误处理模式
```typescript
// 分层错误处理 - /src/services/error-handler.service.js
class ErrorHandlerService {
  handleError(error, type, level, context) {
    // 1. 记录错误历史
    this.recordError(error, type, level, context)
    
    // 2. 分析错误类型
    const errorInfo = this.analyzeError(error, type)
    
    // 3. 显示用户友好提示
    this.showUserFriendlyError(errorInfo, level)
    
    // 4. 执行恢复策略
    this.executeRecoveryStrategy(errorInfo, context)
  }
  
  // 便捷方法
  handleNetworkRequestError(error, context) {
    this.handleError(error, ErrorTypes.NETWORK_ERROR, ErrorLevels.MEDIUM, context)
  }
  
  handleAIRequestError(error, serviceType, context) {
    this.handleError(error, ErrorTypes.AI_SERVICE_ERROR, ErrorLevels.MEDIUM, {
      ...context, serviceType
    })
  }
}
```

### 🆕 3. 性能优化模式
```typescript
// 懒加载和性能优化 - /src/utils/performance.js
export class ResourcePreloader {
  async preload(url, type) {
    if (this.cache.has(url)) return this.cache.get(url)
    
    const promise = this.loadResource(url, type)
    this.cache.set(url, promise)
    return promise
  }
}

// 动态组件导入
export const createAsyncComponent = (importFunc, options = {}) => {
  return () => {
    const promise = importFunc()
    if (options.preload) {
      promise.catch(error => console.warn('预加载失败:', error))
    }
    return promise
  }
}

// 代码分割路由
const PersonalUser = createAsyncComponent(() => 
  import('./pages/SolutionPages/PersonalUser.vue')
)
```

### 🆕 4. 图片懒加载模式
```typescript
// 懒加载图片组件 - /src/components/ui/LazyImage.vue
export default {
  setup(props) {
    const { target, isVisible } = useIntersectionObserver({
      threshold: props.threshold,
      rootMargin: props.rootMargin
    })
    
    const shouldLoad = computed(() => !props.lazy || isVisible.value)
    
    return { target, shouldLoad }
  }
}

// IntersectionObserver Hook - /src/composables/useIntersectionObserver.js
export function useIntersectionObserver(options = {}) {
  const target = ref(null)
  const isVisible = ref(false)
  
  // 观察器逻辑
  const observer = new IntersectionObserver(entries => {
    isVisible.value = entries[0].isIntersecting
  }, options)
  
  return { target, isVisible }
}
```

### 🆕 5. 图标系统模式
```typescript
// 统一图标配置 - /src/utils/icons.js
export const iconMap = {
  navigation: {
    home: 'Home',
    menu: 'Menu', 
    chevronDown: 'ChevronDown'
  },
  aiCategories: {
    enhance: 'Sparkles',     // AI增强
    edit: 'Scissors',        // AI编辑  
    create: 'Palette',       // AI创造
    productivity: 'Zap'      // AI生产力
  },
  userGroups: {
    personal: 'User',        // 个人用户
    contentCreator: 'Video', // 内容创作者
    ecommerce: 'ShoppingCart', // 电商卖家
    designer: 'Target'       // 设计师
  }
}

// 图标预设配置
export const iconSizes = {
  xs: 16, sm: 18, md: 20, lg: 24, xl: 32
}
```

### 6. 动画系统模式
```css
/* 统一动画库 - /src/styles/animations.css */

/* 页面过渡动画 */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮增强交互 */
.btn-enhanced {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 卡片悬停效果 */
.card-interactive {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-interactive:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 骨架屏动画 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}
```

### 7. 依赖注入模式
```typescript
// 服务注入示例
export const useImageProcessor = () => {
  const aiService = inject<AIService>('aiService')
  const storageService = inject<StorageService>('storageService')
  return { aiService, storageService }
}
```

### 8. 服务模式 - AI图像处理
```typescript
interface AIService {
  processImage(image: File, options: ProcessOptions): Promise<ProcessResult>
  getSupportedFeatures(): AIFeature[]
}

class NeroAIService implements AIService { ... }
```

### 9. 观察者模式 - 状态管理
```typescript
// Pinia Store响应式状态
export const useImageStore = defineStore('image', () => {
  const images = ref<ImageItem[]>([])
  const processing = ref(false)
  
  const addImage = (image: ImageItem) => {
    images.value.push(image)
  }
  
  return { images, processing, addImage }
})
```

### 10. 工厂模式 - 组件创建
```typescript
// 动态组件工厂
export const createAIComponent = (type: AIServiceType) => {
  const componentMap = {
    'background-removal': AIBackgroundRemover,
    'image-enlarger': AIImageEnlarger,
    'cartoon': AICartoon,
    'face-restoration': AIFaceRestoration
  }
  return componentMap[type]
}
```

## 数据流架构

### 图片处理流程
```
用户上传 → 前端验证 → OSS存储 → AI服务处理 → 结果存储 → 用户下载
```

### 状态同步流程
```
用户操作 → Composable → Store更新 → 组件响应 → UI更新
```

## 🆕 错误处理架构

### 分层错误处理架构
```typescript
// 错误处理层级
┌─────────────────┐
│   UI层错误显示   │ ← 用户友好提示
├─────────────────┤
│  Component层    │ ← 组件级错误处理
├─────────────────┤
│  Composable层   │ ← 业务逻辑错误处理
├─────────────────┤
│  Service层      │ ← API调用错误处理
├─────────────────┤
│  全局错误处理    │ ← 未捕获错误兜底
└─────────────────┘
```

### 错误恢复策略增强
- **自动重试**: 网络错误和临时故障，支持指数退避
- **降级服务**: AI服务不可用时的备选方案
- **用户引导**: 清晰的错误提示和解决建议
- **🆕 错误历史**: 记录和分析错误模式
- **🆕 智能恢复**: 根据错误类型执行不同恢复策略
- **🆕 状态恢复**: 自动清理加载状态和UI状态

## 🆕 性能优化架构

### 前端性能优化体系
```typescript
// 性能优化层次
┌─────────────────┐
│   用户感知层    │ ← 加载状态、骨架屏、动画
├─────────────────┤
│   资源加载层    │ ← 图片懒加载、预加载、缓存
├─────────────────┤
│   代码分割层    │ ← 路由分割、组件分割、动态导入
├─────────────────┤
│   渲染优化层    │ ← 虚拟滚动、防抖节流、优化重渲染
├─────────────────┤
│   网络优化层    │ ← HTTP/2、CDN、资源压缩
└─────────────────┘
```

### 具体优化实施
- **🆕 智能懒加载**: LazyImage组件 + IntersectionObserver
- **🆕 代码分割**: 动态路由导入，解决方案页面独立chunks
- **🆕 预加载管理**: ResourcePreloader类统一资源预加载
- **🆕 性能监控**: performance.js工具集成，实时性能跟踪
- **缓存策略**: API响应和静态资源缓存
- **Bundle优化**: Tree shaking和压缩

### 后端优化
- **CDN加速**: 静态资源全球分发
- **数据库优化**: 索引优化和查询缓存
- **API限流**: 防止滥用和保护服务稳定性
- **异步处理**: 长时间AI任务异步执行

## 安全架构模式

### 认证授权
- **JWT令牌**: 无状态认证机制
- **角色权限**: 基于角色的访问控制
- **API密钥**: 外部服务安全调用
- **CORS配置**: 跨域请求安全控制

### 数据安全
- **输入验证**: 前后端双重验证
- **SQL注入防护**: 参数化查询
- **文件上传安全**: 类型和大小限制
- **敏感信息加密**: 用户数据加密存储
