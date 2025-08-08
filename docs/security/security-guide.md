# 🔒 安全配置指南

## 概述
本指南说明如何安全地管理项目中的敏感信息，确保API密钥等机密数据不会泄露到GitHub。

## 🚨 重要安全原则

### ❌ 绝对不要做的事情
1. **不要将真实的API密钥直接写在代码文件中**
2. **不要将 `.env` 文件提交到Git仓库**
3. **不要在文档文件中暴露真实密钥**
4. **不要在commit消息中包含敏感信息**

### ✅ 正确的做法

## 📁 本地开发环境

### 1. 使用 .env 文件
```bash
# 在项目根目录创建 .env 文件
# 这个文件已经在 .gitignore 中被忽略

# Remove.bg API Configuration
VITE_REMOVE_BG_API_KEY=your_actual_api_key_here

# 阿里云 OSS 配置
VITE_OSS_ACCESS_KEY_ID=your_actual_access_key_id
VITE_OSS_ACCESS_KEY_SECRET=your_actual_access_key_secret
VITE_OSS_BUCKET=reface
VITE_OSS_REGION=oss-cn-shanghai

# 其他配置
VITE_APP_ENV=development
```

### 2. 验证 .env 文件被忽略
```bash
# 检查文件是否被Git忽略
git check-ignore .env
# 应该输出: .env

# 检查Git状态
git status
# .env 文件不应该出现在待提交列表中
```

## 🚀 部署环境配置

### Vercel 部署
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| 变量名 | 值 | 环境 |
|--------|----|----- |
| `VITE_OSS_ACCESS_KEY_ID` | 你的实际密钥ID | Production, Preview, Development |
| `VITE_OSS_ACCESS_KEY_SECRET` | 你的实际密钥Secret | Production, Preview, Development |
| `VITE_OSS_BUCKET` | reface | Production, Preview, Development |
| `VITE_OSS_REGION` | oss-cn-shanghai | Production, Preview, Development |
| `VITE_REMOVE_BG_API_KEY` | 你的Remove.bg API密钥 | Production, Preview, Development |

### 其他部署平台
- **Netlify**: Settings → Environment variables
- **Railway**: Variables tab
- **Heroku**: Settings → Config Vars

## 🔍 安全检查清单

### 提交代码前的检查
- [ ] 检查 `.env` 文件是否在 `.gitignore` 中
- [ ] 运行 `git status` 确认没有敏感文件待提交
- [ ] 检查所有文档文件中的密钥是否已脱敏
- [ ] 验证代码中没有硬编码的密钥

### 定期安全检查
- [ ] 定期轮换API密钥
- [ ] 检查GitHub仓库是否意外包含敏感信息
- [ ] 监控API密钥的使用情况
- [ ] 确保团队成员了解安全规范

## 🛠️ 工具和脚本

### 环境检查脚本
```bash
# 检查环境变量配置
node check-env.js

# OSS连接诊断
node debug-oss.js
```

### Git钩子（可选）
可以设置pre-commit钩子来防止意外提交敏感信息：

```bash
#!/bin/sh
# .git/hooks/pre-commit

# 检查是否包含可能的密钥
if git diff --cached --name-only | xargs grep -l "LTAI\|sk-\|AIza\|ya29" 2>/dev/null; then
    echo "❌ 检测到可能的API密钥，请检查后再提交"
    exit 1
fi
```

## 🆘 如果密钥已经泄露

1. **立即轮换密钥**
   - 阿里云OSS：在控制台禁用当前密钥并生成新的
   - Remove.bg：在账户设置中重新生成API密钥

2. **检查Git历史**
   ```bash
   # 搜索历史提交中的敏感信息
   git log --all --full-history -- .env
   git log -p --all -S "LTAI5tFbbyTn2jpE5B1xEyfE"
   ```

3. **清理Git历史（如果必要）**
   ```bash
   # 使用 git-filter-repo 清理历史
   # 注意：这会重写历史，需要强制推送
   git filter-repo --invert-paths --path .env
   ```

4. **更新所有部署环境**
   - 更新Vercel等平台上的环境变量
   - 通知团队成员更新本地配置

## 📞 联系和支持

如有安全相关问题，请及时联系项目维护者。

---

**记住：安全无小事，预防胜于治疗！** 🛡️