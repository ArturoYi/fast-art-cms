<script setup lang="ts">
import { updateUserPasswordService } from '@/api/client';
import { useRequest } from '@/api/feachHook/useRequest';
import { showSuccessMessage } from '@/utils/message';
import { NButton, NForm, NFormItem, NInput } from 'naive-ui';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const formRef = ref<InstanceType<typeof NForm> | null>(null);

const model = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const rules = {
  currentPassword: {
    required: true,
    message: () => t('profile.currentPasswordRequired'),
    trigger: ['input', 'blur']
  },
  newPassword: {
    validator(_rule: unknown, value: string) {
      if (!value?.trim()) return new Error(t('profile.newPasswordRequired'));
      const len = value.length;
      if (len < 6 || len > 20) return new Error(t('login.passwordLength'));
      return true;
    },
    trigger: ['input', 'blur']
  },
  confirmPassword: {
    required: true,
    validator(_rule: unknown, value: string) {
      if (!value) return new Error(t('profile.confirmPasswordRequired'));
      if (value !== model.newPassword) return new Error(t('profile.confirmPasswordNotMatch'));
      return true;
    },
    trigger: ['input', 'blur']
  }
};

const { run: submitPassword, loading } = useRequest(updateUserPasswordService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage(t('profile.passwordChangeSuccess'));
    model.currentPassword = '';
    model.newPassword = '';
    model.confirmPassword = '';
    formRef.value?.restoreValidation();
  },
  onError: (err) => err.showMessage()
});

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (errors) return;
    submitPassword({
      oldPassword: model.currentPassword,
      newPassword: model.newPassword
    });
  });
}
</script>

<template>
  <div class="cms-page">
    <div
      class="min-h-0 flex flex-1 flex-col items-center overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
      <div class="w-full max-w-md shrink-0">
        <header class="mb-4">
          <h1 class="cms-page-title">
            {{ $t('route.profilePassword') }}
          </h1>
          <p class="cms-page-desc">
            {{ t('profile.passwordDesc') }}
          </p>
        </header>

        <NForm
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="top"
          require-mark-placement="right-hanging">
          <NFormItem
            :label="t('profile.currentPassword')"
            path="currentPassword">
            <NInput
              v-model:value="model.currentPassword"
              class="w-full"
              type="password"
              show-password-on="click"
              :placeholder="t('profile.currentPasswordPlaceholder')" />
          </NFormItem>
          <NFormItem
            :label="t('profile.newPassword')"
            path="newPassword">
            <NInput
              v-model:value="model.newPassword"
              class="w-full"
              type="password"
              show-password-on="click"
              :placeholder="t('profile.newPasswordPlaceholder')" />
          </NFormItem>
          <NFormItem
            :label="t('profile.confirmPassword')"
            path="confirmPassword">
            <NInput
              v-model:value="model.confirmPassword"
              class="w-full"
              type="password"
              show-password-on="click"
              :placeholder="t('profile.confirmPasswordPlaceholder')" />
          </NFormItem>
          <NFormItem :show-label="false">
            <NButton
              type="primary"
              block
              :loading="loading"
              @click="handleSubmit">
              {{ t('common.confirm') }}
            </NButton>
          </NFormItem>
        </NForm>
      </div>
    </div>
  </div>
</template>
