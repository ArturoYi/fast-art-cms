<script setup lang="ts">
import { NScrollbar } from 'naive-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { VtipEditor, VtipRenderer } from 'vtip-edit';
import 'vtip-edit/style.css';

const props = defineProps<{
  content: string;
  localeKey: string;
  vtipLocale: 'zh' | 'en';
  vtipTheme: 'light' | 'dark';
}>();

const emit = defineEmits<{
  'update:content': [v: string];
}>();

const preview = defineModel<boolean>('preview', { default: false });

const { t } = useI18n();

const model = computed({
  get: () => props.content,
  set: (v: string) => emit('update:content', v)
});

function isRichTextEmpty(html: string): boolean {
  const el = document.createElement('div');
  el.innerHTML = html;
  return !el.textContent?.trim();
}

const previewIsEmpty = computed(() => isRichTextEmpty(props.content));
</script>

<template>
  <div class="write-body-step min-h-0 flex flex-1 flex-col">
    <div class="min-h-0 flex flex-1 flex-col">
      <div
        v-show="!preview"
        class="write-editor-shell min-h-0 flex flex-1 flex-col">
        <VtipEditor
          :key="localeKey"
          v-model="model"
          class="write-editor"
          :locale="vtipLocale"
          :placeholder="t('blog.editorPlaceholder')"
          :theme="vtipTheme" />
      </div>
      <div
        v-show="preview"
        class="min-h-0 flex flex-1 flex-col">
        <NScrollbar class="write-preview-scroll">
          <div
            v-if="previewIsEmpty"
            class="flex min-h-[16rem] items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            {{ $t('blog.emptyPreview') }}
          </div>
          <div
            v-else
            class="write-preview-inner">
            <VtipRenderer
              :key="localeKey"
              :model-value="content"
              class="write-preview-renderer"
              :locale="vtipLocale"
              :theme="vtipTheme" />
          </div>
        </NScrollbar>
      </div>
    </div>
  </div>
</template>

<style scoped>
.write-editor {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  overflow: hidden;
}

.write-editor :deep(.vtip-editor-container) {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 16rem;
}

.write-editor :deep(.vtip-editor-content) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.write-preview-scroll {
  flex: 1;
  min-height: 0;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  background-color: var(--n-color);
}

.write-preview-scroll :deep(.n-scrollbar) {
  height: 100%;
  max-height: 100%;
}

.write-preview-inner {
  box-sizing: border-box;
  min-height: 16rem;
  padding: 1rem 1.25rem;
}

.write-preview-renderer {
  display: block;
  min-height: 12rem;
}

.write-preview-renderer :deep(.vtip-renderer) {
  min-height: 12rem;
  word-break: break-word;
}
</style>
