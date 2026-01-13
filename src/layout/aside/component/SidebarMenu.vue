<script setup lang="ts">
import { NScrollbar, NMenu } from 'naive-ui';
import { MenuProcessor } from '@/router/core/MenuProcessor';
import { computed } from 'vue';
const menuOptions = computed(() => MenuProcessor.getInstance().getMenuList());
</script>

<style scoped lang="scss"></style>
<template>
  <NScrollbar>
    <NMenu :options="menuOptions" />
  </NScrollbar>
</template>
