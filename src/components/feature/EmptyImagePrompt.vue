<template>
  <div class="text-center py-20">
    <div class="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-12 border border-pink-100">
      <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          class="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        还没有选择图片
      </h2>
      <p class="text-gray-600 mb-6">
        请先回到首页上传一张图片
      </p>
      <Button
        type="primary"
        @click="goToHome"
      >
        返回首页
      </Button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import Button from '../ui/Button.vue'

export default {
  name: 'EmptyImagePrompt',
  components: {
    Button
  },
  setup() {
    const router = useRouter()
    
    const goToHome = () => {
      router.push('/')
    }
    
    return {
      goToHome
    }
  }
}
</script>
