<script setup lang="ts">
import {
  BlogPostStatus,
  createBlogPostService,
  getBlogCategoryListService,
  getBlogTagListService,
  type BlogCategory,
  type BlogTag,
  type CreateBlogPostBody
} from '@/api/client';
import { useLanguage } from '@/hook/useLanguage';
import { useTheme } from '@/hook/useTheme';
import { LANGUAGE } from '@/locale';
import { ThemeEnum } from '@/theme/index';
import { showSuccessMessage, showWarningMessage } from '@/utils/message';
import { useRequest } from '@/api/feachHook/useRequest';
import { Eye, Pencil } from '@vicons/tabler';
import {
  NButton,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NIcon,
  NInput,
  NRadio,
  NRadioGroup,
  NScrollbar,
  NSelect,
  NSwitch
} from 'naive-ui';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { VtipEditor, VtipRenderer } from 'vtip-edit';
import 'vtip-edit/style.css';

const { t } = useI18n();
const { getCurrentLocale } = useLanguage();
const { getCurrentTheme, getCurrentThemeModel, prefersDark } = useTheme();

/** vtip 仅支持 zh / en，与应用语言对齐 */
const vtipLocale = computed<'zh' | 'en'>(() => {
  switch (getCurrentLocale.value) {
    case LANGUAGE.EN_US:
      return 'en';
    case LANGUAGE.ZH_CN:
      return 'zh';
    case LANGUAGE.AR_DZ:
      return 'en';
    default:
      return 'zh';
  }
});

/** 与 Naive / useTheme 解析后的亮暗一致，供 vtip 使用 */
const vtipTheme = computed<'light' | 'dark'>(() => {
  if (getCurrentThemeModel.value === ThemeEnum.SYSTEM) {
    return prefersDark.value ? 'dark' : 'light';
  }
  return getCurrentTheme.value === ThemeEnum.DARK ? 'dark' : 'light';
});

function isRichTextEmpty(html: string): boolean {
  const el = document.createElement('div');
  el.innerHTML = html;
  return !el.textContent?.trim();
}

const content = ref('<p></p>');
const isPreviewMode = ref(false);

const form = reactive({
  title: '',
  summary: '',
  coverImage: '',
  categoryId: null as number | null,
  tagIds: [] as number[],
  status: BlogPostStatus.Draft as BlogPostStatus,
  isPinned: false
});

const categories = ref<BlogCategory[]>([]);
const tags = ref<BlogTag[]>([]);
const metaLoading = ref(true);

const categoryOptions = computed(() =>
  categories.value.map(c => ({
    label: c.name,
    value: c.id
  }))
);

const tagOptions = computed(() =>
  tags.value.map(tg => ({
    label: tg.name,
    value: tg.id
  }))
);

const previewIsEmpty = computed(() => isRichTextEmpty(content.value));

const formRef = ref<InstanceType<typeof NForm>>();

