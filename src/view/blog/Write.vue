<script setup lang="ts">
import { useInjection } from '@/hook/useInjection';
import { mediaQueryInjectionKey } from '@/injection';
import { defineAsyncComponent } from 'vue';
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

/**
 * 监听设备类型变化-根据屏幕
 */
// 获取媒体查询信息，用于判断屏幕尺寸
const { isMaxLg } = useInjection(mediaQueryInjectionKey);

/**
 * 懒加载编辑器组件
 */
const WriteMarkdownDesktop = defineAsyncComponent(() => import('./WriteMarkdoen/desktop/index.vue'));
const WriteMarkdownMobile = defineAsyncComponent(() => import('./WriteMarkdoen/mobile/index.vue'));

/**
 * 编辑器实例
 */
const editorRef = useEditor({
  extensions: [StarterKit,],
  editorProps: {
    attributes: {
      class: 'blog-editor-core',
    },
  },
  injectCSS: true,
})
</script>

<template>
  <div>
    <component
      :is="isMaxLg ? WriteMarkdownMobile : WriteMarkdownDesktop"
      :editorRef="editorRef" />
  </div>
</template>

<style>
.blog-editor-core {
  width: 100%;
  height: 500px;
  background-color: red;
}
</style>
