<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { computed, ref } from 'vue';
const props = defineProps<NodeViewProps>();

const preRef = ref<HTMLPreElement>();

const defaultLanguage = computed(() => {
	return props.node.attrs.language || 'plaintext';
});
</script>

<template>
  <NodeViewWrapper
    class="code-wrapper"
    draggable="{false}"
    spellcheck="{false}">
    <pre ref="preRef">
		<NodeViewContent as="code" :class="`language-${defaultLanguage}`" {...node.attrs} />
	</pre>
  </NodeViewWrapper>
</template>
