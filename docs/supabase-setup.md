# Supabase 集成完整配置指南

## 📋 配置清单

### 1. Supabase 数据库表创建

请按照以下步骤在你的 Supabase 项目中创建所需的数据库表：

#### 📍 操作步骤：
1. 打开你的 Supabase 项目控制台：https://supabase.com/dashboard
2. 选择你的项目：`jleiazztrzjunxuzbkgd`
3. 点击左侧菜单的 **"SQL Editor"**
4. 复制 `docs/database-schema.sql` 文件中的完整SQL脚本
5. 粘贴到 SQL Editor 中并点击 **"RUN"** 按钮执行

#### ✅ 创建的表结构：
- `user_profiles` - 用户配置信息表
- `user_quotas` - 用户配额记录表  
- `usage_logs` - 使用记录日志表
- `subscriptions` - 订阅信息表
- `payments` - 支付记录表

### 2. Supabase 认证配置

#### 📍 配置第三方登录：
1. 在 Supabase 控制台，点击 **"Authentication" > "Settings"**
2. 在 **"External OAuth Providers"** 部分：

**Google OAuth:**
- 启用 Google 提供商
- 填入你的 Google Client ID 和 Client Secret
- 重定向URL设置为：`https://jleiazztrzjunxuzbkgd.supabase.co/auth/v1/callback`

**GitHub OAuth:** 
- 启用 GitHub 提供商
- 填入你的 GitHub Client ID 和 Client Secret
- 重定向URL设置为：`https://jleiazztrzjunxuzbkgd.supabase.co/auth/v1/callback`

#### 📍 配置站点URL：
在 **"Authentication" > "Settings" > "Site URL"** 中添加：
```
https://reface.vercel.app
```

在 **"Redirect URLs"** 中添加：
```
https://reface.vercel.app/auth/callback
http://localhost:5173/auth/callback
```

### 3. Vercel 环境变量配置

你的 Vercel 项目中需要配置以下环境变量：

#### 📍 在 Vercel 控制台操作：
1. 打开 Vercel 项目设置：https://vercel.com/dashboard
2. 选择你的 `reface` 项目
3. 点击 **"Settings" > "Environment Variables"**
4. 添加以下变量：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://jleiazztrzjunxuzbkgd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZWlhenp0cnpqdW54dXpia2dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MDk3MzcsImV4cCI6MjA3MDM4NTczN30.J9FrW2Pw6V8AWAPN5XYwZpnQ-IPU9JEE2TXgvlb4Pfo

# 应用配置
VITE_APP_NAME=Reface
VITE_APP_VERSION=1.0.0
VITE_BASE_URL=https://reface.vercel.app
```

### 4. 用户类型和权限体系

#### 🎯 用户类型说明：

| 类型 | 中文名称 | 每日配额 | 最大分辨率 | 水印 | 月费 |
|------|----------|----------|------------|------|------|
| FREE | 免费版 | 3次 | 1080p | 有 | $0 |
| STARTER | 入门版 | 30次 | 2K | 无 | $9.9 |
| PRO | 专业版 | 100次 | 4K | 无 | $19.9 |
| BUSINESS | 商业版 | 无限 | 8K | 无 | $49.9 |
| ADMIN | 管理员 | 无限 | 8K | 无 | - |

#### 🔧 功能权限：
- **免费版**: 基础滤镜、标准处理速度
- **入门版**: 所有滤镜、无水印输出、基础客服
- **专业版**: 批量处理、高级AI背景移除、优先处理、专业客服
- **商业版**: 无限处理、API接口、白标方案、专属客服、高级分析
- **管理员**: 所有功能 + 系统管理

### 5. 部署验证

#### 📍 部署后验证步骤：

1. **提交代码到 GitHub**：
   ```bash
   git add .
   git commit -m "feat: 集成 Supabase 认证系统"
   git push origin main
   ```

2. **等待自动部署**：
   - Vercel 会自动检测到 GitHub 推送
   - 部署完成后访问：https://reface.vercel.app

3. **测试功能**：
   - 访问首页，检查是否能正常加载
   - 点击"注册"按钮，测试注册功能
   - 点击"登录"按钮，测试登录功能
   - 测试第三方登录（Google、GitHub）
   - 检查用户头像和用户类型显示

#### 🐛 问题排查：

**如果遇到连接错误**：
1. 检查 Vercel 环境变量是否正确配置
2. 检查 Supabase URL 和 API Key 是否正确
3. 查看浏览器开发者工具的控制台错误

**如果第三方登录失败**：
1. 检查 OAuth 配置是否正确
2. 检查重定向 URL 是否匹配
3. 检查第三方应用的客户端ID和密钥

### 6. 开发调试

由于项目配置为直接部署到 Vercel 测试，如需调试：

1. **查看实时日志**：
   ```bash
   # 在 Vercel 控制台查看 Function Logs
   ```

2. **检查数据库状态**：
   - 在 Supabase 控制台查看 "Table Editor"
   - 检查用户是否正确创建

3. **浏览器调试**：
   - 打开 https://reface.vercel.app
   - 使用浏览器开发者工具查看网络请求和错误

## 🎉 完成！

配置完成后，你的 Reface 应用将具备：
- ✅ 完整的用户认证系统
- ✅ 多种登录方式支持
- ✅ 用户类型和权限管理
- ✅ 为 Paddle 支付系统预留接口
- ✅ 专业的用户界面

有任何问题随时告诉我！
