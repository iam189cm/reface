# Reface 测试文档

## 📋 测试架构

本项目采用现代化的测试架构，确保代码质量和功能稳定性。

### 🏗️ 技术栈

- **测试框架**: Vitest (与Vite完美集成)
- **Vue测试**: @vue/test-utils + @testing-library/vue
- **DOM环境**: jsdom
- **Mock功能**: Vitest内置mock
- **覆盖率**: V8 coverage

### 📁 目录结构

```
tests/
├── setup/              # 测试配置和设置
│   └── vitest.setup.js  # 全局测试设置
├── unit/               # 单元测试
│   ├── utils/          # 工具函数测试
│   ├── composables/    # 组合函数测试
│   ├── services/       # 服务类测试
│   ├── components/     # Vue组件测试
│   └── stores/         # 状态管理测试
├── integration/        # 集成测试
│   ├── pages/          # 页面级测试
│   └── workflows/      # 业务流程测试
├── fixtures/           # 测试数据
│   └── testData.js     # 共享测试数据
├── mocks/              # Mock文件
│   ├── localStorageMock.js  # 本地存储Mock
│   └── serviceMocks.js      # 服务Mock
└── README.md           # 本文档
```

## 🚀 快速开始

### 安装依赖

项目已包含所有测试依赖，如果需要重新安装：

```bash
npm install -D vitest@^0.34.6 @vue/test-utils@^2.4.0 @testing-library/vue@^7.0.0 jsdom@^22.1.0
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行测试并监听变化
npm run test:watch

# 运行测试一次（CI模式）
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# 启动可视化测试界面
npm run test:ui
```

## 📊 测试覆盖率目标

| 类型 | 目标覆盖率 | 说明 |
|------|-----------|------|
| 语句覆盖率 | ≥70% | 代码语句的执行覆盖 |
| 分支覆盖率 | ≥60% | 条件分支的覆盖 |
| 函数覆盖率 | ≥70% | 函数的调用覆盖 |
| 行覆盖率 | ≥70% | 代码行的执行覆盖 |

### 重点覆盖区域

- ✅ **核心业务逻辑** (95%+): 试用管理、AI服务调用
- ✅ **数据处理函数** (90%+): 图像处理、格式化工具
- ✅ **用户认证流程** (85%+): 登录、注册、权限验证
- ✅ **关键UI组件** (80%+): 按钮、表单、模态框

## 🧪 测试类型和示例

### 1. 单元测试 (Unit Tests)

#### 工具函数测试

```javascript
// tests/unit/utils/phoneUtils.test.js
test('应该正确格式化中国手机号', () => {
  expect(formatPhone('13800138000')).toBe('+86 138 0013 8000')
})
```

#### 组合函数测试

```javascript
// tests/unit/composables/useTrialManager.test.js
test('应该正确消耗试用次数', () => {
  const { attemptUseTrial, remainingTrials } = useTrialManager()
  
  const result = attemptUseTrial('AI处理', 1)
  
  expect(result).toBe(true)
  expect(remainingTrials.value).toBe(2)
})
```

#### Vue组件测试

```javascript
// tests/unit/components/LanguageSwitcher.test.js
test('点击应该触发语言切换', async () => {
  const wrapper = mount(LanguageSwitcher)
  
  await wrapper.find('button').trigger('click')
  
  expect(wrapper.emitted('language-changed')).toBeTruthy()
})
```

### 2. 集成测试 (Integration Tests)

#### 业务流程测试

```javascript
// tests/integration/workflows/imageProcessing.test.js
test('完整的背景移除流程', async () => {
  // 1. 用户上传图片
  await imageStore.uploadImage(testFile)
  
  // 2. 处理图片
  const result = await removeBackgroundService.processImage(...)
  
  // 3. 验证结果
  expect(result.success).toBe(true)
  expect(trialStore.remainingTrials).toBe(2)
})
```

## 🔧 测试配置

### Vitest 配置

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/vitest.setup.js']
  }
})
```

### 全局设置

```javascript
// tests/setup/vitest.setup.js
import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

// 全局插件配置
config.global.plugins = [i18n]

// Mock本地存储
global.localStorage = localStorageMock
```

## 🎭 Mock和测试数据

### Mock文件

- **localStorageMock.js**: 模拟本地存储
- **serviceMocks.js**: 模拟各种服务
- **testData.js**: 共享测试数据

### 使用Mock

```javascript
import { mockImages, createMockFile } from '../../fixtures/testData.js'

const testFile = createMockFile(mockImages.validJpeg)
```

## 📈 最佳实践

### 1. 测试命名

- 使用描述性的测试名称
- 采用"应该...当..."的格式
- 中文命名便于理解

```javascript
test('应该拒绝超过大小限制的文件', () => {
  // 测试代码
})
```

### 2. 测试结构

遵循 AAA 模式：

```javascript
test('测试描述', () => {
  // Arrange - 准备测试数据
  const input = 'test-input'
  
  // Act - 执行被测试的操作
  const result = functionToTest(input)
  
  // Assert - 验证结果
  expect(result).toBe('expected-output')
})
```

### 3. Mock策略

- 只Mock必要的依赖
- 使用真实数据结构
- 保持Mock的简单性

### 4. 异步测试

```javascript
test('异步操作测试', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```

## 🐛 调试测试

### 1. 查看详细输出

```bash
npm test -- --reporter=verbose
```

### 2. 运行单个测试文件

```bash
npm test phoneUtils.test.js
```

### 3. 使用调试器

```javascript
test('调试测试', () => {
  debugger // 在浏览器中暂停
  expect(true).toBe(true)
})
```

## 📝 编写新测试

### 1. 工具函数测试

```bash
# 创建新的工具函数测试
touch tests/unit/utils/newUtil.test.js
```

### 2. 组件测试

```bash
# 创建新的组件测试
touch tests/unit/components/NewComponent.test.js
```

### 3. 集成测试

```bash
# 创建新的集成测试
touch tests/integration/workflows/newWorkflow.test.js
```

## 🚨 常见问题

### Q: 测试运行很慢？

A: 检查是否有未清理的定时器或事件监听器：

```javascript
afterEach(() => {
  vi.clearAllTimers()
  vi.clearAllMocks()
})
```

### Q: Mock不生效？

A: 确保Mock在导入模块之前：

```javascript
vi.mock('@/utils/api.js', () => ({
  fetchData: vi.fn()
}))

import { componentThatUsesApi } from '@/components/MyComponent.vue'
```

### Q: Vue组件测试失败？

A: 确保正确配置全局插件：

```javascript
const wrapper = mount(Component, {
  global: {
    plugins: [router, pinia, i18n]
  }
})
```

---

## 📞 获取帮助

- 查看 [Vitest文档](https://vitest.dev/)
- 查看 [Vue Test Utils文档](https://test-utils.vuejs.org/)
- 项目内搜索现有测试示例
