import {
  NodeView,
  type NodeViewProps,
  type NodeViewRenderer,
  type NodeViewRendererOptions,
  type DecorationWithType,
  getRenderedAttributes,
  type Editor
} from '@tiptap/vue-3';
import type { Decoration, DecorationSource } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { h, render, reactive, type Component, markRaw, defineComponent, provide, type PropType } from 'vue';

export interface RendererUpdateProps {
  oldNode: ProseMirrorNode;
  oldDecorations: readonly Decoration[];
  oldInnerDecorations: DecorationSource;
  newNode: ProseMirrorNode;
  newDecorations: readonly Decoration[];
  newInnerDecorations: DecorationSource;
  updateProps: () => void;
}

export interface VueNodeViewRendererOptions extends NodeViewRendererOptions {
  update?: ((props: RendererUpdateProps) => boolean) | null;
  as?: string;
  attrs?:
    | Record<string, string>
    | ((props: { node: ProseMirrorNode; HTMLAttributes: Record<string, any> }) => Record<string, string>);
}

const ComponentWrapper = defineComponent({
  props: {
    component: {
      type: Object as PropType<Component>,
      required: true
    },
    props: {
      type: Object as PropType<NodeViewProps>,
      required: true
    },
    onDragStart: {
      type: Function as PropType<(event: DragEvent) => void>,
      required: true
    }
  },
  setup(props) {
    provide('nodeViewContext', {
      onDragStart: props.onDragStart
    });

    return () => h(props.component, props.props);
  }
});

class VueRenderer {
  component: Component;
  props: NodeViewProps;
  dom: HTMLElement;
  onDragStart: (event: DragEvent) => void;

  constructor(
    component: Component,
    {
      element,
      props,
      onDragStart
    }: { element: HTMLElement; props: NodeViewProps; onDragStart: (event: DragEvent) => void }
  ) {
    this.component = markRaw(component);
    // 仅对 props 中的非 view 字段做 reactive，避免 view（EditorView）被深层代理
    const { view, ...rest } = props;
    this.props = reactive({ ...rest, view }) as NodeViewProps;
    this.dom = element;
    this.onDragStart = onDragStart;

    this.render();
  }

  render() {
    const vnode = h(ComponentWrapper, {
      component: this.component,
      props: this.props,
      onDragStart: this.onDragStart
    });
    render(vnode, this.dom);
  }

  updateProps(props: Partial<NodeViewProps>) {
    Object.assign(this.props, props);
    this.render();
  }

  updateAttributes(attributes: Record<string, string>) {
    Object.keys(attributes).forEach(key => {
      const value = attributes[key];
      if (value !== undefined) {
        this.dom.setAttribute(key, value);
      }
    });
  }

  destroy() {
    render(null, this.dom);
  }
}

class VueNodeView extends NodeView<Component, Editor, VueNodeViewRendererOptions> {
  renderer!: VueRenderer;
  contentDOMElement: HTMLElement | null = null;

  mount() {
    const props: NodeViewProps = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations as DecorationWithType[],
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: false,
      extension: this.extension,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode()
    };

    if (!this.node.isLeaf) {
      this.contentDOMElement = document.createElement(this.node.isInline ? 'span' : 'div');
      this.contentDOMElement.style.whiteSpace = 'inherit';
    }

    const as = this.options.as ?? (this.node.isInline ? 'span' : 'div');
    const target = document.createElement(as);
    target.classList.add(`node-${this.node.type.name}`);

    this.renderer = new VueRenderer(this.component, {
      element: target,
      props,
      onDragStart: this.onDragStart.bind(this)
    });

    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
    this.editor.on('selectionUpdate', this.handleSelectionUpdate);

    this.appendContentDOM();
    this.updateElementAttributes();
  }

  get dom() {
    return this.renderer.dom;
  }

  get contentDOM() {
    if (this.node.isLeaf) {
      return null;
    }
    return this.contentDOMElement;
  }

  appendContentDOM() {
    const contentElement = this.dom.querySelector('[data-node-view-content]');
    if (this.contentDOMElement && contentElement && !contentElement.contains(this.contentDOMElement)) {
      contentElement.appendChild(this.contentDOMElement);
    }
  }

  handleSelectionUpdate() {
    const { from, to } = this.editor.state.selection;
    const pos = this.getPos();

    if (typeof pos !== 'number') {
      return;
    }

    if (from <= pos && to >= pos + this.node.nodeSize) {
      if (this.renderer.props.selected) {
        return;
      }
      this.selectNode();
    } else {
      if (!this.renderer.props.selected) {
        return;
      }
      this.deselectNode();
    }
  }

  update(node: ProseMirrorNode, decorations: readonly Decoration[], innerDecorations: DecorationSource): boolean {
    const updateProps = (props: Partial<NodeViewProps>) => {
      this.renderer.updateProps(props);
      if (typeof this.options.attrs === 'function') {
        this.updateElementAttributes();
      }
    };

    if (typeof this.options.update === 'function') {
      const oldNode = this.node;
      const oldDecorations = this.decorations;
      const oldInnerDecorations = this.innerDecorations;

      this.node = node;
      this.decorations = decorations;
      this.innerDecorations = innerDecorations;

      return this.options.update({
        oldNode,
        oldDecorations,
        oldInnerDecorations,
        newNode: node,
        newDecorations: decorations,
        newInnerDecorations: innerDecorations,
        updateProps: () =>
          updateProps({
            node,
            decorations: decorations as DecorationWithType[],
            innerDecorations
          })
      });
    }

    if (node.type !== this.node.type) {
      return false;
    }

    if (node === this.node && this.decorations === decorations && this.innerDecorations === innerDecorations) {
      return true;
    }

    this.node = node;
    this.decorations = decorations;
    this.innerDecorations = innerDecorations;

    updateProps({
      node,
      decorations: decorations as DecorationWithType[],
      innerDecorations
    });

    this.appendContentDOM();

    return true;
  }

  selectNode() {
    this.renderer.updateProps({ selected: true });
    this.renderer.dom.classList.add('ProseMirror-selectednode');
  }

  deselectNode() {
    this.renderer.updateProps({ selected: false });
    this.renderer.dom.classList.remove('ProseMirror-selectednode');
  }

  destroy() {
    this.renderer.destroy();
    this.editor.off('selectionUpdate', this.handleSelectionUpdate);
    this.contentDOMElement = null;
  }

  updateElementAttributes() {
    if (this.options.attrs) {
      let attrsObj: Record<string, string> = {};
      if (typeof this.options.attrs === 'function') {
        const extensionAttributes = this.editor.extensionManager.attributes;
        const HTMLAttributes = getRenderedAttributes(this.node, extensionAttributes);
        attrsObj = this.options.attrs({ node: this.node, HTMLAttributes });
      } else {
        attrsObj = this.options.attrs;
      }
      this.renderer.updateAttributes(attrsObj);
    }
  }
}

export const VueNodeViewRenderer = (
  component: Component,
  options?: Partial<VueNodeViewRendererOptions>
): NodeViewRenderer => {
  return props => new VueNodeView(component, props, options);
};
