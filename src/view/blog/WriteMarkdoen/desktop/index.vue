<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/vue-3';

defineProps<{
  editorRef: Editor | undefined;
}>();
</script>

<template>
  <div
    class="desktop-editor-container h-full w-full bg-neutral-card p-4 rounded-lg shadow-sm border border-neutral-base">
    <div
      v-if="editorRef"
      class="tiptap-editor editor-content-wrapper prose max-w-none dark:prose-invert">
      <EditorContent :editor="editorRef" />
    </div>
    <div
      v-else
      class="flex items-center justify-center h-full text-neutral-text-base opacity-50">
      Loading Editor...
    </div>
  </div>
</template>

<style scoped>
.ProseMirror {
  min-height: 500px;
  outline: none;
}
</style>
