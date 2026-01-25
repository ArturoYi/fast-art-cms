<script lang="ts" setup>
import { NCard, NProgress, NScrollbar, NTabs, NTabPane } from 'naive-ui';
import { computed } from 'vue';
import type { Cpu } from '@/api/client/DTO/serverInfoDTO';
import type { FetchClientError } from '@/api/feachHook/types';

const props = defineProps<{
    cpu?: Cpu;
    loading?: boolean;
    error?: FetchClientError;
}>();
/**
 * 计算每个核心的使用率
 * @returns {Array<{index: number, usage: number}>}
 */
const coresUsage = computed(() => {
    if (!props.cpu?.coresLoad || props.cpu.coresLoad.length === 0) return [];
    return props.cpu.coresLoad.map((core, index) => {
        if (!core.rawLoad || !core.rawLoadIdle) return { index, usage: 0 };
        const total = core.rawLoad + core.rawLoadIdle;
        if (total === 0) return { index, usage: 0 };
        return { index: index + 1, usage: Math.round((core.rawLoad / total) * 100) };
    });
});

/**
 * 计算平均使用率
 * @returns {number}
 */
const averageUsage = computed(() => {
    if (!props.cpu?.coresLoad || props.cpu.coresLoad.length === 0) return 0;
    let total = 0;
    let totalIdle = 0;
    for (const core of props.cpu.coresLoad) {
        total += typeof core.rawLoad === 'number' ? core.rawLoad : 0;
        totalIdle += typeof core.rawLoadIdle === 'number' ? core.rawLoadIdle : 0;
    }
    const sum = total + totalIdle;
    if (sum === 0) return 0;
    return Math.round((total / sum) * 100);
});

/**
 * 解构CPU信息并添加平均使用率
 * @returns {ComputedRef<Cpu & { averageUsage: number; coresUsage: { index: number; usage: number }[] }>}
 */
const showCpu = computed(() => {
    return {
        ...props.cpu,
        averageUsage: averageUsage.value,
        coresUsage: coresUsage.value,
    };
})
</script>

<style scoped>
:deep(.n-scrollbar) {
  height: 100%;
}
</style>

<template>
  <NCard :title="$t('dashboard.cpu.title')">
    <div class="flex flex-col gap-4 h-full">
      <div class="flex flex-row gap-4 flex-wrap justify-between">
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.cpu.manufacturer') }}</div>
          <div class="text-base">{{ showCpu.manufacturer || '-' }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.cpu.brand') }}</div>
          <div class="text-base">{{ showCpu.brand || '-' }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.cpu.speed') }}</div>
          <div class="text-base">{{ showCpu.speed ? `${showCpu.speed} GHz` : '-' }}</div>
        </div>
        <div>
          <div class="text-gray-500 text-sm mb-1">{{ $t('dashboard.cpu.physicalCores') }}</div>
          <div class="text-base">{{ showCpu.physicalCores || '-' }}</div>
        </div>
      </div>
      <NTabs
        default-value="averageUsage"
        justify-content="space-evenly"
        type="segment"
        animated>
        <NTabPane
          name="averageUsage"
          :tab="$t('dashboard.cpu.averageUsage')"
          :class="['h-210px']">
          <div class="w-full h-full flex flex-col items-center justify-center pt-6">
            <NProgress
              style="transform: scale(1.3)"
              type="dashboard"
              :stroke-width="12"
              gap-position="bottom"
              :percentage="showCpu.averageUsage" />
          </div>
        </NTabPane>
        <NTabPane
          name="cpuUsage"
          :tab="$t('dashboard.cpu.cpuUsage')"
          :class="['h-210px']">
          <NScrollbar class="h-full">
            <div class="space-y-4 p-4">
              <div
                v-if="coresUsage.length === 0"
                class="text-gray-400 text-center py-8">
                {{ $t('dashboard.cpu.noCoreData') }}
              </div>
              <div
                v-for="core in coresUsage"
                :key="core.index"
                class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">{{ $t('dashboard.cpu.core') }} {{ core.index }}</span>
                  <span class="text-sm text-gray-500">{{ core.usage }}%</span>
                </div>
                <NProgress
                  type="line"
                  :percentage="core.usage"
                  :show-indicator="false"
                  :border-radius="4"
                  :height="8" />
              </div>
            </div>
          </NScrollbar>
        </NTabPane>
      </NTabs>
    </div>
  </NCard>
</template>
