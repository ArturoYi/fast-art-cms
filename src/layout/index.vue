<script setup lang="ts">
import { useRoute } from "vue-router";
import Aside from "@/layout/aside/index.vue";
const route = useRoute();
</script>

<template>
  <div>
    <Aside />
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        :key="route.path" />
    </router-view>
  </div>
</template>
