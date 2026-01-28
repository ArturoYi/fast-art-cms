import { nodeInputRule } from '@tiptap/vue-3';
import { InlineMath } from '@tiptap/extension-mathematics';

export const InlineMathReplacer = InlineMath.extend({
  name: 'inlineMathReplacer',
  addInputRules() {
    return [
      nodeInputRule({
        find: /\$\$([^$]+)\$\$$/,
        type: this.type,
        getAttributes: match => ({ latex: match[1] })
      })
    ];
  }
});
