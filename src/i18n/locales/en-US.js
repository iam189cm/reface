/**
 * English Language Pack (en-US)
 * Reface AI Image Enhancement Tool
 */

export default {
  // Common vocabulary
  common: {
    buttons: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      submit: 'Submit',
      reset: 'Reset',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      retry: 'Retry',
      refresh: 'Refresh',
      upload: 'Upload',
      download: 'Download',
      preview: 'Preview',
      apply: 'Apply',
      clear: 'Clear'
    },
    status: {
      loading: 'Loading...',
      processing: 'Processing...',
      success: 'Success',
      failed: 'Failed',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      completed: 'Completed',
      pending: 'Pending',
      cancelled: 'Cancelled'
    },
    time: {
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      thisYear: 'This Year'
    }
  },

  // Navigation and Layout
  navigation: {
    home: 'Home',
    editor: 'Editor',
    aiTools: 'AI Tools',
    aiToolsTitle: 'Smart Image Processing',
    aiToolsDesc: 'Professional AI technology for beautiful images',
    pricing: 'Pricing',
    admin: 'Admin Panel',
    help: 'Help',
    startEditing: 'Start Editing',
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings'
  },

  // Homepage
  home: {
    title: 'Make Your Photos Beautiful',
    subtitle: 'Beautify your photos in simple steps',
    features: {
      aiBackground: 'AI Background Removal',
      imageEnlarger: 'AI Image Enlarger',
      filters: 'Beauty Filters',
      realtime: 'Real-time Preview'
    }
  },

  // Authentication
  auth: {
    login: {
      title: 'Login to Reface',
      email: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up Now'
    },
    register: {
      title: 'Create Reface Account',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      hasAccount: 'Already have an account?',
      signIn: 'Sign In Now'
    },
    messages: {
      loginSuccess: 'Login successful',
      logoutSuccess: 'Successfully logged out',
      registerSuccess: 'Registration successful',
      invalidCredentials: 'Invalid email or password',
      emailRequired: 'Please enter email address',
      passwordRequired: 'Please enter password'
    }
  },

  // AI Features
  ai: {
    backgroundRemover: {
      title: 'AI Background Removal',
      description: 'Intelligently identify and remove image background',
      button: 'Remove Background',
      processing: 'Removing background...',
      success: 'Background removed successfully',
      error: 'Failed to remove background',
      apiKeyLabel: 'Remove.bg API Key (Development Mode)',
      apiKeyPlaceholder: 'Enter Remove.bg API Key',
      apiKeyNote: 'Production environment will use server-side API Key'
    },
    imageEnlarger: {
      title: 'AI Image Enlarger',
      description: 'Enlarge images using AI technology while maintaining clarity',
      button: 'Enlarge Image',
      processing: 'Enlarging image...',
      success: 'Image enlarged successfully',
      error: 'Failed to enlarge image',
      scaleOptions: {
        '2x': '2x Enlargement',
        '4x': '4x Enlargement',
        '8x': '8x Enlargement'
      },
      resetButton: '🔄 Reset to Recommended',
      advancedSettings: 'Advanced Settings',
      needsUpgrade: 'This feature requires upgrade',
      upgradeHighScale: 'Upgrade to unlock high-scale enlargement'
    }
  },

  // Trial and Upgrade
  trial: {
    status: {
      remaining: 'Remaining trials',
      exhausted: 'Trial quota exhausted',
      firstTime: 'First time use',
      dailyLimit: 'Daily limit'
    },
    messages: {
      success: '{description} successful, consumed {cost} trial(s), {remaining} remaining today',
      exhausted: 'Daily trial quota exhausted, can continue tomorrow',
      warning: 'This feature requires {cost} trial(s), you have {remaining} left',
      failed: 'Failed to use trial quota'
    },
    upgrade: {
      title: 'Unlock More Features',
      description: 'Enjoy unlimited AI background removal after upgrade',
      features: {
        unlimited: 'Unlimited AI Background Removal',
        quality: 'High-quality Image Processing',
        support: 'Priority Customer Support'
      },
      pricing: {
        amount: '$1.99',
        description: 'Trial Pack / 10 Processing'
      },
      buttons: {
        upgrade: 'Upgrade Now',
        notNow: 'Not Now',
        unlockMore: '✨ Upgrade to unlock more',
        unlockFeature: '✨ Upgrade to unlock {feature}'
      },
      paymentNote: 'Payment feature in development, stay tuned',
      paymentDeveloping: 'Payment feature in development, stay tuned!'
    }
  },

  // Image Processing
  image: {
    upload: {
      title: 'Upload Image',
      dragHint: 'Drag image here, or click to select',
      formats: 'Supports JPG, PNG, WebP formats',
      maxSize: 'File size up to 10MB',
      selectFile: 'Select File',
      uploading: 'Uploading...',
      uploadSuccess: 'Upload successful',
      uploadError: 'Upload failed',
      invalidFormat: 'Unsupported file format',
      fileTooLarge: 'File size exceeds limit'
    },
    editor: {
      brightness: 'Brightness',
      contrast: 'Contrast',
      saturation: 'Saturation',
      blur: 'Blur',
      opacity: 'Opacity',
      reset: 'Reset',
      apply: 'Apply',
      save: 'Save',
      download: 'Download'
    },
    canvas: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetZoom: 'Reset Zoom',
      fitToScreen: 'Fit to Screen'
    }
  },

  // Notifications
  notifications: {
    types: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    actions: {
      dismiss: 'Dismiss',
      viewDetails: 'View Details',
      retry: 'Retry'
    }
  },

  // User Types
  userTypes: {
    FREE: 'Free User',
    STARTER: 'Starter',
    PRO: 'Pro',
    BUSINESS: 'Business',
    ADMIN: 'Admin'
  },

  // Error Pages
  errors: {
    404: {
      title: 'Page Not Found',
      message: 'Sorry, the page you are looking for does not exist',
      backHome: 'Back to Home'
    },
    500: {
      title: 'Server Error',
      message: 'Server error occurred, please try again later',
      retry: 'Retry'
    },
    network: {
      title: 'Network Error',
      message: 'Network connection error, please check your network settings',
      retry: 'Retry'
    }
  },

  // AI Tools
  tools: {
    removeBackground: {
      name: 'AI Background Remover',
      desc: 'Smart background removal technology'
    },
    imageEnlarger: {
      name: 'AI Image Enlarger',
      desc: 'AI-powered lossless image upscaling'
    },
    imageFilter: {
      name: 'Real-time Filters',
      desc: 'Beauty filters with live preview'
    }
  },

  // Product Introduction
  intro: {
    title: 'Professional AI Image Processing',
    subtitle: 'Make every photo more perfect with the most advanced AI image processing technology',
    removeBackgroundDesc: 'Using advanced AI technology to intelligently identify subjects and precisely remove backgrounds',
    imageEnlargerDesc: 'Losslessly upscale images up to 8x using deep learning algorithms while maintaining clarity and details',
    oneClick: 'One-Click Smart Processing',
    highQuality: 'Ultra HD Quality',
    quickStart: 'Get Started Now',
    freeTrialInfo: '3 free trials daily, no registration required'
  },

  // Pricing Page
  pricing: {
    title: 'Choose Your Perfect Plan',
    subtitle: 'Flexible pricing options to meet different user needs, all plans include core AI features',
    recommended: 'Recommended',
    currentPlan: 'Current Plan',
    choosePlan: 'Choose Plan',
    free: {
      name: 'Free Trial',
      price: '0',
      period: 'day',
      desc: 'Experience basic features',
      features: [
        '3 daily AI processings',
        'AI Background Removal',
        'AI Image Upscaling (2x)'
      ]
    },
    basic: {
      name: 'Starter Pack',
      price: '9.9',
      period: 'credits',
      desc: '10 AI processing credits',
      features: [
        '10 AI processings',
        'AI Background Removal',
        'AI Image Upscaling (2x)',
        'HD quality output'
      ]
    },
    standard: {
      name: 'Standard Pack',
      price: '39.9',
      period: 'credits',
      desc: '50 AI processing credits',
      features: [
        '50 AI processings',
        'AI Background Removal',
        'AI Image Upscaling (up to 4x)',
        'Ultra HD quality output',
        'Priority processing'
      ]
    },
    premium: {
      name: 'Premium Pack',
      price: '69.9',
      period: 'credits',
      desc: '100 AI processing credits',
      features: [
        '100 AI processings',
        'AI Background Removal',
        'AI Image Upscaling (up to 8x)',
        'Ultra HD quality output',
        'Priority processing',
        'Batch processing'
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: 'How to purchase AI processing credits?',
      a1: 'Click the "Choose Plan" button, select a suitable plan and complete the purchase. We support various payment methods including PayPal and credit cards.',
      q2: 'Do credits expire?',
      a2: 'Purchased credits are permanent and never expire. You can use your AI processing credits anytime.',
      q3: 'Can I get a refund?',
      a3: 'Used credits cannot be refunded due to computational resources consumed. Unused credits can be refunded within 7 days of purchase.'
    }
  },

  // Help Page
  help: {
    title: 'Help Center',
    subtitle: 'Get started with Reface quickly and learn how to use AI features to make your photos perfect',
    sections: {
      title: 'Help Categories',
      gettingStarted: 'Getting Started',
      aiTools: 'AI Tools Usage',
      faq: 'FAQ',
      contact: 'Contact Support'
    },
    gettingStarted: {
      title: 'Getting Started',
      step1: {
        title: 'Upload Image',
        desc: 'Click the upload area or drag image files to the page. Supports JPG, PNG, WebP formats, up to 10MB.'
      },
      step2: {
        title: 'Select AI Function',
        desc: 'Choose the desired AI function from the right panel, such as background removal or image upscaling, and adjust related parameters.'
      },
      step3: {
        title: 'Process and Download',
        desc: 'Click the start processing button, wait for AI processing to complete, then preview the result and download the processed image.'
      }
    },
    aiTools: {
      title: 'AI Tools Guide',
      removeBackground: {
        title: 'AI Background Removal',
        desc: 'Intelligently identifies image subjects and precisely removes backgrounds, suitable for portraits, objects, and various types of images.',
        tip1: 'Choose images with clear subjects and simple backgrounds for better results',
        tip2: 'Processed images are automatically saved in PNG format with transparent background support'
      },
      imageEnlarger: {
        title: 'AI Image Upscaling',
        desc: 'Uses deep learning technology to losslessly upscale image dimensions while maintaining clarity and details.',
        tip1: 'Supports 2x, 4x, 8x upscaling ratios, free users limited to 2x',
        tip2: 'Recommend original image size not exceeding 2000x2000 pixels for best results'
      }
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: 'Why did my image processing fail?',
      a1: 'Please check if the image format is JPG, PNG, or WebP, and if the file size exceeds 10MB. If the problem persists, please contact customer service.',
      q2: 'What are the free trial limitations?',
      a2: 'Free users can use 3 AI processings per day, image upscaling is limited to 2x, and results are in HD quality.',
      q3: 'How to get more AI processing credits?',
      a3: 'You can purchase paid plans to get more AI processing credits. Credits are permanent and support higher upscaling ratios.',
      q4: 'What is the quality of processed images?',
      a4: 'AI-processed images maintain original quality. Background removal outputs PNG transparent format, and image upscaling uses AI algorithms to preserve detail clarity.'
    },
    contact: {
      title: 'Contact Us',
      email: {
        title: 'Email Support',
        desc: 'Have questions? Send us an email'
      },
      chat: {
        title: 'Live Chat',
        desc: 'Online replies 9:00-18:00 on weekdays',
        button: 'Start Chat'
      }
    }
  },

  // Development Debug
  debug: {
    development: 'Development Mode',
    serviceHealth: 'Service Status',
    healthy: 'Healthy',
    unhealthy: 'Unhealthy',
    configErrors: 'Config Errors',
    aiServicesCount: 'AI Services Count'
  }
}
