# 自定义域名配置指南

## 🌐 配置 reface.dataechotech.com

本指南将帮你将Cloudflare域名绑定到Vercel部署的Reface项目。

---

## 📋 配置概览

```
目标域名: reface.dataechotech.com
主域名: dataechotech.com (Cloudflare管理)
部署平台: Vercel
CDN服务: Cloudflare
```

---

## 步骤1：Cloudflare DNS配置

### 1.1 登录Cloudflare
- 访问：https://dash.cloudflare.com/
- 选择域名：`dataechotech.com`

### 1.2 添加DNS记录
进入 **DNS** → **Records** → **+ Add record**

```
配置参数：
Type: CNAME
Name: reface
Target: cname.vercel-dns.com
Proxy Status: 🟠 Proxied (推荐开启)
TTL: Auto
```

### 1.3 验证DNS记录
添加后列表中应显示：
```
reface.dataechotech.com  CNAME  cname.vercel-dns.com  🟠
```

---

## 步骤2：Vercel域名配置

### 2.1 进入项目设置
- 访问：https://vercel.com/dashboard
- 选择 **Reface** 项目
- 点击 **Settings** → **Domains**

### 2.2 添加自定义域名
1. 在域名输入框中填写：`reface.dataechotech.com`
2. 点击 **Add**
3. 等待验证完成

### 2.3 验证状态
成功后应显示：
```
✅ reface.dataechotech.com  
   Assigned to Production (main branch)
```

---

## 步骤3：更新环境变量

### 3.1 Vercel环境变量
在 **Settings** → **Environment Variables** 中更新：

```
VITE_SITE_URL = https://reface.dataechotech.com
```

### 3.2 Supabase配置更新
如果使用了第三方登录，需要更新回调URL：

1. **Site URL**：`https://reface.dataechotech.com`
2. **Redirect URLs**：
   ```
   https://reface.dataechotech.com/auth/callback
   https://reface.dataechotech.com/auth/login  
   https://reface.dataechotech.com/auth/register
   ```

### 3.3 Google OAuth更新（如果适用）
- 访问：https://console.developers.google.com/
- 更新授权重定向URI：`https://reface.dataechotech.com/auth/callback`

---

## 步骤4：测试和验证

### 4.1 DNS传播检查
使用以下工具检查DNS是否生效：
- https://dnschecker.org/
- 查询：`reface.dataechotech.com`
- 应返回：`cname.vercel-dns.com`

### 4.2 SSL证书检查
Vercel会自动为自定义域名申请SSL证书：
- 通常需要5-15分钟
- 状态：**Settings** → **Domains** 中查看

### 4.3 网站访问测试
1. **直接访问**：https://reface.dataechotech.com
2. **功能测试**：
   - 首页加载正常 ✅
   - 图片上传功能 ✅  
   - 用户注册登录 ✅
   - 手机验证码 ✅

---

## 🚀 部署和生效

### 部署状态检查
1. **GitHub推送**: ✅ 已推送最新代码
2. **Vercel部署**: 自动触发，通常2-3分钟完成
3. **域名解析**: DNS生效需要5-15分钟

### 访问方式
```
旧地址: https://reface.vercel.app (仍然可用)
新地址: https://reface.dataechotech.com (主要地址)
```

---

## 🌟 Cloudflare代理优势

开启Cloudflare代理后享受：

### 性能优化
- ⚡ **CDN加速**：全球边缘节点缓存
- 🗜️ **自动压缩**：CSS/JS/图片优化
- 📱 **移动优化**：移动端访问加速

### 安全防护  
- 🛡️ **DDoS防护**：自动防护攻击
- 🔒 **Web防火墙**：过滤恶意请求
- 📊 **流量分析**：实时访问统计

### 稳定性
- 🌍 **高可用**：多地域容灾
- 📈 **带宽无限**：不受流量限制
- ⏱️ **99.9%在线率**：企业级稳定性

---

## 🐛 常见问题

### 问题1：域名无法访问
**症状**：访问 reface.dataechotech.com 显示错误

**排查步骤**：
1. 检查Cloudflare DNS记录是否正确
2. 确认Vercel中域名状态为绿色✅
3. 等待DNS传播（最长24小时）
4. 检查SSL证书状态

**解决方案**：
```bash
# 检查DNS解析
nslookup reface.dataechotech.com

# 检查HTTPS证书
curl -I https://reface.dataechotech.com
```

### 问题2：SSL证书错误
**症状**：浏览器显示"不安全连接"

**原因**：Vercel SSL证书申请中

**解决方案**：
- 等待15分钟让Vercel申请证书
- 在Vercel控制台检查域名状态
- 如超过1小时未解决，删除域名重新添加

### 问题3：Cloudflare配置错误
**症状**：DNS记录正确但仍无法访问

**检查清单**：
- [ ] DNS记录Type是CNAME不是A记录
- [ ] Name填写的是 `reface` 不是完整域名
- [ ] Target是 `cname.vercel-dns.com`
- [ ] Proxy状态可开启可不开启

---

## 📊 配置检查清单

完成配置后，请确认：

### Cloudflare设置
- [ ] 已添加CNAME记录：reface → cname.vercel-dns.com
- [ ] DNS记录状态正常（绿色云朵）
- [ ] 域名解析生效（可通过DNS工具验证）

### Vercel设置  
- [ ] 已添加自定义域名：reface.dataechotech.com
- [ ] 域名状态显示绿色✅
- [ ] SSL证书申请成功
- [ ] 环境变量已更新VITE_SITE_URL

### 功能测试
- [ ] https://reface.dataechotech.com 可以正常访问
- [ ] 网站功能完全正常
- [ ] 第三方登录回调正常（如果使用）
- [ ] 手机验证码发送正常

---

## 🎉 配置完成

恭喜！你的Reface网站现在可以通过专业域名 **https://reface.dataechotech.com** 访问了！

### 后续优化建议

1. **SEO优化**：
   - 添加Google Analytics
   - 提交网站到Google Search Console
   - 配置robots.txt和sitemap.xml

2. **性能监控**：
   - 启用Vercel Analytics
   - 监控Cloudflare流量统计
   - 定期检查网站性能

3. **安全加固**：
   - 启用Cloudflare安全规则
   - 配置适当的CORS策略
   - 定期检查SSL证书有效期

---

## 📞 技术支持

配置过程中遇到问题：
- 📧 提交项目issue
- 💬 联系项目维护者
- 📚 参考Vercel和Cloudflare官方文档
