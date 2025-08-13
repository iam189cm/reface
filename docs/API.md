# Reface API 文档

## 概述

Reface 提供了一套完整的 RESTful API，支持用户管理、AI 图像处理、统计分析等功能。所有 API 都部署在 Vercel Serverless Functions 上。

## 基础信息

- **Base URL**: `https://reface.dataechotech.com/api`
- **认证方式**: Bearer Token (Supabase JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证

所有需要认证的 API 请求都需要在请求头中包含认证令牌：

```http
Authorization: Bearer <your_jwt_token>
```

## 用户认证 API

### 发送短信验证码
```http
POST /api/send-sms
```

**请求参数:**
```json
{
  "phone": "+8613812345678"
}
```

**响应:**
```json
{
  "success": true,
  "message": "验证码已发送",
  "sid": "verification_sid"
}
```

### 验证短信验证码
```http
POST /api/verify-sms
```

**请求参数:**
```json
{
  "phone": "+8613812345678",
  "code": "123456"
}
```

**响应:**
```json
{
  "success": true,
  "valid": true,
  "message": "验证成功"
}
```

## 文件上传 API

### 上传图片到阿里云 OSS
```http
POST /api/upload-oss
```

**请求参数:**
- Content-Type: `multipart/form-data`
- `file`: 图片文件
- `folder`: 存储文件夹 (可选)

**响应:**
```json
{
  "success": true,
  "data": {
    "url": "https://your-bucket.oss-region.aliyuncs.com/path/to/file.jpg",
    "filename": "generated_filename.jpg",
    "size": 1024000
  }
}
```

## 使用配额 API

### 消费用户配额
```http
POST /api/usage/consume
```

**请求参数:**
```json
{
  "serviceType": "remove_background",
  "credits": 1,
  "metadata": {
    "imageSize": "1920x1080",
    "processingTime": 2.5
  }
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "remainingCredits": 15,
    "usedCredits": 1,
    "eventId": "event_uuid"
  }
}
```

## 管理员 API

### 权限要求
所有管理员 API 都需要用户具有 `ADMIN` 权限，否则返回 `401 Unauthorized`。

---

## 📊 统计数据 API

### 获取系统概览统计
```http
GET /api/admin/statistics?type=overview
```

**响应:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 2847,
    "dailyActiveUsers": 342,
    "dailyAIUsage": 1876,
    "systemAlerts": 3,
    "userTypeDistribution": [
      { "user_type": "FREE", "count": 2500 },
      { "user_type": "PRO", "count": 300 },
      { "user_type": "ADMIN", "count": 47 }
    ]
  }
}
```

### 获取服务使用排行
```http
GET /api/admin/statistics?type=service-ranking&days=7
```

**查询参数:**
- `days`: 统计天数，默认 7 天

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "type": "remove_background",
      "name": "背景移除",
      "usage": 1248,
      "percentage": 65,
      "color": "bg-blue-500"
    },
    {
      "type": "enlarge_image", 
      "name": "图像放大",
      "usage": 892,
      "percentage": 46,
      "color": "bg-green-500"
    }
  ]
}
```

### 获取最近事件
```http
GET /api/admin/statistics?type=recent-events&limit=50
```

**查询参数:**
- `limit`: 返回事件数量，默认 50

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "service_type": "remove_background",
      "user_email": "user@example.com",
      "credits_consumed": 1,
      "status": "completed",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 获取使用趋势
```http
GET /api/admin/statistics?type=usage-trends&days=30
```

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2024-01-15",
      "total": 156,
      "services": {
        "remove_background": 89,
        "enlarge_image": 67
      }
    }
  ]
}
```

### 获取所有统计数据
```http
GET /api/admin/statistics?type=all
```

**响应:**
```json
{
  "success": true,
  "data": {
    "overview": { /* 概览数据 */ },
    "serviceRanking": [ /* 排行数据 */ ],
    "recentEvents": [ /* 最近事件 */ ],
    "usageTrends": [ /* 趋势数据 */ ]
  }
}
```

---

## 👥 用户管理 API

### 搜索用户
```http
GET /api/admin/users?query=搜索关键词&limit=20&offset=0
```

**查询参数:**
- `query`: 搜索关键词（邮箱、手机号或用户ID）
- `limit`: 返回数量限制，默认 20
- `offset`: 偏移量，默认 0

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_uuid",
      "email": "user@example.com",
      "user_type": "FREE",
      "credits_used": 2,
      "total_quota": 20,
      "daily_quota": 3,
      "phone": "+8613812345678",
      "avatar_url": null,
      "created_at": "2024-01-01T00:00:00Z",
      "last_sign_in_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 获取用户详情
```http
GET /api/admin/users?userId=user_uuid
```

**响应:**
```json
{
  "success": true,
  "data": {
    "profile": { /* 用户资料信息 */ },
    "authUser": { /* 认证用户信息 */ },
    "usageEvents": [ /* 最近30天使用记录 */ ]
  }
}
```

### 调整用户配额
```http
POST /api/admin/users
```

**请求参数:**
```json
{
  "userId": "user_uuid",
  "creditAmount": 10,
  "reason": "管理员手动调整"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "newBalance": 30
  }
}
```

### 更新用户状态
```http
PUT /api/admin/users
```

**请求参数:**
```json
{
  "userId": "user_uuid",
  "userType": "BANNED",
  "reason": "违反使用条款"
}
```

**用户类型:**
- `FREE`: 免费用户
- `STARTER`: 初级用户  
- `PRO`: 专业用户
- `BUSINESS`: 商业用户
- `BANNED`: 被封禁用户

**响应:**
```json
{
  "success": true
}
```

---

## 错误处理

所有 API 在出现错误时都会返回统一的错误格式：

```json
{
  "success": false,
  "error": "错误描述信息",
  "details": "详细错误信息 (仅开发环境)"
}
```

### 常见错误代码

| HTTP 状态码 | 说明 |
|------------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 405 | 请求方法不允许 |
| 429 | 请求频率过高 |
| 500 | 服务器内部错误 |

## 使用限制

- 管理员API：需要 ADMIN 权限
- 文件上传：最大文件大小 10MB
- 请求频率：每分钟最多 100 次请求
- 响应超时：30 秒

## 开发环境

本地开发时，API 请求会通过 Vite 代理转发到线上环境：

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'https://reface.dataechotech.com',
      changeOrigin: true
    }
  }
}
```

## 更新日志

- **2024-01-15**: 添加管理员统计和用户管理 API
- **2024-01-10**: 添加使用配额消费 API
- **2024-01-05**: 初始版本，包含基础认证和文件上传 API
