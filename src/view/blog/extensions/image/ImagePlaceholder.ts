import { VueNodeViewRenderer, Node, mergeAttributes, type CommandProps, type NodeViewProps } from '@tiptap/vue-3';
import { type Component } from 'vue';

export interface ImagePlaceholderOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/vue-3' {
  interface Commands<ReturnType> {
    imagePlaceholder: {
      insertImagePlaceholder: () => ReturnType;
    };
  }
}

export const ImagePlaceholder = (component: Component<NodeViewProps>): Node<ImagePlaceholderOptions> =>
  Node.create<ImagePlaceholderOptions>({
    name: 'imagePlaceholder',
    group: 'block',
    atom: true,
    draggable: true,
    addOptions() {
      return {
        HTMLAttributes: {}
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div[data-type="image-placeholder"]'
        }
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-placeholder' })];
    },
    addNodeView() {
      return VueNodeViewRenderer(component);
    },
    addCommands() {
      return {
        insertImagePlaceholder: () => (props: CommandProps) => {
          return props.commands.insertContent({
            type: 'image-placeholder'
          });
        }
      };
    }
  });
