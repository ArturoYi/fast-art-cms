<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { utilsInitialize } from "@/utils";
import { onMounted } from "vue";
import { RouterView } from "vue-router";

onMounted(() => {
  utilsInitialize();
});
</script>

<template>
  <n-config-provider>
    <RouterView />
  </n-config-provider>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
