<template>
  <div class="space-y-4">
    <!-- 磨皮控制 -->
    <FilterCard
      title="磨皮"
      icon="star"
      color="pink"
    >
      <Slider
        :model-value="adjustments.smoothing"
        :min="0"
        :max="100"
        label="磨皮强度"
        unit="%"
        color="pink"
        @update:model-value="updateAdjustment('smoothing', $event)"
      />
    </FilterCard>

    <!-- 美白控制 -->
    <FilterCard
      title="美白"
      icon="lightning"
      color="purple"
    >
      <Slider
        :model-value="adjustments.whitening"
        :min="0"
        :max="100"
        label="美白强度"
        unit="%"
        color="purple"
        @update:model-value="updateAdjustment('whitening', $event)"
      />
    </FilterCard>

    <!-- 亮度控制 -->
    <FilterCard
      title="亮度"
      icon="sun"
      color="blue"
    >
      <Slider
        :model-value="adjustments.brightness"
        :min="-50"
        :max="50"
        label="亮度"
        color="blue"
        @update:model-value="updateAdjustment('brightness', $event)"
      />
    </FilterCard>

    <!-- 对比度控制 -->
    <FilterCard
      title="对比度"
      icon="adjust"
      color="green"
    >
      <Slider
        :model-value="adjustments.contrast"
        :min="-50"
        :max="50"
        label="对比度"
        color="green"
        @update:model-value="updateAdjustment('contrast', $event)"
      />
    </FilterCard>

    <!-- 饱和度控制 -->
    <FilterCard
      title="饱和度"
      icon="color"
      color="pink"
    >
      <Slider
        :model-value="adjustments.saturation"
        :min="-50"
        :max="50"
        label="饱和度"
        color="pink"
        @update:model-value="updateAdjustment('saturation', $event)"
      />
    </FilterCard>
  </div>
</template>

<script>
import Slider from '../ui/Slider.vue'
import FilterCard from './FilterCard.vue'
import { useImageEditor } from '../../composables/useImageEditor.js'

export default {
  name: 'FilterControlPanel',
  components: {
    Slider,
    FilterCard
  },
  setup() {
    const { adjustments, updateAdjustment } = useImageEditor()
    
    return {
      adjustments,
      updateAdjustment
    }
  }
}
</script>
