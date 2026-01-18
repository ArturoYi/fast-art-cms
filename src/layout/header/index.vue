<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";

// 获取媒体查询信息，用于判断屏幕尺寸
const { isMaxSm } = useInjection(mediaQueryInjectionKey);

// 懒加载桌面端头部组件
const HeaderDesktop = defineAsyncComponent(
  () => import("@/layout/header/desktop/index.vue")
);

// 懒加载移动端头部组件
const HeaderMobile = defineAsyncComponent(
  () => import("@/layout/header/mobile/index.vue")
);
</script>

<template>
  <header>
    <!-- 桌面端：当屏幕宽度大于 sm（640px）时显示 -->
    <HeaderDesktop v-if="!isMaxSm" />
    <!-- 移动端：当屏幕宽度小于等于 sm（640px）时显示 -->
    <HeaderMobile v-else />
  </header>
</template>
