<script setup lang="ts">
import FullScreen from "@/components/full-screen/FullScreen.vue";
import ChangeTheme from "@/components/change-theme/ChangeTheme.vue";
import ChangeLang from "@/components/change-lang/ChangeLang.vue";
import SignOut from "@/components/sign-out/SignOut.vue";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.vue";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
const { isMaxMd } = useInjection(mediaQueryInjectionKey);
</script>
<template>
  <div
    flex
    align-center
    justify-between
    py-4
    px-4>
    <div
      flex
      align-center
      justify-start
      gap-3>
      <Breadcrumb v-if="!isMaxMd" />
    </div>
    <div
      flex
      align-center
      gap-3
      justify-end>
      <FullScreen />
      <ChangeLang />
      <ChangeTheme />
      <SignOut />
    </div>
  </div>
</template>
