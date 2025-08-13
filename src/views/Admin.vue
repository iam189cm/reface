<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- 管理员头部 -->
    <div class="mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">管理员面板</h1>
            <p class="text-gray-600 mt-1">系统管理和用户监控</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              <span>在线管理员：</span>
              <span class="font-medium text-green-600">{{ user?.email }}</span>
            </div>
            <div class="h-8 w-px bg-gray-200"></div>
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>刷新数据</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">总用户数</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">今日活跃</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.dailyActiveUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">今日AI使用</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.dailyAIUsage }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">系统告警</p>
            <p class="text-2xl font-semibold text-gray-900">{{ statistics.systemAlerts }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要功能区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 用户管理 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">用户管理</h2>
            <button
              @click="showUserSearch = !showUserSearch"
              class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              {{ showUserSearch ? '收起搜索' : '展开搜索' }}
            </button>
          </div>
          
          <!-- 用户搜索 -->
          <div v-if="showUserSearch" class="mt-4 space-y-3">
            <div class="flex space-x-3">
              <input
                v-model="userSearchQuery"
                type="text"
                placeholder="搜索用户邮箱、手机号或ID..."
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keyup.enter="searchUsers"
              />
              <button
                @click="searchUsers"
                :disabled="isSearching"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                搜索
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- 用户列表 -->
          <div v-if="isSearching" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p class="text-gray-500 mt-2">搜索中...</p>
          </div>

          <div v-else-if="searchResults.length > 0" class="space-y-3">
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-3">
                <img
                  :src="user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`"
                  :alt="user.email"
                  class="w-8 h-8 rounded-full"
                />
                <div>
                  <p class="font-medium text-gray-900">{{ user.email }}</p>
                  <div class="flex items-center space-x-2 text-sm text-gray-500">
                    <span class="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                      {{ user.user_type }}
                    </span>
                    <span>配额: {{ user.credits_used }}/{{ user.total_quota }}</span>
                    <span v-if="user.phone">• {{ user.phone }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 用户操作按钮 -->
              <div class="flex items-center space-x-2">
                <button
                  @click="showUserDetail(user)"
                  class="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  详情
                </button>
                <button
                  @click="showCreditModal(user)"
                  class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  配额
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  :class="user.user_type === 'BANNED' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                  class="px-2 py-1 text-xs rounded"
                >
                  {{ user.user_type === 'BANNED' ? '解封' : '封禁' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="userSearchQuery && !isSearching" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17H9v-2.25" />
            </svg>
            <p>未找到匹配的用户</p>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>输入关键词搜索用户</p>
          </div>
        </div>
      </div>

      <!-- 使用统计 -->
      <div class="bg-white rounded-xl shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">使用统计</h2>
        </div>

        <div class="p-6">
          <!-- 服务使用排行 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">AI服务使用排行</h3>
            <div class="space-y-2">
              <div
                v-for="service in usageStats.serviceRanking"
                :key="service.type"
                class="flex items-center justify-between"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded-full" :class="service.color"></div>
                  <span class="text-sm text-gray-700">{{ service.name }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium">{{ service.usage }}</span>
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full"
                      :class="service.color.replace('bg-', 'bg-')"
                      :style="{ width: `${service.percentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近事件 -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">最近事件</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="event in recentEvents"
                :key="event.id"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div class="w-2 h-2 rounded-full" :class="getEventStatusColor(event.status)"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs text-gray-900 truncate">{{ event.service_type }}</p>
                  <p class="text-xs text-gray-500">{{ event.user_email }} • {{ formatTime(event.created_at) }}</p>
                </div>
                <div class="text-xs text-gray-400">
                  {{ event.credits_consumed }}配额
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配额管理弹窗 -->
    <div v-if="showCreditManagement" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">管理用户配额</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户</label>
            <p class="text-sm text-gray-600">{{ selectedUser?.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">当前配额</label>
            <p class="text-sm text-gray-900 font-medium">
              {{ selectedUser?.credits_used }}/{{ selectedUser?.total_quota }}
            </p>
          </div>
          
          <div>
            <label for="creditAmount" class="block text-sm font-medium text-gray-700 mb-1">
              调整配额 (正数增加，负数减少)
            </label>
            <input
              id="creditAmount"
              v-model.number="creditAdjustment"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入配额变更数量"
            />
          </div>
          
          <div>
            <label for="creditReason" class="block text-sm font-medium text-gray-700 mb-1">调整原因</label>
            <input
              id="creditReason"
              v-model="creditReason"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入调整原因"
            />
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="closeCreditModal"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="adjustUserCredit"
            :disabled="isAdjusting || !creditAdjustment"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isAdjusting ? '处理中...' : '确认调整' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/modules/auth/authStore.js'
import { useNotification } from '../composables/ui/useNotification.js'

export default {
  name: 'Admin',
  setup() {
    const authStore = useAuthStore()
    const { showSuccess, showError, showInfo } = useNotification()
    
    // 响应式数据
    const isLoading = ref(false)
    const userSearchQuery = ref('')
    const showUserSearch = ref(false)
    const isSearching = ref(false)
    const searchResults = ref([])
    
    // 配额管理
    const showCreditManagement = ref(false)
    const selectedUser = ref(null)
    const creditAdjustment = ref(0)
    const creditReason = ref('')
    const isAdjusting = ref(false)
    
    // 统计数据
    const statistics = ref({
      totalUsers: 0,
      dailyActiveUsers: 0,
      dailyAIUsage: 0,
      systemAlerts: 0
    })
    
    const usageStats = ref({
      serviceRanking: [
        { type: 'remove_background', name: '背景移除', usage: 1248, percentage: 65, color: 'bg-blue-500' },
        { type: 'enlarge_image', name: '图像放大', usage: 892, percentage: 46, color: 'bg-green-500' },
        { type: 'image_filter', name: '图像滤镜', usage: 567, percentage: 29, color: 'bg-purple-500' }
      ]
    })
    
    const recentEvents = ref([])
    
    // 计算属性
    const user = computed(() => authStore.user)
    
    // 权限检查
    const checkAdminPermission = () => {
      if (!authStore.isAdmin) {
        showError('权限不足：需要管理员权限')
        // 这里应该跳转到首页或登录页
        return false
      }
      return true
    }
    
    // 刷新数据
    const refreshData = async () => {
      if (!checkAdminPermission()) return
      
      isLoading.value = true
      try {
        await Promise.all([
          loadStatistics(),
          loadRecentEvents()
        ])
        showSuccess('数据刷新成功')
      } catch (error) {
        console.error('刷新数据失败:', error)
        showError('数据刷新失败')
      } finally {
        isLoading.value = false
      }
    }
    
    // 加载统计数据
    const loadStatistics = async () => {
      // 这里应该调用实际的API
      // 模拟数据
      statistics.value = {
        totalUsers: 2847,
        dailyActiveUsers: 342,
        dailyAIUsage: 1876,
        systemAlerts: 3
      }
    }
    
    // 加载最近事件
    const loadRecentEvents = async () => {
      // 这里应该调用实际的API
      // 模拟数据
      recentEvents.value = [
        {
          id: 1,
          service_type: 'remove_background',
          user_email: 'user1@example.com',
          credits_consumed: 1,
          status: 'completed',
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          service_type: 'enlarge_image',
          user_email: 'user2@example.com',
          credits_consumed: 2,
          status: 'failed',
          created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString()
        }
      ]
    }
    
    // 搜索用户
    const searchUsers = async () => {
      if (!userSearchQuery.value.trim()) {
        showError('请输入搜索关键词')
        return
      }
      
      isSearching.value = true
      try {
        // 这里应该调用实际的API
        // 模拟搜索结果
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        searchResults.value = [
          {
            id: 1,
            email: 'test@example.com',
            user_type: 'FREE',
            credits_used: 2,
            total_quota: 3,
            phone: '+8613812345678',
            avatar_url: null
          }
        ]
        
        showInfo(`找到 ${searchResults.value.length} 个用户`)
      } catch (error) {
        console.error('搜索用户失败:', error)
        showError('搜索用户失败')
      } finally {
        isSearching.value = false
      }
    }
    
    // 显示用户详情
    const showUserDetail = (user) => {
      showInfo(`查看用户详情: ${user.email}`)
      // 这里可以打开详情弹窗或跳转到详情页
    }
    
    // 显示配额管理弹窗
    const showCreditModal = (user) => {
      selectedUser.value = user
      creditAdjustment.value = 0
      creditReason.value = ''
      showCreditManagement.value = true
    }
    
    // 关闭配额管理弹窗
    const closeCreditModal = () => {
      showCreditManagement.value = false
      selectedUser.value = null
      creditAdjustment.value = 0
      creditReason.value = ''
    }
    
    // 调整用户配额
    const adjustUserCredit = async () => {
      if (!selectedUser.value || !creditAdjustment.value) return
      
      isAdjusting.value = true
      try {
        // 这里应该调用实际的API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新本地数据
        const user = searchResults.value.find(u => u.id === selectedUser.value.id)
        if (user) {
          user.total_quota = Math.max(0, user.total_quota + creditAdjustment.value)
        }
        
        showSuccess(`配额调整成功：${creditAdjustment.value > 0 ? '+' : ''}${creditAdjustment.value}`)
        closeCreditModal()
      } catch (error) {
        console.error('配额调整失败:', error)
        showError('配额调整失败')
      } finally {
        isAdjusting.value = false
      }
    }
    
    // 切换用户状态（封禁/解封）
    const toggleUserStatus = async (user) => {
      const action = user.user_type === 'BANNED' ? '解封' : '封禁'
      
      try {
        // 这里应该调用实际的API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 更新本地数据
        user.user_type = user.user_type === 'BANNED' ? 'FREE' : 'BANNED'
        
        showSuccess(`用户${action}成功`)
      } catch (error) {
        console.error(`${action}用户失败:`, error)
        showError(`${action}用户失败`)
      }
    }
    
    // 获取事件状态颜色
    const getEventStatusColor = (status) => {
      const colors = {
        'completed': 'bg-green-400',
        'failed': 'bg-red-400',
        'pending': 'bg-yellow-400'
      }
      return colors[status] || 'bg-gray-400'
    }
    
    // 格式化时间
    const formatTime = (timestamp) => {
      const now = new Date()
      const time = new Date(timestamp)
      const diff = Math.floor((now - time) / 1000 / 60) // 分钟差
      
      if (diff < 1) return '刚刚'
      if (diff < 60) return `${diff}分钟前`
      if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
      return time.toLocaleDateString()
    }
    
    // 初始化
    onMounted(() => {
      if (checkAdminPermission()) {
        refreshData()
      }
    })
    
    return {
      // 数据
      isLoading,
      userSearchQuery,
      showUserSearch,
      isSearching,
      searchResults,
      statistics,
      usageStats,
      recentEvents,
      user,
      
      // 配额管理
      showCreditManagement,
      selectedUser,
      creditAdjustment,
      creditReason,
      isAdjusting,
      
      // 方法
      refreshData,
      searchUsers,
      showUserDetail,
      showCreditModal,
      closeCreditModal,
      adjustUserCredit,
      toggleUserStatus,
      getEventStatusColor,
      formatTime
    }
  }
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
