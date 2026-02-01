<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import Highlight from '@tiptap/extension-highlight';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Markdown } from '@tiptap/markdown';
import { Table, TableHeader, TableRow, TableCell } from '@/view/blog/extensions/table';
import { InlineMathReplacer } from '@/view/blog/extensions/InlineMathReplacer';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlock from '@/view/blog/components/CodeBlock.vue'
import { ImagePlaceholder } from '@/view/blog/extensions/image/ImagePlaceholder';
import ImagePlaceholderComp from '@/view/blog/components/ImagePlaceholderComp.vue';
import { ImageExtended } from '@/view/blog/extensions/image/ImageExtended.ts';
import ImageExtendedComp from '@/view/blog/components/ImageExtendedComp.vue';
import { SlashCommands, getSuggestionItems, renderItems } from '@/view/blog/extensions/slash-command'


// create a lowlight instance
const lowlight = createLowlight(all)
/**
 * 编辑器实例
 * https://edra.tsuzat.com/
 */
const editorRef = useEditor({
  extensions: [
    // 基础功能套件
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal'
        }
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc'
        }
      },
      heading: {
        levels: [1, 2, 3, 4]
      },
      link: {
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_tab',
          rel: 'noopener noreferrer nofollow'
        }
      },
      codeBlock: false
    }),
    CharacterCount, // 字数统计
    Highlight, // 代码高亮
    Placeholder.configure({
      emptyEditorClass: 'is-editor-empty',
      placeholder: '请输入内容',
    }), // 空内容占位符
    Color, // 颜色
    FontSize, // 字体大小
    TextStyle, // 文本样式
    Subscript, // 下标
    Superscript, // 上标
    Typography, // 排版
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }), // 文本对齐
    TaskList, // 任务项
    TaskItem.configure({
      nested: true
    }), // 任务项嵌套
    Markdown, // markdown 语法
    Table, // 表格
    TableHeader, // 表格头
    TableRow, // 表格行
    TableCell, // 表格单元格
    InlineMathReplacer, // 行内数学公式替换器
    CodeBlockLowlight.configure({
      lowlight
    }).extend({
      addNodeView() {
        return VueNodeViewRenderer(CodeBlock);
      }
    }),
    // 视图级别扩展
    ImagePlaceholder(ImagePlaceholderComp),
    ImageExtended(ImageExtendedComp),
    // 斜杠命令
    SlashCommands.configure({
      suggestion: {
        items: getSuggestionItems,
        render: renderItems,
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'edra-editor',
    },
  },
  injectCSS: false,
})
</script>

<template>
  <div class="h-full  write">
    <!-- <div v-if="editorRef">
      <BubbleMenu class="bubble-menu" :tippy-options="{ duration: 100 }" :editor="editorRef">
        <button @click="editorRef.chain().focus().toggleBold().run()" :class="{ 'is-active': editorRef.isActive('bold') }">
          Bold
        </button>
        <button @click="editorRef.chain().focus().toggleItalic().run()" :class="{ 'is-active': editorRef.isActive('italic') }">
          Italic
        </button>
        <button @click="editorRef.chain().focus().toggleStrike().run()" :class="{ 'is-active': editorRef.isActive('strike') }">
          Strike
        </button>
        <button @click="editorRef.chain().focus().toggleCode().run()" :class="{ 'is-active': editorRef.isActive('code') }">
          Code
        </button>
      </BubbleMenu>
    </div> -->
    <EditorContent :editor="editorRef" />
  </div>
</template>

<style scoped>
.write {
  height: 100%;
  width: 100%;
  padding: 1rem;
}
</style>
