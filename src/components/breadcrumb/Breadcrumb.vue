<script setup lang="ts">
import { computed } from "vue";
import {
  NDropdown,
  NIcon,
  type DropdownOption,
  NBreadcrumb,
  NBreadcrumbItem,
} from "naive-ui";
import { useRoute, useRouter, type RouteLocationMatched, type RouteRecordRaw } from "vue-router";

const router = useRoute();
const route = useRouter();

// 获取路由面包屑列表
const routeBreadcrumbList = computed(() => {
  return router.matched.filter((item) => item.name !== "layout");
});

// 是否可以显示下拉菜单,children为数组且长度大于0时，显示下拉菜单
const disableDropdown = (breadcrumbItem: RouteLocationMatched) => {
  if (!breadcrumbItem.children || breadcrumbItem.children.length === 0) {
    return true;
  }
  return false;
};

// 获取面包屑选项的子选项
const getChildrenOptions = (children: RouteRecordRaw[]): DropdownOption[] => children.map((child) => {
  return {
    label:child.meta?.title,
    key: String(child.path),
    children: (child.children && child.children.length > 0) ? getChildrenOptions(child.children) : undefined,
  };
});

// 获取面包屑选项
const getOptions = (breadcrumbItem: RouteLocationMatched): DropdownOption[] => {
  if (!breadcrumbItem.children || breadcrumbItem.children.length === 0) {
    return [];
  }
  return getChildrenOptions(breadcrumbItem.children);
};

// 处理下拉菜单选择
const handleSelect = (key: string) => {
  route.push(key);
};
</script>
<template>
  <NBreadcrumb class="flex items-center">
    <NBreadcrumbItem
      clickable
      v-for="breadcrumbItem in routeBreadcrumbList"
      :key="String(breadcrumbItem.path)">
      <n-dropdown
        :disabled="disableDropdown(breadcrumbItem)"
        :options="getOptions(breadcrumbItem)"
        @select="handleSelect">
        <span v-if="!disableDropdown(breadcrumbItem)">
          <NIcon
            v-if="breadcrumbItem.meta && breadcrumbItem.meta.icon"
            :component="breadcrumbItem.meta.icon" />
          <span class="mx-1"></span>
          <span>{{ breadcrumbItem.meta.title }}</span>
        </span>
        <RouterLink
          v-else
          :to="breadcrumbItem.path">
          <NIcon
            v-if="breadcrumbItem.meta && breadcrumbItem.meta.icon"
            :component="breadcrumbItem.meta.icon" />
          <span class="mx-1"></span>
          <span>{{ breadcrumbItem.meta.title }}</span>
        </RouterLink>
      </n-dropdown>
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>
