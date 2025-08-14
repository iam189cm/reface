# Reface - AI图片美化工具

Reface 是一个专为女性用户打造的 AI 图片美化 SaaS 应用，采用现代化 TypeScript + Vue 3 架构，提供背景移除、图片放大等AI图像处理功能。

## ✨ 项目特点

- 🔧 **TypeScript 全覆盖** - 完全类型安全，优秀的开发体验
- 🏗️ **模块化架构** - Feature模块清晰分离，易于维护扩展  
- ⚡ **现代开发工具链** - Vite + ESLint + Prettier + Vue-tsc
- 🎯 **依赖注入系统** - 松耦合设计，便于测试和维护
- 📱 **响应式设计** - Tailwind CSS，完美支持移动端

## 🚀 快速开始

### 环境要求
- Node.js 18.0+
- npm 9.0+

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev          # 启动开发服务器 (localhost:3000)
npm run type-check   # TypeScript类型检查
npm run lint         # ESLint代码检查
```

### 构建生产版本
```bash
npm run build        # 构建生产版本
npm run preview      # 预览构建结果
```

## 🏗️ 项目架构

### 核心设计原则
- **单一职责原则** - 每个模块只负责一个业务领域
- **类型安全优先** - TypeScript全覆盖，编译时错误检测  
- **依赖注入** - 松耦合设计，便于测试和扩展
- **模块化组织** - Feature模块清晰分离业务逻辑

### 📁 项目结构

```
reface/
├── 🔧 api/                      # Vercel Serverless Functions
│   ├── admin/                   # 管理后台API
│   ├── auth/                    # 认证相关API  
│   └── ai/                      # AI服务API
├── 📦 src/
│   ├── 🏗️ app/                  # 应用级配置
│   │   ├── router/              # 路由配置
│   │   ├── stores/              # 全局状态
│   │   └── providers/           # 全局提供者
│   ├── 🎯 features/             # 业务功能模块
│   │   ├── image-processing/    # 图片处理功能 (14 files)
│   │   ├── ai-services/         # AI服务功能 (15 files)
│   │   ├── user-auth/           # 用户认证功能 (11 files)
│   │   └── admin-dashboard/     # 管理后台功能 (6 files)
│   ├── 🔗 shared/               # 共享资源
│   │   ├── components/ui/       # 通用UI组件
│   │   ├── services/            # 核心服务
│   │   ├── types/               # TypeScript类型定义
│   │   ├── constants/           # 全局常量
│   │   ├── composables/         # 通用组合函数
│   │   └── utils/               # 工具函数
│   ├── 📄 pages/                # 页面组件
│   └── 🎨 assets/               # 静态资源
├── 🧪 tests/                    # 测试文件
├── 📚 docs/                     # 项目文档
└── 📋 REFACTOR_SUMMARY.md       # 重构完成报告
```

### 🎯 Feature模块化架构
每个Feature模块都包含完整的业务逻辑：
```
features/[module-name]/
├── types/          # TypeScript类型定义
├── components/     # 业务组件  
├── composables/    # 业务逻辑组合函数
├── services/       # 业务服务
├── constants/      # 业务常量
└── index.ts        # 统一导出
```

## 🛠️ 技术栈

### 前端
- **Vue 3** - Composition API，现代化Vue开发
- **TypeScript** - 完整类型安全，优秀开发体验
- **Vite** - 快速构建工具，热更新
- **Tailwind CSS** - 实用优先的CSS框架
- **Pinia** - Vue 3状态管理
- **Vue Router 4** - 客户端路由
- **Vue I18n** - 国际化支持

### 后端
- **Vercel Functions** - Serverless函数部署
- **Supabase** - 数据库和认证
- **阿里云OSS** - 对象存储服务
- **Remove.bg API** - AI背景移除
- **VanceAI API** - AI图片处理

### 开发工具
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化
- **Husky** - Git钩子管理
- **Vitest** - 单元测试框架

## 🔧 核心功能

### 🖼️ 图片处理
- **智能上传** - 拖拽上传，进度跟踪，错误恢复
- **格式支持** - JPG、PNG、WebP多格式支持
- **尺寸验证** - 智能检测图片尺寸和文件大小
- **缩略图生成** - 自动生成预览缩略图

### 🤖 AI服务
- **背景移除** - Remove.bg API集成，一键抠图
- **图片放大** - VanceAI技术，AI无损放大
- **服务管理** - 统一任务管理，状态跟踪
- **错误恢复** - 自动重试机制，用户友好的错误提示

### 👤 用户系统
- **多种认证** - 邮箱、手机、Google等多种登录方式
- **权限管理** - 基于角色的访问控制
- **配额管理** - 灵活的使用配额和限制
- **会话管理** - JWT令牌自动刷新

### 📊 管理后台
- **用户管理** - 用户搜索、编辑、状态管理
- **数据统计** - 实时系统统计和使用分析
- **配额控制** - 用户配额调整和批量操作
- **审计日志** - 完整的管理操作记录

## 🚀 部署架构

- **前端部署**: Vercel自动部署，支持预览环境
- **API服务**: Vercel Serverless Functions，按需扩容
- **CDN加速**: Cloudflare全球CDN，快速访问
- **数据存储**: Supabase PostgreSQL + 阿里云OSS

## 📈 开发规范

### 代码风格
- **TypeScript优先** - 所有新代码必须使用TypeScript
- **组合式API** - 使用Vue 3 Composition API
- **单一职责** - 每个函数/组件只负责一个功能
- **类型导出** - 所有类型定义统一导出

### 目录命名
- **kebab-case** - 目录使用短横线命名
- **PascalCase** - 组件目录使用大驼峰
- **camelCase** - 文件使用小驼峰
- **扩展名** - 新文件统一使用.ts/.vue扩展名

### Git工作流
- **dev分支** - 开发分支，本地开发推送到此
- **main分支** - 生产分支，经过测试后合并
- **功能分支** - feature/功能名称，完成后合并到dev

## 📚 文档和指南

- 📋 [重构完成报告](REFACTOR_SUMMARY.md) - 详细的重构过程和成果
- 📖 [API文档](docs/API.md) - 后端API接口文档
- 🧪 [测试指南](tests/README.md) - 测试框架和规范

## 🤝 贡献指南

1. **Fork项目** 并创建功能分支
2. **确保类型检查通过** (`npm run type-check`)
3. **运行代码规范检查** (`npm run lint`)  
4. **编写单元测试** 覆盖新功能
5. **提交Pull Request** 到dev分支

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**🎯 Reface现代化重构完成 - 更稳定、更高效、更易维护！** 🚀
