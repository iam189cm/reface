/**
 * 试用计数管理
 * 管理用户的免费试用次数
 */

const TRIAL_KEY = 'reface_trial_count';
const TRIAL_RESET_KEY = 'reface_trial_reset';
const MAX_TRIAL_COUNT = 3;

/**
 * 获取用户剩余试用次数
 * @returns {number} 剩余试用次数
 */
export const getRemainingTrials = () => {
  try {
    // 检查是否需要重置试用次数（每天重置）
    const lastReset = localStorage.getItem(TRIAL_RESET_KEY);
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      // 新的一天，重置试用次数
      localStorage.setItem(TRIAL_KEY, '0');
      localStorage.setItem(TRIAL_RESET_KEY, today);
      return MAX_TRIAL_COUNT;
    }

    const usedCount = parseInt(localStorage.getItem(TRIAL_KEY) || '0');
    return Math.max(0, MAX_TRIAL_COUNT - usedCount);
  } catch (error) {
    console.error('获取试用次数失败:', error);
    return MAX_TRIAL_COUNT;
  }
};

/**
 * 使用一次试用机会
 * @returns {boolean} 是否成功使用
 */
export const useTrial = () => {
  try {
    const remaining = getRemainingTrials();
    if (remaining <= 0) {
      return false;
    }

    const usedCount = parseInt(localStorage.getItem(TRIAL_KEY) || '0');
    localStorage.setItem(TRIAL_KEY, String(usedCount + 1));
    return true;
  } catch (error) {
    console.error('使用试用次数失败:', error);
    return false;
  }
};

/**
 * 检查是否可以使用试用
 * @returns {boolean} 是否可以使用
 */
export const canUseTrial = () => {
  return getRemainingTrials() > 0;
};

/**
 * 获取试用状态信息
 * @returns {Object} 试用状态
 */
export const getTrialStatus = () => {
  const remaining = getRemainingTrials();
  const used = MAX_TRIAL_COUNT - remaining;
  
  return {
    maxTrials: MAX_TRIAL_COUNT,
    usedTrials: used,
    remainingTrials: remaining,
    canUse: remaining > 0,
    isFirstTime: used === 0
  };
};

/**
 * 重置试用次数（仅用于开发测试）
 */
export const resetTrials = () => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.removeItem(TRIAL_KEY);
    localStorage.removeItem(TRIAL_RESET_KEY);
    console.log('试用次数已重置');
  }
};