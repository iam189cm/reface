/**
 * 滤镜相关常量定义
 */

// 滤镜类型
export const FILTER_TYPES = {
  SMOOTHING: 'smoothing',
  WHITENING: 'whitening', 
  BRIGHTNESS: 'brightness',
  CONTRAST: 'contrast',
  SATURATION: 'saturation'
}

// 滤镜配置
export const FILTER_CONFIG = {
  [FILTER_TYPES.SMOOTHING]: {
    name: '磨皮',
    description: '自然磨皮，保持肌理细节',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
    unit: '%',
    color: 'pink',
    icon: 'star'
  },
  [FILTER_TYPES.WHITENING]: {
    name: '美白',
    description: '自然美白，提升肌肤光泽',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
    unit: '%',
    color: 'purple',
    icon: 'lightning'
  },
  [FILTER_TYPES.BRIGHTNESS]: {
    name: '亮度',
    description: '调节图片整体亮度',
    min: -50,
    max: 50,
    default: 0,
    step: 1,
    unit: '',
    color: 'blue',
    icon: 'sun'
  },
  [FILTER_TYPES.CONTRAST]: {
    name: '对比度',
    description: '调节图片明暗对比',
    min: -50,
    max: 50,
    default: 0,
    step: 1,
    unit: '',
    color: 'green',
    icon: 'adjust'
  },
  [FILTER_TYPES.SATURATION]: {
    name: '饱和度',
    description: '调节图片色彩饱和度',
    min: -50,
    max: 50,
    default: 0,
    step: 1,
    unit: '',
    color: 'pink',
    icon: 'color'
  }
}

// 预设滤镜效果
export const FILTER_PRESETS = {
  ORIGINAL: {
    name: '原图',
    values: {
      [FILTER_TYPES.SMOOTHING]: 0,
      [FILTER_TYPES.WHITENING]: 0,
      [FILTER_TYPES.BRIGHTNESS]: 0,
      [FILTER_TYPES.CONTRAST]: 0,
      [FILTER_TYPES.SATURATION]: 0
    }
  },
  NATURAL: {
    name: '自然',
    values: {
      [FILTER_TYPES.SMOOTHING]: 20,
      [FILTER_TYPES.WHITENING]: 15,
      [FILTER_TYPES.BRIGHTNESS]: 5,
      [FILTER_TYPES.CONTRAST]: 10,
      [FILTER_TYPES.SATURATION]: 5
    }
  },
  FRESH: {
    name: '清新',
    values: {
      [FILTER_TYPES.SMOOTHING]: 30,
      [FILTER_TYPES.WHITENING]: 25,
      [FILTER_TYPES.BRIGHTNESS]: 10,
      [FILTER_TYPES.CONTRAST]: 5,
      [FILTER_TYPES.SATURATION]: -10
    }
  },
  SWEET: {
    name: '甜美',
    values: {
      [FILTER_TYPES.SMOOTHING]: 40,
      [FILTER_TYPES.WHITENING]: 35,
      [FILTER_TYPES.BRIGHTNESS]: 15,
      [FILTER_TYPES.CONTRAST]: -5,
      [FILTER_TYPES.SATURATION]: 15
    }
  },
  VINTAGE: {
    name: '复古',
    values: {
      [FILTER_TYPES.SMOOTHING]: 10,
      [FILTER_TYPES.WHITENING]: 5,
      [FILTER_TYPES.BRIGHTNESS]: -10,
      [FILTER_TYPES.CONTRAST]: 20,
      [FILTER_TYPES.SATURATION]: -20
    }
  }
}

// 滤镜算法参数
export const FILTER_ALGORITHMS = {
  // 磨皮算法参数
  SMOOTHING: {
    BLUR_RADIUS: 2,
    INTENSITY_FACTOR: 0.2,
    PRESERVE_DETAIL: true
  },
  
  // 美白算法参数
  WHITENING: {
    WHITE_FACTOR: 0.3,
    PRESERVE_SHADOW: true,
    BLEND_MODE: 'overlay'
  },
  
  // 亮度算法参数
  BRIGHTNESS: {
    MULTIPLIER: 2.55, // 将 -50~50 转换为 -127.5~127.5
    CLAMP_MIN: 0,
    CLAMP_MAX: 255
  },
  
  // 对比度算法参数
  CONTRAST: {
    BASE_VALUE: 259,
    OFFSET: 128,
    MULTIPLIER: 2.55
  },
  
  // 饱和度算法参数
  SATURATION: {
    GRAY_WEIGHTS: {
      RED: 0.299,
      GREEN: 0.587,
      BLUE: 0.114
    },
    RANGE_FACTOR: 50 // 将 -50~50 转换为 0~2
  }
}

// 滤镜处理优先级（数字越小优先级越高）
export const FILTER_PRIORITY = {
  [FILTER_TYPES.BRIGHTNESS]: 1,
  [FILTER_TYPES.CONTRAST]: 2,
  [FILTER_TYPES.SATURATION]: 3,
  [FILTER_TYPES.WHITENING]: 4,
  [FILTER_TYPES.SMOOTHING]: 5
}

// 滤镜性能配置
export const FILTER_PERFORMANCE = {
  // 是否启用Web Worker进行处理
  USE_WORKER: false,
  
  // 批处理大小
  BATCH_SIZE: 1000,
  
  // 是否启用GPU加速
  USE_GPU: false,
  
  // 处理超时时间（毫秒）
  TIMEOUT: 5000
}
