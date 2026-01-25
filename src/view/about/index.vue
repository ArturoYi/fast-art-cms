<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark } from "@milkdown/kit/preset/commonmark";

const editorRef = ref<HTMLDivElement | null>(null);
const defaultValue = "# Hello Milkdown\n\n这是一个最基本的 Milkdown 编辑器示例。\n\n你可以在这里输入 **Markdown** 格式的内容。\n\n- 支持列表\n- 支持**粗体**和*斜体*\n- 支持代码块";

onMounted(() => {
  if (!editorRef.value) return;

  Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, editorRef.value!);
      ctx.set(defaultValueCtx, defaultValue);
    })
    .use(commonmark)
    .create();
});
</script>

<template>
  <div class="milkdown-editor-container">
    <div class="editor-wrapper">
      <div
        ref="editorRef"
        class="editor" />
    </div>
  </div>
</template>

<style scoped>
.milkdown-editor-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.editor-wrapper {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.editor {
  min-height: 400px;
  outline: none;
}
</style>
