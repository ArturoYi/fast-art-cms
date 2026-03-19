<script setup lang="ts">
import { ref } from 'vue'

// 以纯文本替代原来的富文本编辑器
const content = ref('')
</script>

<template>
  <div class="h-full write">
    <textarea
      v-model="content"
      class="write-input"
      placeholder="请输入内容" />
  </div>
</template>

<style scoped>
.write {
  height: 100%;
  width: 100%;
  padding: 1rem;
}

.write-input {
  width: 100%;
  height: calc(100% - 0rem);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: none;
}
</style>
