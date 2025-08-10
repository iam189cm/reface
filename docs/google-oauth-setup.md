# Google OAuth 登录配置详细指南

## 🎯 Google OAuth 配置步骤

### 1. 创建 Google Cloud 项目

#### 步骤A：访问 Google Cloud Console
1. 打开 [Google Cloud Console](https://console.cloud.google.com/)
2. 如果没有账号，使用 Google 账号登录

#### 步骤B：创建新项目
1. 点击顶部的项目选择器
2. 点击 **"NEW PROJECT"**
3. 填写项目信息：
   - **Project name**: `Reface-Auth` (或你喜欢的名称)
   - **Organization**: 选择你的组织（或留空）
4. 点击 **"CREATE"**

---

### 2. 启用 Google+ API

#### 步骤A：启用API
1. 在左侧菜单中点击 **"APIs & Services"** > **"Library"**
2. 搜索 **"Google+ API"**
3. 点击并选择 **"Google+ API"**
4. 点击 **"ENABLE"** 启用API

#### 步骤B：配置OAuth同意屏幕
1. 点击 **"APIs & Services"** > **"OAuth consent screen"**
2. 选择 **"External"**（适用于所有Google用户）
3. 填写必要信息：
   - **App name**: `Reface`
   - **User support email**: 你的邮箱
   - **Developer contact information**: 你的邮箱
4. 点击 **"SAVE AND CONTINUE"**

---

### 3. 创建 OAuth 2.0 凭据

#### 步骤A：创建凭据
1. 点击 **"APIs & Services"** > **"Credentials"**
2. 点击 **"+ CREATE CREDENTIALS"** > **"OAuth 2.0 Client IDs"**
3. 选择应用类型：**"Web application"**
4. 填写配置信息：

```
Name: Reface Web Client

Authorized JavaScript origins:
https://reface.vercel.app
http://localhost:5173

Authorized redirect URIs:
https://jleiazztrzjunxuzbkgd.supabase.co/auth/v1/callback
```

5. 点击 **"CREATE"**

#### 步骤B：获取密钥
创建成功后，你会得到：
- **Client ID**: `xxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxx`

**⚠️ 重要**：请安全保存这两个密钥！

---

### 4. 在 Supabase 中配置 Google 登录

#### 步骤A：打开 Supabase 配置
1. 访问你的 Supabase 项目：https://supabase.com/dashboard/project/jleiazztrzjunxuzbkgd
2. 点击左侧菜单 **"Authentication"**
3. 点击 **"Settings"** 标签页
4. 滚动到 **"External OAuth Providers"** 部分

#### 步骤B：配置 Google 提供商
找到 **Google** 提供商并：
1. ✅ 勾选 **"Enable sign in with Google"**
2. 填入从 Google Cloud Console 获取的信息：
   ```
   Client ID: 你的Google Client ID
   Client Secret: 你的Google Client Secret
   ```
3. 点击 **"Save"**

---

### 5. 配置站点 URL

在 Supabase Authentication Settings 中：

#### 设置 Site URL：
```
https://reface.vercel.app
```

#### 设置 Redirect URLs：
```
https://reface.vercel.app/auth/callback
http://localhost:5173/auth/callback
```

---

### 6. 测试 Google 登录

#### 部署和测试：
1. **提交代码**：
   ```bash
   git add .
   git commit -m "feat: 配置 Google OAuth 登录"
   git push origin main
   ```

2. **等待部署完成**，然后访问：https://reface.vercel.app

3. **测试流程**：
   - 点击 **"登录"**
   - 点击 **"Google 登录"**
   - 应该会跳转到 Google 授权页面
   - 授权后应该跳转回你的应用并成功登录

---

### 7. 常见问题排查

#### 问题1：`redirect_uri_mismatch` 错误
**解决方法**：
- 检查 Google Cloud Console 中的重定向 URI 是否正确
- 确保是：`https://jleiazztrzjunxuzbkgd.supabase.co/auth/v1/callback`

#### 问题2：`invalid_client` 错误
**解决方法**：
- 检查 Supabase 中的 Client ID 和 Client Secret 是否正确
- 确保没有多余的空格

#### 问题3：Google 登录按钮无响应
**解决方法**：
- 检查浏览器控制台是否有错误
- 确认 Supabase 环境变量配置正确

---

### 8. 安全提醒

- ❌ **不要在前端代码中暴露 Client Secret**
- ✅ **Client Secret 只应该在 Supabase 后台配置**
- ✅ **定期检查和更新 OAuth 凭据**
- ✅ **监控异常登录活动**

---

## 🎉 完成！

配置完成后，用户就可以使用 Google 账号一键登录你的 Reface 应用了！

有任何问题随时联系我。
