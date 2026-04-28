<script setup lang="ts">
import {
  createBlogCategoryService,
  deleteBlogCategoryService,
  getBlogCategoryListService,
  updateBlogCategoryService,
  type BlogCategory,
} from '@/api/client';
import { useRequest } from '@/api/feachHook/useRequest';
import { showSuccessMessage } from '@/utils/message';
import type { DataTableColumns, FormRules } from 'naive-ui';
import {
  NButton,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NPagination,
  NSpace,
  useDialog,
} from 'naive-ui';
import { computed, h, onMounted, reactive, ref } from 'vue';

const dialog = useDialog();

const keyword = ref('');
const page = ref(1);
const pageSize = ref(10);

const list = ref<BlogCategory[]>([]);

const { run: fetchList, loading: listLoading } = useRequest(getBlogCategoryListService, {
  manual: true,
  onSuccess: res => {
    list.value = res?.data ?? [];
  },
  onError: err => err.showMessage(),
});

onMounted(() => {
  fetchList();
});

const filtered = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  const base = list.value.slice().sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  if (!kw) return base;
  return base.filter(it => {
    const name = String(it.name ?? '').toLowerCase();
    const desc = String(it.description ?? '').toLowerCase();
    return name.includes(kw) || desc.includes(kw);
  });
});

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filtered.value.slice(start, start + pageSize.value);
});

function handleSearch() {
  page.value = 1;
}

function formatTime(v?: string) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
}

const columns = computed<DataTableColumns<BlogCategory>>(() => [
  { title: '名称', key: 'name', ellipsis: { tooltip: true } },
  { title: '描述', key: 'description', ellipsis: { tooltip: true }, render: r => r.description ?? '—' },
  { title: '排序', key: 'sort', width: 100 },
  { title: '创建时间', key: 'createdAt', width: 200, render: r => formatTime(r.createdAt) },
  { title: '更新时间', key: 'updatedAt', width: 200, render: r => formatTime(r.updatedAt) },
  {
    title: '操作',
    key: 'actions',
    width: 180,
    render: row =>
      h(
        NSpace,
        { size: 8 },
        {
          default: () => [
            h(
              NButton,
              { size: 'small', secondary: true, onClick: () => openEdit(row) },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              { size: 'small', type: 'error', secondary: true, onClick: () => confirmDelete(row) },
              { default: () => '删除' },
            ),
          ],
        },
      ),
  },
]);

const modalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const formRef = ref<InstanceType<typeof NForm>>();

const form = reactive({
  name: '',
  description: '',
  sort: 0,
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: ['blur', 'input'] }],
};

function resetForm() {
  form.name = '';
  form.description = '';
  form.sort = 0;
  editingId.value = null;
  isEditing.value = false;
}

function openCreate() {
  resetForm();
  modalOpen.value = true;
}

function openEdit(row: BlogCategory) {
  resetForm();
  isEditing.value = true;
  editingId.value = row.id;
  form.name = row.name ?? '';
  form.description = row.description ?? '';
  form.sort = row.sort ?? 0;
  modalOpen.value = true;
}

const { run: createOne, loading: saving } = useRequest(createBlogCategoryService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage('已创建');
    modalOpen.value = false;
    fetchList();
  },
  onError: err => err.showMessage(),
});

const { run: updateOne, loading: updating } = useRequest(updateBlogCategoryService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage('已更新');
    modalOpen.value = false;
    fetchList();
  },
  onError: err => err.showMessage(),
});

const { run: deleteOne, loading: deleting } = useRequest(deleteBlogCategoryService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage('已删除');
    fetchList();
  },
  onError: err => err.showMessage(),
});

function handleSave() {
  formRef.value?.validate(errors => {
    if (errors) return;
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      sort: form.sort ?? 0,
    };
    if (isEditing.value && editingId.value != null) {
      updateOne({ id: editingId.value, ...payload });
    } else {
      createOne(payload);
    }
  });
}

function confirmDelete(row: BlogCategory) {
  dialog.warning({
    title: '确认删除？',
    content: `将删除分类「${row.name}」`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      deleteOne(row.id);
      return true;
    },
  });
}
</script>

<template>
  <div class="box-border flex h-full min-h-0 flex-col p-6">
    <header class="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-lg font-semibold text-[var(--n-text-color)]">
        {{ $t('route.blogCategory') }}
      </h1>
      <NSpace>
        <NInput
          v-model:value="keyword"
          clearable
          placeholder="名称/描述"
          style="width: 14rem"
          @keyup.enter="handleSearch" />
        <NButton
          type="primary"
          :loading="listLoading"
          @click="handleSearch">
          搜索
        </NButton>
        <NButton
          secondary
          :loading="listLoading"
          @click="fetchList">
          刷新
        </NButton>
        <NButton
          type="primary"
          @click="openCreate">
          新增分类
        </NButton>
      </NSpace>
    </header>

    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div
        class="min-h-[18rem] flex-1 overflow-auto rounded-[var(--n-border-radius)] border border-[var(--n-border-color)]">
        <NDataTable
          :columns="columns"
          :data="paged"
          :loading="listLoading || deleting"
          :bordered="false" />
      </div>
      <footer class="flex shrink-0 items-center justify-between gap-4">
        <div class="text-sm text-[var(--n-text-color-3)]">共 {{ filtered.length }} 条</div>
        <NPagination
          v-model:page="page"
          v-model:page-size="pageSize"
          show-size-picker
          :page-sizes="[10, 20, 50, 100]"
          :item-count="filtered.length" />
      </footer>
    </div>

    <NModal
      v-model:show="modalOpen"
      preset="card"
      :title="isEditing ? '编辑分类' : '新增分类'"
      style="width: 520px">
      <NForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        label-width="80">
        <NFormItem
          label="名称"
          path="name">
          <NInput
            v-model:value="form.name"
            placeholder="例如：技术" />
        </NFormItem>
        <NFormItem
          label="描述"
          path="description">
          <NInput
            v-model:value="form.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }" />
        </NFormItem>
        <NFormItem
          label="排序"
          path="sort">
          <NInputNumber
            v-model:value="form.sort"
            :min="0" />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton @click="modalOpen = false">取消</NButton>
          <NButton
            type="primary"
            :loading="saving || updating"
            @click="handleSave"
            >保存</NButton
          >
        </div>
      </template>
    </NModal>
  </div>
</template>
