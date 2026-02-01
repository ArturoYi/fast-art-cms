import { Extension } from '@tiptap/vue-3';
import Suggestion from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';
import CommandList from '@/view/blog/components/CommandList.vue';

const SlashCommands = Extension.create({
  name: 'slash-command',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        }
      }
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: 'Heading 1',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      }
    },
    {
      title: 'Heading 2',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      }
    },
    {
      title: 'Heading 3',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      }
    },
    {
      title: 'Bullet List',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      }
    },
    {
      title: 'Ordered List',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      }
    },
    {
      title: 'Code Block',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setCodeBlock().run();
      }
    },
    {
      title: 'Blockquote',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setBlockquote().run();
      }
    },
    {
      title: 'Horizontal Rule',
      command: ({ editor, range }: any) => {
        editor.chain().focus().deleteRange(range).setHorizontalRule().run();
      }
    }
  ]
    .filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
};

const renderItems = () => {
  let component: any;
  let popup: any;
  return {
    onStart: (props: any) => {
      component = new VueRenderer(CommandList, {
        props,
        editor: props.editor
      });

      if (!props.clientRect) {
        return;
      }

      // popup = tippy('body', {
      //   getReferenceClientRect: props.clientRect,
      //   appendTo: () => document.body,
      //   content: component.element,
      //   showOnCreate: true,
      //   interactive: true,
      //   trigger: 'manual',
      //   placement: 'bottom-start',
      // })
    },

    onUpdate(props: any) {
      component.updateProps(props);

      if (!props.clientRect) {
        return;
      }

      popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },

    onKeyDown(props: any) {
      if (props.event.key === 'Escape') {
        popup[0].hide();

        return true;
      }

      return component.ref?.onKeyDown(props);
    },

    onExit() {
      popup[0].destroy();
      component.destroy();
    }
  };
};

export { SlashCommands, getSuggestionItems, renderItems };
