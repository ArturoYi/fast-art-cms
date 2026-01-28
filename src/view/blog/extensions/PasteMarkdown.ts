import { Extension } from '@tiptap/vue-3';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const PasteMarkdown = Extension.create({
  name: 'pasteMarkdown',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('pasteMarkdown'),
        props: {
          handlePaste: (view, event, slice) => {
            const editable = this.editor.isEditable;
            if (!editable) return false;

            const text = event.clipboardData?.getData('text/plain');
            if (!text) return false;

            // Check if the text looks like a Markdown table
            // Pattern:
            // | Header | Header |
            // | --- | --- |
            const isTable = /^\s*\|.*?\|.*?\|\s*$/m.test(text) && /^\s*\|[-: ]+\|[-: ]+\|\s*$/m.test(text);

            if (isTable) {
              // Unindent the text to ensure it's parsed as a table, not a code block
              const lines = text.split('\n');
              const minIndent = lines.reduce((min, line) => {
                if (line.trim().length === 0) return min;
                const indent = line.match(/^\s*/)?.[0].length || 0;
                return Math.min(min, indent);
              }, Infinity);

              const unindentedText =
                minIndent !== Infinity && minIndent > 0 ? lines.map(line => line.slice(minIndent)).join('\n') : text;

              // Insert as Markdown
              this.editor.commands.insertContent(unindentedText, {
                contentType: 'markdown'
              });
              return true;
            }

            return false;
          }
        }
      })
    ];
  }
});
