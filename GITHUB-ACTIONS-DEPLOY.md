# 🚀 GitHub Actions 自动部署指南

## 🎯 解决私有仓库部署问题

**问题**: Vercel免费计划不支持私有GitHub仓库的自动部署
**解决方案**: 使用GitHub Actions + Vercel CLI实现完全免费的自动部署

## ✅ 已创建的文件

- ✅ `.github/workflows/deploy.yml` - 主分支(main)生产部署
- ✅ `.github/workflows/preview.yml` - 预览分支和PR部署

## 🔧 配置步骤

### 第1步：获取Vercel项目信息

1. **安装Vercel CLI**（如果还没有）
   ```bash
   npm install -g vercel@latest
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **链接项目**
   ```bash
   # 在项目根目录运行
   vercel link
   ```
   - 选择你的团队
   - 选择现有项目 `reface` 或创建新项目

4. **获取项目ID**
   ```bash
   # 查看生成的配置文件
   cat .vercel/project.json
   ```
   记录 `projectId` 和 `orgId`

5. **获取Vercel Token**
   - 访问: https://vercel.com/account/tokens
   - 点击 "Create Token"
   - 输入名称: `GitHub Actions - reface`
   - 复制生成的token

### 第2步：设置GitHub Secrets

1. **访问GitHub仓库设置**
   ```
   https://github.com/your-username/reface/settings/secrets/actions
   ```

2. **添加以下Secrets**：
   - `VERCEL_TOKEN` - 你的Vercel访问令牌
   - `VERCEL_ORG_ID` - 从project.json获取的orgId
   - `VERCEL_PROJECT_ID` - 从project.json获取的projectId

   **所有环境变量**（从Vercel Dashboard复制）：
   - `VITE_OSS_ACCESS_KEY_ID`
   - `VITE_OSS_ACCESS_KEY_SECRET` 
   - `VITE_OSS_BUCKET`
   - `VITE_OSS_REGION`
   - `VITE_REMOVE_BG_API_KEY`

### 第3步：禁用Vercel自动部署

在Vercel Dashboard中：
1. 进入项目设置 → Git
2. 关闭 "Automatic Deployments from Git"

或者在项目根目录创建 `vercel.json`：
```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

## 🚀 工作流程说明

### 生产部署 (deploy.yml)
- **触发**: 推送到 `main` 分支
- **行为**: 自动部署到生产环境
- **域名**: 更新 https://reface.vercel.app/

### 预览部署 (preview.yml)  
- **触发**: 推送到任何非main分支，或创建/更新PR
- **行为**: 创建预览部署
- **功能**: 在PR中自动评论预览链接

## 📋 使用方法

### 开发流程
```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Add new feature"

# 3. 推送分支（自动触发预览部署）
git push origin feature/new-feature

# 4. 创建PR（会在PR中显示预览链接）
# 通过GitHub网页创建PR

# 5. 合并到main（自动触发生产部署）
git checkout main
git merge feature/new-feature
git push origin main
```

## 🔒 安全优势

1. **私有仓库支持** - 完全支持私有仓库
2. **免费使用** - 无需升级Vercel Pro计划
3. **安全的秘密管理** - 环境变量安全存储在GitHub Secrets
4. **完全控制** - 自定义部署流程和条件

## 🧪 测试部署

### 测试生产部署
```bash
# 推送到main分支
git add .
git commit -m "test: GitHub Actions deployment"
git push origin main
```

### 测试预览部署  
```bash
# 创建测试分支
git checkout -b test/actions-preview
git push origin test/actions-preview
```

## 📊 部署状态监控

- **GitHub Actions**: 在仓库的 "Actions" 标签页查看部署状态
- **Vercel Dashboard**: 查看最终部署结果
- **PR评论**: 预览部署链接会自动发送到PR评论

## 🛠️ 故障排除

### 常见问题

1. **Token权限不足**
   - 确保Vercel Token有正确的权限
   - 重新生成Token并更新GitHub Secrets

2. **项目ID错误**
   - 运行 `vercel link` 重新链接项目
   - 检查 `.vercel/project.json` 中的ID

3. **环境变量缺失**
   - 确保所有必要的环境变量都添加到GitHub Secrets
   - 检查变量名称是否完全匹配

### 调试方法
```bash
# 本地测试Vercel构建
vercel build

# 本地测试部署
vercel deploy --prebuilt
```

## 🎉 完成后的效果

✅ **私有仓库自动部署** - 支持私有GitHub仓库
✅ **生产自动发布** - 推送main分支自动更新生产环境  
✅ **预览部署** - 每个分支和PR都有独立的预览环境
✅ **完全免费** - 无需付费升级Vercel计划
✅ **安全可靠** - 通过GitHub Actions安全管理部署流程

**现在你可以安全地使用私有仓库进行开发，同时享受自动化部署的便利！** 🚀