const formRules = {
  title: [
    {
      required: true,
      message: () => t('blog.titleRequired'),
      trigger: ['blur', 'input']
    }
  ],
  categoryId: [
    {
      required: true,
      validator: (_: unknown, v: number | null) => {
        if (v === null || v === undefined) {
          return Promise.reject(new Error(t('blog.categoryRequired')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'change']
    }
  ]
};

onMounted(async () => {
  metaLoading.value = true;
  try {
    const [cRes, tRes] = await Promise.all([getBlogCategoryListService(), getBlogTagListService()]);
    categories.value = cRes.data ?? [];
    tags.value = tRes.data ?? [];
  } finally {
    metaLoading.value = false;
  }
});

const { run: submitPost, loading: submitLoading } = useRequest(createBlogPostService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage(t('blog.publishSuccess'));
  },
  onError: err => {
    err.showMessage();
  }
});

function togglePreview() {
  isPreviewMode.value = !isPreviewMode.value;
}

function buildCreateBody(): CreateBlogPostBody {
  const body: CreateBlogPostBody = {
    title: form.title.trim(),
    content: content.value,
    categoryId: form.categoryId!,
    status: form.status,
    isPinned: form.isPinned ? 1 : 0
  };
  const summary = form.summary.trim();
  if (summary) body.summary = summary;
  const cover = form.coverImage.trim();
  if (cover) body.coverImage = cover;
  if (form.tagIds.length) body.tagIds = Array.from(new Set(form.tagIds));
  return body;
}

function handlePublish() {
  formRef.value?.validate(errors => {
    if (errors) return;
    if (isRichTextEmpty(content.value)) {
      showWarningMessage(t('blog.contentRequired'));
      return;
    }
    submitPost(buildCreateBody());
  });
}
</script>

<template>
  <div class="write-page h-full min-h-0 flex flex-col box-border p-6">
    <header class="mb-4 flex shrink-0 items-center justify-between gap-4">
      <h1 class="m-0 min-w-0 truncate text-lg font-semibold text-[var(--n-text-color)]">
        {{ $t('route.blogWrite') }}
      </h1>
      <div class="flex shrink-0 items-center gap-2">
        <NButton
          type="primary"
          :loading="submitLoading"
          :disabled="metaLoading"
          @click="handlePublish">
          {{ $t('blog.publish') }}
        </NButton>
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
      </div>
    </header>

    <NForm
      ref="formRef"
      class="mb-4 shrink-0"
      :model="form"
      :rules="formRules"
      label-placement="left"
      label-width="auto">
      <NGrid
        :cols="24"
        :x-gap="16"
        :y-gap="12"
        responsive="screen">
        <NGridItem :span="24">
          <NFormItem
            :label="$t('blog.title')"
            path="title">
            <NInput
              v-model:value="form.title"
              :placeholder="$t('blog.titlePlaceholder')"
              clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem
            :label="$t('blog.category')"
            path="categoryId">
            <NSelect
              v-model:value="form.categoryId"
              :options="categoryOptions"
              :placeholder="$t('blog.categoryPlaceholder')"
              :loading="metaLoading"
              clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem :label="$t('blog.tags')">
            <NSelect
              v-model:value="form.tagIds"
              multiple
              :options="tagOptions"
              :placeholder="$t('blog.tagsPlaceholder')"
              :loading="metaLoading"
              clearable
              filterable
              max-tag-count="responsive" />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem :label="$t('blog.summary')">
            <NInput
              v-model:value="form.summary"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              :placeholder="$t('blog.summaryPlaceholder')"
              clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem :label="$t('blog.coverImage')">
            <NInput
              v-model:value="form.coverImage"
              :placeholder="$t('blog.coverPlaceholder')"
              clearable />
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem :label="$t('blog.status')">
            <NRadioGroup v-model:value="form.status">
              <NRadio :value="BlogPostStatus.Draft">
                {{ $t('blog.statusDraft') }}
              </NRadio>
              <NRadio :value="BlogPostStatus.Published">
                {{ $t('blog.statusPublished') }}
              </NRadio>
            </NRadioGroup>
          </NFormItem>
        </NGridItem>
        <NGridItem :span="24">
          <NFormItem :label="$t('blog.pinned')">
            <NSwitch v-model:value="form.isPinned" />
          </NFormItem>
        </NGridItem>
      </NGrid>
    </NForm>

    <div class="min-h-0 flex flex-1 flex-col">
      <!-- VtipEditor 就绪前根为注释节点，需外层 div 承接布局 -->
      <div
        v-show="!isPreviewMode"
        class="write-editor-shell min-h-0 flex flex-1 flex-col">
        <!-- vtip 内部未随 locale/placeholder 更新，依赖 key 在语言切换时重建 -->
        <VtipEditor
          :key="getCurrentLocale"
          v-model="content"
          class="write-editor"
          :locale="vtipLocale"
          :placeholder="t('blog.editorPlaceholder')"
          :theme="vtipTheme" />
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
              :key="getCurrentLocale"
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
