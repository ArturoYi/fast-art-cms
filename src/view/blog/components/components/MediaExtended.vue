<script setup lang="ts">
import { nodeViewProps } from '@tiptap/vue-3'
// 定义 Props
const props = defineProps({
    ...nodeViewProps, // 包含 editor, node, updateAttributes 等
    mediaRef: {
        type: Object as () => HTMLElement | null, // 明确 TS 类型
        required: false
    }
})
</script>
<template>
  <div></div>
</template>
