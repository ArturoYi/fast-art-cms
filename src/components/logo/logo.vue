<script setup lang="ts">
import { computed } from "vue";
import { NGradientText } from "naive-ui";
import { useLayoutStore } from "@/store/modules/layout";
import { useInjection } from "@/hook/useInjection";
import { mediaQueryInjectionKey } from "@/injection";
import logoImg from "@/assets/logo.svg";

const layoutStore = useLayoutStore();
const { isMaxSm } = useInjection(mediaQueryInjectionKey);

// 计算属性：判断是否显示 logo（桌面端且侧边栏收起时显示）
const showLogo = computed(() => {
  return !isMaxSm.value && layoutStore.isCollapsed;
});

// 点击事件：根据桌面端/移动端切换侧边栏
const handleLogoClick = () => {
  if (isMaxSm.value) {
    // 移动端：切换移动端抽屉
    layoutStore.toggleMobileDrawer();
  } else {
    // 桌面端：切换侧边栏折叠状态
    layoutStore.toggleCollapsed();
  }
};
</script>
<template>
  <div class="logo-container">
    <Transition
      name="fade"
      mode="out-in">
      <!-- 桌面端侧边栏收起时显示 logo -->
      <img
        v-if="showLogo"
        key="logo"
        :src="logoImg"
        alt="Logo"
        class="logo-image"
        cursor-pointer
        @click="handleLogoClick" />
      <!-- 其他情况显示文案 -->
      <NGradientText
        v-else
        key="text"
        text="1.3rem"
        cursor-pointer
        @click="handleLogoClick"
        class="logo-text"
        :gradient="{
          from: 'rgb(85, 85, 85)',
          to: 'rgb(170, 170, 170)',
        }">
        FastCMS
      </NGradientText>
    </Transition>
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  min-height: 4rem; /* 固定最小高度，避免抖动 */
  box-sizing: border-box;
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.logo-text {
  display: block;
  line-height: 1.5;
  height: 1.5rem; /* 固定高度，与 logo 图片高度接近 */
  flex-shrink: 0;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
