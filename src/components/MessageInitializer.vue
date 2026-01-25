<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { setGlobalMessage } from '@/utils/message';

// 初始化全局消息实例
const message = useMessage();
setGlobalMessage(message);
</script>

<template>
  <!-- 此组件不渲染任何内容，仅用于初始化消息实例 -->
</template>
