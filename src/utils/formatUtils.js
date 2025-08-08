/**
 * 格式化工具函数
 * 提供各种数据格式化方法
 */

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期
 * @param {string} format - 格式化模式
 * @returns {string} 格式化后的日期
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return '无效日期'
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  const formatMap = {
    'YYYY': year,
    'MM': month,
    'DD': day,
    'HH': hours,
    'mm': minutes,
    'ss': seconds
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match])
}

/**
 * 格式化相对时间
 * @param {Date|string|number} date - 日期
 * @returns {string} 相对时间描述
 */
export const formatRelativeTime = (date) => {
  const now = new Date()
  const target = new Date(date)
  const diff = now - target

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)} 分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)} 天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)} 周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)} 个月前`
  } else {
    return `${Math.floor(diff / year)} 年前`
  }
}

/**
 * 格式化数字
 * @param {number} num - 数字
 * @param {Object} options - 格式化选项
 * @returns {string} 格式化后的数字
 */
export const formatNumber = (num, options = {}) => {
  const {
    decimals = 0,
    thousandsSeparator = ',',
    decimalSeparator = '.',
    prefix = '',
    suffix = ''
  } = options

  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }

  const fixed = num.toFixed(decimals)
  const parts = fixed.split('.')
  
  // 添加千位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
  
  const formatted = parts.join(decimalSeparator)
  return prefix + formatted + suffix
}

/**
 * 格式化货币
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号
 * @returns {string} 格式化后的货币
 */
export const formatCurrency = (amount, currency = '¥') => {
  return formatNumber(amount, {
    decimals: 2,
    prefix: currency
  })
}

/**
 * 格式化百分比
 * @param {number} value - 数值（0-1 或 0-100）
 * @param {Object} options - 选项
 * @returns {string} 格式化后的百分比
 */
export const formatPercentage = (value, options = {}) => {
  const { decimals = 1, isDecimal = true } = options
  
  const percentage = isDecimal ? value * 100 : value
  return formatNumber(percentage, {
    decimals,
    suffix: '%'
  })
}

/**
 * 格式化文件大小（从 imageUtils 复制过来保持一致性）
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化持续时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`
  }
}

/**
 * 格式化电话号码
 * @param {string} phone - 电话号码
 * @returns {string} 格式化后的电话号码
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
  }
  
  return phone
}

/**
 * 截断文本
 * @param {string} text - 文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * 格式化键值对为查询字符串
 * @param {Object} params - 参数对象
 * @returns {string} 查询字符串
 */
export const formatQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

/**
 * 格式化 RGB 颜色值
 * @param {number} r - 红色值
 * @param {number} g - 绿色值
 * @param {number} b - 蓝色值
 * @param {number} a - 透明度（可选）
 * @returns {string} RGB/RGBA 颜色字符串
 */
export const formatRgbColor = (r, g, b, a) => {
  const values = [Math.round(r), Math.round(g), Math.round(b)]
  
  if (typeof a === 'number') {
    values.push(Math.round(a * 100) / 100)
    return `rgba(${values.join(', ')})`
  }
  
  return `rgb(${values.join(', ')})`
}
