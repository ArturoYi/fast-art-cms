<script setup lang="ts">
import { BlogPostStatus } from '@/api/client';
import { useInjection } from '@/hook/useInjection';
import { mediaQueryInjectionKey } from '@/injection';
import {
  NForm,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
  NSelect,
  NSwitch
} from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { computed, ref, unref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WriteMetaForm } from './types';

defineProps<{
  modelValue: WriteMetaForm;
  categoryOptions: { label: string; value: number }[];
  tagOptions: { label: string; value: number }[];
  metaLoading: boolean;
}>();

const { t } = useI18n();
const { isMaxSm } = useInjection(mediaQueryInjectionKey);

const labelPlacement = computed<'top' | 'left'>(() => (unref(isMaxSm) ? 'top' : 'left'));

const formRef = ref<FormInst | null>(null);

const formRules: FormRules = {
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

function validate(): Promise<void> {
  return new Promise((resolve, reject) => {
    formRef.value?.validate(errors => {
      if (errors) reject(errors);
      else resolve();
    });
  });
}

defineExpose({ validate });
</script>

<template>
  <div class="write-meta-step min-h-0 min-w-0 flex flex-1 flex-col overflow-hidden">
    <div class="write-meta-step-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain">
      <div class="write-meta-step-surface">
        <NForm
          ref="formRef"
          class="write-meta-form pb-2"
          :model="modelValue"
          :rules="formRules"
          :label-placement="labelPlacement"
          :label-width="isMaxSm ? undefined : 'auto'">
          <div class="write-meta-fields">
            <NFormItem
              :label="$t('blog.title')"
              path="title">
              <NInput
                v-model:value="modelValue.title"
                class="write-meta-control"
                :placeholder="$t('blog.titlePlaceholder')"
                clearable />
            </NFormItem>
            <NFormItem
              :label="$t('blog.category')"
              path="categoryId">
              <NSelect
                v-model:value="modelValue.categoryId"
                class="write-meta-control"
                :options="categoryOptions"
                :placeholder="$t('blog.categoryPlaceholder')"
                :loading="metaLoading"
                clearable />
            </NFormItem>
            <NFormItem :label="$t('blog.tags')">
              <NSelect
                v-model:value="modelValue.tagIds"
                class="write-meta-control"
                multiple
                :options="tagOptions"
                :placeholder="$t('blog.tagsPlaceholder')"
                :loading="metaLoading"
                clearable
                filterable
                max-tag-count="responsive" />
            </NFormItem>
            <NFormItem :label="$t('blog.summary')">
              <NInput
                v-model:value="modelValue.summary"
                class="write-meta-control"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :placeholder="$t('blog.summaryPlaceholder')"
                clearable />
            </NFormItem>
            <NFormItem :label="$t('blog.coverImage')">
              <NInput
                v-model:value="modelValue.coverImage"
                class="write-meta-control"
                :placeholder="$t('blog.coverPlaceholder')"
                clearable />
            </NFormItem>
            <NFormItem :label="$t('blog.status')">
              <NRadioGroup
                v-model:value="modelValue.status"
                :class="['write-meta-radio-group', { 'write-meta-radio-group--stack': isMaxSm }]">
                <NRadio :value="BlogPostStatus.Draft">
                  {{ $t('blog.statusDraft') }}
                </NRadio>
                <NRadio :value="BlogPostStatus.Published">
                  {{ $t('blog.statusPublished') }}
                </NRadio>
              </NRadioGroup>
            </NFormItem>
            <NFormItem :label="$t('blog.pinned')">
              <NSwitch v-model:value="modelValue.isPinned" />
            </NFormItem>
          </div>
        </NForm>
      </div>
    </div>
  </div>
</template>

<style scoped>
.write-meta-step-surface {
  box-sizing: border-box;
  width: 100%;
  max-width: 42rem;
  min-width: 0;
  margin-inline: auto;
}

.write-meta-form {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.write-meta-fields {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  gap: 0.75rem;
}

.write-meta-form :deep(.n-form-item) {
  min-width: 0;
  max-width: 100%;
}

.write-meta-form :deep(.n-form-item-body),
.write-meta-form :deep(.n-form-item-body__fill) {
  min-width: 0;
  max-width: 100%;
}

.write-meta-form :deep(.n-form-item-blank) {
  min-width: 0;
  max-width: 100%;
}

.write-meta-form :deep(.n-form-item-feedback-wrapper) {
  min-width: 0;
  max-width: 100%;
}

.write-meta-control {
  width: 100%;
  max-width: 100%;
}

.write-meta-control :deep(.n-input),
.write-meta-control :deep(.n-input-wrapper),
.write-meta-control :deep(.n-base-selection),
.write-meta-control :deep(.n-base-selection-label) {
  max-width: 100%;
}

.write-meta-control :deep(.n-input__textarea-el),
.write-meta-control :deep(input.n-input__input-el) {
  min-width: 0;
}

.write-meta-control :deep(.n-base-selection-tags) {
  max-width: 100%;
  overflow-x: auto;
}

.write-meta-radio-group--stack :deep(.n-radio-group) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
}
</style>
