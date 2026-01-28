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
    Markdown,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    InlineMathReplacer,
  ],
  editorProps: {
    attributes: {
      class: 'blog-editor-core markdown-body',
    },
  },
  injectCSS: false,
})
</script>

<template>
  <div class="h-full">
    <EditorContent :editor="editorRef" />
  </div>
</template>

<style>
.tiptap-editor {
  max-width: 800px;
  margin: 20px auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.editor-toolbar button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.editor-toolbar button:hover {
  background: #e9e9e9;
}

.editor-toolbar button.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.markdown-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.file-input {
  display: none;
}

.editor-content {
  padding: 20px;
  min-height: 400px;
  outline: none;
}

.export-result {
  margin-top: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 4px;
}

.export-result pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
