// 图标系统配置文件
// 使用 Lucide Icons 提供一致的图标体验

// 注意：在使用前请先安装 lucide-vue-next:
// npm install lucide-vue-next

// 导航和UI图标
export {
  Home,           // 主页
  Menu,           // 移动端菜单
  ChevronDown,    // 下拉箭头
  Globe,          // 语言切换
  User,           // 用户图标
  LogIn,          // 登录
  UserPlus,       // 注册
  Rocket,         // 免费试用
  Search,         // 搜索
  Bell,           // 通知
  Settings,       // 设置
} from 'lucide-vue-next'

// AI功能分类图标
export {
  Sparkles,       // AI增强 - 闪光特效
  Scissors,       // AI编辑 - 编辑工具
  Palette,        // AI创造 - 创作调色板
  Zap,           // AI生产力 - 闪电效率
  Wand2,         // 魔法棒 - 备用AI图标
  Bot,           // 机器人 - AI通用图标
} from 'lucide-vue-next'

// 用户群体图标
export {
  Users,          // 个人用户
  Video,          // 内容创作者 
  ShoppingCart,   // 电商卖家
  Target,         // 设计师
  Briefcase,      // 商业用户
  Camera,         // 摄影师
  Laptop,         // 开发者
} from 'lucide-vue-next'

// 功能状态图标
export {
  CheckCircle,    // 已上线/成功
  Clock,          // 处理中
  AlertCircle,    // 警告
  XCircle,        // 错误/失败
  Timer,          // 敬请期待
  Loader,         // 加载中
  Upload,         // 上传
  Download,       // 下载
} from 'lucide-vue-next'

// 页脚和联系图标
export {
  Mail,           // 邮箱
  Phone,          // 电话
  MapPin,         // 地址
  FileText,       // 法律文档
  Building,       // 企业信息
  ExternalLink,   // 外部链接
  ArrowRight,     // 右箭头
  Heart,          // 收藏/喜欢
} from 'lucide-vue-next'

// 社交媒体图标
export {
  Twitter,        // Twitter
  Github,         // GitHub
  Linkedin,       // LinkedIn
  Facebook,       // Facebook
  Instagram,      // Instagram
  Youtube,        // YouTube
} from 'lucide-vue-next'

// 图标映射配置
export const iconMap = {
  // 导航类
  navigation: {
    home: 'Home',
    menu: 'Menu', 
    chevronDown: 'ChevronDown',
    globe: 'Globe',
    user: 'User',
    login: 'LogIn',
    register: 'UserPlus',
    rocket: 'Rocket'
  },

  // AI功能分类
  aiCategories: {
    enhance: 'Sparkles',     // AI增强
    edit: 'Scissors',        // AI编辑  
    create: 'Palette',       // AI创造
    productivity: 'Zap'      // AI生产力
  },

  // 用户群体
  userGroups: {
    personal: 'User',        // 个人用户
    contentCreator: 'Video', // 内容创作者
    ecommerce: 'ShoppingCart', // 电商卖家
    designer: 'Target'       // 设计师
  },

  // 功能状态
  status: {
    available: 'CheckCircle',    // 已上线
    processing: 'Clock',         // 处理中
    comingSoon: 'Timer',        // 敬请期待
    error: 'XCircle',           // 错误
    loading: 'Loader'           // 加载中
  },

  // 联系和服务
  contact: {
    email: 'Mail',
    phone: 'Phone',
    address: 'MapPin',
    legal: 'FileText',
    company: 'Building'
  }
}

/**
 * 获取图标组件
 * @param {string} category - 图标分类
 * @param {string} name - 图标名称
 * @returns {Component|null} Vue组件或null
 */
export const getIcon = (category, name) => {
  const iconName = iconMap[category]?.[name]
  if (!iconName) {
    console.warn(`图标不存在: ${category}.${name}`)
    return null
  }
  
  // 这里需要动态导入，实际使用时需要配置
  // return iconComponents[iconName]
  return iconName
}

/**
 * 图标尺寸预设
 */
export const iconSizes = {
  xs: 16,    // 超小图标
  sm: 18,    // 小图标  
  md: 20,    // 中等图标（默认）
  lg: 24,    // 大图标
  xl: 32,    // 超大图标
  xxl: 48    // 巨大图标
}

/**
 * 图标颜色预设（与主题配色对应）
 */
export const iconColors = {
  primary: 'text-pink-600',      // 主色调
  secondary: 'text-purple-600',  // 次要色调
  success: 'text-green-600',     // 成功状态
  warning: 'text-yellow-600',    // 警告状态
  error: 'text-red-600',         // 错误状态
  muted: 'text-gray-500',        // 静音/次要
  white: 'text-white',           // 白色
  current: 'text-current'        // 继承当前颜色
}

/**
 * 常用图标组合配置
 */
export const iconPresets = {
  // AI功能卡片图标配置
  aiFeatures: {
    imageUpscale: { icon: 'Sparkles', color: 'primary', size: 'lg' },
    backgroundRemoval: { icon: 'Scissors', color: 'primary', size: 'lg' },
    cartoonize: { icon: 'Palette', color: 'primary', size: 'lg' },
    batchProcess: { icon: 'Zap', color: 'primary', size: 'lg' }
  },

  // 导航图标配置
  navigation: {
    dropdown: { icon: 'ChevronDown', color: 'current', size: 'sm' },
    language: { icon: 'Globe', color: 'muted', size: 'md' },
    user: { icon: 'User', color: 'muted', size: 'md' }
  }
}
