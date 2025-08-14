/**
 * 管理后台组合函数
 */

import { ref, computed, onMounted, type Ref } from 'vue'
import { useNotification } from '@/shared/composables/useNotification'
import type { 
  SystemStatistics,
  UserSearchParams,
  UserStatistics,
  CreditAdjustment
} from '../types/admin.types'
import type { PaginatedData } from '@/shared/types'

export function useAdminDashboard() {
  const { showError, showSuccess } = useNotification()

  // 响应式状态
  const isLoading = ref(false)
  const statistics: Ref<SystemStatistics | null> = ref(null)
  const users: Ref<PaginatedData<UserStatistics> | null> = ref(null)
  const selectedUsers: Ref<UserStatistics[]> = ref([])

  // 用户搜索状态
  const searchParams: Ref<UserSearchParams> = ref({
    page: 1,
    pageSize: 20,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // 计算属性
  const hasUsers = computed(() => users.value && users.value.items.length > 0)
  const totalPages = computed(() => users.value?.totalPages || 0)
  const hasSelection = computed(() => selectedUsers.value.length > 0)

  // 加载系统统计信息
  const loadStatistics = async (): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟API调用
      const mockStats: SystemStatistics = {
        totalUsers: 2847,
        activeUsers: 1234,
        newUsersToday: 23,
        totalAIUsage: 15678,
        dailyAIUsage: 342,
        systemAlerts: 2,
        serverStatus: 'healthy',
        uptime: 99.9,
        lastUpdateAt: new Date().toISOString()
      }
      
      statistics.value = mockStats

    } catch (error) {
      showError('加载统计信息失败')
      console.error('Load statistics error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 搜索用户
  const searchUsers = async (params?: Partial<UserSearchParams>): Promise<void> => {
    try {
      isLoading.value = true
      
      // 更新搜索参数
      if (params) {
        searchParams.value = { ...searchParams.value, ...params }
      }

      // 模拟API调用
      const mockUsers: PaginatedData<UserStatistics> = {
        items: [
          {
            id: '1',
            email: 'user1@example.com',
            userType: 'FREE',
            creditsUsed: 5,
            totalQuota: 100,
            lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          },
          {
            id: '2',
            email: 'user2@example.com',
            phone: '+8613812345678',
            userType: 'PREMIUM',
            creditsUsed: 150,
            totalQuota: 1000,
            lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true
          }
        ],
        total: 2847,
        page: searchParams.value.page || 1,
        pageSize: searchParams.value.pageSize || 20,
        totalPages: Math.ceil(2847 / (searchParams.value.pageSize || 20))
      }
      
      users.value = mockUsers

    } catch (error) {
      showError('搜索用户失败')
      console.error('Search users error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 调整用户配额
  const adjustUserCredits = async (
    userId: string, 
    amount: number, 
    reason: string
  ): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 更新本地数据
      if (users.value) {
        const user = users.value.items.find(u => u.id === userId)
        if (user) {
          user.totalQuota = Math.max(0, user.totalQuota + amount)
        }
      }

      showSuccess(`配额调整成功：${amount > 0 ? '+' : ''}${amount}`)

    } catch (error) {
      showError('配额调整失败')
      console.error('Adjust credits error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 切换用户状态
  const toggleUserStatus = async (userId: string): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新本地数据
      if (users.value) {
        const user = users.value.items.find(u => u.id === userId)
        if (user) {
          user.isActive = !user.isActive
        }
      }

      showSuccess('用户状态更新成功')

    } catch (error) {
      showError('用户状态更新失败')
      console.error('Toggle user status error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 批量操作
  const batchUpdateUsers = async (
    userIds: string[], 
    operation: 'activate' | 'deactivate' | 'delete'
  ): Promise<void> => {
    if (userIds.length === 0) return

    try {
      isLoading.value = true
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 更新本地数据
      if (users.value && operation !== 'delete') {
        userIds.forEach(userId => {
          const user = users.value!.items.find(u => u.id === userId)
          if (user) {
            user.isActive = operation === 'activate'
          }
        })
      } else if (users.value && operation === 'delete') {
        users.value.items = users.value.items.filter(u => !userIds.includes(u.id))
        users.value.total -= userIds.length
      }

      // 清空选择
      selectedUsers.value = []

      const operationNames = {
        activate: '激活',
        deactivate: '禁用',
        delete: '删除'
      }

      showSuccess(`批量${operationNames[operation]}成功：${userIds.length}个用户`)

    } catch (error) {
      showError('批量操作失败')
      console.error('Batch update error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 导出用户数据
  const exportUsers = async (format: 'csv' | 'excel' = 'csv'): Promise<void> => {
    try {
      isLoading.value = true
      
      // 模拟导出延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 创建模拟导出文件
      const data = users.value?.items.map(user => ({
        ID: user.id,
        邮箱: user.email,
        手机: user.phone || '',
        用户类型: user.userType,
        已用配额: user.creditsUsed,
        总配额: user.totalQuota,
        状态: user.isActive ? '激活' : '禁用',
        最后登录: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '',
        注册时间: new Date(user.createdAt).toLocaleString('zh-CN')
      })) || []

      // 创建并下载文件
      const csvContent = convertToCSV(data)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`
      link.click()

      showSuccess('用户数据导出成功')

    } catch (error) {
      showError('导出失败')
      console.error('Export error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 刷新数据
  const refreshData = async (): Promise<void> => {
    await Promise.all([
      loadStatistics(),
      searchUsers()
    ])
  }

  // 工具函数：转换为CSV格式
  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        }).join(',')
      )
    ]
    
    return csvRows.join('\n')
  }

  // 分页处理
  const goToPage = (page: number): void => {
    if (page > 0 && page <= totalPages.value) {
      searchUsers({ page })
    }
  }

  const changePageSize = (pageSize: number): void => {
    searchUsers({ page: 1, pageSize })
  }

  // 选择处理
  const toggleUserSelection = (user: UserStatistics): void => {
    const index = selectedUsers.value.findIndex(u => u.id === user.id)
    if (index >= 0) {
      selectedUsers.value.splice(index, 1)
    } else {
      selectedUsers.value.push(user)
    }
  }

  const toggleAllSelection = (): void => {
    if (hasSelection.value) {
      selectedUsers.value = []
    } else {
      selectedUsers.value = users.value?.items || []
    }
  }

  const clearSelection = (): void => {
    selectedUsers.value = []
  }

  // 初始化
  onMounted(async () => {
    await refreshData()
  })

  return {
    // 状态
    isLoading,
    statistics,
    users,
    selectedUsers,
    searchParams,

    // 计算属性
    hasUsers,
    totalPages,
    hasSelection,

    // 方法
    loadStatistics,
    searchUsers,
    adjustUserCredits,
    toggleUserStatus,
    batchUpdateUsers,
    exportUsers,
    refreshData,
    goToPage,
    changePageSize,
    toggleUserSelection,
    toggleAllSelection,
    clearSelection
  }
}
