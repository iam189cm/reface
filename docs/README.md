# Reface 项目文档

## 📖 项目简介

Reface 是一个专为女性用户（18-35岁）设计的AI图像美化SaaS产品，专注于自拍照片增强处理。

## 🚀 快速开始

### 本地开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问: http://localhost:3000

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 环境变量配置

复制 `env.example` 为 `.env.local` 并填入相应配置：

```bash
cp env.example .env.local
```

必需的环境变量：

**核心服务**：
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase服务端密钥

**AI服务**：
- `VITE_REMOVE_BG_API_KEY` - Remove.bg API密钥
- `VITE_VANCE_AI_API_TOKEN` - VanceAI API Token

**阿里云OSS存储**：
- `VITE_OSS_ACCESS_KEY_ID` - OSS访问密钥ID
- `VITE_OSS_ACCESS_KEY_SECRET` - OSS访问密钥Secret
- `VITE_OSS_BUCKET` - 存储桶名称
- `VITE_OSS_REGION` - OSS区域

**阿里云短信服务**：
- `ALIYUN_ACCESS_KEY_ID` - 阿里云访问密钥ID
- `ALIYUN_ACCESS_KEY_SECRET` - 阿里云访问密钥Secret
- `ALIYUN_SMS_SIGN_NAME` - 短信签名名称
- `ALIYUN_SMS_TEMPLATE_CODE` - 短信模板代码

