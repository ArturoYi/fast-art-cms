<script setup lang="ts">
import AuthBackground from "@/view/auth/components/AuthBackground.vue";
import { ref, reactive } from "vue";
import ChangeLang from "@/components/change-lang/ChangeLang.vue";
import ChangeTheme from "@/components/change-theme/ChangeTheme.vue";

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
const handleLogin = async () => {
  try {
    loading.value = true;
    await formRef.value?.validate();

    // TODO: 实现登录逻辑
    // console.log('登录数据:', loginForm);
  } catch (error) {
    // 表单验证失败，错误信息由 naive-ui 处理
  } finally {
    loading.value = false;
  }
};

// NOTE: 登录表单 UI 尚未接入时，避免 vue-tsc(noUnusedLocals) 报错
void loginForm;
void formRules;
void handleLogin;
</script>
<template>
  <AuthBackground>
    <ChangeLang />
    <ChangeTheme />
  </AuthBackground>
</template>
