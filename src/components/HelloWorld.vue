<script setup lang="ts">
import { useUserStore } from "../store/modules/user";
import { StorageKeyManager } from "../utils/storage/storage-key-manager";
import {
  getLanguageCode,
  LANGUAGE_EN_US,
  LANGUAGE_ZH_CN,
  type LanguageEnum,
} from "../enums/appEnum";
import { useI18n } from "vue-i18n";
import { loginService } from "@/api/client";
const userStore = useUserStore();
const { locale } = useI18n();
const switchLanguage = (language: LanguageEnum) => {
  userStore.user.language = language;
  locale.value = language;
  document.documentElement.lang = getLanguageCode(language);
};
const login = async () => {
  const result = await loginService({
    username: "chenyiren",
    password: "cyr68611",
    captchaId: "9f1c2a3b4d5e6f7g",
    verifyCode: "A1B2",
  });
  console.log(result.data);
};
</script>

<template>
  <div>
    <button @click="userStore.user.name = '李四'">修改名称</button>
    <h1>{{ userStore.user.name }}</h1>
    <button @click="userStore.user.age++">增加年龄</button>
    <h1>{{ $t("common.confirm") }}</h1>
    <h1>{{ userStore.user.age }}</h1>
    <button @click="StorageKeyManager.migrateAllData()">迁移数据</button>
    <button @click="switchLanguage(LANGUAGE_EN_US)">切换英文</button>
    <button @click="switchLanguage(LANGUAGE_ZH_CN)">切换中文</button>
    <button @click="login">登录</button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
