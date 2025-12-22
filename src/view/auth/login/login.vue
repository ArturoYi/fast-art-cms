<script setup lang="ts">
import { NCard, NForm, NFormItem, NInput, NButton } from "naive-ui";
import AuthBackground from "@/view/auth/components/AuthBackground.vue";
import { ref, reactive } from "vue";
import ChangeLang from "@/components/change-lang/ChangeLang.vue";
import ChangeTheme from "@/components/change-theme/ChangeTheme.vue";
// import { useDeviceStore } from "@/store/modules/device";
// import { storeToRefs } from "pinia";
// const deviceStore = useDeviceStore();
// const { isMobile } = storeToRefs(deviceStore);

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

// 提交状态
const loading = ref(false);

// 登录提交方法
const handleLogin = async (e: MouseEvent) => {
  try {
    e.preventDefault();
    formRef.value?.validate((errors: any) => {
      if (!errors) {
        //正确
      }
    });
    loading.value = true;
    await formRef.value?.validate();
  } catch (error) {
    // 表单验证失败，错误信息由 naive-ui 处理
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <AuthBackground>
    <NCard
      shadow-lg
      rounded-4
      w-98
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
            v-model:value="loginForm.username" />
        </NFormItem>
        <NFormItem
          label="密码"
          path="password">
          <NInput
            :input-props="{
              autocomplete: 'password',
            }"
            clearable
            type="password"
            show-password-on="click"
            v-model:value="loginForm.password" />
        </NFormItem>
        <!-- 去注册，忘记密码 -->
        <div
          flex
          justify-between>
          <NButton>去注册</NButton>
          <NButton>忘记密码</NButton>
        </div>
        <NFormItem>
          <NButton
            attr-type="button"
            block
            type="primary"
            @click.native="handleLogin"
            >登录</NButton
          >
        </NFormItem>
      </NForm>
    </NCard>
  </AuthBackground>
</template>
