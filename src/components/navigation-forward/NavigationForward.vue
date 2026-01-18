<script setup lang="ts">
import { reactive, watch } from "vue";
import { NIcon, NButton, NTooltip } from "naive-ui";
import { ArrowForward } from "@vicons/tabler";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import { $t } from "@/locale";
import { router } from "@/router";

interface WindowWithNavigation extends Window {
  navigation?: {
    canGoBack: boolean;
    canGoForward: boolean;
    back(): void;
    forward(): void;
  };
}
const win = window as WindowWithNavigation;

const { isMaxSm } = useInjection(mediaQueryInjectionKey);

const navigationState = reactive({
  canGoForward: true
});

const stopWatch = watch(
  () => router.currentRoute.value,
  () => {
    if (!win.navigation) {
      stopWatch();
      return;
    }
    navigationState.canGoForward = win.navigation.canGoForward;
  },
  { immediate: true }
);

function goForward() {
  if (!navigationState.canGoForward) return;
  if (typeof win.navigation?.forward === "function") {
    win.navigation.forward();
  } else {
    router.forward();
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
        :disabled="!navigationState.canGoForward"
        @click="goForward">
        <template #icon>
          <NIcon>
            <ArrowForward />
          </NIcon>
        </template>
      </NButton>
    </template>
    {{ $t("common.navigationForward") }}
  </NTooltip>
</template>
