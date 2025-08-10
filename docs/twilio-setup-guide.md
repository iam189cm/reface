# Twilio 短信服务详细配置指南

## 🎯 完整配置流程

### 第一步：注册Twilio账号

#### 1. 注册账号
1. 访问 [Twilio官网](https://www.twilio.com/)
2. 点击 **"Sign up and get your trial account"**
3. 填写注册信息：
   - **First Name**: 你的名字
   - **Last Name**: 你的姓氏
   - **Email**: 你的邮箱
   - **Password**: 设置密码
4. 选择用途：**Products** → 选择 **SMS**
5. 完成邮箱验证

#### 2. 验证手机号码
- Twilio要求验证你的手机号
- 用于接收验证码，完成账号激活
- **重要**：这个号码也会成为你的测试号码

---

### 第二步：获取基本凭据

登录Twilio控制台后，在**Dashboard**页面可以看到：

#### 📋 **基本凭据** (Account Info)
```
Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Auth Token: [点击显示] xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
My Twilio phone number: +1234567890
```

**⚠️ 重要**：Auth Token默认隐藏，点击眼睛图标显示并复制保存。

---

### 第三步：创建Message Service（关键步骤）

#### 🔥 **什么是Message Service SID？**

**Message Service** 是Twilio的消息服务管理功能，它可以：
- 统一管理多个发送号码
- 自动选择最佳发送路由
- 提供更好的消息传输稳定性
- 简化大规模短信发送管理

#### 📱 **创建Message Service步骤**

1. **进入Messaging服务**：
   - 在Twilio控制台左侧菜单
   - 点击 **"Messaging"** → **"Services"**

2. **创建新服务**：
   - 点击 **"Create Messaging Service"**
   - 填写服务信息：
     ```
     Service Name: Reface SMS Service
     Use Case: Verify users (验证用户)
     ```
   - 点击 **"Create Messaging Service"**

3. **添加发送方标识**：
   - 在服务配置页面，点击 **"Add Senders"**
   - 选择 **"Phone Number"**
   - 选择你的Twilio试用号码（从第二步获取的号码）
   - 点击 **"Add Phone Numbers"**

4. **配置服务设置**：
   - **Inbound Settings**: 可以保持默认
   - **Integration**: 暂时跳过
   - **Compliance**: 保持默认设置

5. **获取Message Service SID**：
   - 配置完成后，在服务概览页面
   - 复制 **Service SID**，格式类似：`MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 第四步：在Supabase中配置

#### 🔧 **进入Supabase配置页面**

1. 打开你的Supabase项目：https://supabase.com/dashboard/project/jleiazztrzjunxuzbkgd
2. 点击 **"Authentication"** → **"Settings"**
3. 滚动到 **"SMS Provider Settings"**

#### 📝 **填入Twilio配置**

找到 **SMS Provider** 部分：

1. **Provider**: 选择 **"Twilio"**
2. **填入以下信息**：
   ```
   Twilio Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Twilio Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Twilio Message Service SID: MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. 点击 **"Save"**

#### ⚠️ **配置说明**

- **Account SID**: 你的Twilio账户标识符
- **Auth Token**: 认证令牌，用于API调用权限验证  
- **Message Service SID**: 消息服务标识符，用于发送短信

**三个都必须填写正确，缺一不可！**

---

### 第五步：配置短信模板

#### 📄 **默认短信模板**

Supabase会使用以下默认模板发送验证码：
```
Your confirmation code is {{ .Code }}
```

如需自定义，在Supabase的 **"Email Templates"** 部分可以修改。

---

### 第六步：测试配置

#### 🧪 **测试流程**

1. **部署你的应用**：
   ```bash
   git add .
   git commit -m "docs: 添加Twilio配置指南"
   git push origin main
   ```

2. **访问应用**：https://reface.vercel.app/auth/login

3. **测试手机号登录**：
   - 点击 **"手机号登录"**
   - 输入手机号：`+86 你的手机号` （中国大陆需要+86前缀）
   - 点击 **"发送验证码"**
   - 检查是否收到短信

4. **查看调试信息**：
   - 打开浏览器开发者工具
   - 查看 **Console** 标签的日志
   - 查看 **Network** 标签的API请求

---

### 第七步：监控和调试

#### 📊 **Twilio控制台监控**

1. **查看发送日志**：
   - Twilio控制台 → **"Monitor"** → **"Logs"** → **"Messaging"**
   - 可以看到每条短信的发送状态

2. **常见状态码**：
   - **`queued`**: 消息已入队，等待发送
   - **`sent`**: 消息已发送到运营商
   - **`delivered`**: 消息已送达
   - **`failed`**: 发送失败

#### 🐛 **常见问题排查**

**问题1：手机收不到验证码**
```
可能原因：
1. 手机号格式错误（缺少国家代码）
2. 运营商拦截（特别是中国移动）
3. Twilio账户余额不足

解决方案：
1. 确保手机号格式：+86 13800138000
2. 尝试其他手机号码
3. 检查Twilio账户余额
```

**问题2：API调用失败**
```
可能原因：
1. Supabase配置错误（SID/Token/Message Service SID）
2. Twilio账户未激活
3. 网络连接问题

解决方案：
1. 重新检查三个配置项
2. 确认Twilio账户状态
3. 查看浏览器Network标签的错误信息
```

---

### 第八步：升级到正式版本

#### 💰 **试用版限制**

Twilio试用账户有以下限制：
- **试用金额**: $15美元
- **发送限制**: 只能发送到已验证的号码
- **短信内容**: 会包含"Sent from your Twilio trial account"前缀

#### 🚀 **升级到付费版本**

当试用额度用完或需要发送到未验证号码时：

1. **添加付费方式**：
   - Twilio控制台 → **"Billing"**
   - 添加信用卡或银行卡

2. **升级账户**：
   - 点击 **"Upgrade your account"**
   - 完成付费升级

3. **购买专用号码**（可选）：
   - **"Phone Numbers"** → **"Manage"** → **"Buy a number"**
   - 选择国家和号码类型
   - 费用：约$1-2美元/月

---

## 📊 **配置检查清单**

### ✅ **必须完成的步骤**

- [ ] 注册Twilio账号并验证邮箱
- [ ] 验证手机号码
- [ ] 获取Account SID和Auth Token  
- [ ] 创建Message Service并获取Service SID
- [ ] 在Message Service中添加发送号码
- [ ] 在Supabase中配置三个关键参数
- [ ] 测试短信发送功能

### ⚡ **关键配置参数**

```bash
# 在Supabase Authentication Settings中填入：
Twilio Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Twilio Auth Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  
Twilio Message Service SID: MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🎯 **总结**

**Message Service SID** 是Twilio消息服务的统一管理标识符，它的作用是：
1. **统一管理** 多个发送号码
2. **自动路由** 选择最佳发送通道  
3. **提高稳定性** 确保消息送达率
4. **简化配置** 一个SID管理多个资源

配置完成后，你的用户就可以使用手机号 + 验证码的方式登录注册你的Reface应用了！

有任何配置问题随时问我！🚀
