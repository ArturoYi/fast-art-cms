<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useLanguage } from '@/hook/useLanguage';
import { $t } from '@/locale';
import { showSuccessMessage } from '@/utils/message';
import { getCaptchaService, registerService } from '@/api/client';
import { useRequest } from '@/api/feachHook/useRequest';
import { useUserStore } from '@/store/modules/user';
import { NButton, NForm, NFormItem, NIcon, NInput } from 'naive-ui';
import { ShieldLock, UserCircle } from '@vicons/tabler';

const emit = defineEmits<{
  switchMode: [mode: 'login'];
}>();

const userStore = useUserStore();
const { getCurrentLocale } = useLanguage();

const registerForm = reactive({
  username: '',
  password: '',
  captchaId: '',
  verifyCode: ''
});

const formRef = ref<InstanceType<typeof NForm>>();
const captchaSvg = ref('');
const captchaLoading = ref(false);
const captchaCountdown = ref(0);

watch(getCurrentLocale, () => {
  formRef.value?.restoreValidation();
});

function captchaImageToDataUrl(image: string): string {
  const value = image.trim();
  if (!value) return '';
  if (value.startsWith('data:')) return value;
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  if (/<\s*svg[\s>]/i.test(value)) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(image)}`;
  }
  return `data:image/svg+xml;base64,${value.replace(/\s/g, '')}`;
}

const captchaImageSrc = computed(() => captchaImageToDataUrl(captchaSvg.value));
let captchaCountdownTimer: ReturnType<typeof setInterval> | null = null;

function clearCaptchaCountdownTimer() {
  if (captchaCountdownTimer !== null) {
    clearInterval(captchaCountdownTimer);
    captchaCountdownTimer = null;
  }
}

function startCaptchaCountdown() {
  captchaCountdown.value = 60;
  clearCaptchaCountdownTimer();
  captchaCountdownTimer = window.setInterval(() => {
    if (captchaCountdown.value <= 1) {
      captchaCountdown.value = 0;
      clearCaptchaCountdownTimer();
      return;
    }
    captchaCountdown.value -= 1;
  }, 1000);
}

async function loadCaptcha() {
  if (captchaLoading.value || captchaCountdown.value > 0) return;
  captchaLoading.value = true;
  try {
    const res = await getCaptchaService();
    const payload = res?.data;
    if (payload?.captchaId != null && payload.image != null) {
      registerForm.captchaId = payload.captchaId;
      captchaSvg.value = payload.image;
      registerForm.verifyCode = '';
      startCaptchaCountdown();
    }
  } finally {
    captchaLoading.value = false;
  }
}

onMounted(() => {
  // 进入注册面板时预拉一次验证码，避免首次提交缺少 captchaId
  loadCaptcha();
});

onUnmounted(() => {
  clearCaptchaCountdownTimer();
});

const formRules = {
  username: [
    {
      asyncValidator: async (_rule: unknown, value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!value || value.trim() === '') {
          return Promise.reject(new Error($t('login.usernameRequired')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'input']
    },
    {
      asyncValidator: async (_rule: unknown, value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (value && (value.length < 3 || value.length > 20)) {
          return Promise.reject(new Error($t('login.usernameLength')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'input']
    }
  ],
  password: [
    {
      asyncValidator: async (_rule: unknown, value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!value || value.trim() === '') {
          return Promise.reject(new Error($t('login.passwordRequired')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'input']
    },
    {
      asyncValidator: async (_rule: unknown, value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (value && (value.length < 6 || value.length > 20)) {
          return Promise.reject(new Error($t('login.passwordLength')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'input']
    }
  ],

  verifyCode: [
    {
      asyncValidator: async (_rule: unknown, value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (!registerForm.captchaId) {
          return Promise.reject(new Error($t('login.captchaMissing')));
        }
        if (!value || value.trim() === '') {
          return Promise.reject(new Error($t('login.verifyCodeRequired')));
        }
        if (value.trim().length !== 4) {
          return Promise.reject(new Error($t('login.verifyCodeLength')));
        }
        return Promise.resolve();
      },
      trigger: ['blur', 'input']
    }
  ]
};

const { run, loading } = useRequest(registerService, {
  manual: true,
  onSuccess: () => {
    showSuccessMessage($t('register.registerSuccess'));
    emit('switchMode', 'login');
  },
  onError: (error) => {
    error.showMessage();
    loadCaptcha();
  }
});

function handleRegister(e?: MouseEvent) {
  e?.preventDefault();
  formRef.value?.validate((errors: unknown) => {
    if (!errors) {
      run({
        ...registerForm,
        lang: userStore.getCurrentLocale
      });
    }
  });
}

defineExpose({
  submit: handleRegister,
  loading
});
</script>

<template>
  <NForm
    mt-12
    ref="formRef"
    :model="registerForm"
    :rules="formRules">
    <NFormItem
      :label="$t('login.username')"
      path="username">
      <NInput
        size="large"
        clearable
        v-model:value="registerForm.username">
        <template #prefix>
          <NIcon
            size="20"
            :component="UserCircle" />
        </template>
      </NInput>
    </NFormItem>
    <NFormItem
      mt-2
      :label="$t('login.password')"
      path="password">
      <NInput
        size="large"
        :input-props="{
          autocomplete: 'new-password'
        }"
        clearable
        type="password"
        show-password-on="click"
        v-model:value="registerForm.password">
        <template #prefix>
          <NIcon
            size="20"
            :component="ShieldLock" />
        </template>
      </NInput>
    </NFormItem>

    <NFormItem
      mt-2
      :label="$t('login.verifyCode')"
      path="verifyCode">
      <div class="captcha-section">
        <div class="captcha-row">
          <div class="captcha-svg-box">
            <img
              v-if="captchaImageSrc"
              class="captcha-img"
              alt=""
              role="presentation"
              draggable="false"
              :src="captchaImageSrc" />
          </div>
          <NButton
            class="captcha-btn"
            type="primary"
            :loading="captchaLoading"
            :disabled="captchaLoading || captchaCountdown > 0"
            :title="$t('login.captchaGet')"
            @click="loadCaptcha">
            {{ captchaCountdown > 0 ? `${captchaCountdown}s` : $t('login.captchaGet') }}
          </NButton>
        </div>
        <NInput
          size="large"
          v-model:value="registerForm.verifyCode"
          :maxlength="4"
          clearable
          :placeholder="$t('login.verifyCode')" />
      </div>
    </NFormItem>
  </NForm>
</template>

<style scoped>
.captcha-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.captcha-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.captcha-svg-box {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}

.captcha-btn {
  height: 40px;
  min-width: 100px;
  flex-shrink: 0;
}

.captcha-img {
  height: 100%;
  width: auto;
  display: block;
  user-select: none;
  pointer-events: none;
}
</style>
