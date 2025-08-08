/**
 * AI 服务集成工具
 * 包含背景移除、图片增强等功能
 */

// Remove.bg API 配置
const REMOVE_BG_API_URL = 'https://api.remove.bg/v1.0/removebg';

/**
 * 使用 Remove.bg API 移除图片背景
 * @param {File|Blob} imageFile - 图片文件
 * @param {string} apiKey - Remove.bg API Key
 * @returns {Promise<Blob>} 处理后的图片 Blob
 */
export const removeBackground = async (imageFile, apiKey) => {
  if (!apiKey) {
    throw new Error('Remove.bg API Key 未配置');
  }

  const formData = new FormData();
  formData.append('image_file', imageFile);
  formData.append('size', 'preview'); // 使用预览尺寸节省配额

  try {
    const response = await fetch(REMOVE_BG_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.title || `API 请求失败: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Remove.bg API 错误:', error);
    throw error;
  }
};

/**
 * 检查 API 剩余配额
 * @param {string} apiKey - Remove.bg API Key  
 * @returns {Promise<Object>} 配额信息
 */
export const checkApiQuota = async (apiKey) => {
  try {
    const response = await fetch('https://api.remove.bg/v1.0/account', {
      headers: {
        'X-Api-Key': apiKey,
      }
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('配额检查失败:', error);
    return null;
  }
};

/**
 * 将 Blob 转换为 Canvas ImageData
 * @param {Blob} blob - 图片 Blob
 * @returns {Promise<Object>} { canvas, ctx, imageData }
 */
export const blobToCanvas = (blob) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      resolve({ canvas, ctx, imageData });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
};

/**
 * 压缩图片以节省 API 配额
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} quality - 压缩质量 (0-1)
 * @returns {Promise<Blob>} 压缩后的图片
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 计算压缩尺寸
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// ========== VanceAI API 服务 ==========

import { API_ENDPOINTS, VANCE_AI_CONFIG } from '../constants/apiConstants.js';

/**
 * VanceAI API - 上传图片
 * @param {File|Blob} imageFile - 图片文件
 * @param {string} apiToken - VanceAI API Token
 * @returns {Promise<string>} 返回图片uid
 */
export const vanceAIUpload = async (imageFile, apiToken) => {
  if (!apiToken) {
    throw new Error('VanceAI API Token 未配置');
  }

  const formData = new FormData();
  formData.append('api_token', apiToken);
  formData.append('file', imageFile);

  try {
    const response = await fetch(API_ENDPOINTS.VANCE_AI_UPLOAD, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`上传失败: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code !== 200) {
      throw new Error(result.message || '上传失败');
    }

    return result.data.uid;
  } catch (error) {
    console.error('VanceAI 上传错误:', error);
    throw error;
  }
};

/**
 * VanceAI API - 提交图像放大任务
 * @param {string} uid - 图片uid
 * @param {string} apiToken - VanceAI API Token  
 * @param {Object} params - 处理参数
 * @returns {Promise<string>} 返回任务trans_id
 */
export const vanceAIEnlarge = async (uid, apiToken, params = {}) => {
  if (!uid || !apiToken) {
    throw new Error('缺少必要参数');
  }

  const {
    scale = VANCE_AI_CONFIG.DEFAULT_PARAMS.scale,
    suppress_noise = VANCE_AI_CONFIG.DEFAULT_PARAMS.suppress_noise,
    remove_blur = VANCE_AI_CONFIG.DEFAULT_PARAMS.remove_blur
  } = params;

  const jconfig = {
    job: 'enlarge',
    config: {
      module: 'enlarge',
      module_params: {
        model_name: VANCE_AI_CONFIG.ENLARGE_MODEL,
        suppress_noise: suppress_noise,
        remove_blur: remove_blur,
        scale: scale
      },
      out_params: {}
    }
  };

  const formData = new FormData();
  formData.append('api_token', apiToken);
  formData.append('uid', uid);
  formData.append('jconfig', JSON.stringify(jconfig));

  try {
    const response = await fetch(API_ENDPOINTS.VANCE_AI_TRANSFORM, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`处理任务提交失败: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code !== 200) {
      throw new Error(result.message || '处理任务提交失败');
    }

    return result.data.trans_id;
  } catch (error) {
    console.error('VanceAI 处理任务提交错误:', error);
    throw error;
  }
};

/**
 * VanceAI API - 检查处理进度
 * @param {string} transId - 任务trans_id
 * @param {string} apiToken - VanceAI API Token
 * @returns {Promise<Object>} 返回进度信息
 */
export const vanceAICheckProgress = async (transId, apiToken) => {
  if (!transId || !apiToken) {
    throw new Error('缺少必要参数');
  }

  const formData = new FormData();
  formData.append('api_token', apiToken);
  formData.append('trans_id', transId);

  try {
    const response = await fetch(API_ENDPOINTS.VANCE_AI_PROGRESS, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`进度查询失败: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.code !== 200) {
      throw new Error(result.message || '进度查询失败');
    }

    return result.data;
  } catch (error) {
    console.error('VanceAI 进度查询错误:', error);
    throw error;
  }
};

