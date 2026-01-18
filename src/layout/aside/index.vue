<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";

// 获取媒体查询信息，用于判断屏幕尺寸
const { isMaxSm } = useInjection(mediaQueryInjectionKey);

// 懒加载桌面端侧边栏菜单组件
const SideBarMenuDesktop = defineAsyncComponent(
  () => import("@/layout/aside/component/SideBarMenuDesktop.vue")
);

// 懒加载移动端侧边栏菜单组件
const SideBarMenuMobile = defineAsyncComponent(
  () => import("@/layout/aside/component/SideBarMenuMobile.vue")
);
</script>

<template>
  <!-- 桌面端：当屏幕宽度大于 sm（640px）时显示 -->
  <SideBarMenuDesktop v-if="!isMaxSm" />
  <!-- 移动端：当屏幕宽度小于等于 sm（640px）时显示 -->
  <SideBarMenuMobile v-else />
</template>
