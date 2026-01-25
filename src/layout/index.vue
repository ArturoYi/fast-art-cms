<script setup lang="ts">
import { RouterView } from "vue-router";
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter } from "naive-ui";
import Aside from "@/layout/aside/index.vue";
import Header from "@/layout/header/index.vue";
import Footer from "@/layout/footer/index.vue";
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
        <NLayoutHeader bordered>
          <Header />
        </NLayoutHeader>
        <NLayoutContent
          class="flex-1"
          content-style="overflow: hidden;">
          <RouterView />
        </NLayoutContent>
        <NLayoutFooter bordered>
          <Footer />
        </NLayoutFooter>
      </NLayout>
    </NLayout>
  </div>
</template>
