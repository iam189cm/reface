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

// 网络连接诊断函数
const checkNetworkConnection = async () => {
  try {
    console.log('检查网络连接...');
    
    // 测试基本网络连接
    const testResponse = await fetch('https://httpbin.org/get', {
      method: 'GET',
      signal: AbortSignal.timeout(10000)
    });
    
    if (testResponse.ok) {
      console.log('基本网络连接正常');
      
      // 测试VanceAI域名连接
      try {
        const vanceAITest = await fetch('https://api-service.vanceai.com', {
          method: 'HEAD',
          signal: AbortSignal.timeout(15000)
        });
        console.log('VanceAI服务器连接状态:', vanceAITest.status);
      } catch (vanceError) {
        console.warn('VanceAI服务器连接测试失败:', vanceError.message);
      }
      
    } else {
      console.warn('网络连接可能存在问题');
    }
  } catch (error) {
    console.error('网络诊断失败:', error.message);
  }
};

/**
 * VanceAI API - 上传图片
 * @param {File|Blob} imageFile - 图片文件
 * @param {string} apiToken - VanceAI API Token
 * @returns {Promise<string>} 返回图片uid
 */
// 带重试的网络请求函数
const fetchWithRetry = async (url, options, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`尝试请求 ${url}，第${i + 1}次`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error) {
      console.error(`请求失败，第${i + 1}次尝试:`, error.message);
      
      if (i === retries - 1) {
        // 最后一次尝试失败
        throw error;
      }
      
      // 等待后重试
      console.log(`等待${delay}ms后重试...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5; // 递增延迟
    }
  }
};

export const vanceAIUpload = async (imageFile, apiToken) => {
  if (!apiToken) {
    throw new Error('VanceAI API Token 未配置');
  }

  console.log('VanceAI上传开始:', {
    fileName: imageFile.name,
    fileSize: imageFile.size,
    fileType: imageFile.type
  });

  const formData = new FormData();
  formData.append('api_token', apiToken);
  formData.append('file', imageFile);

  try {
    const response = await fetchWithRetry(API_ENDPOINTS.VANCE_AI_UPLOAD, {
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
      }
    }, 3, 2000);

    console.log('VanceAI上传响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息');
      console.error('VanceAI上传HTTP错误:', errorText);
      throw new Error(`上传失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('VanceAI上传响应:', result);
    
    if (result.code !== 200) {
      console.error('VanceAI上传业务错误:', result);
      throw new Error(result.message || `上传失败，错误码: ${result.code}`);
    }

    console.log('VanceAI上传成功，uid:', result.data.uid);
    return result.data.uid;
  } catch (error) {
    console.error('VanceAI 上传错误:', error);
    
    // 提供更友好的错误信息
    if (error.name === 'AbortError') {
      throw new Error('上传超时，请检查网络连接后重试');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('网络连接失败，请检查网络状态后重试');
    } else if (error.message.includes('ERR_TIMED_OUT')) {
      throw new Error('请求超时，请稍后重试');
    }
    
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

  // 尝试简化的配置格式
  const jconfig = {
    "job": "enlarge",
    "config": {
      "module": "enlarge",
      "module_params": {
        "model_name": "EnlargeStable",
        "scale": scale
      },
      "out_params": {}
    }
  };
  
  // 如果有高级参数，再添加
  if (suppress_noise !== undefined && suppress_noise !== null) {
    jconfig.config.module_params.suppress_noise = Number(suppress_noise);
  }
  if (remove_blur !== undefined && remove_blur !== null) {
    jconfig.config.module_params.remove_blur = Number(remove_blur);
  }
  
  // 验证参数
  console.log('处理参数验证:', {
    model_name: jconfig.config.module_params.model_name,
    suppress_noise: jconfig.config.module_params.suppress_noise,
    remove_blur: jconfig.config.module_params.remove_blur,
    scale: jconfig.config.module_params.scale,
    scale_type: typeof jconfig.config.module_params.scale,
    suppress_noise_type: typeof jconfig.config.module_params.suppress_noise,
    remove_blur_type: typeof jconfig.config.module_params.remove_blur
  });

  console.log('VanceAI处理任务提交:', {
    uid,
    params,
    jconfig: JSON.stringify(jconfig)
  });

  const formData = new FormData();
  formData.append('api_token', apiToken);
  formData.append('uid', uid);
  formData.append('jconfig', JSON.stringify(jconfig));

  try {
    const response = await fetchWithRetry(API_ENDPOINTS.VANCE_AI_TRANSFORM, {
      method: 'POST',
      body: formData
    }, 3, 1000);

    console.log('VanceAI处理任务响应状态:', response.status);
    console.log('VanceAI处理任务响应Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息');
      console.error('VanceAI处理任务HTTP错误:', errorText);
      throw new Error(`处理任务提交失败: ${response.status} - ${errorText}`);
    }

    // 检查响应类型
    const contentType = response.headers.get('content-type') || '';
    console.log('响应Content-Type:', contentType);
    
    if (contentType.startsWith('image/')) {
      // 明确的图片类型，直接处理为blob
      console.log('VanceAI API使用同步模式，直接返回处理结果');
      const imageBlob = await response.blob();
      console.log('直接获取处理结果，大小:', imageBlob.size);
      return { mode: 'sync', result: imageBlob };
    } else if (contentType.includes('json')) {
      // 明确的JSON类型
      const result = await response.json();
      console.log('VanceAI处理任务响应:', result);
      
      if (result.code !== 200) {
        console.error('VanceAI处理任务业务错误:', result);
        throw new Error(result.message || `处理任务提交失败，错误码: ${result.code}`);
      }

      console.log('VanceAI处理任务提交成功，trans_id:', result.data.trans_id);
      return { mode: 'async', trans_id: result.data.trans_id };
    } else {
      // 不确定的类型，先尝试作为图片数据
      console.log('未知Content-Type，尝试作为图片数据处理');
      try {
        const imageBlob = await response.blob();
        console.log('成功获取图片数据，大小:', imageBlob.size);
        
        // 检查blob是否真的是图片数据
        if (imageBlob.size > 1000) { // 假设真实图片至少1KB
          return { mode: 'sync', result: imageBlob };
        } else {
          throw new Error('数据大小异常，可能不是图片');
        }
      } catch (blobError) {
        console.error('作为图片处理失败:', blobError.message);
        throw new Error('响应数据格式无法识别');
      }
    }
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
    const response = await fetchWithRetry(API_ENDPOINTS.VANCE_AI_PROGRESS, {
      method: 'POST',
      body: formData
    }, 2, 500);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '无法读取错误信息');
      console.error('VanceAI进度查询HTTP错误:', errorText);
      throw new Error(`进度查询失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('VanceAI进度查询响应:', result);
    
    if (result.code !== 200) {
      console.error('VanceAI进度查询业务错误:', result);
      throw new Error(result.message || `进度查询失败，错误码: ${result.code}`);
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
  
  console.log('VanceAI完整处理流程开始:', {
    fileName: imageFile?.name,
    fileSize: imageFile?.size,
    params,
    hasApiToken: !!apiToken
  });
  
  if (!apiToken || apiToken === 'your_vance_ai_api_token_here') {
    throw new Error('VanceAI API Token 未配置');
  }

  try {
    // 步骤0: 网络连接检查
    await checkNetworkConnection();
    
    // 步骤1: 上传图片
    onProgress?.({ step: 1, progress: 10, message: '正在上传图片到VanceAI...' });
    const uid = await vanceAIUpload(imageFile, apiToken);
    
    // 步骤2: 提交处理任务
    onProgress?.({ step: 2, progress: 20, message: '正在提交处理任务...' });
    const enlargeResult = await vanceAIEnlarge(uid, apiToken, params);
    
    // 检查是同步还是异步模式
    if (enlargeResult.mode === 'sync') {
      // 同步模式，直接返回结果
      console.log('同步模式处理完成');
      onProgress?.({ step: 4, progress: 100, message: '处理完成！' });
      return enlargeResult.result;
    }
    
    // 异步模式，继续轮询
    const transId = enlargeResult.trans_id;
    console.log('异步模式，开始轮询，trans_id:', transId);
    
    // 步骤3: 轮询检查进度
    onProgress?.({ step: 3, progress: 30, message: '正在处理图片，请稍候...' });
    
    let attempts = 0;
    const maxAttempts = VANCE_AI_CONFIG.POLLING.MAX_ATTEMPTS;
    console.log('开始轮询，最大尝试次数:', maxAttempts);
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, VANCE_AI_CONFIG.POLLING.INTERVAL));
      
      const progressData = await vanceAICheckProgress(transId, apiToken);
      const status = progressData.status;
      
      console.log(`轮询第${attempts + 1}次，状态:`, status, '数据:', progressData);
      
      // 计算进度百分比 (30% - 90%)
      const progressPercent = 30 + (attempts / maxAttempts) * 60;
      
      if (status === VANCE_AI_CONFIG.JOB_STATUS.FINISH) {
        // 处理完成，下载结果
        console.log('处理完成，检查下载URL字段:', progressData);
        onProgress?.({ step: 4, progress: 95, message: '正在下载处理结果...' });
        
        // 检查多种可能的URL字段名
        const downloadUrl = progressData.result_url || 
                           progressData.download_url || 
                           progressData.url || 
                           progressData.output_url ||
                           progressData.result;
        
        if (!downloadUrl) {
          // 如果没有直接的下载URL，尝试通过trans_id构造下载请求
          console.log('未找到直接下载URL，尝试通过API获取结果');
          
          // 构造下载请求
          const downloadFormData = new FormData();
          downloadFormData.append('api_token', apiToken);
          downloadFormData.append('trans_id', transId);
          
          try {
            // 方法1: 尝试通过download端点获取结果
            const downloadResponse = await fetch('https://api-service.vanceai.com/web_api/v1/download', {
              method: 'POST',
              body: downloadFormData
            });
            
            if (downloadResponse.ok) {
              const downloadResult = await downloadResponse.json();
              console.log('download端点响应:', downloadResult);
              
              if (downloadResult.code === 200 && downloadResult.data && downloadResult.data.download_url) {
                const resultResponse = await fetch(downloadResult.data.download_url);
                if (resultResponse.ok) {
                  const resultBlob = await resultResponse.blob();
                  console.log('通过download端点获取结果成功，大小:', resultBlob.size);
                  onProgress?.({ step: 4, progress: 100, message: '处理完成！' });
                  return resultBlob;
                }
              }
            } else {
              console.error('download端点HTTP错误:', downloadResponse.status);
            }
            
            // 方法2: 尝试直接通过progress端点的其他字段
            console.log('尝试重新查询progress，寻找其他字段');
            const retryProgressData = await vanceAICheckProgress(transId, apiToken);
            console.log('重新查询progress结果:', retryProgressData);
            
            // 检查是否有其他可能的URL字段
            const possibleUrls = [
              retryProgressData.result_url,
              retryProgressData.download_url, 
              retryProgressData.output_url,
              retryProgressData.file_url,
              retryProgressData.image_url
            ].filter(url => url && typeof url === 'string');
            
            if (possibleUrls.length > 0) {
              console.log('找到可能的下载URL:', possibleUrls[0]);
              const resultResponse = await fetch(possibleUrls[0]);
              if (resultResponse.ok) {
                const resultBlob = await resultResponse.blob();
                console.log('通过重新查询获取结果成功，大小:', resultBlob.size);
                onProgress?.({ step: 4, progress: 100, message: '处理完成！' });
                return resultBlob;
              }
            }
            
          } catch (downloadError) {
            console.error('尝试download端点失败:', downloadError);
          }
          
          throw new Error('处理完成但无法获取结果文件，API可能缺少下载URL');
        }
        
        console.log('找到下载URL:', downloadUrl);
        const resultResponse = await fetch(downloadUrl);
        if (!resultResponse.ok) {
          throw new Error(`下载处理结果失败: ${resultResponse.status}`);
        }
        
        const resultBlob = await resultResponse.blob();
        console.log('结果下载成功，大小:', resultBlob.size);
        onProgress?.({ step: 4, progress: 100, message: '处理完成！' });
        
        return resultBlob;
        
      } else if (status === VANCE_AI_CONFIG.JOB_STATUS.FATAL) {
        console.error('处理失败，状态为FATAL，完整数据:', progressData);
        
        // 尝试获取更详细的错误信息
        let errorMessage = '图片处理失败';
        
        if (progressData.message) {
          errorMessage += `: ${progressData.message}`;
        } else if (progressData.error) {
          errorMessage += `: ${progressData.error}`;
        } else if (progressData.error_message) {
          errorMessage += `: ${progressData.error_message}`;
        } else {
          // 常见的FATAL错误原因
          errorMessage += ': 可能的原因包括图片格式不支持、图片损坏或处理参数错误';
        }
        
        // 添加文件大小信息帮助诊断
        if (progressData.filesize === 0) {
          errorMessage += ' (文件大小为0，可能是图片处理失败)';
        }
        
        throw new Error(errorMessage);
        
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
        console.warn('未知状态:', status, '继续等待...');
        attempts++;
      }
    }
    
    console.error('处理超时，达到最大尝试次数:', maxAttempts);
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