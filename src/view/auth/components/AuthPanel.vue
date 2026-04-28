<script setup lang="ts">
import { NCard } from 'naive-ui';
import AuthBackground from '@/view/auth/components/AuthBackground.vue';
import ChangeLang from '@/components/change-lang/ChangeLang.vue';
import ChangeTheme from '@/components/change-theme/ChangeTheme.vue';

defineProps<{
  title: string;
}>();
</script>

<template>
  <AuthBackground>
    <NCard
      shadow-lg
      rounded-4
      w-88
      m-7
      flex
      flex-col
      justify-between>
      <div class="flex justify-end gap-x-4 w-full">
        <ChangeLang />
        <ChangeTheme />
      </div>
      <h1
        text-3xl
        font-bold>
        {{ title }}
      </h1>
      <slot />
    </NCard>
  </AuthBackground>
</template>
