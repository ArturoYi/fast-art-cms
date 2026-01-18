<script setup lang="ts">
import { NDrawer, NMenu } from "naive-ui";
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
// 计算属性：从 store 获取抽屉显示状态（响应式）
const showDrawer = computed({
  get: () => layoutStore.isMobileDrawerVisible,
  set: (value: boolean) => {
    layoutStore.setMobileDrawerVisible(value);
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
    // 更新激活的菜单项 key，由路由路径和路由名称组合而成
    menuActiveKey.value = String(newPath);
    // 移动端：路由变化时自动关闭抽屉
    layoutStore.closeMobileDrawer();
  },
  // 监听选项：immediate 为 true 表示立即执行一次回调函数
  { immediate: true }
);
// 抽屉的宽度
const drawerWidth = 280;
// 菜单图标尺寸
const iconSize = 22;

// 暴露方法：打开抽屉
const open = () => {
  layoutStore.openMobileDrawer();
};

// 暴露方法：关闭抽屉
const close = () => {
  layoutStore.closeMobileDrawer();
};

// 暴露方法：切换抽屉显示状态
const toggle = () => {
  layoutStore.toggleMobileDrawer();
};

// 暴露给父组件的方法
defineExpose({
  open,
  close,
  toggle
});
</script>

<template>
  <!-- Naive UI 抽屉组件 - 移动端版本 -->
  <NDrawer
    v-model:show="showDrawer"
    :width="drawerWidth"
    placement="left"
    :trap-focus="false"
    :block-scroll="true">
    <Logo />
    <!-- Naive UI 菜单组件 -->
    <NMenu
      :options="menuOptions"
      :value="menuActiveKey"
      :collapsed="false"
      :collapsed-width="drawerWidth"
      :collapsed-icon-size="iconSize" />
  </NDrawer>
</template>
