<script setup lang="ts">
import { NSpace,NButton, NDatePicker } from "naive-ui";
import { ref } from "vue";

const timestamp = ref(1183135260000);
</script>

<template>
  <div>
    <NSpace>
      <NDatePicker
        v-model:value="timestamp"
        type="datetime"
        clearable />
    </NSpace>
  </div>
</template>
