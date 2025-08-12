# 阿里云短信服务配置指南

## 📱 阿里云短信服务完整配置教程

本指南将帮你完成阿里云短信服务的配置，实现手机号验证码注册登录功能。

---

## 步骤1：注册阿里云账号

### 1.1 访问阿里云官网
- 打开 https://www.aliyun.com/
- 点击 **"免费注册"**

### 1.2 完成注册和实名认证
```
注册流程：
1. 填写手机号和邮箱
2. 设置登录密码
3. 手机号验证
4. 个人实名认证（需上传身份证）
```

⚠️ **重要**：必须完成实名认证才能开通短信服务

---

## 步骤2：开通短信服务

### 2.1 进入短信服务控制台
1. 登录阿里云控制台：https://ecs.console.aliyun.com/
2. 搜索框输入 **"短信服务"**
3. 或直接访问：https://dysms.console.aliyun.com/

### 2.2 开通服务
1. 点击 **"立即开通"**
2. 选择 **"按量付费"**（￥0.045/条）
3. 勾选服务协议
4. 点击 **"立即开通"**

---

## 步骤3：创建AccessKey

### 3.1 进入访问控制RAM
- 访问：https://ram.console.aliyun.com/users

### 3.2 创建RAM用户
1. 点击 **"创建用户"**
2. 填写用户信息：
   ```
   登录名称: reface-sms-user
   显示名称: Reface短信服务用户
   访问方式: ✅ 编程访问 (AccessKey)
   ```
3. 点击 **"确定"**

### 3.3 保存AccessKey
⚠️ **重要**：AccessKey Secret只显示一次，请立即保存！

```
AccessKey ID: LTAIxxxxxxxxxxxxxxxxxx
AccessKey Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.4 添加权限
1. 在用户列表找到刚创建的用户
2. 点击 **"添加权限"**
3. 搜索权限：**AliyunDysmsFullAccess**
4. 勾选后点击 **"确定"**

---

## 步骤4：创建短信签名

### 4.1 进入签名管理
- 在短信服务控制台，点击 **"签名管理"**

### 4.2 添加签名
1. 点击 **"添加签名"**
2. 填写签名信息：

```
签名名称: Reface
签名来源: 企事业单位的全称或简称
适用场景: 验证码
签名属性: 自用（个人用户选择）
证明类型: 
  - 企业用户：营业执照
  - 个人用户：个人身份证明
签名内容说明: 用于Reface平台用户注册登录验证
```

### 4.3 上传证明材料
- **企业**：营业执照扫描件
- **个人**：身份证正反面

### 4.4 等待审核
- 审核时间：1-2个工作日
- 审核通过后签名状态变为 **"审核通过"**

---

## 步骤5：创建短信模板

### 5.1 进入模板管理
- 点击 **"模板管理"** → **"添加模板"**

### 5.2 创建验证码模板
```
模板类型: 验证码
模板名称: 身份验证验证码
模板内容: 您的验证码为：${code}，该验证码5分钟内有效，请勿泄露于他人！
适用场景: 注册/登录验证
```

### 5.3 提交审核
- 点击 **"提交审核"**
- 审核时间：通常几小时内通过
- 通过后获得模板CODE（如：SMS_123456789）

---

## 步骤6：配置环境变量

### 6.1 在Vercel中配置环境变量
1. 访问Vercel项目：https://vercel.com/dashboard
2. 选择Reface项目
3. 进入 **Settings** → **Environment Variables**

### 6.2 添加以下环境变量
```bash
# 阿里云短信配置
ALIYUN_ACCESS_KEY_ID=你的AccessKey ID
ALIYUN_ACCESS_KEY_SECRET=你的AccessKey Secret  
ALIYUN_SMS_SIGN_NAME=Reface
ALIYUN_SMS_TEMPLATE_CODE=你的模板CODE

# Supabase配置（如果还没有的话）
VITE_SUPABASE_URL=你的Supabase项目URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Supabase服务端密钥
```

### 6.3 重新部署
- 配置环境变量后，Vercel会自动重新部署
- 或手动点击 **"Redeploy"**

---

## 步骤7：在Supabase中创建数据库表

### 7.1 执行SQL
在Supabase SQL Editor中执行：

```sql
-- 创建短信验证码表
CREATE TABLE IF NOT EXISTS sms_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sms_phone ON sms_verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_sms_expires_at ON sms_verification_codes(expires_at);

-- 启用行级安全
ALTER TABLE sms_verification_codes ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "允许所有操作" ON sms_verification_codes USING (true);
```

---

## 步骤8：测试功能

### 8.1 部署并测试
1. 推送代码到GitHub
2. 等待Vercel自动部署
3. 访问：https://reface.vercel.app/auth/register

### 8.2 测试流程
```
1. 点击"手机号注册"
2. 输入手机号：+86 13800138000
3. 点击"发送验证码"
4. 检查手机是否收到短信
5. 输入6位验证码
6. 点击"注册/登录"
```

### 8.3 查看日志
- Vercel Functions日志：https://vercel.com/dashboard → Functions → 查看日志
- 浏览器控制台：F12 → Console标签

---

## 💰 费用说明

### 短信费用
```
国内短信：￥0.045/条
国际短信：￥0.50/条（根据目标国家）
套餐包：可购买更便宜的套餐包
```

### 预估成本
```
测试阶段：每月约￥5-10（100条验证码）
正式运营：每月约￥50-100（1000条验证码）
```

---

## 🐛 常见问题

### 问题1：签名审核不通过
**原因**：
- 证明材料不清晰
- 签名名称与证件不符
- 个人用户使用企业签名

**解决**：
- 重新上传高清证件照
- 确保签名与证件主体一致
- 个人用户选择个人身份证明

### 问题2：模板审核不通过
**原因**：
- 模板内容包含敏感词汇
- 变量格式不正确
- 缺少必要说明

**解决**：
- 使用标准验证码模板格式
- 变量使用${code}格式
- 添加详细的使用说明

### 问题3：发送失败
**错误代码参考**：
```
isv.BUSINESS_LIMIT_CONTROL: 业务限流
isv.INVALID_PARAMETERS: 参数无效  
isv.MOBILE_NUMBER_ILLEGAL: 手机号格式错误
isv.AMOUNT_NOT_ENOUGH: 账户余额不足
```

**解决方案**：
- 检查手机号格式（+86 开头）
- 确认账户余额充足
- 检查API调用频率
- 验证签名和模板状态

### 问题4：验证码收不到
**可能原因**：
- 运营商拦截
- 手机号已被屏蔽
- 网络延迟

**解决方案**：
- 检查垃圾短信
- 尝试其他手机号
- 联系阿里云技术支持

---

## 📞 技术支持

### 阿里云支持
- 工单系统：https://workorder.console.aliyun.com/
- 客服热线：95187
- 在线文档：https://help.aliyun.com/product/44282.html

### 开发者支持
- 有配置问题随时在项目中提issue
- 或联系项目维护者获得帮助

---

## ✅ 配置检查清单

完成配置后，请确认：

- [ ] 阿里云账号已实名认证
- [ ] 短信服务已开通
- [ ] RAM用户已创建，权限已分配
- [ ] AccessKey已保存
- [ ] 短信签名审核通过
- [ ] 短信模板审核通过
- [ ] Vercel环境变量已配置
- [ ] Supabase数据库表已创建
- [ ] 测试发送验证码成功
- [ ] 测试注册登录流程成功

🎉 **恭喜！阿里云短信服务配置完成！**
