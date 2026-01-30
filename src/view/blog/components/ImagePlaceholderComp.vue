<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3';
import { NodeViewWrapper } from '@tiptap/vue-3';
const props = defineProps<NodeViewProps>();
</script>

<template>
  <NodeViewWrapper class="image-placeholder-wrapper my-4">
    <div>图片上传组件</div>
  </NodeViewWrapper>
</template>
