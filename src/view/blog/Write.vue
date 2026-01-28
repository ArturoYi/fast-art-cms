<script setup lang="ts">
import { useInjection } from '@/hook/useInjection';
import { mediaQueryInjectionKey } from '@/injection';
import { defineAsyncComponent, onMounted, ref } from 'vue';
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown';
import { TableKit } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { PasteMarkdown } from './extensions/PasteMarkdown'

/**
 * 监听设备类型变化-根据屏幕
 */
// 获取媒体查询信息，用于判断屏幕尺寸
const { isMaxLg } = useInjection(mediaQueryInjectionKey);

/**
 * 懒加载编辑器组件
 */
const WriteMarkdownDesktop = defineAsyncComponent(() => import('./WriteMarkdown/desktop/index.vue'));
const WriteMarkdownMobile = defineAsyncComponent(() => import('./WriteMarkdown/mobile/index.vue'));


/**
 * 编辑器内容
 */
const value = ref('');



/**
 * 编辑器实例
 */
const editorRef = useEditor({
  extensions: [
    StarterKit,
    Markdown.configure({
      indentation: {
        style: 'space',
        size: 4,
      },
      markedOptions: {
        gfm: true,
        breaks: false,
      },
    }),
    TableKit,
  ],
  editorProps: {
    attributes: {
      class: 'blog-editor-core markdown-body',
    },
  },
  onUpdate: ({ editor }) => {
    value.value = editor.getMarkdown();
  },
  contentType: 'markdown',
  injectCSS: false,
})
</script>

<template>
  <div class="h-full">
    <component
      :is="isMaxLg ? WriteMarkdownMobile : WriteMarkdownDesktop"
      :editorRef="editorRef"
      :value="value" />
  </div>
</template>

<style>
.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0;
  /* the above doesn't seem to work in Edge */
}

.ProseMirror pre {
  white-space: pre-wrap;
}

.ProseMirror li {
  position: relative;
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection {
  caret-color: transparent;
}

/* See https://github.com/ProseMirror/prosemirror/issues/1421#issuecomment-1759320191 */
.ProseMirror [draggable][contenteditable=false] {
  user-select: text
}

.ProseMirror-selectednode {
  outline: 2px solid #8cf;
}

/* Make sure li selections wrap around markers */

li.ProseMirror-selectednode {
  outline: none;
}

li.ProseMirror-selectednode:after {
  content: "";
  position: absolute;
  left: -32px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  border: 2px solid #8cf;
  pointer-events: none;
}

/* Protect against generic img rules */

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
}
</style>
