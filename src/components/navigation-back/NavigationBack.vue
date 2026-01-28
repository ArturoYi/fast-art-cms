<script setup lang="ts">
import { reactive, watch } from "vue";
import { NIcon, NButton, NTooltip } from "naive-ui";
import { ArrowBack } from "@vicons/tabler";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import { $t } from "@/locale";
import { router } from "@/router";

interface WindowWithNavigation extends Window {
  navigation?: { canGoBack: boolean; canGoForward: boolean; back(): void };
}
const win = window as WindowWithNavigation;

const { isMaxSm } = useInjection(mediaQueryInjectionKey);

const navigationState = reactive({
  canGoBack: true,
});

const stopWatch = watch(
  () => router.currentRoute.value,
  () => {
    if (!win.navigation) {
      stopWatch();
      return;
    }
    navigationState.canGoBack = win.navigation.canGoBack;
  },
  { immediate: true }
);

function goBack() {
  if (!navigationState.canGoBack) return;
  if (typeof win.navigation?.back === "function") {
    win.navigation.back();
  } else {
    router.back();
  }
}
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
        :disabled="!navigationState.canGoBack"
        @click="goBack">
        <template #icon>
          <NIcon>
            <ArrowBack />
          </NIcon>
        </template>
      </NButton>
    </template>
    <template #default>
      {{ $t("common.navigationBack") }}
    </template>
  </NTooltip>
</template>
