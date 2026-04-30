<script setup lang="ts">
import { BlogPostStatus } from '@/api/client';
import { NScrollbar, NSwitch } from 'naive-ui';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { VtipRenderer } from 'vtip-edit';
import 'vtip-edit/style.css';
import type { WriteMetaForm } from './types';

const props = defineProps<{
  meta: WriteMetaForm;
  content: string;
  categoryOptions: { label: string; value: number }[];
  tagOptions: { label: string; value: number }[];
  localeKey: string;
  vtipLocale: 'zh' | 'en';
  vtipTheme: 'light' | 'dark';
}>();

const { t } = useI18n();

const categoryLabel = computed(() => {
  const id = props.meta.categoryId;
  if (id == null) return '—';
  return props.categoryOptions.find(o => o.value === id)?.label ?? '—';
});

const tagLabels = computed(() => {
  const ids = props.meta.tagIds;
  if (!ids?.length) return '—';
  const names = ids
    .map(id => props.tagOptions.find(o => o.value === id)?.label)
    .filter(Boolean) as string[];
  return names.length ? names.join(', ') : '—';
});

const statusLabel = computed(() =>
  props.meta.status === BlogPostStatus.Published
    ? t('blog.statusPublished')
    : t('blog.statusDraft')
);
</script>

<template>
  <div class="write-confirm-step flex min-h-0 flex-1 flex-col gap-4">
    <div class="confirm-meta grid gap-3 text-sm text-[var(--n-text-color)]">
      <div class="confirm-row">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.title') }}</span>
        <span class="confirm-value font-medium">{{ meta.title.trim() || '—' }}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.category') }}</span>
        <span class="confirm-value">{{ categoryLabel }}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.tags') }}</span>
        <span class="confirm-value">{{ tagLabels }}</span>
      </div>
      <div class="confirm-row confirm-row--block">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.summary') }}</span>
        <span class="confirm-value mt-1 block whitespace-pre-wrap">{{ meta.summary.trim() || '—' }}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.coverImage') }}</span>
        <span class="confirm-value break-all">{{ meta.coverImage.trim() || '—' }}</span>
      </div>
      <div class="confirm-row">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.status') }}</span>
        <span class="confirm-value">{{ statusLabel }}</span>
      </div>
      <div class="confirm-row confirm-row--align-center">
        <span class="confirm-label text-[var(--n-text-color-3)]">{{ $t('blog.pinned') }}</span>
        <NSwitch
          :value="meta.isPinned"
          disabled />
      </div>
    </div>

    <div class="min-h-0 flex flex-1 flex-col">
      <div class="mb-2 text-sm font-medium text-[var(--n-text-color)]">
        {{ $t('blog.confirmContentPreview') }}
      </div>
      <NScrollbar class="write-confirm-preview-scroll">
        <div class="write-preview-inner">
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
</template>

<style scoped>
.confirm-row {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.5rem 1rem;
  align-items: start;
}

.confirm-row--block {
  grid-template-columns: 1fr;
}

.confirm-row--block .confirm-label {
  grid-column: 1;
}

.confirm-row--align-center {
  align-items: center;
}

.confirm-row--align-center .confirm-label {
  align-self: center;
}

.write-confirm-preview-scroll {
  flex: 1;
  min-height: 12rem;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  background-color: var(--n-color);
}

.write-confirm-preview-scroll :deep(.n-scrollbar) {
  height: 100%;
  max-height: 100%;
}

.write-preview-inner {
  box-sizing: border-box;
  min-height: 10rem;
  padding: 1rem 1.25rem;
}

.write-preview-renderer {
  display: block;
  min-height: 8rem;
}

.write-preview-renderer :deep(.vtip-renderer) {
  min-height: 8rem;
  word-break: break-word;
}
</style>