**站点配置**：
- `VITE_SITE_URL` - 站点URL (默认: https://reface.dataechotech.com)
- `VITE_APP_ENV` - 应用环境 (development/production)

## 🏗️ 项目架构

### 技术栈
- **前端框架**: Vue 3 + Composition API + Vite
- **样式框架**: Tailwind CSS + PostCSS
- **状态管理**: Pinia (模块化设计)
- **路由管理**: Vue Router 4 (权限守卫)
- **国际化**: Vue I18n (中英文支持)
- **测试框架**: Vitest + Vue Test Utils
- **数据库**: Supabase (PostgreSQL + RLS)
- **认证系统**: Supabase Auth (JWT + 多种登录方式)
- **文件存储**: 阿里云OSS (专用存储，移除本地存储)
- **短信服务**: 阿里云SMS (手机号验证)
- **AI服务**: Remove.bg API + VanceAI API
- **部署平台**: Vercel (Serverless Functions + 自动部署)

### 项目结构
```
reface/
├── api/                          # 🌐 Vercel Serverless Functions
│   ├── admin/                   # 管理员API
│   │   ├── statistics.js        # 数据统计API
│   │   └── users.js             # 用户管理API
│   ├── usage/                   # 配额管理API
│   │   └── consume.js           # 配额消费API
│   ├── send-sms.js              # 短信发送API
│   ├── verify-sms.js            # 短信验证API
│   └── upload-oss.js            # 文件上传API
├── src/                          # 💻 前端源代码
│   ├── components/              # Vue组件
│   │   ├── feature/            # 核心功能组件
│   │   │   ├── AIBackgroundRemover.vue   # AI背景移除
│   │   │   ├── AIImageEnlarger.vue       # AI图片放大
│   │   │   ├── ImageUploader.vue         # 图片上传
│   │   │   ├── ProductIntro.vue          # 产品介绍
│   │   │   └── TrialStatusPanel.vue      # 试用状态面板
│   │   ├── layout/             # 布局组件
│   │   │   └── AppHeader.vue            # 应用导航栏
│   │   └── ui/                 # 基础UI组件
│   │       ├── LanguageSwitcher.vue     # 语言切换器
│   │       ├── Loading.vue              # 加载组件
│   │       └── Toast.vue                # 通知组件
│   ├── composables/            # Vue组合式函数
│   │   ├── business/           # 业务逻辑组合函数
│   │   │   ├── useAIServices.js         # AI服务管理
│   │   │   ├── useAuthManager.js        # 认证管理
│   │   │   └── useTrialManager.js       # 试用管理
│   │   ├── ui/                 # UI相关组合函数
│   │   └── useImageEditor.js    # 图片编辑器核心逻辑
│   ├── services/               # 服务层（依赖注入架构）
│   │   ├── ai/                 # AI服务
│   │   │   ├── removeBackground/        # 背景移除服务
│   │   │   └── vanceAI/                 # VanceAI服务
│   │   ├── auth/               # 认证服务
│   │   │   ├── EmailAuthService.js      # 邮箱认证
│   │   │   ├── PhoneAuthService.js      # 手机号认证
│   │   │   └── SocialAuthService.js     # 社交登录
│   │   ├── core/               # 核心服务
│   │   │   ├── ConfigService.js         # 配置管理
│   │   │   ├── DISetup.js               # 依赖注入设置
│   │   │   └── ServiceContainer.js      # 服务容器
│   │   └── network/            # 网络服务
│   │       └── HttpClient.js            # HTTP客户端
│   ├── stores/                 # Pinia状态管理
│   │   ├── modules/            # 模块化Store
│   │   │   └── auth/           # 认证相关状态
│   │   ├── appStore.js         # 应用全局状态
│   │   ├── editorStore.js      # 编辑器状态
│   │   ├── imageStore.js       # 图片状态
│   │   └── trialStore.js       # 试用状态
│   ├── i18n/                   # 🌍 国际化
│   │   ├── locales/            # 语言包
│   │   │   ├── zh-CN.js        # 中文语言包
│   │   │   └── en-US.js        # 英文语言包
│   │   └── utils/              # i18n工具
│   ├── views/                  # 页面组件
│   │   ├── auth/               # 认证相关页面
│   │   ├── Admin.vue           # 管理员后台
│   │   ├── Editor.vue          # 图片编辑器
│   │   ├── Home.vue            # 首页
│   │   ├── Pricing.vue         # 定价页面
│   │   └── Help.vue            # 帮助页面
│   └── utils/                  # 工具函数
├── supabase/                    # 🗄️ Supabase配置
│   ├── functions/              # Edge Functions
│   └── migrations/             # 数据库迁移文件
├── tests/                       # 🧪 测试框架
│   ├── unit/                   # 单元测试
│   ├── integration/            # 集成测试
│   └── mocks/                  # 模拟数据
├── config/                      # ⚙️ 配置文件
├── scripts/                     # 🔧 开发脚本
└── docs/                        # 📚 项目文档
```

## 🎯 核心功能

### 🤖 AI智能处理
1. **AI背景移除** - 集成Remove.bg API，智能识别并移除图片背景
2. **AI图片放大** - 使用VanceAI API，支持2x/4x无损放大，保持细节清晰
3. **实时预览** - 所有AI处理结果实时预览，支持撤销和重做

### 👤 用户系统
4. **多重认证** - 支持邮箱注册、手机号短信验证、社交登录(Google)
5. **配额管理** - 智能配额追踪，支持免费试用和付费套餐
6. **用户资料** - 完整的用户信息管理和权限控制

### 🎨 用户体验
7. **响应式设计** - 完美适配桌面端和移动端
8. **多语言支持** - 中英文无缝切换，智能语言检测
9. **拖拽上传** - 支持拖拽上传和批量处理
10. **云存储** - 阿里云OSS安全存储，CDN加速访问

### 🛠️ 管理功能
11. **管理后台** - 用户管理、数据统计、配额调整
12. **数据分析** - AI服务使用统计、用户活跃度分析
13. **系统监控** - 服务健康检查、错误日志记录

## 🛠️ 开发工作流程

### 本地调试流程
1. **环境配置**: 复制 `env.example` 为 `.env.local` 并配置API密钥
2. **启动开发环境**: `npm run dev` (端口3000)
3. **实时预览**: http://localhost:3000
4. **API代理**: API请求自动代理到生产环境 (https://reface.dataechotech.com)
5. **功能测试**: 运行 `npm run test` 执行单元测试
6. **构建验证**: `npm run build` 确保无错误
7. **提交代码**: 测试通过后push到GitHub dev分支

### 开发环境特点
- **纯前端开发**: 只需要Vite开发服务器，无需Vercel CLI
- **API代理策略**: 本地前端 + 线上API，避免本地环境配置复杂性
- **热重载**: 代码修改实时预览，提升开发效率
- **依赖注入**: 开发环境支持Mock服务，便于离线调试

### 部署流程  
- **开发分支**: dev分支用于功能开发和测试
- **主分支**: main分支对应生产环境
- **自动部署**: GitHub push触发Vercel自动部署
- **生产访问**: https://reface.dataechotech.com

## 📚 开发说明

### 依赖注入系统
项目使用自定义的依赖注入容器，提升代码可维护性：
- **ServiceContainer**: 统一管理所有服务实例
- **单例模式**: 确保服务实例唯一性和性能优化
- **Mock支持**: 开发环境可使用Mock服务进行离线调试
- **配置驱动**: 通过ConfigService统一管理所有配置
- **类型安全**: 服务接口标准化，降低耦合度

### 存储架构设计
项目采用**OSS专用存储**策略：
- **移除本地存储**: 避免浏览器存储限制和数据丢失风险
- **阿里云OSS**: 提供稳定、快速的云端文件存储
- **CDN加速**: 图片访问和下载速度优化
- **权限控制**: 基于签名URL的安全访问控制
- **成本优化**: 按需付费，适合初创项目规模

### 状态管理
- 使用Pinia进行状态管理
- 模块化设计，职责清晰
- 认证状态与业务状态分离

### 测试框架
- **单元测试**: Vitest + Vue Test Utils
- **集成测试**: 完整业务流程测试
- **覆盖率**: 支持测试覆盖率统计
- **Mock服务**: 完善的模拟数据和服务

### 代码规范  
- **Vue 3 Composition API**: 统一使用组合式API
- **模块化设计**: 服务层与UI层严格分离
- **依赖注入**: 使用ServiceContainer管理所有服务依赖
- **错误处理**: 统一错误处理和用户友好的提示信息
- **TypeScript**: 关键服务使用TypeScript (Supabase Functions)
- **代码组织**: 按功能模块组织，单一职责原则

## 🐛 常见问题

### API配置问题
确保`.env.local`文件中的API密钥正确配置：
- **Remove.bg API Key**: 需要有效配额，建议使用付费账户
- **VanceAI Token**: 确保格式正确，账户有足够积分
- **Supabase配置**: URL和密钥需要匹配项目设置
- **阿里云OSS**: AccessKey需要有OSS写入权限
- **阿里云SMS**: 需要开通短信服务并配置模板

### 本地开发问题

**依赖安装问题**：
```bash
rm -rf node_modules package-lock.json
npm install
```

**端口冲突问题**：
```bash
# 如果3000端口被占用，可以修改vite.config.js中的端口配置
# 或者使用以下命令指定端口
npm run dev -- --port 3001
```

**API代理问题**：
如果线上API无法访问，检查网络连接或临时禁用代理：
```javascript
// vite.config.js - 临时禁用API代理进行本地测试
server: {
  // proxy: { ... } // 注释掉代理配置
}
```

**测试运行问题**：
```bash
# 运行所有测试
npm run test

# 运行测试UI
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

## 📋 可用脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (端口3000) |
| `npm start` | 启动开发服务器的别名 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览构建结果 |
| `npm run test` | 运行Vitest测试 |
| `npm run test:ui` | 启动测试UI界面 |
| `npm run test:coverage` | 生成测试覆盖率报告 |
| `npm run check-env` | 检查环境变量配置 |
| `npm run debug-oss` | 调试阿里云OSS配置 |

## 🔧 开发注意事项

### 项目特性
- **闭源个人项目**: 代码仅用于内部开发和部署
- **女性用户导向**: UI设计和功能专为女性用户优化
- **移动端优先**: 响应式设计，移动端体验优先
- **OSS专用存储**: 完全依赖阿里云OSS，不支持本地存储

### 分支管理
- **main分支**: 生产环境代码，与线上版本保持同步
- **dev分支**: 开发分支，用于功能开发和测试
- **功能分支**: 临时分支，开发完成后合并到dev分支

### 版本发布
1. 在dev分支完成功能开发和测试
2. 创建Pull Request从dev合并到main
3. 合并后Vercel自动部署到生产环境
4. 访问 https://reface.dataechotech.com 验证功能

## 📞 项目信息

- **在线访问**: https://reface.dataechotech.com
- **项目类型**: 闭源个人SaaS项目
- **技术栈**: Vue3 + Tailwind + Supabase + 阿里云
- **开发状态**: 持续开发中

---

> **Reface** - 现代化Vue3架构 + 依赖注入 + 模块化设计，专为女性用户打造的AI图片美化工具

