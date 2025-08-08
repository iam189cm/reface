<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
    <FeatureCard
      icon="heart"
      title="智能磨皮"
      description="自然磨皮，保持肌理细节"
      color="pink"
    />
    
    <FeatureCard
      icon="bulb"
      title="亮度调节"
      description="精准调节图片亮度对比度"
      color="purple"
    />
    
    <FeatureCard
      icon="check"
      title="一键美白"
      description="自然美白，提升肌肤光泽"
      color="pink"
    />
  </div>
</template>

<script>
// 功能卡片组件
const FeatureCard = {
  props: {
    icon: String,
    title: String,
    description: String,
    color: {
      type: String,
      default: 'pink'
    }
  },
  computed: {
    iconClasses() {
      const baseClasses = 'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'
      const colorClasses = this.color === 'purple' ? 'bg-purple-100' : 'bg-pink-100'
      return `${baseClasses} ${colorClasses}`
    },
    iconColor() {
      return this.color === 'purple' ? 'text-purple-600' : 'text-pink-600'
    }
  },
  template: `
    <div class="bg-white/70 backdrop-blur-md rounded-2xl p-6 text-center border border-pink-100 hover:shadow-lg transition-all duration-300">
      <div :class="iconClasses">
        <svg class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <!-- 心形图标 -->
          <path v-if="icon === 'heart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          
          <!-- 灯泡图标 -->
          <path v-else-if="icon === 'bulb'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          
          <!-- 检查图标 -->
          <path v-else-if="icon === 'check'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
        </svg>
      </div>
      <h3 class="font-semibold text-gray-800 mb-2">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
    </div>
  `
}

export default {
  name: 'FeatureShowcase',
  components: {
    FeatureCard
  }
}
</script>
