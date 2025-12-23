<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton, NIcon, useMessage } from "naive-ui";
import { UserCircle, ShieldLock } from "@vicons/tabler";
import AuthBackground from "@/view/auth/components/AuthBackground.vue";
import { ref, reactive } from "vue";
import ChangeLang from "@/components/change-lang/ChangeLang.vue";
import ChangeTheme from "@/components/change-theme/ChangeTheme.vue";
import { useRequest } from "@/api/feachHook/useRequest";
import { loginService } from "@/api/client";
const message = useMessage()
// 表单数据
const loginForm = reactive({
  username: "",
  password: "",
});

// 表单验证规则
const formRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: ["blur", "input"],
    },
    {
      min: 3,
      max: 20,
      message: "用户名长度应在 3-20 个字符之间",
      trigger: ["blur", "input"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["blur", "input"],
    },
    {
      min: 6,
      max: 20,
      message: "密码长度应在 6-20 个字符之间",
      trigger: ["blur", "input"],
    },
  ],
};

// 表单引用
const formRef = ref();

// API请求
const { run, loading } = useRequest(loginService, {
  manual: true,
  defaultParams: [loginForm],
  loadingKeep: 1000,
  onSuccess: (data) => {
    message.success("登录成功: " + data.message);
  },
  onError: (error) => {
    message.error("登录失败: " + error.message);
  },
});

// 登录提交方法
const handleLogin = async (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      run(loginForm);
    }else{
      message.error(errors[0].message);
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
      <div
        w-full
        flex
        gap-x-4
        justify-end>
        <ChangeLang /> <ChangeTheme />
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
          label="用户名"
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
          label="密码"
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
            >去注册</NButton
          >
          <NButton
            text
            type="primary"
            >忘记密码</NButton
          >
        </div>
        <NButton
          attr-type="button"
          :loading="loading"
          mt-4
          block
          type="primary"
          @click.native="handleLogin"
          >登录</NButton
        >
      </NForm>
    </NCard>
  </AuthBackground>
</template>
