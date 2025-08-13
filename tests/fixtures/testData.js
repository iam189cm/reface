/**
 * 测试数据
 * 提供各种测试场景的数据
 */

// 用户数据
export const mockUsers = {
  freeUser: {
    id: '1',
    email: 'free@example.com',
    displayName: 'Free User',
    userType: 'FREE',
    avatarUrl: 'https://example.com/avatar1.jpg'
  },
  
  proUser: {
    id: '2', 
    email: 'pro@example.com',
    displayName: 'Pro User',
    userType: 'PRO',
    avatarUrl: 'https://example.com/avatar2.jpg'
  }
}

// 图片数据
export const mockImages = {
  validJpeg: {
    name: 'test.jpg',
    type: 'image/jpeg',
    size: 1024 * 1024, // 1MB
    lastModified: Date.now()
  },
  
  validPng: {
    name: 'test.png',
    type: 'image/png', 
    size: 2 * 1024 * 1024, // 2MB
    lastModified: Date.now()
  },
  
  tooLarge: {
    name: 'huge.jpg',
    type: 'image/jpeg',
    size: 15 * 1024 * 1024, // 15MB
    lastModified: Date.now()
  },
  
  invalidFormat: {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1024 * 1024,
    lastModified: Date.now()
  }
}

// 手机号测试数据
export const mockPhoneNumbers = {
  valid: {
    chinese: '+86 138 0013 8000',
    us: '+1 555 123 4567',
    formatted: '138 0013 8000',
    unformatted: '13800138000'
  },
  
  invalid: {
    tooShort: '123',
    tooLong: '123456789012345',
    invalidChars: 'abc-def-ghij',
    wrongFormat: '138-0013-8000'
  }
}

// API响应数据
export const mockAPIResponses = {
  removeBackground: {
    success: {
      success: true,
      outputUrl: 'https://api.remove.bg/output/test.png',
      credits: { remaining: 2 }
    },
    
    error: {
      success: false,
      error: 'Insufficient credits',
      code: 'CREDIT_EXHAUSTED'
    }
  },
  
  enlargeImage: {
    success: {
      success: true,
      outputUrl: 'https://api.vance.ai/output/enlarged.jpg',
      scale: '2x',
      originalSize: { width: 800, height: 600 },
      outputSize: { width: 1600, height: 1200 }
    }
  }
}

// 试用数据
export const mockTrialData = {
  fresh: {
    maxTrials: 3,
    usedTrials: 0,
    remainingTrials: 3,
    lastResetDate: new Date().toISOString().split('T')[0]
  },
  
  halfUsed: {
    maxTrials: 3,
    usedTrials: 1,
    remainingTrials: 2,
    lastResetDate: new Date().toISOString().split('T')[0]
  },
  
  exhausted: {
    maxTrials: 3,
    usedTrials: 3,
    remainingTrials: 0,
    lastResetDate: new Date().toISOString().split('T')[0]
  }
}

// 创建Mock文件对象
export function createMockFile(data) {
  return new File(['mock-content'], data.name, {
    type: data.type,
    lastModified: data.lastModified
  })
}

// 创建Mock图片URL
export function createMockImageUrl(width = 800, height = 600) {
  return `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAACP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAACP/aAAwDAQACEQMRAD8AfwAA`
}