/**
 * VanceAI API - 完整的异步处理流程
 * @param {File|Blob} imageFile - 图片文件
 * @param {Object} params - 处理参数
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Blob>} 处理后的图片
 */
export const vanceAIEnlargeComplete = async (imageFile, params = {}, onProgress) => {
  const apiToken = import.meta.env.VITE_VANCE_AI_API_TOKEN;
  
  if (!apiToken || apiToken === 'your_vance_ai_api_token_here') {
    throw new Error('VanceAI API Token 未配置');
  }

  try {
    // 步骤1: 上传图片
    onProgress?.({ step: 1, progress: 10, message: '正在上传图片到VanceAI...' });
    const uid = await vanceAIUpload(imageFile, apiToken);
    
    // 步骤2: 提交处理任务
    onProgress?.({ step: 2, progress: 20, message: '正在提交处理任务...' });
    const transId = await vanceAIEnlarge(uid, apiToken, params);
    
    // 步骤3: 轮询检查进度
    onProgress?.({ step: 3, progress: 30, message: '正在处理图片，请稍候...' });
    
    let attempts = 0;
    const maxAttempts = VANCE_AI_CONFIG.POLLING.MAX_ATTEMPTS;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, VANCE_AI_CONFIG.POLLING.INTERVAL));
      
      const progressData = await vanceAICheckProgress(transId, apiToken);
      const status = progressData.status;
      
      // 计算进度百分比 (30% - 90%)
      const progressPercent = 30 + (attempts / maxAttempts) * 60;
      
      if (status === VANCE_AI_CONFIG.JOB_STATUS.FINISH) {
        // 处理完成，下载结果
        onProgress?.({ step: 4, progress: 95, message: '正在下载处理结果...' });
        
        const resultResponse = await fetch(progressData.result_url);
        if (!resultResponse.ok) {
          throw new Error('下载处理结果失败');
        }
        
        const resultBlob = await resultResponse.blob();
        onProgress?.({ step: 4, progress: 100, message: '处理完成！' });
        
        return resultBlob;
        
      } else if (status === VANCE_AI_CONFIG.JOB_STATUS.FATAL) {
        throw new Error('图片处理失败');
        
      } else if (status === VANCE_AI_CONFIG.JOB_STATUS.WAITING || status === VANCE_AI_CONFIG.JOB_STATUS.PROCESS) {
        // 继续等待
        onProgress?.({ 
          step: 3, 
          progress: Math.min(progressPercent, 90), 
          message: `正在处理图片... (${attempts + 1}/${maxAttempts})` 
        });
        attempts++;
        
      } else {
        // 未知状态，继续等待
        attempts++;
      }
    }
    
    throw new Error('处理超时，请稍后重试');
    
  } catch (error) {
    console.error('VanceAI 完整处理流程错误:', error);
    throw error;
  }
};

// 缓存配置
export const CACHE_CONFIG = {
  // 缓存键前缀
  PREFIX: 'reface_api_',
  
  // 缓存时间（毫秒）
  TTL: {
    SHORT: 5 * 60 * 1000,      // 5分钟
    MEDIUM: 30 * 60 * 1000,    // 30分钟
    LONG: 2 * 60 * 60 * 1000   // 2小时
  },
  
  // 是否启用缓存
  ENABLED: true
}