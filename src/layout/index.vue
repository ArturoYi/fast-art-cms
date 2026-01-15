<script setup lang="ts">
import { useRoute } from "vue-router";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter } from "naive-ui";
import Aside from "@/layout/aside/index.vue";
const route = useRoute();
const { isMaxSm } = useInjection(mediaQueryInjectionKey);
</script>

<template>
  <div class="h-full">
    <NLayout
      has-sider
      class="h-svh">
      <Aside />
      <NLayout
        class="h-full"
        content-style="display: flex; flex-direction: column;">
        <NLayoutHeader>颐和园路</NLayoutHeader>
        <NLayoutContent
          class="flex-1"
          content-style="overflow: hidden;">
          平山道
        </NLayoutContent>
        <NLayoutFooter>成府路</NLayoutFooter>
      </NLayout>
    </NLayout>
  </div>
</template>
