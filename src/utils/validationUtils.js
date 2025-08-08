/**
 * 验证工具函数
 * 提供各种数据验证方法
 */

/**
 * 验证邮箱地址
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号码（中国大陆）
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否有效
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证 URL
 * @param {string} url - URL 地址
 * @returns {boolean} 是否有效
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证数值范围
 * @param {number} value - 数值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {boolean} 是否在范围内
 */
export const isInRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * 验证字符串长度
 * @param {string} str - 字符串
 * @param {number} minLength - 最小长度
 * @param {number} maxLength - 最大长度
 * @returns {boolean} 长度是否有效
 */
export const isValidLength = (str, minLength = 0, maxLength = Infinity) => {
  return typeof str === 'string' && str.length >= minLength && str.length <= maxLength
}

/**
 * 验证必填字段
 * @param {any} value - 值
 * @returns {boolean} 是否非空
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * 验证图片文件类型
 * @param {File} file - 文件对象
 * @param {string[]} allowedTypes - 允许的类型
 * @returns {boolean} 是否为有效图片
 */
export const isValidImageType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) => {
  return file && file.type && allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大大小（字节）
 * @returns {boolean} 大小是否有效
 */
export const isValidFileSize = (file, maxSize) => {
  return file && file.size <= maxSize
}

/**
 * 批量验证
 * @param {Object} data - 要验证的数据
 * @param {Object} rules - 验证规则
 * @returns {Object} 验证结果
 */
export const validateData = (data, rules) => {
  const result = {
    valid: true,
    errors: {}
  }

  Object.keys(rules).forEach(field => {
    const value = data[field]
    const fieldRules = rules[field]
    const fieldErrors = []

    fieldRules.forEach(rule => {
      const { validator, message } = rule

      if (typeof validator === 'function') {
        if (!validator(value)) {
          fieldErrors.push(message)
        }
      }
    })

    if (fieldErrors.length > 0) {
      result.valid = false
      result.errors[field] = fieldErrors
    }
  })

  return result
}

/**
 * 常用验证规则
 */
export const validationRules = {
  required: (message = '此字段为必填项') => ({
    validator: isRequired,
    message
  }),

  email: (message = '请输入有效的邮箱地址') => ({
    validator: isValidEmail,
    message
  }),

  phone: (message = '请输入有效的手机号码') => ({
    validator: isValidPhone,
    message
  }),

  minLength: (min, message = `最少需要 ${min} 个字符`) => ({
    validator: (value) => isValidLength(value, min),
    message
  }),

  maxLength: (max, message = `最多只能 ${max} 个字符`) => ({
    validator: (value) => isValidLength(value, 0, max),
    message
  }),

  range: (min, max, message = `数值应在 ${min} 到 ${max} 之间`) => ({
    validator: (value) => isInRange(value, min, max),
    message
  })
}
