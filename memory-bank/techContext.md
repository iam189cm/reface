# 技术上下文 - Reface

## 技术栈概览

### 前端技术栈
- **Vue 3.4.0**: 使用Composition API，现代化Vue开发
- **TypeScript 5.3.0**: 完整类型安全，优秀开发体验
- **Vite 4.5.0**: 快速构建工具，热更新支持
- **Tailwind CSS 3.3.6**: 实用优先的CSS框架
- **Pinia 3.0.3**: Vue 3官方状态管理库
- **Vue Router 4.2.5**: 客户端路由管理
- **Vue I18n 9.14.5**: 国际化支持
- **Lucide Vue Next**: 现代化图标库，轻量级SVG图标组件

### 后端技术栈
- **Vercel Functions**: Serverless函数部署
- **Supabase 2.54.0**: 数据库和认证服务
- **阿里云OSS 6.23.0**: 对象存储服务
- **Node.js**: 服务端JavaScript运行时

### 外部服务集成
- **NeroAI API**: 多功能AI图像处理服务
- **阿里云POP Core**: 阿里云服务SDK

### 开发工具链
- **ESLint 8.56.0**: 代码规范检查
- **Prettier 3.1.0**: 代码格式化
- **Vitest 0.34.6**: 单元测试框架
- **Vue TSC 1.6.5**: Vue TypeScript编译器

### 🆕 性能和用户体验工具 (Phase 2)
- **IntersectionObserver API**: 图片懒加载和滚动动画
- **Web Performance API**: 性能监控和指标收集
- **CSS Animations**: 统一动画系统和微交互
- **Error Boundary**: 全局错误捕获和处理机制

## 开发环境配置

### 本地开发要求
- Node.js 18.0+
- npm 9.0+
- 现代浏览器支持ES2020+

### 环境变量配置
```bash
# Supabase配置
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 阿里云OSS配置
VITE_OSS_REGION=your_oss_region
VITE_OSS_BUCKET=your_oss_bucket
VITE_OSS_ACCESS_KEY_ID=your_access_key_id
VITE_OSS_ACCESS_KEY_SECRET=your_access_key_secret

# AI服务配置
VITE_NERO_AI_API_KEY=your_nero_ai_api_key
```

### 开发命令
```bash
# ✅ 已完成的设置
npm install lucide-vue-next  # 图标库已安装

# 日常开发命令
npm run dev          # 启动开发服务器 (localhost:5173)
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
npm run type-check   # TypeScript类型检查
npm run lint         # ESLint代码检查
npm run test         # 运行单元测试
npm run test:ui      # 测试UI界面

# 🆕 性能优化相关
# 构建分析和性能监控已内置到构建流程中
# 图片懒加载和代码分割自动生效
```

## 项目结构详解

### 核心目录结构
```
reface/
├── src/
│   ├── app/                    # 应用级配置
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # 全局状态
│   │   └── providers/         # 全局提供者
│   ├── features/              # 业务功能模块
│   │   ├── image-processing/  # 图片处理功能
│   │   ├── ai-services/       # AI服务功能
│   │   ├── user-auth/         # 用户认证功能
│   │   ├── user-trial/        # 试用管理功能
│   │   └── admin-dashboard/   # 管理后台功能
│   ├── shared/                # 共享资源
│   │   ├── components/        # 通用组件
│   │   ├── services/          # 核心服务
│   │   ├── types/             # 类型定义
│   │   ├── constants/         # 全局常量
│   │   ├── composables/       # 通用组合函数
│   │   └── utils/             # 工具函数
│   ├── pages/                 # 页面组件
│   │   ├── SolutionPages/     # 🆕 解决方案页面
│   │   │   ├── PersonalUser.vue      # 个人用户
│   │   │   ├── ContentCreator.vue    # 内容创作者
│   │   │   ├── EcommerceSeller.vue   # 电商卖家
│   │   │   └── Designer.vue          # 设计师
│   │   └── ...                # 其他页面
│   ├── components/            # 组件目录
│   │   ├── layout/            # 布局组件
│   │   │   ├── AppHeader.vue  # 🔄 重组导航栏
│   │   │   └── AppFooter.vue  # 🆕 页脚组件
│   │   └── ...                # 其他组件
│   ├── utils/                 # 工具函数
│   │   ├── icons.js           # 图标系统配置
│   │   ├── performance.js     # 🆕 性能优化工具
│   │   └── ...                # 其他工具
│   ├── composables/           # 组合函数
│   │   ├── ui/                # UI相关composables
│   │   │   ├── useGlobalState.js       # 🆕 全局状态管理
│   │   │   └── useIntersectionObserver.js # 🆕 交叉观察器
│   ├── services/              # 服务层
│   │   ├── error-handler.service.js # 🆕 统一错误处理
│   │   └── ...                # 其他服务
│   ├── styles/                # 样式文件
│   │   ├── animations.css     # 🆕 动画系统
│   │   └── ...                # 其他样式
├── api/                       # Vercel Functions
├── tests/                     # 测试文件
└── docs/                      # 项目文档
```

