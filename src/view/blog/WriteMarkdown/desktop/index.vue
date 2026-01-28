<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3';
import type { Editor } from '@tiptap/vue-3';
import { NSplit, NInput, NScrollbar, NIcon } from 'naive-ui';
import { ChevronLeft, ChevronRight } from '@vicons/tabler';
import { computed } from 'vue';

const props = defineProps<{
  editorRef: Editor | undefined;
  value: string;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string): void;
}>();

const inputValue = computed({
  get: () => props.value,
  set: (val) => {
    emit('update:value', val);
    if (props.editorRef) {
      // Sync content to editor
      props.editorRef.commands.setContent(val,{
        contentType: 'markdown',
      });
    }
  }
});
</script>

<template>
  <div class="desktop-editor-container h-full w-full">
    <NSplit
      direction="horizontal"
      class="h-full"
      :max="0.97"
      :min="0.03">
      <template #1>
        <div class="h-full w-full flex flex-col">
          <NScrollbar
            class="flex-1"
            content-class="min-h-full flex flex-col">
            <NInput
              v-model:value="inputValue"
              class="flex-1"
              type="textarea"
              :autosize="{ minRows: 1 }"
              :bordered="false"
              placeholder="请输入 Markdown 内容..." />
          </NScrollbar>
        </div>
      </template>
      <template #2>
        <div class="h-full w-full flex flex-col">
          <NScrollbar
            class="flex-1"
            content-class="min-h-full flex flex-col">
            <EditorContent
              :editor="editorRef"
              class="h-full w-full flex-1" />
          </NScrollbar>
        </div>
      </template>
    </NSplit>
  </div>
</template>

<style scoped>
:deep(.n-input-wrapper),
:deep(.n-input__textarea) {
    height: 100%;
    min-height: 100%;
}

.ProseMirror {
  min-height: 500px;
  outline: none;
}
</style>
