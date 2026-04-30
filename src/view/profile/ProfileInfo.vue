<script setup lang="ts">
import { getCurrentUserService, updateUserProfileService } from '@/api/client';
import type { UserProfile } from '@/api/client/DTO/userDTO';
import { useRequest } from '@/api/feachHook/useRequest';
import { showInfoMessage, showSuccessMessage } from '@/utils/message';
import { UserCircle } from '@vicons/tabler';
import {
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NScrollbar,
  NSpin,
  NTooltip,
  NSpace,
  useDialog
} from 'naive-ui';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dialog = useDialog();

const AVATAR_SIZE = 52;

const username = ref('');
/** 接口原始头像字段（URL 或相对路径） */
const avatarRaw = ref<string | null>(null);
const formRef = ref<InstanceType<typeof NForm> | null>(null);

const form = reactive({
  nickname: '',
  email: '',
  phone: '',
  qq: '',
  remark: ''
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolvePublicAssetUrl(url: string | null | undefined): string | undefined {
  if (url == null || String(url).trim() === '') return undefined;
  const u = String(url).trim();
  if (/^https?:\/\//i.test(u) || u.startsWith('data:') || u.startsWith('blob:')) return u;
  const base = (import.meta.env.VITE_BASE_URL ?? '').replace(/\/$/, '');
  if (u.startsWith('/')) return base ? `${base}${u}` : u;
  return base ? `${base}/${u}` : u;
}

const displayAvatarSrc = computed(() => resolvePublicAssetUrl(avatarRaw.value));

/** 主标题：优先昵称，否则登录名 */
const displayTitle = computed(() => {
  const nick = form.nickname.trim();
  const u = username.value.trim();
  if (nick) return nick;
  if (u) return u;
  return '—';
});

/** 副标题：有昵称时展示登录名，避免与主标题重复 */
const displaySubtitle = computed(() => {
  const nick = form.nickname.trim();
  const u = username.value.trim();
  if (!u || !nick || nick === u) return '';
  return `@${u}`;
});

const rules = {
  email: {
    validator(_rule: unknown, value: string) {
      const v = (value ?? '').trim();
      if (!v) return true;
      if (!emailPattern.test(v)) return new Error(t('profile.emailInvalid'));
      return true;
    },
    trigger: ['input', 'blur']
  }
};

function applyProfile(p: UserProfile | null | undefined) {
  if (!p) return;
  username.value = p.username != null ? String(p.username) : '';
  avatarRaw.value = p.avatar != null && String(p.avatar).trim() !== '' ? String(p.avatar) : null;
  form.nickname = p.nickname != null ? String(p.nickname) : '';
  form.email = p.email != null ? String(p.email) : '';
  form.phone = p.phone != null ? String(p.phone) : '';
  form.qq = p.qq != null ? String(p.qq) : '';
  form.remark = p.remark != null ? String(p.remark) : '';
}

const { run: fetchProfile, loading: profileLoading } = useRequest(getCurrentUserService, {
  manual: true,
  onSuccess: (res) => {
    applyProfile(res?.data ?? undefined);
  },
  onError: () => {
    /* 进入页静默刷新，失败不打断操作 */
  }
});

const { run: saveProfile, loading: saving } = useRequest(updateUserProfileService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage(t('profile.updateSuccess'));
    fetchProfile();
  },
  onError: (err) => err.showMessage()
});

onMounted(() => {
  fetchProfile();
});

function handleSave() {
  formRef.value?.validate((errors) => {
    if (errors) return;
    const nickname = form.nickname.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const qq = form.qq.trim();
    const remark = form.remark.trim();
    saveProfile({
      nickname: nickname || undefined,
      email: email || undefined,
      phone: phone || undefined,
      qq: qq || undefined,
      remark: remark || undefined
    });
  });
}

function handleDeleteAccount() {
  dialog.warning({
    title: t('profile.deleteAccountTitle'),
    content: t('profile.deleteAccountWarning'),
    positiveText: t('profile.deleteAccountConfirm'),
    negativeText: t('common.cancel'),
    positiveButtonProps: { type: 'error' },
    onPositiveClick: () => {
      showInfoMessage(t('profile.deleteAccountNotSupported'));
      return true;
    }
  });
}
</script>

<template>
  <div class="cms-page">
    <header class="mb-4 shrink-0">
      <h1 class="cms-page-title">
        {{ $t('route.profileInfo') }}
      </h1>
      <p class="cms-page-desc">
        {{ t('profile.infoDesc') }}
      </p>
    </header>

    <NCard
      class="min-h-0 flex flex-1 flex-col overflow-hidden"
      :bordered="false"
      content-style="padding: 0; display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;">
      <NSpin
        :show="profileLoading"
        class="profile-info-spin min-h-0 flex flex-1 flex-col">
        <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <NForm
            ref="formRef"
            class="flex min-h-0 flex-1 flex-col overflow-hidden"
            :model="form"
            :rules="rules"
            label-placement="top"
            require-mark-placement="right-hanging">
            <NScrollbar
              class="min-h-0 flex-1 basis-0"
              trigger="hover">
              <NSpace
                vertical
                :size="16"
                class="box-border p-5">
                <div class="flex items-center gap-4">
                  <NTooltip
                    :show-arrow="false"
                    placement="bottom">
                    <template #trigger>
                      <NAvatar
                        :size="AVATAR_SIZE"
                        round
                        :src="displayAvatarSrc"
                        object-fit="cover"
                        class="shrink-0 !bg-[var(--n-color-embedded)]">
                        <NIcon
                          :size="26"
                          :component="UserCircle" />
                      </NAvatar>
                    </template>
                    {{ t('profile.avatarReadonly') }}
                  </NTooltip>
                  <div class="min-w-0 flex-1">
                    <p class="m-0 truncate text-base font-medium text-[var(--n-text-color)]">
                      {{ displayTitle }}
                    </p>
                    <p
                      v-if="displaySubtitle"
                      class="mt-0.5 m-0 truncate text-sm text-[var(--n-text-color-3)]">
                      {{ displaySubtitle }}
                    </p>
                  </div>
                </div>

                <NDivider class="!my-0" />

                <div class="profile-form-grid grid grid-cols-1 gap-x-5 gap-y-2 lg:grid-cols-2 lg:gap-y-3">
                  <NFormItem
                    class="min-w-0"
                    :label="t('profile.fieldNickname')"
                    path="nickname">
                    <NInput
                      v-model:value="form.nickname"
                      :placeholder="t('profile.fieldNickname')" />
                  </NFormItem>
                  <NFormItem
                    class="min-w-0"
                    :label="t('profile.fieldEmail')"
                    path="email">
                    <NInput
                      v-model:value="form.email"
                      :placeholder="t('profile.fieldEmail')" />
                  </NFormItem>
                  <NFormItem
                    class="min-w-0"
                    :label="t('profile.fieldPhone')"
                    path="phone">
                    <NInput
                      v-model:value="form.phone"
                      :placeholder="t('profile.fieldPhone')" />
                  </NFormItem>
                  <NFormItem
                    class="min-w-0"
                    :label="t('profile.fieldQq')"
                    path="qq">
                    <NInput
                      v-model:value="form.qq"
                      :placeholder="t('profile.fieldQq')" />
                  </NFormItem>
                  <NFormItem
                    class="min-w-0 lg:col-span-2"
                    :label="t('profile.fieldRemark')"
                    path="remark">
                    <NInput
                      v-model:value="form.remark"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      :placeholder="t('profile.fieldRemark')" />
                  </NFormItem>
                </div>
              </NSpace>
            </NScrollbar>
          </NForm>

          <div
            class="shrink-0 border-t border-[var(--n-border-color)] px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            <div class="flex flex-wrap items-center gap-3">
              <NButton
                type="primary"
                :loading="saving"
                :disabled="profileLoading"
                @click="handleSave">
                {{ t('profile.save') }}
              </NButton>
              <NButton
                secondary
                type="error"
                :disabled="profileLoading"
                @click="handleDeleteAccount">
                {{ t('profile.deleteAccount') }}
              </NButton>
            </div>
          </div>
        </div>
      </NSpin>
    </NCard>
  </div>
</template>
