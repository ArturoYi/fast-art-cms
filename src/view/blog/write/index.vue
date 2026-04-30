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
import { useRequest } from '@/api/feachHook/useRequest';
import { useLanguage } from '@/hook/useLanguage';
import { useTheme } from '@/hook/useTheme';
import { LANGUAGE } from '@/locale';
import { ThemeEnum } from '@/theme/index';
import { showSuccessMessage, showWarningMessage } from '@/utils/message';
import { Eye, Pencil } from '@vicons/tabler';
import { NButton, NIcon } from 'naive-ui';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import WriteBodyStep from './WriteBodyStep.vue';
import WriteConfirmStep from './WriteConfirmStep.vue';
import WriteMetaStep from './WriteMetaStep.vue';
import type { WriteMetaForm } from './types';

const { t } = useI18n();
const { getCurrentLocale } = useLanguage();
const { getCurrentTheme, getCurrentThemeModel, prefersDark } = useTheme();

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

const vtipTheme = computed<'light' | 'dark'>(() => {
  if (getCurrentThemeModel.value === ThemeEnum.SYSTEM) {
    return prefersDark.value ? 'dark' : 'light';
  }
  return getCurrentTheme.value === ThemeEnum.DARK ? 'dark' : 'light';
});

const localeKey = computed(() => String(getCurrentLocale.value));

function isRichTextEmpty(html: string): boolean {
  const el = document.createElement('div');
  el.innerHTML = html;
  return !el.textContent?.trim();
}

const currentStep = ref(0);
/** 仅第 1 步正文：与顶栏「预览」联动，离开该步时关闭 */
const bodyPreviewMode = ref(false);
const content = ref('<p></p>');

watch(currentStep, s => {
  if (s !== 0) bodyPreviewMode.value = false;
});

function toggleBodyPreview() {
  bodyPreviewMode.value = !bodyPreviewMode.value;
}

const form = reactive<WriteMetaForm>({
  title: '',
  summary: '',
  coverImage: '',
  categoryId: null,
  tagIds: [],
  status: BlogPostStatus.Draft,
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

const metaStepRef = ref<InstanceType<typeof WriteMetaStep>>();

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
  if (isRichTextEmpty(content.value)) {
    showWarningMessage(t('blog.contentRequired'));
    currentStep.value = 0;
    return;
  }
  metaStepRef.value
    ?.validate()
    .then(() => {
      submitPost(buildCreateBody());
    })
    .catch(() => {
      currentStep.value = 1;
    });
}

async function goNext() {
  if (currentStep.value === 0) {
    if (isRichTextEmpty(content.value)) {
      showWarningMessage(t('blog.contentRequired'));
      return;
    }
    currentStep.value = 1;
    return;
  }
  if (currentStep.value === 1) {
    try {
      await metaStepRef.value?.validate();
      currentStep.value = 2;
    } catch {
      /* 校验错误已由表单展示 */
    }
  }
}

function goPrev() {
  if (currentStep.value > 0) currentStep.value -= 1;
}
</script>

<template>
  <div class="write-page h-full min-h-0 flex flex-col box-border p-6">
    <header class="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 min-w-0 truncate text-lg font-semibold text-[var(--n-text-color)]">
        {{ $t('route.blogWrite') }}
      </h1>
      <div class="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <NButton
          v-if="currentStep > 0"
          secondary
          @click="goPrev">
          {{ $t('blog.prevStep') }}
        </NButton>
        <NButton
          v-if="currentStep === 0"
          secondary
          @click="toggleBodyPreview">
          <template #icon>
            <NIcon>
              <Eye v-if="!bodyPreviewMode" />
              <Pencil v-else />
            </NIcon>
          </template>
          {{ bodyPreviewMode ? $t('blog.exitPreview') : $t('blog.preview') }}
        </NButton>
        <NButton
          v-if="currentStep < 2"
          type="primary"
          :disabled="metaLoading && currentStep === 1"
          @click="goNext">
          {{ $t('blog.nextStep') }}
        </NButton>
        <NButton
          v-if="currentStep === 2"
          type="primary"
          :loading="submitLoading"
          :disabled="metaLoading"
          @click="handlePublish">
          {{ $t('blog.publish') }}
        </NButton>
      </div>
    </header>

    <div class="min-h-0 min-w-0 flex flex-1 flex-col">
      <WriteBodyStep
        v-show="currentStep === 0"
        v-model:content="content"
        v-model:preview="bodyPreviewMode"
        :locale-key="localeKey"
        :vtip-locale="vtipLocale"
        :vtip-theme="vtipTheme" />
      <WriteMetaStep
        v-show="currentStep === 1"
        ref="metaStepRef"
        :model-value="form"
        :category-options="categoryOptions"
        :tag-options="tagOptions"
        :meta-loading="metaLoading" />
      <WriteConfirmStep
        v-show="currentStep === 2"
        :meta="form"
        :content="content"
        :category-options="categoryOptions"
        :tag-options="tagOptions"
        :locale-key="localeKey"
        :vtip-locale="vtipLocale"
        :vtip-theme="vtipTheme" />
    </div>
  </div>
</template>
