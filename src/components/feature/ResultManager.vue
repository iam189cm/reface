<template>
  <div class="result-manager">
    <!-- 结果管理头部 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            处理结果
          </h3>
          <p class="text-sm text-gray-600">
            管理和下载AI处理结果
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <Button 
          v-if="results.length > 0"
          type="secondary" 
          size="small" 
          @click="clearAllResults"
        >
          清空历史
        </Button>
        <Button 
          type="secondary" 
          size="small" 
          :loading="isRefreshing"
          @click="refreshResults"
        >
          刷新
        </Button>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="results.length === 0"
      class="text-center py-12"
    >
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h4 class="text-lg font-medium text-gray-900 mb-2">
        暂无处理结果
      </h4>
      <p class="text-gray-600 mb-6">
        使用AI功能处理图片后，结果将在这里显示
      </p>
      <Button
        type="primary"
        @click="$emit('start-processing')"
      >
        开始处理图片
      </Button>
    </div>

    <!-- 结果列表 -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- 筛选和排序 -->
      <div class="glass-effect rounded-xl p-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- 筛选器 -->
          <div class="flex items-center space-x-4">
            <select
              v-model="filterService"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="">
                所有功能
              </option>
              <option
                v-for="service in uniqueServices"
                :key="service"
                :value="service"
              >
                {{ getServiceName(service) }}
              </option>
            </select>
            
            <select
              v-model="filterStatus"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="">
                所有状态
              </option>
              <option value="completed">
                已完成
              </option>
              <option value="failed">
                失败
              </option>
            </select>
          </div>
          
          <!-- 排序 -->
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-600">排序:</label>
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="created_at">
                创建时间
              </option>
              <option value="service_type">
                功能类型
              </option>
              <option value="processing_time">
                处理时间
              </option>
            </select>
            <Button
              type="secondary"
              size="small"
              @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
            >
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </Button>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-xl font-bold text-gray-900">
                {{ filteredResults.length }}
              </div>
              <div class="text-sm text-gray-500">
                结果总数
              </div>
            </div>
            <div>
              <div class="text-xl font-bold text-green-600">
                {{ completedResults.length }}
              </div>
              <div class="text-sm text-gray-500">
                成功处理
              </div>
            </div>
            <div>
              <div class="text-xl font-bold text-red-600">
                {{ failedResults.length }}
              </div>
              <div class="text-sm text-gray-500">
                处理失败
              </div>
            </div>
            <div>
              <div class="text-xl font-bold text-blue-600">
                {{ totalCreditsUsed }}
              </div>
              <div class="text-sm text-gray-500">
                消耗积分
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果网格 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ResultCard
          v-for="result in paginatedResults"
          :key="result.task_id"
          :result="result"
          @download="downloadResult"
          @delete="deleteResult"
          @reprocess="reprocessResult"
          @share="shareResult"
        />
      </div>

      <!-- 分页 -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center"
      >
        <div class="flex items-center space-x-2">
          <Button
            type="secondary"
            size="small"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </Button>
          <span class="text-sm text-gray-600">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <Button
            type="secondary"
            size="small"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Button from '../ui/Button.vue'
import { useNeroAIServices } from '../../composables/business/useNeroAIServices.js'
import { useNotification } from '../../composables/ui/useNotification.js'

