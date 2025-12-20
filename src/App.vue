<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NModalProvider,
} from "naive-ui";
import { utilsInitialize } from "@/utils";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useTheme } from "@/hook/useTheme";
import { useLanguage } from "@/hook/useLanguage";

const { setSystemThemeModel, getCurrentNaiveTheme, getCurrentThemeOverrides } =
  useTheme();

const { getNaiveThemeLanguage, setLanguage, getNaiveThemeDatetimeFormat } =
  useLanguage();

onMounted(() => {
  utilsInitialize();
  setSystemThemeModel();
  setLanguage();
});
</script>

<template>
  <NConfigProvider
    :theme="getCurrentNaiveTheme"
    :theme-overrides="getCurrentThemeOverrides"
    :locale="getNaiveThemeLanguage"
    :date-locale="getNaiveThemeDatetimeFormat">
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <NModalProvider>
            <RouterView />
          </NModalProvider>
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>
