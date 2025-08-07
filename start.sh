#!/bin/bash

echo "🎨 启动 Reface 图片美化工具..."
echo ""

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 16 ]; then
    echo "❌ 需要 Node.js 16 或更高版本"
    echo "当前版本: $(node -v)"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    npm install
fi

echo "🚀 启动开发服务器..."
echo "📱 请在浏览器中打开: http://localhost:5173"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev