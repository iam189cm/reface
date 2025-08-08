<template>
  <div class="flex space-x-2">
    <!-- 撤销按钮 -->
    <Button
      size="small"
      type="ghost"
      :disabled="!canUndo"
      @click="$emit('undo')"
      title="撤销 (Ctrl+Z)"
    >
      <template #icon>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </template>
    </Button>
    
    <!-- 重做按钮 -->
    <Button
      size="small"
      type="ghost"
      :disabled="!canRedo"
      @click="$emit('redo')"
      title="重做 (Ctrl+Y)"
    >
      <template #icon>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
        </svg>
      </template>
    </Button>
    
    <!-- 重置按钮 -->
    <Button
      size="small"
      type="secondary"
      @click="$emit('reset')"
      title="重置所有调整"
    >
      重置
    </Button>
    
    <!-- 下载按钮 -->
    <Button
      size="small"
      type="primary"
      @click="$emit('download')"
      title="下载图片 (Ctrl+S)"
    >
      下载图片
    </Button>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import Button from '../ui/Button.vue'

export default {
  name: 'ActionToolbar',
  components: {
    Button
  },
  props: {
    canUndo: {
      type: Boolean,
      default: false
    },
    canRedo: {
      type: Boolean,
      default: false
    }
  },
  emits: ['reset', 'download', 'undo', 'redo'],
  setup(props, { emit }) {
    // 键盘快捷键处理
    const handleKeydown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault()
            if (event.shiftKey) {
              // Ctrl+Shift+Z 或 Ctrl+Y 重做
              if (props.canRedo) {
                emit('redo')
              }
            } else {
              // Ctrl+Z 撤销
              if (props.canUndo) {
                emit('undo')
              }
            }
            break
          case 'y':
            event.preventDefault()
            // Ctrl+Y 重做
            if (props.canRedo) {
              emit('redo')
            }
            break
          case 's':
            event.preventDefault()
            // Ctrl+S 下载
            emit('download')
            break
        }
      }
    }
    
    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })
    
    return {}
  }
}
</script>
