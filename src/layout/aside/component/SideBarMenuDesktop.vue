<script setup lang="ts">
import { NLayoutSider, NMenu } from "naive-ui";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { MenuProcessor } from "@/router/core/MenuProcessor";
import { useLayoutStore } from "@/store/modules/layout";
import Logo from "@/components/logo/logo.vue";

// 获取布局 store 实例
const layoutStore = useLayoutStore();

// 计算属性：获取菜单选项列表，通过 MenuProcessor 单例获取菜单数据
const menuOptions = computed(() => MenuProcessor.getInstance().getMenuList());
// 响应式引用：当前激活的菜单项的 key 值，初始值为空字符串
const menuActiveKey = ref("");
// 计算属性：从 store 获取侧边栏折叠状态（响应式）
const collapsed = computed({
  get: () => layoutStore.isCollapsed,
  set: (value: boolean) => {
    layoutStore.setCollapsed(value);
  }
});
// 获取当前路由对象，用于监听路由变化
const route = useRoute();
// 监听路由路径的变化
watch(
  // 监听源：路由的 path 属性
  () => route.path,
  // 回调函数：当路由路径变化时执行
  (newPath: string) => {
    // 更新激活的菜单项 key，由路由路径组成
    menuActiveKey.value = String(newPath);
  },
  // 监听选项：immediate 为 true 表示立即执行一次回调函数
  { immediate: true }
);
// 展开的菜单栏宽度
const expandedWidth = 240;
// 折叠的菜单栏宽度
const collapsedWidth = 64;
// 折叠的菜单栏图标尺寸
const collapsedIconSize = 22;
</script>

<template>
  <!-- Naive UI 侧边栏布局组件 - 桌面端版本 -->
  <NLayoutSider
    collapse-mode="width"
    :collapsed-width="collapsedWidth"
    :collapsed-icon-size="collapsedIconSize"
    v-model:collapsed="collapsed"
    :width="expandedWidth"
    show-trigger="arrow-circle"
    :native-scrollbar="false"
    bordered>
    <!-- 添加logo -->
    <Logo />
    <!-- Naive UI 菜单组件 -->
    <NMenu
      :width="expandedWidth"
      :options="menuOptions"
      :value="menuActiveKey"
      :collapsed="collapsed"
      :collapsed-width="collapsedWidth"
      :collapsed-icon-size="collapsedIconSize" />
  </NLayoutSider>
</template>
