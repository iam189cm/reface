# Reface - 图片美化工具

一个基于 Vue3 + Vite + Tailwind CSS 的图片编辑网页应用，提供简洁优雅的图片美化功能。

## 功能特色

- 🎨 **现代化 UI** - 采用 Tailwind CSS 打造的少女感设计
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🖼️ **图片上传** - 支持拖拽上传和点击上传
- ✨ **实时预览** - 调节参数时实时查看效果
- 🎛️ **丰富调节** - 磨皮、美白、亮度、对比度、饱和度调节
- 🤖 **AI 背景移除** - 集成 Remove.bg API，智能移除图片背景
- 🎁 **免费试用** - 每用户每天 3 次免费 AI 处理
- 💾 **一键下载** - 处理完成后可直接下载图片

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Canvas API** - 图像处理和渲染

## 项目结构

```
reface/
├── src/
│   ├── components/          # 可复用组件
│   │   └── SliderControl.vue   # 滑块控制组件
│   ├── views/              # 页面组件
│   │   ├── Home.vue           # 首页 - 图片上传
│   │   └── Editor.vue         # 编辑页 - 图片调节
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
└── vite.config.js          # Vite 配置
```

## 安装和运行

### 快速启动
```bash
# 使用启动脚本（推荐）
./start.sh
```

### 手动启动
1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   启动后访问 http://localhost:5173

3. **构建生产版本**
   ```bash
   npm run build
   ```

4. **预览生产版本**
   ```bash
   npm run preview
   ```

### 系统要求
- Node.js 16.0 或更高版本
- 现代浏览器（支持 ES6+ 和 Canvas API）

### 环境配置
1. **复制环境变量文件**
   ```bash
   cp env.example .env
   ```

2. **配置 Remove.bg API Key**
   - 访问 [Remove.bg](https://www.remove.bg/api) 注册账号
   - 获取免费 API Key（50张/月）
   - 在 `.env` 文件中设置 `VITE_REMOVE_BG_API_KEY`

## 使用说明

### 首页功能
- 点击上传区域或拖拽图片文件进行上传
- 支持 JPG、PNG、WebP 格式，最大 10MB
- 上传后可预览图片信息
- 点击"开始编辑"进入编辑页面

### 编辑页功能
- **AI 背景移除** - 智能移除图片背景（每天3次免费）
- **磨皮调节** - 0-100% 强度调节
- **美白调节** - 0-100% 强度调节
- **亮度调节** - -50 到 +50 调节
- **对比度调节** - -50 到 +50 调节
- **饱和度调节** - -50 到 +50 调节
- **重置功能** - 一键恢复所有参数到默认值
- **下载功能** - 保存处理后的图片

### 交互特点
- 所有调节都有实时预览效果
- 滑块支持精确数值显示
- 每个参数都可以单独重置
- 响应式设计，移动端友好

## 自定义配置

### 颜色主题
项目使用了自定义的粉色和紫色渐变主题，可在 `tailwind.config.js` 中修改：

```javascript
theme: {
  extend: {
    colors: {
      'pink': { /* 自定义粉色调色板 */ },
      'purple': { /* 自定义紫色调色板 */ }
    }
  }
}
```

### 图片处理
当前版本的图像处理主要通过 CSS Filter 实现，Canvas 区域已预留用于未来的高级图像处理功能。

## 开发计划

- [ ] 实现真正的图像算法处理
- [ ] 添加更多滤镜效果
- [ ] 支持批量处理
- [ ] 添加历史记录功能
- [ ] 支持更多图片格式

## 许可证

MIT License