<script setup lang="ts">
import { NIcon, NButton, NTooltip, useDialog } from "naive-ui";
import { Logout } from "@vicons/tabler";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import { useUserStore } from "@/store/modules/user";
import { $t } from "@/locale";

const { isMaxSm } = useInjection(mediaQueryInjectionKey);
const userStore = useUserStore();
const dialog = useDialog();

function handleLogout() {
  dialog.warning({
    title: $t("common.logoutTitle"),
    content: $t("common.logoutConfirm"),
    positiveText: $t("common.confirm"),
    negativeText: $t("common.cancel"),
    onPositiveClick: () => {
      userStore.logout();
      return true;
    }
  });
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
        @click="handleLogout">
        <template #icon>
          <NIcon>
            <Logout />
          </NIcon>
        </template>
      </NButton>
    </template>
    {{ $t("common.logoutTitle") }}
  </NTooltip>
</template>
