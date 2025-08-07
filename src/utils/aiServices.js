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