<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NIcon, NScrollbar } from 'naive-ui'
import { Eye, Pencil } from '@vicons/tabler'
import { VtipEditor, VtipRenderer } from 'vtip-edit'
import 'vtip-edit/style.css'

const content = ref('<p></p>')
const isPreviewMode = ref(false)

const previewIsEmpty = computed(() => {
  const el = document.createElement('div')
  el.innerHTML = content.value
  return !el.textContent?.trim()
})

function togglePreview() {
  isPreviewMode.value = !isPreviewMode.value
}
</script>

<template>
  <div class="write-page h-full min-h-0 flex flex-col box-border p-6">
    <header class="mb-4 flex shrink-0 items-center justify-between gap-4">
      <h1 class="m-0 min-w-0 truncate text-lg font-semibold text-[var(--n-text-color)]">
        {{ $t('route.blogWrite') }}
      </h1>
      <NButton
        secondary
        @click="togglePreview">
        <template #icon>
          <NIcon>
            <Eye v-if="!isPreviewMode" />
            <Pencil v-else />
          </NIcon>
        </template>
        {{ isPreviewMode ? $t('blog.exitPreview') : $t('blog.preview') }}
      </NButton>
    </header>

    <div class="min-h-0 flex flex-1 flex-col">
      <!-- VtipEditor 就绪前根为注释节点，需外层 div 承接布局 -->
      <div
        v-show="!isPreviewMode"
        class="write-editor-shell min-h-0 flex flex-1 flex-col">
        <VtipEditor
          v-model="content"
          class="write-editor"
          locale="zh"
          placeholder="请输入内容"
          theme="auto" />
      </div>
      <div
        v-show="isPreviewMode"
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
              :model-value="content"
              class="write-preview-renderer"
              locale="zh"
              theme="auto" />
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
