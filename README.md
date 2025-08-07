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

### 前端技术栈
- **Vue 3** - 渐进式 JavaScript 框架 (Composition API)
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vue Router** - 官方路由管理器
- **Canvas API** - 图像处理和渲染

### 后端服务
- **Vercel** - 静态网站托管 + Serverless Functions
- **阿里云 OSS** - 对象存储服务，图片 CDN 加速
- **Remove.bg API** - AI 背景移除服务

### 项目结构
```
reface/
├── src/
│   ├── components/              # 可复用组件
│   │   ├── SliderControl.vue       # 滑块控制组件
│   │   └── BackgroundRemover.vue   # AI背景移除组件
│   ├── views/                  # 页面组件
│   │   ├── Home.vue               # 首页 - 图片上传
│   │   └── Editor.vue             # 编辑页 - 图片调节
│   ├── utils/                  # 工具函数
│   │   ├── aiServices.js          # AI服务集成
│   │   ├── ossClient.js           # OSS客户端
│   │   └── trialManager.js        # 试用计数管理
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 入口文件
│   └── style.css               # 全局样式
├── api/                        # Vercel Functions
│   └── upload-oss.js              # OSS上传API
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── tailwind.config.js          # Tailwind 配置
├── vite.config.js              # Vite 配置
└── vercel.json                 # Vercel 部署配置
```

## 🔧 本地开发

### 系统要求
- Node.js 16.0 或更高版本
- 现代浏览器（支持 ES6+ 和 Canvas API）

### 快速启动
```bash
# 克隆项目 (私有仓库)
git clone https://github.com/iam189cm/reface.git
cd reface

# 使用启动脚本（推荐）
./start.sh

# 或手动启动
npm install
npm run dev
```

启动后访问 http://localhost:5173

### 环境配置

1. **复制环境变量文件**
   ```bash
   cp env.example .env
   ```

2. **配置必需的 API Keys**
   ```bash
   # Remove.bg API Key
   VITE_REMOVE_BG_API_KEY=your_remove_bg_api_key
   
   # 阿里云 OSS 配置
   VITE_OSS_ACCESS_KEY_ID=your_oss_access_key_id
   VITE_OSS_ACCESS_KEY_SECRET=your_oss_access_key_secret
   VITE_OSS_BUCKET=your_bucket_name
   VITE_OSS_REGION=oss-cn-shanghai
   ```

