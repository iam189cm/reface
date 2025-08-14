/**
 * 中文语言包 (zh-CN)
 * Reface AI图像美化工具
 */

export default {
  // 通用词汇
  common: {
    buttons: {
      confirm: '确认',
      cancel: '取消',
      submit: '提交',
      reset: '重置',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      close: '关闭',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      retry: '重试',
      refresh: '刷新',
      upload: '上传',
      download: '下载',
      preview: '预览',
      apply: '应用',
      clear: '清空'
    },
    status: {
      loading: '加载中...',
      processing: '处理中...',
      success: '成功',
      failed: '失败',
      error: '错误',
      warning: '警告',
      info: '信息',
      completed: '已完成',
      pending: '等待中',
      cancelled: '已取消'
    },
    time: {
      today: '今天',
      yesterday: '昨天',
      tomorrow: '明天',
      thisWeek: '本周',
      thisMonth: '本月',
      thisYear: '今年'
    }
  },

  // 导航和布局
  navigation: {
    home: '首页',
    editor: '编辑器',
    aiTools: 'AI工具',
    aiToolsTitle: '智能图片处理',
    aiToolsDesc: '专业AI技术，让图片更美丽',
    pricing: '定价',
    admin: '管理后台',
    help: '帮助',
    startEditing: '开始编辑',
    login: '登录',
    register: '注册',
    logout: '退出登录',
    profile: '个人资料',
    settings: '设置'
  },

  // 首页
  home: {
    title: '专为女性打造的',
    subtitle: 'AI图片美化工具',
    description: '轻松去除背景、智能放大图片，让你的每一张照片都完美绽放',
    startNow: '立即开始 - 免费试用',
    viewDemo: '查看功能演示',
    demoTitle: '看看处理效果',
    demoSubtitle: '真实案例展示，效果一目了然',
    features: {
      aiBackground: 'AI背景移除',
      imageEnlarger: 'AI图像放大',
      filters: '美颜滤镜',
      realtime: '实时预览'
    }
  },

  // 效果演示
  demo: {
    removeBackground: 'AI背景移除效果',
    removeBackgroundDesc: '智能识别主体，精准去除背景',
    imageEnlarge: 'AI图片放大效果',
    imageEnlargeDesc: '智能算法重建细节，清晰度大幅提升',
    before: '处理前',
    after: '处理后',
    blurrySmall: '模糊 • 小尺寸',
    clearLarge: '清晰 • 大尺寸'
  },

  // 工作流程
  workflow: {
    title: '简单三步，完美效果',
    step1: '上传图片',
    step1Desc: '选择需要处理的图片文件',
    step2: '选择功能',
    step2Desc: '选择背景移除或图片放大',
    step3: '下载结果',
    step3Desc: '处理完成后下载高质量图片'
  },

  // 信任保障
  trust: {
    title: '安全可靠的服务保障',
    subtitle: '您的隐私和数据安全是我们的首要关注',
    privacy: '隐私保护',
    privacyDesc: '图片处理完成后自动删除\n不存储任何个人数据',
    technology: '技术领先',
    technologyDesc: '采用业界领先的AI算法\n持续优化处理效果',
    service: '服务稳定',
    serviceDesc: '7x24小时服务保障\n99.9%服务可用性'
  },

  // 认证相关
  auth: {
    login: {
      title: '登录到 Reface',
      email: '邮箱地址',
      password: '密码',
      forgotPassword: '忘记密码？',
      noAccount: '还没有账号？',
      signUp: '立即注册'
    },
    register: {
      title: '注册 Reface 账号',
      email: '邮箱地址',
      password: '密码',
      confirmPassword: '确认密码',
      hasAccount: '已有账号？',
      signIn: '立即登录'
    },
    messages: {
      loginSuccess: '登录成功',
      logoutSuccess: '已成功退出登录',
      registerSuccess: '注册成功',
      invalidCredentials: '邮箱或密码错误',
      emailRequired: '请输入邮箱地址',
      passwordRequired: '请输入密码'
    }
  },

  // AI功能
  ai: {
    backgroundRemover: {
      title: 'AI背景移除',
      description: '智能识别并移除图片背景',
      button: '移除背景',
      processing: '正在移除背景...',
      success: '背景移除成功',
      error: '背景移除失败',
      apiKeyLabel: 'Remove.bg API Key (开发模式)',
      apiKeyPlaceholder: '请输入 Remove.bg API Key',
      apiKeyNote: '生产环境将使用服务器端 API Key'
    },
    imageEnlarger: {
      title: 'AI图像放大',
      description: '使用AI技术放大图片并保持清晰度',
      button: '放大图片',
      processing: '正在放大图片...',
      success: '图片放大成功',
      error: '图片放大失败',
      scaleOptions: {
        '2x': '2倍放大',
        '4x': '4倍放大',
        '8x': '8倍放大'
      },
      resetButton: '🔄 重置为推荐值',
      advancedSettings: '高级设置',
      needsUpgrade: '该功能需要升级解锁',
      upgradeHighScale: '升级解锁高倍放大'
    }
  },

  // 试用和升级
  trial: {
    status: {
      remaining: '剩余试用',
      exhausted: '试用次数已用完',
      firstTime: '首次使用',
      dailyLimit: '每日限制'
    },
    messages: {
      success: '{description}成功，消耗{cost}次试用，今日还可使用 {remaining} 次',
      exhausted: '今日试用次数已用完，明天可继续使用',
      warning: '该功能需要 {cost} 次试用机会，您只剩 {remaining} 次',
      failed: '试用次数使用失败'
    },
    upgrade: {
      title: '解锁更多功能',
      description: '升级后可享受无限次数的 AI 背景移除功能',
      features: {
        unlimited: '无限次 AI 背景移除',
        quality: '高质量图片处理',
        support: '优先客服支持'
      },
      pricing: {
        amount: '¥9.9',
        description: '体验包 / 10张处理'
      },
      buttons: {
        upgrade: '立即升级',
        notNow: '暂不升级',
        unlockMore: '✨ 升级解锁更多次数',
        unlockFeature: '✨ 升级解锁{feature}'
      },
      paymentNote: '支付功能开发中，敬请期待',
      paymentDeveloping: '支付功能开发中，敬请期待！'
    }
  },

  // 图片处理
  image: {
    upload: {
      title: '上传图片',
      dragHint: '拖拽图片到此处，或点击选择',
      formats: '支持 JPG、PNG、WebP 格式',
      maxSize: '文件大小不超过 10MB',
      selectFile: '选择文件',
      uploading: '上传中...',
      uploadSuccess: '上传成功',
      uploadError: '上传失败',
      invalidFormat: '不支持的文件格式',
      fileTooLarge: '文件大小超过限制'
    },
    editor: {
      brightness: '亮度',
      contrast: '对比度',
      saturation: '饱和度',
      blur: '模糊',
      opacity: '透明度',
      reset: '重置',
      apply: '应用',
      save: '保存',
      download: '下载'
    },
    canvas: {
      zoomIn: '放大',
      zoomOut: '缩小',
      resetZoom: '重置缩放',
      fitToScreen: '适应屏幕'
    }
  },

  // 通知消息
  notifications: {
    types: {
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息'
    },
    actions: {
      dismiss: '忽略',
      viewDetails: '查看详情',
      retry: '重试'
    }
  },

  // 用户类型
  userTypes: {
    FREE: '免费用户',
    STARTER: '入门版',
    PRO: '专业版',
    BUSINESS: '企业版',
    ADMIN: '管理员'
  },

  // 错误页面
  errors: {
    404: {
      title: '页面不存在',
      message: '抱歉，您访问的页面不存在',
      backHome: '返回首页'
    },
    500: {
      title: '服务器错误',
      message: '服务器出现错误，请稍后再试',
      retry: '重试'
    },
    network: {
      title: '网络错误',
      message: '网络连接异常，请检查网络设置',
      retry: '重试'
    }
  },

  // AI工具
  tools: {
    removeBackground: {
      name: 'AI背景移除',
      desc: '智能识别并移除图片背景'
    },
    imageEnlarger: {
      name: 'AI图片放大',
      desc: 'AI算法无损放大图片'
    },
    imageFilter: {
      name: '实时滤镜',
      desc: '美颜滤镜实时预览'
    }
  },

  // 产品介绍
  intro: {
    title: '专业AI图片处理',
    subtitle: '让每一张照片都更加完美，体验最先进的AI图像处理技术',
    removeBackgroundDesc: '使用先进的AI技术，智能识别主体并精确移除背景，让您的图片更加专业',
    imageEnlargerDesc: '通过深度学习算法，无损放大图片至8倍，保持清晰度和细节',
    oneClick: '一键智能处理',
    highQuality: '超高清品质',
    quickStart: '立即开始',
    freeTrialInfo: '每天免费体验3次，无需注册'
  },

  // 定价页面
  pricing: {
    title: '选择适合你的套餐',
    subtitle: '灵活的定价方案，满足不同用户的需求，所有套餐都包含核心AI功能',
    recommended: '推荐',
    currentPlan: '当前套餐',
    choosePlan: '选择套餐',
    free: {
      name: '免费试用',
      price: '0',
      period: '天',
      desc: '体验基础功能',
      features: [
        '每日3次AI处理',
        'AI背景移除',
        'AI图片放大(2x)'
      ]
    },
    basic: {
      name: '体验包',
      price: '9.9',
      period: '次',
      desc: '10次AI处理配额',
      features: [
        '10次AI处理',
        'AI背景移除',
        'AI图片放大(2x)',
        '高清画质输出'
      ]
    },
    standard: {
      name: '标准包',
      price: '39.9',
      period: '次',
      desc: '50次AI处理配额',
      features: [
        '50次AI处理',
        'AI背景移除',
        'AI图片放大(最高4x)',
        '超高清画质输出',
        '优先处理'
      ]
    },
    premium: {
      name: '超值包',
      price: '69.9',
      period: '次',
      desc: '100次AI处理配额',
      features: [
        '100次AI处理',
        'AI背景移除',
        'AI图片放大(最高8x)',
        '超高清画质输出',
        '优先处理',
        '批量处理'
      ]
    },
    faq: {
      title: '常见问题',
      q1: '如何购买AI处理配额？',
      a1: '点击"选择套餐"按钮，选择适合的套餐后即可完成购买，支持支付宝、微信等多种支付方式。',
      q2: '配额会过期吗？',
      a2: '购买的配额永久有效，不会过期。您可以随时使用您的AI处理配额。',
      q3: '能否退款？',
      a3: '由于AI处理需要消耗计算资源，已使用的配额不支持退款。未使用的配额在购买后7天内可以申请退款。'
    }
  },

  // 帮助页面  
  help: {
    title: '帮助中心',
    subtitle: '快速上手Reface，了解如何使用AI功能让你的图片更完美',
    sections: {
      title: '帮助分类',
      gettingStarted: '快速开始',
      aiTools: 'AI工具使用',
      faq: '常见问题',
      contact: '联系支持'
    },
    gettingStarted: {
      title: '快速开始',
      step1: {
        title: '上传图片',
        desc: '点击上传区域或拖拽图片文件到页面中，支持JPG、PNG、WebP格式，最大10MB。'
      },
      step2: {
        title: '选择AI功能',
        desc: '在右侧面板中选择需要的AI功能，如背景移除或图片放大，调整相关参数。'
      },
      step3: {
        title: '处理并下载',
        desc: '点击开始处理按钮，等待AI处理完成后，即可预览效果并下载处理后的图片。'
      }
    },
    aiTools: {
      title: 'AI工具详解',
      removeBackground: {
        title: 'AI背景移除',
        desc: '智能识别图片主体，精确移除背景，适用于人像、物品等各类图片。',
        tip1: '选择主体清晰、背景单一的图片效果更佳',
        tip2: '处理后的图片会自动保存为PNG格式，支持透明背景'
      },
      imageEnlarger: {
        title: 'AI图片放大',
        desc: '使用深度学习技术，无损放大图片尺寸，保持清晰度和细节。',
        tip1: '支持2x、4x、8x多种放大倍数，免费用户限制2x',
        tip2: '建议原图尺寸不超过2000x2000像素以获得最佳效果'
      }
    },
    faq: {
      title: '常见问题解答',
      q1: '为什么我的图片处理失败了？',
      a1: '请检查图片格式是否为JPG、PNG或WebP，文件大小是否超过10MB。如果问题仍然存在，请联系客服。',
      q2: '免费试用有什么限制？',
      a2: '免费用户每天可以使用3次AI处理，图片放大限制为2x，处理结果为高清画质。',
      q3: '如何获得更多AI处理次数？',
      a3: '您可以购买付费套餐获得更多AI处理配额，配额永久有效，支持更高倍数的图片放大。',
      q4: '处理后的图片质量如何？',
      a4: 'AI处理后的图片保持原有画质，背景移除输出PNG透明格式，图片放大采用AI算法保持细节清晰。'
    },
    contact: {
      title: '联系我们',
      email: {
        title: '邮件支持',
        desc: '遇到问题？发送邮件给我们'
      },
      chat: {
        title: '在线客服',
        desc: '工作日9:00-18:00在线回复',
        button: '开始对话'
      }
    }
  },

  // 开发调试
  debug: {
    development: '开发模式',
    serviceHealth: '服务状态',
    healthy: '正常',
    unhealthy: '异常',
    configErrors: '配置错误',
    aiServicesCount: 'AI服务数量'
  }
}
