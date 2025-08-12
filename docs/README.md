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
# 访问: http://localhost:5173

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
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥
- `VITE_REMOVE_BG_API_KEY` - Remove.bg API密钥
- `VITE_VANCE_AI_API_TOKEN` - VanceAI API Token

## 🏗️ 项目架构

### 技术栈
- **前端**: Vue 3 + Composition API + Vite
- **样式**: Tailwind CSS
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: Supabase
- **存储**: 阿里云OSS
- **AI服务**: Remove.bg + VanceAI

### 项目结构
```
src/
├── components/          # UI组件
│   ├── feature/        # 功能组件
│   ├── layout/         # 布局组件
│   └── ui/            # 基础UI组件
├── composables/        # 组合函数
│   ├── business/      # 业务逻辑
│   └── ui/           # UI相关
├── services/          # 服务层（依赖注入）
│   ├── ai/           # AI服务
│   ├── auth/         # 认证服务
│   ├── core/         # 核心服务
│   └── network/      # 网络服务
├── stores/           # 状态管理
│   └── modules/      # 模块化Store
├── utils/           # 工具函数
└── views/           # 页面组件
```

## 🎯 核心功能

1. **AI背景移除** - 使用Remove.bg API
2. **AI图像放大** - 使用VanceAI API，支持2x/4x/8x放大
3. **用户认证** - 支持邮箱、手机号、Google登录
4. **试用系统** - 免费用户每日3次试用机会
5. **图像处理** - 基础编辑功能

## 🛠️ 开发工作流程

### 本地调试流程
1. **启动开发环境**: `npm run dev`
2. **实时预览**: http://localhost:5173
3. **功能测试**: 本地完整测试所有功能
4. **构建验证**: `npm run build` 确保无错误
5. **提交代码**: 测试通过后再push到GitHub

### 部署流程
- **开发环境**: 本地 `npm run dev`
- **预览环境**: 本地 `npm run build && npm run preview`  
- **生产环境**: Vercel自动部署 (https://reface.dataechotech.com)

## 📚 开发说明

### 依赖注入系统
项目使用自定义的依赖注入容器：
- 所有服务通过`ServiceContainer`管理
- 支持单例模式和工厂模式
- 开发环境可使用Mock服务进行测试

### 状态管理
- 使用Pinia进行状态管理
- 模块化设计，职责清晰
- 认证状态与业务状态分离

### 代码规范
- 使用ESLint + Prettier
- 组件采用Composition API
- 服务层与UI层分离
- 统一错误处理和日志记录

## 🐛 常见问题

### API配置问题
确保`.env.local`文件中的API密钥正确配置，特别是：
- Remove.bg API Key需要有效配额
- VanceAI Token需要正确格式
- Supabase配置需要匹配项目设置

### 本地开发问题
如遇到依赖问题：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 支持

- **在线演示**: https://reface.dataechotech.com
- **GitHub仓库**: https://github.com/iam189cm/reface
- **技术问题**: 请创建GitHub Issue

---

> 本项目采用现代化Vue3架构，支持依赖注入、模块化开发，易于维护和扩展。