3. **获取 API Keys**
   - **Remove.bg**: 访问 [Remove.bg API](https://www.remove.bg/api) 注册账号获取免费 API Key（50张/月）
   - **阿里云 OSS**: 在阿里云控制台创建 OSS Bucket 并获取访问密钥

## 📱 功能说明

### 首页功能
- **图片上传**: 点击上传或拖拽图片文件
- **格式支持**: JPG、PNG、WebP 格式，最大 10MB
- **云存储**: 自动上传到阿里云 OSS，CDN 加速
- **预览信息**: 显示图片大小、类型等信息
- **一键编辑**: 直接跳转到编辑页面

### 编辑页功能
- **AI 背景移除**: 智能移除图片背景（每天3次免费）
- **实时滤镜调节**:
  - 磨皮调节: 0-100% 强度
  - 美白调节: 0-100% 强度  
  - 亮度调节: -50 到 +50
  - 对比度调节: -50 到 +50
  - 饱和度调节: -50 到 +50
- **操作功能**:
  - 重置功能: 一键恢复所有参数
  - 下载功能: 保存处理后的图片
  - 实时预览: 所有调节都有即时效果

### 交互特点
- **响应式设计**: 完美适配手机和平板
- **精确控制**: 滑块支持精确数值显示
- **智能降级**: OSS 不可用时自动使用本地存储
- **友好提示**: 详细的操作引导和错误提示

## 🎨 设计系统

### 色彩主题
项目采用少女感的粉紫渐变主题：

```javascript
// Tailwind 自定义颜色
colors: {
  'pink': {
    50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8',
    300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899',
    600: '#db2777', 700: '#be185d', 800: '#9d174d'
  },
  'purple': {
    50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff',
    300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7',
    600: '#9333ea', 700: '#7c3aed', 800: '#6b21a8'
  }
}

// 渐变背景
backgroundImage: {
  'gradient-pink': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
  'gradient-purple': 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
  'gradient-rainbow': 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%)'
}
```

### UI 组件特点
- **圆角设计**: 使用 rounded-xl、rounded-2xl 营造柔和感
- **毛玻璃效果**: backdrop-blur-md 创造现代感
- **阴影层次**: 多层次阴影增强立体感
- **动画过渡**: 所有交互都有流畅的 transition 效果

## 🔧 构建和部署

### 构建命令
```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 部署到 Vercel

1. **连接 GitHub 仓库**
   - 访问 [Vercel](https://vercel.com)
   - 导入 GitHub 项目
   - 选择 `reface` 仓库

2. **配置环境变量**
   ```
   VITE_REMOVE_BG_API_KEY = your_remove_bg_api_key
   VITE_OSS_ACCESS_KEY_ID = your_oss_access_key_id
   VITE_OSS_ACCESS_KEY_SECRET = your_oss_access_key_secret
   VITE_OSS_BUCKET = your_bucket_name
   VITE_OSS_REGION = oss-cn-shanghai
   ```

3. **部署设置**
   - 构建命令: `npm run build`
   - 输出目录: `dist`
   - Node.js 版本: 18.x

## 🔐 安全和隐私

### 数据安全
- **API 密钥**: 通过环境变量安全管理，不暴露在客户端
- **图片存储**: 使用阿里云 OSS 企业级存储，数据加密传输
- **隐私保护**: 不收集用户个人信息，图片处理完成后可选择删除

### 访问控制
- **OSS 权限**: 配置为公共读，私有写
- **CORS 设置**: 仅允许指定域名访问
- **API 限流**: Remove.bg API 有使用频率限制

## 📊 性能优化

### 已实现优化
- **图片压缩**: 上传前自动压缩，节省带宽和存储
- **CDN 加速**: 阿里云 OSS CDN 全球加速
- **代码分割**: 动态导入减少首屏加载时间
- **缓存策略**: 静态资源长期缓存

### 性能指标
- **首屏加载**: < 3 秒
- **图片上传**: 5-10 秒（取决于图片大小和网络）
- **AI 处理**: 10-15 秒（Remove.bg API 响应时间）
- **构建大小**: ~850KB（包含 OSS SDK）

## 🐛 故障排除

### 常见问题

1. **图片上传失败**
   - 检查网络连接
   - 确认图片格式和大小符合要求
   - 查看浏览器控制台错误信息

2. **AI 背景移除不工作**
   - 确认 Remove.bg API Key 有效
   - 检查免费额度是否用完
   - 查看 API 响应错误信息

3. **图片预览空白**
   - 检查 OSS 配置和权限
   - 确认 CORS 设置正确
   - 尝试刷新页面重新加载

### 调试方法
- **浏览器控制台**: 查看详细的调试日志
- **Vercel 函数日志**: 检查服务端错误
- **OSS 控制台**: 查看存储和访问日志

## 💰 商业化

### 试用机制
- **免费额度**: 每用户每天 3 次 AI 处理
- **计数方式**: 本地存储，每日自动重置
- **升级提示**: 用完后引导用户升级

### 定价策略（规划中）
- **体验包**: 10张 ¥9.9
- **标准包**: 50张 ¥39.9  
- **超值包**: 100张 ¥69.9

### 支付集成（待开发）
- **推荐方案**: Stripe 支付
- **支持方式**: 国际信用卡
- **个人开发者**: 支持个人账户收款

## 🤝 贡献

这是一个闭源商业项目，暂不接受外部贡献。

## 📄 许可证

版权所有 © 2024 iam189cm. 保留所有权利。

本项目为私有商业软件，未经授权不得复制、修改或分发。

## 📞 联系方式

- **开发者**: iam189cm
- **项目地址**: https://reface.vercel.app
- **开发时间**: 2024年12月

---

**Reface - 让每一张照片都更美丽** ✨