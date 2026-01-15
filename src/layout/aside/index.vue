<script setup lang="ts">
import { NLayoutSider, NMenu } from "naive-ui";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { MenuProcessor } from "@/router/core/MenuProcessor";
const menuOptions = computed(() => MenuProcessor.getInstance().getMenuList());
const menuActiveKey = ref("");
const collapsed = ref(false);
const route = useRoute();
watch(
  () => route.path,
  (newPath: string) => {
    menuActiveKey.value = String(newPath) + String(route.name);
  },
  { immediate: true }
);
</script>
<template>
  <NLayoutSider
    collapse-mode="width"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    v-model:collapsed="collapsed"
    :width="240"
    show-trigger="arrow-circle"
    :native-scrollbar="false"
    bordered>
    <NMenu
      :options="menuOptions"
      :value="menuActiveKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22" />
  </NLayoutSider>
</template>
