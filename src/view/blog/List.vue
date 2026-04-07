<script setup lang="ts">
import { BlogPostStatus, getBlogPostListService, type BlogPost } from '@/api/client';
import { useRequest } from '@/api/feachHook/useRequest';
import { NButton, NDataTable, NInput, NPagination, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { computed, h, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const keyword = ref('');
const page = ref(1);
const pageSize = ref(10);

const { data, loading, run } = useRequest(getBlogPostListService, {
  manual: true
});

const list = computed(() => data.value?.data?.list ?? []);
const total = computed(() => data.value?.data?.total ?? 0);

function fetchList() {
  const kw = keyword.value.trim();
  run({
    page: page.value,
    size: pageSize.value,
    ...(kw ? { keyword: kw } : {})
  });
}

onMounted(() => {
  fetchList();
});

watch([page, pageSize], () => {
  fetchList();
});

function handleSearch() {
  page.value = 1;
  fetchList();
}

const columns = computed<DataTableColumns<BlogPost>>(() => [
  {
    title: t('blog.listTitle'),
    key: 'title',
    ellipsis: { tooltip: true }
  },
  {
    title: t('blog.listCategory'),
    key: 'category',
    width: 140,
    render(row) {
      return row.category?.name ?? '—';
    }
  },
  {
    title: t('blog.listStatus'),
    key: 'status',
    width: 120,
    render(row) {
      const published = row.status === BlogPostStatus.Published;
      return h(
        NTag,
        { type: published ? 'success' : 'default', size: 'small' },
        { default: () => (published ? t('blog.statusLabelPublished') : t('blog.statusLabelDraft')) }
      );
    }
  },
  {
    title: t('blog.listCreatedAt'),
    key: 'createdAt',
    width: 200,
    render(row) {
      const raw = row.createdAt;
      if (!raw) return '—';
      const d = typeof raw === 'string' ? new Date(raw) : raw;
      return Number.isNaN(d.getTime()) ? String(raw) : d.toLocaleString();
    }
  }
]);
</script>

<template>
  <div class="blog-list-page box-border flex h-full min-h-0 flex-col p-6">
    <header class="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-lg font-semibold text-[var(--n-text-color)]">
        {{ $t('route.blogList') }}
      </h1>
      <NSpace>
        <NInput
          v-model:value="keyword"
          clearable
          :placeholder="$t('blog.listKeyword')"
          style="width: 14rem"
          @keyup.enter="handleSearch" />
        <NButton
          type="primary"
          :loading="loading"
          @click="handleSearch">
          {{ $t('blog.listSearch') }}
        </NButton>
        <NButton
          secondary
          :loading="loading"
          @click="fetchList">
          {{ $t('blog.listRefresh') }}
        </NButton>
      </NSpace>
    </header>

    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div
        class="min-h-[18rem] flex-1 overflow-auto rounded-[var(--n-border-radius)] border border-[var(--n-border-color)]">
        <NDataTable
          :columns="columns"
          :data="list"
          :loading="loading"
          :bordered="false"
          :single-line="false" />
      </div>
      <div class="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <span class="text-sm text-[var(--n-text-color-3)]">{{ $t('blog.listTotal', { n: total }) }}</span>
        <NPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :item-count="total"
          :page-sizes="[10, 20, 50]"
          show-size-picker />
      </div>
    </div>
  </div>
</template>
