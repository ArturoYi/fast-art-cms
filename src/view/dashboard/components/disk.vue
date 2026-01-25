<script lang="ts" setup>
import { NCard, NSkeleton, NProgress } from 'naive-ui';
import { computed } from 'vue';
import type { Disk } from '@/api/client/DTO/serverInfoDTO';
import type { FetchClientError } from '@/api/feachHook/types';

const props = defineProps<{
  disk?: Disk;
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

// 计算磁盘使用率
const diskUsage = computed(() => {
  if (!props.disk?.size || !props.disk?.used) return 0;
  return Math.round((props.disk.used / props.disk.size) * 100);
});

const showDisk = computed(() => {
  return {
    ...props.disk,
    diskUsage: diskUsage.value,
  };
});
</script>

<template>
  <NCard :title="$t('dashboard.disk.title')">
    <div class="space-y-4">
      <div
        flex
        flex-row
        gap-4
        flex-wrap
        justify-between>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.disk.totalSize') }}</div>
          <div class="text-base">{{ formatBytes(showDisk.size) }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.disk.used') }}</div>
          <div class="text-base">{{ formatBytes(showDisk.used) }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.disk.available') }}</div>
          <div class="text-base">{{ formatBytes(showDisk.available) }}</div>
        </div>
      </div>
      <div>
        <div class="text-gray-500 text-sm mb-2">{{ $t('dashboard.disk.usage') }}</div>
        <NProgress
          type="line"
          processing
          :percentage="diskUsage"
          :show-indicator="true"
          :border-radius="4" />
      </div>
    </div>
  </NCard>
</template>
