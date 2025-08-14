<template>
  <div class="max-w-2xl mx-auto">
    <div class="glass-effect rounded-3xl p-8 text-center">
      <div 
        id="upload-area"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
        class="border-2 border-dashed border-pink-300 rounded-2xl p-12 hover:border-pink-400 transition-all duration-200 cursor-pointer group"
        :class="{ 
          'border-pink-400 bg-pink-50 scale-105': dragState.isDragging,
          'border-red-400 bg-red-50': validationError
        }"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- 上传图标 -->
        <div 
          class="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
          :class="{ 'animate-pulse': uploadStatus === 'uploading' }"
        >
          <Loading v-if="uploadStatus === 'uploading'" size="medium" color="white" />
          <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
        </div>

        <!-- 上传文本 -->
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ uploadText }}</h3>
        <p class="text-gray-600 mb-2">{{ $t('upload.supportedFormats') }}</p>
        <p class="text-sm text-gray-500 mb-4">{{ $t('upload.privacyNote') }}</p>
        
        <!-- 上传按钮 -->
        <button 
          class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105"
          :disabled="uploadStatus === 'uploading'"
        >
          {{ uploadButtonText }}
        </button>
      </div>
      
      <!-- 上传进度 -->
      <div v-if="uploadStatus === 'uploading'" class="mt-4">
        <div class="flex items-center justify-center space-x-2 text-sm mb-2">
          <div class="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-gray-600">{{ $t('upload.validating') }}</span>
        </div>
        <div v-if="currentTask?.progress" class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${currentTask.progress.percentage}%` }"
          ></div>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="validationError" class="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
        {{ validationError }}
      </div>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInputRef"
      type="file" 
      :accept="acceptedFormats" 
      @change="handleFileSelect"
      class="hidden"
    >
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UploadStatus, DragDropState, UploadTask } from '../../types/upload.types'
import type { ImageValidationError } from '../../types/image.types'
import Loading from '@/shared/components/ui/Loading/Loading.vue'
import { useImageUpload } from '../../composables/useImageUpload'

// Props
interface Props {
  accept?: string[]
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: () => ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: 10 * 1024 * 1024, // 10MB
  multiple: false,
  disabled: false
})

// Emits
interface Emits {
  (e: 'upload:start', task: UploadTask): void
  (e: 'upload:success', task: UploadTask): void
  (e: 'upload:error', task: UploadTask): void
}

const emit = defineEmits<Emits>()

// Composables
const { t } = useI18n()
const {
  fileInputRef,
  uploadStatus,
  currentTask,
  dragState,
  validationError,
  handleFileSelect,
  handleDrop,
  handleDragEnter,
  handleDragLeave,
  triggerFileInput
} = useImageUpload({
  maxSize: props.maxSize,
  allowedFormats: props.accept,
  onStart: (task) => emit('upload:start', task),
  onSuccess: (task) => emit('upload:success', task),
  onError: (task) => emit('upload:error', task)
})

// Computed properties
const acceptedFormats = computed(() => props.accept.join(','))

const uploadText = computed(() => {
  switch (uploadStatus.value) {
    case 'uploading':
      return t('upload.processing')
    case 'error':
      return t('upload.validationFailed')
    default:
      return t('upload.dragOrClick')
  }
})

const uploadButtonText = computed(() => {
  return uploadStatus.value === 'uploading' 
    ? t('upload.uploading') 
    : t('upload.selectImage')
})
</script>
