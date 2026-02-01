<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { ref, onMounted, onUnmounted } from 'vue'

/** 组件 Props：继承 TipTap nodeViewProps（含 editor、node、updateAttributes 等），可选传入媒体元素引用 */
const props = defineProps({
  ...nodeViewProps,
  mediaRef: {
    type: Object as () => HTMLElement | null,
    required: false
  }
})

/** 媒体宽度下限（相对父容器的百分比） */
const minWidthPercent = 20
/** 媒体宽度上限（相对父容器的百分比） */
const maxWidthPercent = 100

/** 可调整大小容器的 DOM 引用（id 为 resizable-container-media 的根 div） */
const nodeRef = ref<HTMLElement | null>(null)
/** 当前是否处于拖拽调整宽度状态 */
const resizing = ref(false)
/** 开始拖拽时媒体宽度占父容器的百分比，用于计算拖拽过程中的新宽度 */
const resizingInitialWidthPercent = ref(0)
/** 开始拖拽时鼠标/触摸点的 X 坐标，用于计算位移 */
const resizingInitialMouseX = ref(0)
/** 当前拖拽的是左侧手柄还是右侧手柄，影响位移方向 */
const resizingPosition = ref<'left' | 'right'>('left')
/** 更多操作面板是否展开（预留） */
const openedMore = ref(false)

/**
 * 鼠标按下拖拽手柄时调用，记录拖拽方向并启动拖拽
 * @param e 鼠标事件
 * @param position 拖拽手柄位置：'left' | 'right'
 */
function handleResizingPosition(e: MouseEvent, position: 'left' | 'right') {
  startResize(e)
  resizingPosition.value = position
}

/**
 * 开始拖拽：记录初始鼠标 X 和当前媒体宽度百分比
 * @param e 鼠标事件
 */
function startResize(e: MouseEvent) {
  e.preventDefault()
  resizing.value = true
  resizingInitialMouseX.value = e.clientX
  const mediaEl = props.mediaRef ?? nodeRef.value?.querySelector('[data-media]') as HTMLElement | null
  if (mediaEl && nodeRef.value?.parentElement) {
    const currentWidth = mediaEl.offsetWidth
    const parentWidth = nodeRef.value.parentElement.offsetWidth
    resizingInitialWidthPercent.value = (currentWidth / parentWidth) * 100
  }
}

/**
 * 鼠标移动时根据位移更新媒体宽度（百分比），并写入 node 属性
 * @param e 鼠标事件
 */
function doResize(e: MouseEvent) {
  if (!resizing.value || !nodeRef.value?.parentElement) return
  let dx = e.clientX - resizingInitialMouseX.value
  if (resizingPosition.value === 'left') {
    dx = resizingInitialMouseX.value - e.clientX
  }
  const parentWidth = nodeRef.value.parentElement.offsetWidth
  const deltaPercent = (dx / parentWidth) * 100
  const newWidthPercent = Math.max(
    Math.min(resizingInitialWidthPercent.value + deltaPercent, maxWidthPercent),
    minWidthPercent
  )
  props.updateAttributes?.({ width: `${newWidthPercent}%` })
}

/** 结束拖拽：重置拖拽相关状态 */
function endResize() {
  resizing.value = false
  resizingInitialMouseX.value = 0
  resizingInitialWidthPercent.value = 0
}

/**
 * 触摸按下拖拽手柄时调用，记录拖拽方向与初始触摸 X、当前宽度百分比
 * @param e 触摸事件
 * @param position 拖拽手柄位置：'left' | 'right'
 */
function handleTouchStart(e: TouchEvent, position: 'left' | 'right') {
  const touch = e.touches[0]
  if (!touch) return
  e.preventDefault()
  resizing.value = true
  resizingPosition.value = position
  resizingInitialMouseX.value = touch.clientX
  const mediaEl = props.mediaRef ?? nodeRef.value?.querySelector('[data-media]') as HTMLElement | null
  if (mediaEl && nodeRef.value?.parentElement) {
    const currentWidth = mediaEl.offsetWidth
    const parentWidth = nodeRef.value.parentElement.offsetWidth
    resizingInitialWidthPercent.value = (currentWidth / parentWidth) * 100
  }
}

/**
 * 触摸移动时根据位移更新媒体宽度（百分比），并写入 node 属性
 * @param e 触摸事件
 */
function handleTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (!resizing.value || !nodeRef.value?.parentElement || !touch) return
  let dx = touch.clientX - resizingInitialMouseX.value
  if (resizingPosition.value === 'left') {
    dx = resizingInitialMouseX.value - touch.clientX
  }
  const parentWidth = nodeRef.value.parentElement.offsetWidth
  const deltaPercent = (dx / parentWidth) * 100
  const newWidthPercent = Math.max(
    Math.min(resizingInitialWidthPercent.value + deltaPercent, maxWidthPercent),
    minWidthPercent
  )
  props.updateAttributes?.({ width: `${newWidthPercent}%` })
}

/** 触摸结束：重置拖拽相关状态 */
function handleTouchEnd() {
  resizing.value = false
  resizingInitialMouseX.value = 0
  resizingInitialWidthPercent.value = 0
}

/** 标题输入变更时更新 node 的 title 属性 */
function handleTitleChange(e: Event) {
  const target = e.target as HTMLInputElement
  props.updateAttributes?.({ title: target.value })
}

/** 挂载时在 window 上注册鼠标与触摸的拖拽/结束监听 */
onMounted(() => {
  window.addEventListener('mousemove', doResize)
  window.addEventListener('mouseup', endResize)
  window.addEventListener('touchmove', handleTouchMove, { passive: false })
  window.addEventListener('touchend', handleTouchEnd)
})

/** 卸载时移除 window 上的拖拽相关监听，避免内存泄漏与误触发 */
onUnmounted(() => {
  window.removeEventListener('mousemove', doResize)
  window.removeEventListener('mouseup', endResize)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})
</script>
<template>
  <NodeViewWrapper
    id="resizable-container-media"
    :style="{ width: props.node.attrs.width }">
    <div class="relative flex flex-col rounded-md">
      <slot />
      <input
        v-if="props.node.attrs.title != null && props.node.attrs.title.trim() !== ''"
        :value="props.node.attrs.title"
        type="text"
        class="text-muted-foreground my-1 w-full bg-transparent text-center text-sm outline-none"
        @change="handleTitleChange" />
    </div>
  </NodeViewWrapper>
</template>
