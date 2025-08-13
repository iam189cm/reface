# Reface - AI 图片美化工具

> 专为女性用户打造的智能图片美化 SaaS 产品

一个基于 Vue3 + Vite + Tailwind CSS 的现代化图片编辑网页应用，提供多种 AI 图片处理功能和完整的用户管理系统。

## 🌟 产品特色

- 🎨 **少女感设计** - 粉紫渐变色调，优雅的毛玻璃效果
- 📱 **响应式体验** - 完美适配桌面端和移动端
- 🖼️ **智能上传** - 支持拖拽上传，自动云存储
- ✨ **实时预览** - 调节参数时实时查看效果
- 🤖 **AI 背景移除** - 集成 Remove.bg API，智能抠图
- 🔍 **AI 图片放大** - 集成 VanceAI API，智能图片放大

- 📱 **多种登录方式** - 支持邮箱、手机号短信验证、社交登录
- 🎁 **免费试用** - 每用户每天 3 次免费 AI 处理
- 💳 **配额管理** - 智能配额追踪和管理系统
- 🌍 **多语言支持** - 中英文无缝切换
- 🛠️ **管理员后台** - 完整的用户管理和数据统计功能
- 💾 **一键下载** - 处理完成后直接下载高质量图片

## 🚀 在线体验

**网站地址**: https://reface.dataechotech.com

## 🏗️ 技术架构

- **前端**: Vue 3 + Composition API + Vite + Tailwind CSS
- **状态管理**: Pinia (模块化状态管理)
- **路由**: Vue Router 4 (带权限守卫)
- **国际化**: Vue I18n (中英文支持)
- **后端**: Vercel Serverless Functions
- **数据库**: Supabase (PostgreSQL + 实时订阅)
- **认证**: Supabase Auth (JWT + RLS)
- **存储**: 阿里云 OSS + CDN 加速
- **AI服务**: Remove.bg API + VanceAI API
- **测试**: Vitest + Vue Test Utils

## 🔧 快速开始

### 安装依赖
```bash
npm install
```

### 环境配置
```bash
cp env.example .env
# 编辑 .env 文件，填入必要的 API Keys
```

### 启动开发服务器

```bash
# 启动 Vite 开发服务器
npm run dev
# 或者
npm start

# 访问: http://localhost:3000
# API 请求会自动代理到 https://reface.dataechotech.com
```

### 开发脚本说明
- `npm run dev` / `npm start` - 启动 Vite 开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run test` - 运行 Vitest 测试
- `npm run test:run` - 运行测试并退出
- `npm run test:ui` - 启动测试UI界面
- `npm run test:coverage` - 生成测试覆盖率报告
- `npm run check-env` - 检查环境变量配置
- `npm run debug-oss` - 调试阿里云OSS配置

### 环境变量说明
项目需要配置以下环境变量：

```bash
# Supabase 配置
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=Supabase服务端密钥

# 阿里云 OSS 配置
VITE_OSS_REGION=oss区域
VITE_OSS_BUCKET=存储桶名称
OSS_ACCESS_KEY_ID=访问密钥ID
OSS_ACCESS_KEY_SECRET=访问密钥Secret

# AI 服务配置
REMOVE_BG_API_KEY=Remove.bg API密钥
VANCE_AI_API_KEY=VanceAI API密钥

# 短信服务配置 (Twilio)
TWILIO_ACCOUNT_SID=Twilio账户SID
TWILIO_AUTH_TOKEN=Twilio认证令牌
TWILIO_VERIFY_SERVICE_SID=验证服务SID
```

## 📚 文档

- [API 文档](./docs/API.md) - 完整的 API 接口文档
- [项目概述](./docs/README.md) - 项目详细说明

## 🛠️ 项目结构

```
reface/
├── docs/                           # 📚 项目文档
│   ├── API.md                     # API接口文档
│   └── README.md                  # 项目详细说明
├── scripts/                       # 🔧 工具脚本
│   ├── check-env.js              # 环境检查脚本
│   ├── debug-oss.js              # OSS调试脚本
│   └── test-*.js                 # 各种测试脚本
├── config/                       # ⚙️ 配置文件
│   ├── policies/                 # 阿里云RAM策略
│   ├── postcss.config.js        # PostCSS配置
│   └── tailwind.config.js       # Tailwind配置
├── src/                          # 💻 源代码
│   ├── components/              # Vue组件
│   │   ├── feature/            # 功能组件
│   │   ├── layout/             # 布局组件
│   │   └── ui/                 # UI基础组件
│   ├── composables/            # Vue组合式函数
│   │   ├── business/           # 业务逻辑组合函数
│   │   └── ui/                 # UI相关组合函数
│   ├── services/               # 服务层
│   │   ├── ai/                 # AI服务
│   │   ├── auth/               # 认证服务
│   │   ├── core/               # 核心服务
│   │   └── network/            # 网络服务
│   ├── stores/                 # Pinia状态管理
│   │   ├── modules/            # 模块化store
│   │   └── *.js                # 各功能store
│   ├── views/                  # 页面组件
│   │   ├── auth/               # 认证相关页面
│   │   ├── Admin.vue           # 管理员后台
│   │   ├── Editor.vue          # 图片编辑器
│   │   └── Home.vue            # 首页
│   ├── i18n/                   # 国际化
│   │   ├── locales/            # 语言包
│   │   └── utils/              # i18n工具
│   ├── utils/                  # 工具函数
│   └── styles/                 # 样式文件
├── api/                          # 🌐 Vercel Serverless Functions
│   ├── admin/                  # 管理员API
│   │   ├── statistics.js       # 统计数据API
│   │   └── users.js            # 用户管理API
│   ├── usage/                  # 配额管理API
│   ├── send-sms.js             # 短信发送API
│   ├── verify-sms.js           # 短信验证API
│   └── upload-oss.js           # 文件上传API
├── supabase/                     # 🗄️ Supabase配置
│   ├── functions/              # Edge Functions
│   ├── migrations/             # 数据库迁移
│   └── config.toml             # Supabase配置
├── tests/                        # 🧪 测试文件
│   ├── unit/                   # 单元测试
│   ├── integration/            # 集成测试
│   ├── fixtures/               # 测试数据
│   └── mocks/                  # 模拟数据
└── dist/                         # 📦 构建输出
```

## 🎯 核心功能

### 🖼️ AI 图片处理
- **背景移除**: 使用 Remove.bg API，智能识别并移除图片背景
- **图片放大**: 集成 VanceAI，AI算法实现图片无损放大
- **实时滤镜**: 亮度、对比度、饱和度、磨皮、美白等实时调节

### 👤 用户系统
- **多种认证方式**: 邮箱注册、手机号短信验证、社交登录
- **配额管理**: 每日免费试用配额，智能追踪和管理
- **用户资料**: 完整的用户信息管理

### 🛠️ 管理后台
- **用户管理**: 搜索、查看、编辑用户信息
- **配额调整**: 管理员可调整用户配额
- **数据统计**: 系统使用情况、AI服务统计、用户活跃度分析
- **状态管理**: 用户封禁/解封功能

### 🌍 国际化
- **多语言支持**: 中文/英文无缝切换
- **智能检测**: 自动检测用户语言偏好
- **完整翻译**: 界面、提示信息、错误信息全覆盖

## 📄 许可证

版权所有 © 2024 iam189cm. 保留所有权利。

---

**Reface - 让每一张照片都更美丽** ✨
