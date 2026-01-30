<script setup lang="ts">
import { ref } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

// 获取 img 元素的引用，传递给 MediaExtended 以计算宽度
const imageRef = ref<HTMLElement | null>(null)
</script>

<template>
  <MediaExtended
    v-bind="props"
    :media-ref="imageRef">
    <img
      ref="imageRef"
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title"
      class="m-0 block h-auto w-full object-cover"
      :style="{
                // 这里的宽度由父容器控制，img 设为 100% 填充容器
                maxWidth: '100%',
            }" />
  </MediaExtended>
</template>
