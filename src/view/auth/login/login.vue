<script setup lang="ts">
import { computed, ref } from 'vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import { $t } from '@/locale';
import AuthPanel from '@/view/auth/components/AuthPanel.vue';
import { NButton } from 'naive-ui';

const mode = ref<'login' | 'register'>('login');

const authTitle = computed(() => {
  return mode.value === 'login' ? $t('common.login') : $t('common.register');
});

const activeFormComponent = computed(() => {
  return mode.value === 'login' ? LoginForm : RegisterForm;
});

const formComponentRef = ref<InstanceType<typeof LoginForm | typeof RegisterForm> | null>(null);

function switchMode(nextMode: 'login' | 'register') {
  mode.value = nextMode;
}

/* ---------- bottom buttons ---------- */
const submitLabel = computed(() =>
  mode.value === 'login' ? $t('common.login') : $t('common.register')
);

const switchLabel = computed(() =>
  mode.value === 'login' ? $t('common.register') : $t('register.backToLogin')
);

const showForgotPassword = computed(() => mode.value === 'login');

function handleSubmit() {
  (formComponentRef.value as any)?.submit?.();
}

function handleSwitchMode() {
  switchMode(mode.value === 'login' ? 'register' : 'login');
}

const submitLoading = computed(() => {
  return (formComponentRef.value as any)?.loading ?? false;
});
</script>
<template>
  <AuthPanel :title="authTitle">
    <Transition
      name="auth-form"
      mode="out-in">
      <component
        :is="activeFormComponent"
        ref="formComponentRef"
        :key="mode"
        @switch-mode="switchMode" />
    </Transition>

    <!-- Shared bottom actions — outside Transition to avoid flicker -->
    <div class="auth-bottom-actions">
      <div class="auth-switch-row">
        <NButton
          text
          type="primary"
          @click="handleSwitchMode">
          {{ switchLabel }}
        </NButton>
        <NButton
          v-if="showForgotPassword"
          text
          type="primary">
          {{ $t('common.forgotPassword') }}
        </NButton>
      </div>
      <NButton
        attr-type="button"
        size="large"
        :loading="submitLoading"
        block
        type="primary"
        @click="handleSubmit">
        {{ submitLabel }}
      </NButton>
    </div>
  </AuthPanel>
</template>
<style scoped>
.auth-bottom-actions {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-form-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.auth-form-leave-active {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 1, 1),
    transform 0.18s cubic-bezier(0.4, 0, 1, 1);
  will-change: opacity, transform;
}

.auth-form-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.auth-form-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
