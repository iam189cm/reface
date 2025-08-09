<template>
  <div class="bg-white/70 backdrop-blur-md rounded-xl shadow-sm p-4 border border-gray-100/50">
    <h3 class="text-base font-medium text-gray-800 mb-3 flex items-center">
      <div :class="iconClasses">
        <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <!-- 星星图标 -->
          <path v-if="icon === 'star'" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          
          <!-- 闪电图标 -->
          <path v-else-if="icon === 'lightning'" fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          
          <!-- 太阳图标 -->
          <path v-else-if="icon === 'sun'" fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          
          <!-- 调整图标 -->
          <path v-else-if="icon === 'adjust'" fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3.22l.123.489.804.804A1 1 0 0111.28 17.7l-.707-.707-.543-.543H6a2 2 0 01-2-2V5zm3.2 6.2A1 1 0 018 10h8a1 1 0 01.8 1.6l-1 1.25a1 1 0 01-1.6 0L12 10.8 9.8 12.8a1 1 0 01-1.6 0l-2-2.5z" clip-rule="evenodd" />
          
          <!-- 颜色图标 -->
          <path v-else-if="icon === 'color'" fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zM3 15a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm6-11a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm2.5 5a2.5 2.5 0 015 0 .75.75 0 11-1.5 0 1 1 0 00-2 0 .75.75 0 01-1.5 0zm4.5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
      </div>
      {{ title }}
    </h3>
    
    <!-- 滑块内容 -->
    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FilterCard',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'pink',
      validator: (value) => ['pink', 'purple', 'blue', 'green'].includes(value)
    }
  },
  setup(props) {
    // 图标样式
    const iconClasses = computed(() => {
      const baseClasses = 'w-5 h-5 rounded-full flex items-center justify-center mr-2'
      
      const colorClasses = {
        pink: 'bg-pink-100',
        purple: 'bg-purple-100', 
        blue: 'bg-blue-100',
        green: 'bg-green-100'
      }
      
      return `${baseClasses} ${colorClasses[props.color] || colorClasses.pink}`
    })
    
    return {
      iconClasses
    }
  }
}
</script>
