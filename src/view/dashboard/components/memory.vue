<script lang="ts" setup>
import { NCard, NProgress } from 'naive-ui';
import { computed } from 'vue';
import type { Memory } from '@/api/client/DTO/serverInfoDTO';
import type { FetchClientError } from '@/api/feachHook/types';

const props = defineProps<{
  memory?: Memory;
  loading?: boolean;
  error?: FetchClientError;
}>();

// 格式化字节大小
const formatBytes = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 0) return '-';
  if(props.error) return '-';
  if(props.loading) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

// 计算内存使用率
const memoryUsage = computed(() => {
  if (!props.memory?.total || !props.memory?.available) return 0;
  const used = props.memory.total - props.memory.available;
  return Math.round((used / props.memory.total) * 100);
});

const showMemory = computed(() => {
  return {
    ...props.memory,
    memoryUsage: memoryUsage.value,
  };
});
</script>

<template>
  <NCard :title="$t('dashboard.memory.title')">
    <div class="space-y-4">
      <div
        flex
        flex-row
        gap-4
        flex-wrap
        justify-between>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.memory.total') }}</div>
          <div class="text-base">{{ formatBytes(showMemory.total) }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.memory.available') }}</div>
          <div class="text-base">{{ formatBytes(showMemory.available) }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.memory.used') }}</div>
          <div class="text-base">
            {{ formatBytes(showMemory.total && showMemory.available ? showMemory.total - showMemory.available : undefined) }}
          </div>
        </div>
      </div>
      <div>
        <div class="text-gray-500 text-sm mb-2">{{ $t('dashboard.memory.usage') }}</div>
        <NProgress
          processing
          type="line"
          :percentage="showMemory.memoryUsage"
          :show-indicator="true"
          :border-radius="4" />
      </div>
    </div>
  </NCard>
</template>
