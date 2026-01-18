<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import { NButton, NIcon, NTooltip } from "naive-ui";
import { ArrowsMaximize, ArrowsMinimize } from "@vicons/tabler";
import { computed } from "vue";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import { $t } from "@/locale";

const { isMaxSm } = useInjection(mediaQueryInjectionKey);

// 使用 useFullscreen 获取全屏状态和控制函数
// 不传参数时，默认全屏整个文档
const { isFullscreen, enter, exit } = useFullscreen();

// 计算属性：根据全屏状态返回对应的图标
const currentIcon = computed(() => {
  return isFullscreen.value ? ArrowsMinimize : ArrowsMaximize;
});

// 计算属性：根据全屏状态返回对应的提示文本
const tooltipText = computed(() => {
  return isFullscreen.value ? $t("common.exitFullscreen") : $t("common.fullscreen");
});

// 切换全屏状态的函数
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exit();
  } else {
    enter();
  }
};
</script>

<template>
  <NTooltip
    trigger="hover"
    :disabled="isMaxSm"
    placement="bottom">
    <template #trigger>
      <NButton
        tertiary
        circle
        @click="toggleFullscreen">
        <template #icon>
          <NIcon>
            <component :is="currentIcon" />
          </NIcon>
        </template>
      </NButton>
    </template>
    {{ tooltipText }}
  </NTooltip>
</template>
