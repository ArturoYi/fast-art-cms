<script setup lang="ts">
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NIcon,
} from "naive-ui";
import { UserCircle, ShieldLock } from "@vicons/tabler";
import AuthBackground from "@/view/auth/components/AuthBackground.vue";
import { ref, reactive, watch } from "vue";
import ChangeLang from "@/components/change-lang/ChangeLang.vue";
import ChangeTheme from "@/components/change-theme/ChangeTheme.vue";
import { useRequest } from "@/api/feachHook/useRequest";
import { loginService } from "@/api/client";
import { $t } from "@/locale";
import { useLanguage } from "@/hook/useLanguage";
import { useUserStore } from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
const store = useUserStore();
const router = useRouter();
const route = useRoute();
//监听语言切换
const { getCurrentLocale } = useLanguage();

watch(getCurrentLocale, (_) => {
  //清除表单验证
  formRef.value?.restoreValidation();
});

// 表单数据
const loginForm = reactive({
  username: "chenyiren",
  password: "cyr68611",
  captchaId: "9f1c2a3b4d5e6f7g",
  verifyCode: "A1B2",
});

// 表单验证规则
const formRules = {
  username: [
    {
      asyncValidator: async (_rule: any, value: string) => {
        // 模拟异步验证延迟
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!value || value.trim() === "") {
          return Promise.reject(new Error($t("login.usernameRequired")));
        }
        return Promise.resolve();
      },
      trigger: ["blur", "input"],
    },
    {
      asyncValidator: async (_rule: any, value: string) => {
        // 模拟异步验证延迟
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (value && (value.length < 3 || value.length > 20)) {
          return Promise.reject(new Error($t("login.usernameLength")));
        }
        return Promise.resolve();
      },
      trigger: ["blur", "input"],
    },
  ],
  password: [
    {
      asyncValidator: async (_rule: any, value: string) => {
        // 模拟异步验证延迟
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!value || value.trim() === "") {
          return Promise.reject(new Error($t("login.passwordRequired")));
        }
        return Promise.resolve();
      },
      trigger: ["blur", "input"],
    },
    {
      asyncValidator: async (_rule: any, value: string) => {
        // 模拟异步验证延迟
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (value && (value.length < 6 || value.length > 20)) {
          return Promise.reject(new Error($t("login.passwordLength")));
        }
        return Promise.resolve();
      },
      trigger: ["blur", "input"],
    },
  ],
};

// 表单引用
const formRef = ref<InstanceType<typeof NForm>>();

// API请求
const { run, loading } = useRequest(loginService, {
  manual: true,
  defaultParams: [loginForm],
  loadingKeep: 1000,
  onSuccess: (data) => {
    const token = data?.data?.token;
    if (token) {
      store.setAccessToken(token);
      // 获取 redirect 参数，如果存在则跳转到指定页面，否则跳转到首页
      const redirect = route.query.redirect as string;
      router.push(redirect || "/");
    }
  },
  onError: (error) => {
    error.showMessage();
  },
});

// 登录提交方法
const handleLogin = async (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      run(loginForm);
    }
  });
};
</script>
<template>
  <AuthBackground>
    <NCard
      shadow-lg
      rounded-4
      w-88
      m-7
      flex
      flex-col
      justify-between>
      <div class="flex justify-end gap-x-4 w-full">
        <ChangeLang />
        <ChangeTheme />
      </div>
      <h1
        text-3xl
        font-bold>
        {{ $t("common.login") }}
      </h1>
      <NForm
        mt-12
        ref="formRef"
        :model="loginForm"
        :rules="formRules">
        <NFormItem
          :label="$t('login.username')"
          path="username">
          <NInput
            clearable
            v-model:value="loginForm.username">
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
            :input-props="{
            autocomplete: 'password',
          }"
            clearable
            type="password"
            show-password-on="click"
            v-model:value="loginForm.password">
            <template #prefix>
              <NIcon
                size="20"
                :component="ShieldLock" />
            </template>
          </NInput>
        </NFormItem>
        <!-- 去注册，忘记密码 -->
        <div
          flex
          justify-between
          mt-8>
          <NButton
            text
            type="primary"
            >{{ $t("common.register") }}</NButton
          >
          <NButton
            text
            type="primary"
            >{{
            $t("common.forgotPassword")
            }}</NButton
          >
        </div>
        <NButton
          attr-type="button"
          :loading="loading"
          mt-4
          block
          type="primary"
          @click.native="handleLogin"
          >{{
          $t("common.login") }}</NButton
        >
      </NForm>
    </NCard>
  </AuthBackground>
</template>
