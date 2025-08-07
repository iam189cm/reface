# OSS Bucket 安全配置指南

## 🔐 推荐的权限配置

### 1. Bucket 基本权限
- **读写权限**: 私有（Private）
- **不要设置为**: 公共读 或 公共读写

### 2. CORS 配置
```json
[
  {
    "allowedOrigins": [
      "https://reface.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "allowedMethods": [
      "GET",
      "PUT", 
      "POST",
      "DELETE",
      "HEAD"
    ],
    "allowedHeaders": [
      "*"
    ],
    "exposeHeaders": [
      "ETag",
      "x-oss-request-id"
    ],
    "maxAgeSeconds": 3600
  }
]
```

### 3. RAM 用户权限策略
为你的 AccessKey 对应的 RAM 用户配置以下权限：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:GetObject",
        "oss:PutObject",
        "oss:DeleteObject",
        "oss:GetObjectAcl",
        "oss:PutObjectAcl"
      ],
      "Resource": [
        "acs:oss:*:*:reface/*"
      ]
    },
    {
      "Effect": "Allow", 
      "Action": [
        "oss:ListObjects",
        "oss:GetBucketAcl"
      ],
      "Resource": [
        "acs:oss:*:*:reface"
      ]
    }
  ]
}
```

## 🔄 数据流程

### 上传流程
1. 前端请求预签名 URL → Vercel Function
2. Vercel Function 生成预签名 URL → 返回给前端  
3. 前端直接上传到 OSS → 使用预签名 URL
4. OSS 存储文件 → 返回成功状态

### 访问流程  
1. 前端需要显示图片 → 使用公共 URL
2. 浏览器直接从 OSS 获取图片 → 需要读权限

## ⚠️ 当前配置问题

如果你的 Bucket 设置为"公共读写"：

### 安全风险
- 任何人都可以上传文件到你的 Bucket
- 可能被恶意利用存储违法内容
- 产生意外的存储和流量费用

### 建议修改
1. 将 Bucket 权限改为 **私有**
2. 为上传的文件单独设置公共读权限
3. 或使用 CDN 来提供文件访问

## 🛠️ 代码适配

如果改为私有 Bucket，需要修改文件访问方式：

### 方案1: 上传时设置文件为公共读
```javascript
// 在 api/upload-oss.js 中修改预签名 URL 生成
const url = client.signatureUrl(key, {
  method: 'PUT',
  expires: 3600,
  'Content-Type': contentType,
  'x-oss-object-acl': 'public-read'  // 添加这行
})
```

### 方案2: 使用预签名 URL 访问
```javascript
// 为每个文件生成临时访问 URL
const getFileUrl = (key) => {
  return client.signatureUrl(key, {
    expires: 3600 * 24  // 24小时有效
  })
}
```

## 📊 配置对比

| 配置方案 | 安全性 | 便利性 | 费用风险 | 推荐度 |
|---------|--------|--------|----------|--------|
| 公共读写 | ❌ 低 | ✅ 高 | ❌ 高 | ❌ |
| 公共读 | ⚠️ 中 | ✅ 高 | ⚠️ 中 | ⚠️ |
| 私有+文件公读 | ✅ 高 | ✅ 高 | ✅ 低 | ✅ |
| 完全私有 | ✅ 最高 | ⚠️ 中 | ✅ 最低 | ✅ |

## 🎯 推荐方案

**私有 Bucket + 文件级公共读权限**
- Bucket 设置为私有
- 上传时为文件设置公共读权限
- 既安全又便于访问