<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3';
import type { NodeViewProps } from '@tiptap/vue-3';

const props = defineProps<NodeViewProps>();
</script>
<template>
  <NodeViewWrapper v-bind="props">
    <div>ImageExtendedComp</div>
  </NodeViewWrapper>
</template>
