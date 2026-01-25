<script lang="ts" setup>
import { NCard, NSkeleton } from 'naive-ui';
import type { Runtime } from '@/api/client/DTO/serverInfoDTO';

defineProps<{
  runtime?: Runtime;
  loading?: boolean;
}>();
</script>

<template>
  <NCard title="运行时信息">
    <NSkeleton
      v-if="loading"
      :rows="4" />
    <div
      v-else-if="runtime"
      flex
      flex-row
      gap-4
      flex-wrap>
      <div>
        <div class="text-gray-500 text-sm mb-1">操作系统</div>
        <div class="text-base">{{ runtime.os || '-' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm mb-1">架构</div>
        <div class="text-base">{{ runtime.arch || '-' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm mb-1">Node.js 版本</div>
        <div class="text-base">{{ runtime.nodeVersion || '-' }}</div>
      </div>
      <div>
        <div class="text-gray-500 text-sm mb-1">npm 版本</div>
        <div class="text-base">{{ runtime.npmVersion || '-' }}</div>
      </div>
    </div>
    <div
      v-else
      class="text-gray-400">
      暂无数据
    </div>
  </NCard>
</template>
