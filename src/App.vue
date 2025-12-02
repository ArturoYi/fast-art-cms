<script setup lang="ts">
import { onBeforeMount, onMounted } from "vue";
import { initializeTheme } from "./hooks/core/useTheme";
import { toggleTransition } from "./utils/ui/animation";

onBeforeMount(() => {
  toggleTransition(true);
  initializeTheme();
});

onMounted(() => {
  toggleTransition(false);
});
</script>

<template>
  <RouterView />
</template>