// 结果卡片组件
const ResultCard = {
  template: `
    <div class="glass-effect rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
      <!-- 预览图片 -->
      <div class="relative h-48 bg-gray-100 overflow-hidden">
        <img
          v-if="result.result?.output"
          :src="result.result.output"
          :alt="getServiceName(result.service_type)"
          class="w-full h-full object-cover"
          @error="handleImageError"
        >
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <div class="text-sm">无预览</div>
          </div>
        </div>
        
        <!-- 状态标识 -->
        <div class="absolute top-3 left-3">
          <StatusBadge :status="result.status" />
        </div>
        
        <!-- 快速操作 -->
        <div class="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity">
          <div class="flex space-x-1">
            <button
              v-if="result.status === 'done'"
              @click="$emit('download')"
              class="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
            >
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 结果信息 -->
      <div class="p-4">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-gray-900 truncate mb-1">
              {{ getServiceName(result.service_type) }}
            </h4>
            <p class="text-sm text-gray-500">
              {{ formatTime(result.created_at) }}
            </p>
          </div>
          <div class="text-right text-sm text-gray-500">
            <div>{{ result.result?.processing_time || 0 }}ms</div>
            <div>{{ result.result?.credits_consumed || 1 }} 积分</div>
          </div>
        </div>
        
        <!-- 元数据 -->
        <div v-if="result.result?.original_size" class="text-xs text-gray-500 mb-3">
          <div class="grid grid-cols-2 gap-2">
            <div>原始: {{ result.result.original_size.width }}×{{ result.result.original_size.height }}</div>
            <div v-if="result.result.processed_size">
              处理: {{ result.result.processed_size.width }}×{{ result.result.processed_size.height }}
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center justify-between">
          <div class="flex space-x-2">
            <Button
              v-if="result.status === 'done'"
              type="primary"
              size="small"
              @click="$emit('download')"
            >
              下载
            </Button>
            <Button
              type="secondary"
              size="small"
              @click="$emit('reprocess')"
            >
              重新处理
            </Button>
          </div>
          <div class="flex space-x-1">
            <button
              @click="$emit('share')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
            </button>
            <button
              @click="$emit('delete')"
              class="text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  props: ['result'],
  emits: ['download', 'delete', 'reprocess', 'share'],
  setup() {
    const getServiceName = (serviceType) => {
      const serviceNames = {
        'BackgroundRemover': '背景移除',
        'ImageUpscaler:Standard': '标准放大',
        'ImageUpscaler:Photograph': '照片放大',
        'ImageUpscaler:Anime': '动漫放大',
        'ImageUpscaler:FaceEnhancement': '人脸增强',
        'FaceRestoration': '面部修复',
        'ImageDenoiser': '图像降噪',
        'ScratchFix': '划痕修复',
        'ColorizePhoto': '黑白上色',
        'Cartoon': '卡通化',
        'FaceDetection': '人脸检测',
        'ImageCompressor': '图像压缩'
      }
      return serviceNames[serviceType] || serviceType
    }
    
    const formatTime = (timeString) => {
      if (!timeString) return '-'
      const date = new Date(timeString)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
      return date.toLocaleDateString()
    }
    
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }
    
    return {
      getServiceName,
      formatTime,
      handleImageError
    }
  }
}

// 状态标识组件
const StatusBadge = {
  template: `
    <span 
      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
      :class="badgeClass"
    >
      {{ statusText }}
    </span>
  `,
  props: ['status'],
  computed: {
    badgeClass() {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        running: 'bg-blue-100 text-blue-800', 
        done: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
      return classes[this.status] || classes.pending
    },
    statusText() {
      const texts = {
        pending: '等待中',
        running: '处理中',
        done: '已完成', 
        failed: '失败'
      }
      return texts[this.status] || '未知'
    }
  }
}

export default {
  name: 'ResultManager',
  components: {
    Button,
    ResultCard,
    StatusBadge
  },
  
  emits: ['start-processing'],
  
  setup(props, { emit }) {
    const neroAI = useNeroAIServices()
    const { showSuccess, showError, showWarning } = useNotification()
    
    // 响应式数据
    const results = ref([])
    const isRefreshing = ref(false)
    const filterService = ref('')
    const filterStatus = ref('')
    const sortBy = ref('created_at')
    const sortOrder = ref('desc')
    const currentPage = ref(1)
    const pageSize = 12
    
    // 计算属性
    const uniqueServices = computed(() => {
      const services = [...new Set(results.value.map(r => r.service_type))]
      return services.sort()
    })
    
    const filteredResults = computed(() => {
      let filtered = results.value
      
      // 按服务类型筛选
      if (filterService.value) {
        filtered = filtered.filter(r => r.service_type === filterService.value)
      }
      
      // 按状态筛选
      if (filterStatus.value) {
        filtered = filtered.filter(r => r.status === filterStatus.value)
      }
      
      // 排序
      filtered.sort((a, b) => {
        let aValue = a[sortBy.value]
        let bValue = b[sortBy.value]
        
        if (sortBy.value === 'created_at') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        } else if (sortBy.value === 'processing_time') {
          aValue = a.result?.processing_time || 0
          bValue = b.result?.processing_time || 0
        }
        
        if (sortOrder.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      return filtered
    })
    
    const paginatedResults = computed(() => {
      const start = (currentPage.value - 1) * pageSize
      const end = start + pageSize
      return filteredResults.value.slice(start, end)
    })
    
    const totalPages = computed(() => {
      return Math.ceil(filteredResults.value.length / pageSize)
    })
    
    const completedResults = computed(() => {
      return results.value.filter(r => r.status === 'done')
    })
    
    const failedResults = computed(() => {
      return results.value.filter(r => r.status === 'failed')
    })
    
    const totalCreditsUsed = computed(() => {
      return results.value.reduce((total, result) => {
        return total + (result.result?.credits_consumed || 1)
      }, 0)
    })
    
    // 方法
    const refreshResults = async () => {
      isRefreshing.value = true
      
      try {
        // 从服务获取处理历史
        const history = neroAI.getProcessingHistory()
        results.value = history || []
        
        showSuccess('结果已刷新')
      } catch (error) {
        console.error('刷新结果失败:', error)
        showError('刷新失败')
      } finally {
        isRefreshing.value = false
      }
    }
    
    const clearAllResults = () => {
      if (confirm('确定要清空所有处理结果吗？此操作不可恢复。')) {
        neroAI.clearProcessingHistory()
        results.value = []
        showSuccess('已清空所有结果')
      }
    }
    
    const downloadResult = (result) => {
      if (neroAI.downloadResult && result.result?.output) {
        neroAI.downloadResult(result)
        showSuccess('开始下载')
      } else {
        showError('无法下载此结果')
      }
    }
    
    const deleteResult = (result) => {
      if (confirm('确定要删除这个处理结果吗？')) {
        const index = results.value.findIndex(r => r.task_id === result.task_id)
        if (index > -1) {
          results.value.splice(index, 1)
          showSuccess('结果已删除')
        }
      }
    }
    
    const reprocessResult = (result) => {
      emit('start-processing')
      showSuccess('已切换到处理界面')
    }
    
    const shareResult = (result) => {
      if (result.result?.output) {
        // 复制结果URL到剪贴板
        if (navigator.clipboard) {
          navigator.clipboard.writeText(result.result.output)
            .then(() => showSuccess('结果链接已复制到剪贴板'))
            .catch(() => showError('复制失败'))
        } else {
          showWarning('浏览器不支持剪贴板功能')
        }
      }
    }
    
    const getServiceName = (serviceType) => {
      const serviceNames = {
        'BackgroundRemover': '背景移除',
        'ImageUpscaler:Standard': '标准放大',
        'ImageUpscaler:Photograph': '照片放大',
        'ImageUpscaler:Anime': '动漫放大',
        'ImageUpscaler:FaceEnhancement': '人脸增强',
        'FaceRestoration': '面部修复',
        'ImageDenoiser': '图像降噪',
        'ScratchFix': '划痕修复',
        'ColorizePhoto': '黑白上色',
        'Cartoon': '卡通化',
        'FaceDetection': '人脸检测',
        'ImageCompressor': '图像压缩'
      }
      return serviceNames[serviceType] || serviceType
    }
    
    // 生命周期
    onMounted(() => {
      refreshResults()
    })
    
    return {
      results,
      isRefreshing,
      filterService,
      filterStatus,
      sortBy,
      sortOrder,
      currentPage,
      uniqueServices,
      filteredResults,
      paginatedResults,
      totalPages,
      completedResults,
      failedResults,
      totalCreditsUsed,
      refreshResults,
      clearAllResults,
      downloadResult,
      deleteResult,
      reprocessResult,
      shareResult,
      getServiceName
    }
  }
}
</script>
