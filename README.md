# Reface - AI 图片美化工具

> 专为女性用户打造的智能图片美化 SaaS 产品

一个基于 Vue3 + Vite + Tailwind CSS 的现代化图片编辑网页应用，提供 AI 背景移除和实时美颜滤镜功能。

## 🌟 产品特色

- 🎨 **少女感设计** - 粉紫渐变色调，优雅的毛玻璃效果
- 📱 **响应式体验** - 完美适配桌面端和移动端
- 🖼️ **智能上传** - 支持拖拽上传，自动云存储
- ✨ **实时预览** - 调节参数时实时查看效果
- 🤖 **AI 背景移除** - 集成 Remove.bg API，智能抠图
- 🎛️ **丰富滤镜** - 磨皮、美白、亮度、对比度、饱和度调节
- 🎁 **免费试用** - 每用户每天 3 次免费 AI 处理
- 💾 **一键下载** - 处理完成后直接下载高质量图片

## 🚀 在线体验

**网站地址**: https://reface.vercel.app

## 🏗️ 技术架构

- **前端**: Vue 3 + Composition API + Vite + Tailwind CSS
- **后端**: Vercel Serverless Functions
- **存储**: 阿里云 OSS + CDN 加速
- **AI服务**: Remove.bg API

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
npm run dev
# 或使用启动脚本
./scripts/start.sh
```

### 构建生产版本
```bash
npm run build
```

## 📚 文档

- [项目概述](./docs/project-overview.md) - 详细的项目介绍
- [开发规划](./docs/development-plan.md) - 项目规划和优化建议
- [重构总结](./docs/refactoring-summary.md) - 🆕 完美重构完成总结
- [部署指南](./docs/deployment/) - 部署相关文档
- [安全指南](./docs/security/) - 安全配置文档

## 🛠️ 项目结构

```
reface/
├── docs/           # 📚 项目文档
├── scripts/        # 🔧 工具脚本
├── config/         # ⚙️ 配置文件
├── src/            # 💻 源代码
├── api/            # 🌐 Vercel Functions
└── public/         # 📁 静态资源
```

## 📄 许可证

版权所有 © 2024 iam189cm. 保留所有权利。

---

**Reface - 让每一张照片都更美丽** ✨