### TypeScript配置
- **严格模式**: 启用所有严格类型检查
- **路径映射**: 支持@/别名导入
- **模块解析**: Node.js模块解析策略
- **目标版本**: ES2020，支持现代浏览器

### 构建配置
- **Vite配置**: 优化的开发和生产构建
- **🆕 代码分割增强**: 动态路由导入，解决方案页面独立chunks
- **🆕 资源优化**: 图片懒加载、预加载管理、缓存策略
- **环境变量**: 开发和生产环境区分
- **🆕 性能监控**: 构建时性能分析和优化建议

## 数据库设计

### Supabase表结构
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE,
  name VARCHAR,
  avatar_url VARCHAR,
  role VARCHAR DEFAULT 'user',
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 使用记录表
CREATE TABLE usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  service_type VARCHAR NOT NULL,
  credits_consumed INTEGER NOT NULL,
  image_url VARCHAR,
  result_url VARCHAR,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 短信验证表
CREATE TABLE sms_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 数据库策略
- **RLS策略**: 行级安全策略保护用户数据
- **索引优化**: 查询性能优化
- **数据备份**: 自动备份和恢复机制
- **连接池**: 数据库连接优化

## API设计规范

### RESTful API设计
```
GET    /api/users          # 获取用户列表
POST   /api/users          # 创建用户
GET    /api/users/:id      # 获取用户详情
PUT    /api/users/:id      # 更新用户信息
DELETE /api/users/:id      # 删除用户

POST   /api/upload-oss     # 上传文件到OSS
POST   /api/send-sms       # 发送短信验证码
POST   /api/verify-sms     # 验证短信验证码
```

### 响应格式标准
```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}
```

## 🆕 性能优化策略 (Phase 2完成)

### 前端性能优化实施
- **✅ 代码分割增强**: 动态路由导入，解决方案页面分离chunks
- **✅ 图片懒加载**: LazyImage组件 + IntersectionObserver实现
- **✅ 全局加载管理**: 统一加载状态和用户反馈
- **✅ 性能监控**: 实时性能指标收集和分析
- **✅ 动画优化**: CSS硬件加速和60fps流畅动画
- **✅ Bundle优化**: Tree shaking和代码压缩
- **缓存策略**: Service Worker和HTTP缓存 (待实施)

### 技术实现详情
```typescript
// 性能工具集成
export const initPerformanceOptimizations = () => {
  // 启动性能监控
  performanceMonitor.monitorPageLoad()
  performanceMonitor.monitorResourceLoad()
  
  // 预加载关键资源
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      console.log('[Performance] 空闲时间预加载启动')
    })
  }
}

// 懒加载实现
export function useLazyLoad(callback, options = {}) {
  const { target, isVisible } = useIntersectionObserver(options)
  
  watch(isVisible, (visible) => {
    if (visible && callback) callback()
  })
  
  return { target, isVisible }
}
```

### 后端性能优化
- **CDN加速**: Cloudflare全球分发
- **数据库优化**: 查询优化和索引
- **API缓存**: Redis缓存热点数据 (待实施)
- **异步处理**: 长时间任务队列处理

## 安全措施

### 前端安全
- **XSS防护**: 内容安全策略(CSP)
- **CSRF防护**: 同源策略和Token验证
- **输入验证**: 前端表单验证
- **敏感信息**: 避免在前端存储敏感数据

### 后端安全
- **认证授权**: JWT令牌和角色权限
- **API限流**: 防止滥用和DDoS攻击
- **数据加密**: 敏感数据加密存储
- **SQL注入**: 参数化查询防护

## 测试策略

### 测试类型
- **单元测试**: Vitest + Vue Test Utils
- **集成测试**: API接口测试
- **E2E测试**: 用户流程测试
- **性能测试**: 加载时间和响应速度

### 测试覆盖率目标
- **组件测试**: 覆盖率 > 80%
- **工具函数**: 覆盖率 > 90%
- **API接口**: 覆盖率 > 70%
- **关键流程**: 覆盖率 100%

## 部署架构

### 生产环境
- **前端部署**: Vercel自动部署
- **API部署**: Vercel Serverless Functions
- **数据库**: Supabase托管PostgreSQL
- **CDN**: Cloudflare全球加速
- **监控**: Vercel Analytics + 自定义监控

### CI/CD流程
```
代码提交 → GitHub Actions → 类型检查 → 单元测试 → 构建 → 部署 → 验证
```

## 开发规范

### 代码规范
- **命名约定**: camelCase变量，PascalCase组件
- **文件组织**: Feature模块化组织
- **导入顺序**: 第三方库 → 内部模块 → 相对路径
- **注释规范**: JSDoc注释和类型注解

### 🆕 架构规范 (Phase 2)
- **组合函数**: 使用`use`前缀，返回响应式对象
- **错误处理**: 使用统一的ErrorHandler服务
- **性能优化**: 优先使用懒加载和代码分割
- **状态管理**: 优先使用useGlobalState统一接口
- **动画效果**: 使用animations.css预定义动画类

### Git工作流
- **分支策略**: main(生产) + dev(开发) + feature分支
- **提交规范**: Conventional Commits格式
- **代码审查**: Pull Request必须经过审查
- **自动化**: 提交前自动运行lint和test
