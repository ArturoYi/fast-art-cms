<script lang="ts" setup>
import { useRequest } from '@/api/feachHook/useRequest';
import { NScrollbar } from 'naive-ui';
import { getUserInfoService } from '@/api/client';
import { computed } from 'vue';
import { useInjection } from '@/hook/useInjection';
import { mediaQueryInjectionKey } from '@/injection';
import CpuComponent from './components/cpu.vue';
import DiskComponent from './components/disk.vue';
import MemoryComponent from './components/memory.vue';

// 获取媒体查询信息，用于判断屏幕尺寸
const { isMaxLg } = useInjection(mediaQueryInjectionKey);

const { data: serverInfo, loading: serverInfoLoading,error: serverInfoError  } = useRequest(getUserInfoService,{
  cacheKey: 'serverInfo',
});

/**
 * 解构服务器信息数据
 * @type {Cpu}
 * @type {Disk}
 * @type {Memory}
 */
const cpu = computed(() => serverInfo.value?.data?.cpu);
const disk = computed(() => serverInfo.value?.data?.disk);
const memory = computed(() => serverInfo.value?.data?.memory);
</script>
<template>
  <NScrollbar>
    <div
      p-6
      flex
      gap-4
      items-stretch
      h-460px
      :class="isMaxLg ? 'flex-col' : 'flex-row'">
      <!-- CPU 信息 -->
      <CpuComponent
        :cpu="cpu"
        :loading="serverInfoLoading"
        :error="serverInfoError"
        :class="[isMaxLg ? 'w-full' : 'w-[50%]',]" />

      <div
        flex
        flex-col
        justify-between
        :class="[isMaxLg ? 'w-full' : 'w-[50%]',isMaxLg ? 'gap-5':'gap-0', 'h-full']">
        <!-- 磁盘信息 -->
        <DiskComponent
          :disk="disk"
          :loading="serverInfoLoading"
          :error="serverInfoError" />
        <!-- 内存信息 -->
        <MemoryComponent
          :memory="memory"
          :loading="serverInfoLoading"
          :error="serverInfoError" />
      </div>
    </div>
  </NScrollbar>
</template>
