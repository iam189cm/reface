# 微信登录配置指南

## 📝 微信登录配置说明

由于微信登录涉及到微信开放平台的企业级认证，配置相对复杂。以下是完整的配置流程：

## 1. 🏢 企业资质要求

### 必要条件：
- ✅ 营业执照（个体工商户或企业）
- ✅ 对公银行账户
- ✅ 企业邮箱
- ✅ 企业认证费用：300元人民币/年

### 注册流程：
1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册开发者账号
3. 进行企业认证（需要营业执照等资料）
4. 等待审核通过（通常3-7个工作日）

---

## 2. 📱 创建网站应用

### 步骤A：创建应用
1. 登录微信开放平台
2. 管理中心 → 网站应用 → 创建网站应用
3. 填写应用信息：
   - **应用名称**: Reface AI图片处理
   - **应用简介**: AI图片处理和美化工具
   - **应用官网**: https://reface.vercel.app
   - **授权回调域**: reface.vercel.app

### 步骤B：获取密钥
审核通过后，获取：
- **AppID**: 应用的唯一标识
- **AppSecret**: 应用密钥

---

## 3. ⚙️ Supabase 微信登录配置

### 配置步骤：
1. 在 Supabase 控制台：**Authentication** → **Settings**
2. 找到 **External OAuth Providers** → **WeChat**
3. 启用微信登录并填入：
   ```
   Client ID: 微信应用的 AppID
   Client Secret: 微信应用的 AppSecret
   ```

### 回调地址配置：
在微信开放平台的应用设置中，配置授权回调域名：
```
reface.vercel.app
```

---

## 4. 🔧 代码实现（已预留）

前端代码已经预留了微信登录的接口：

```javascript
// 微信登录 - 已预留接口
const signInWithWechat = () => {
  // 等微信开放平台审核通过后启用
  showError('微信登录功能即将开放，敬请期待！')
}
```

当微信开放平台配置完成后，只需要：

1. **启用微信登录按钮**：
```javascript
// 将这行代码
<button :disabled="true" class="...opacity-50 cursor-not-allowed">

// 改为
<button @click="signInWithProvider('wechat')" :disabled="loading" class="...">
```

2. **更新 authStore**：
```javascript
// 在 signInWithProvider 方法中支持 wechat 参数
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'wechat', // 支持微信登录
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

---

## 5. 🚫 为什么暂时不启用？

### 主要障碍：
1. **企业认证要求**：个人开发者无法申请
2. **审核周期长**：通常需要1-2周
3. **费用成本**：年费300元
4. **合规要求**：需要完整的企业资质

### 建议方案：
- **优先实现**：Google登录 + 手机号登录
- **后期规划**：等产品稳定后再申请微信开放平台
- **替代方案**：可以考虑使用QQ登录（个人也可申请）

---

## 6. 🎯 当前状态

- ✅ 前端UI已完成，显示"即将开放"
- ✅ 后端接口已预留
- ⏳ 等待微信开放平台企业认证
- ⏳ 等待微信应用审核通过

---

## 7. 📞 下一步行动

如果你决定申请微信登录：

1. **准备企业资料**：营业执照、银行账户等
2. **注册微信开放平台**：提交企业认证
3. **等待审核通过**：通常1-2周
4. **创建网站应用**：配置回调域名
5. **更新配置文件**：填入 AppID 和 AppSecret
6. **启用前端功能**：去掉禁用状态

**暂时建议**：先完善Google登录和手机号登录，微信登录可以后期添加。
