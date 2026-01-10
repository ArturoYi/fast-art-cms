<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <div>
    <router-view v-slot="{ Component }">
      <component
        :is="Component"
        :key="route.path" />
    </router-view>
  </div>
</template>
