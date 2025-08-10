/**
 * 手机号格式化工具
 * 处理各种用户输入格式，转换为国际标准格式
 */

// 中国手机号正则表达式 - 更新到最新的号段规则
const CHINA_MOBILE_REGEX = /^1[3-9]\d{9}$/

/**
 * 格式化手机号为国际标准格式
 * @param {string} phone - 用户输入的手机号
 * @returns {string} 格式化后的手机号
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''
  
  // 移除所有空格、横线、括号等特殊字符
  let cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // 如果已经有+号，直接返回
  if (cleanPhone.startsWith('+')) {
    return cleanPhone
  }
  
  // 如果以86开头，添加+号
  if (cleanPhone.startsWith('86') && cleanPhone.length === 13) {
    return '+' + cleanPhone
  }
  
  // 如果是中国手机号格式（11位数字，以1开头）
  if (CHINA_MOBILE_REGEX.test(cleanPhone)) {
    return '+86' + cleanPhone
  }
  
  // 如果是10位数字，可能是其他国家号码，需要用户手动添加国家代码
  if (/^\d{10}$/.test(cleanPhone)) {
    throw new Error('请输入完整的国际格式手机号，如 +86 13800138000')
  }
  
  // 如果是其他格式，直接添加+号（假设用户知道自己在输入什么）
  if (/^\d+$/.test(cleanPhone)) {
    return '+' + cleanPhone
  }
  
  // 无法识别的格式
  throw new Error('手机号格式不正确，请输入如 +86 13800138000 的格式')
}

/**
 * 验证手机号格式
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhoneNumber(phone) {
  if (!phone) return false
  
  try {
    const formatted = formatPhoneNumber(phone)
    // 基本验证：必须以+开头，后面是数字，长度在10-15位之间
    return /^\+\d{10,15}$/.test(formatted)
  } catch {
    return false
  }
}

/**
 * 获取手机号显示格式（用于UI展示）
 * @param {string} phone - 手机号
 * @returns {string} 格式化显示的手机号
 */
export function getDisplayPhoneNumber(phone) {
  if (!phone) return ''
  
  try {
    const formatted = formatPhoneNumber(phone)
    
    // 中国手机号特殊处理：+86 138 0013 8000
    if (formatted.startsWith('+86') && formatted.length === 14) {
      const number = formatted.substring(3)
      return `+86 ${number.substring(0, 3)} ${number.substring(3, 7)} ${number.substring(7)}`
    }
    
    // 其他国家手机号：+1 234 567 8900
    if (formatted.length > 10) {
      const countryCode = formatted.match(/^\+(\d{1,3})/)?.[1] || ''
      const number = formatted.substring(countryCode.length + 1)
      
      if (number.length >= 10) {
        return `+${countryCode} ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
      }
    }
    
    return formatted
  } catch {
    return phone
  }
}

/**
 * 检测手机号的国家/地区
 * @param {string} phone - 手机号
 * @returns {string} 国家代码描述
 */
export function detectPhoneRegion(phone) {
  if (!phone) return '未知'
  
  try {
    const formatted = formatPhoneNumber(phone)
    
    if (formatted.startsWith('+86')) return '中国大陆'
    if (formatted.startsWith('+852')) return '香港'
    if (formatted.startsWith('+853')) return '澳门'
    if (formatted.startsWith('+886')) return '台湾'
    if (formatted.startsWith('+1')) return '美国/加拿大'
    if (formatted.startsWith('+44')) return '英国'
    if (formatted.startsWith('+81')) return '日本'
    if (formatted.startsWith('+82')) return '韩国'
    if (formatted.startsWith('+65')) return '新加坡'
    
    return '其他地区'
  } catch {
    return '格式错误'
  }
}
