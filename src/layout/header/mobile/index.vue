<script setup lang="ts">
import { Menu2, Settings, ArrowsMaximize, ArrowsMinimize, Language, Moon, Sun, Logout } from "@vicons/tabler";
import { NButton, NIcon, NDrawer, NList, NListItem, NModal, NCard, NRadioGroup, NRadio, useDialog } from "naive-ui";
import { computed, ref, watch } from "vue";
import { useLayoutStore } from "@/store/modules/layout";
import { useUserStore } from "@/store/modules/user";
import NavigationBack from "@/components/navigation-back/NavigationBack.vue";
import NavigationForward from "@/components/navigation-forward/NavigationForward.vue";
import { $t, languageOptions } from "@/locale";
import { useFullscreen } from "@vueuse/core";
import { useTheme } from "@/hook/useTheme";
import { useLanguage } from "@/hook/useLanguage";
import { ThemeEnum } from "@/theme";

const layoutStore = useLayoutStore();
const userStore = useUserStore();
const dialog = useDialog();

// 移动端菜单按钮点击事件
const handleMenuButtonClick = () => {
  layoutStore.toggleMobileDrawer();
};

// 移动端设置按钮点击事件
const handleSettingsButtonClick = () => {
  layoutStore.toggleMobileSettingsDrawer();
};

// 计算属性：从 store 获取设置抽屉显示状态（响应式）
const showSettingsDrawer = computed({
  get: () => layoutStore.isMobileSettingsDrawerVisible,
  set: (value: boolean) => {
    layoutStore.setMobileSettingsDrawerVisible(value);
  }
});

// 点击标题关闭抽屉
const handleTitleClick = () => {
  layoutStore.closeMobileSettingsDrawer();
};

// 全屏功能
const { isFullscreen, enter, exit } = useFullscreen();
const fullscreenIcon = computed(() => isFullscreen.value ? ArrowsMinimize : ArrowsMaximize);
const fullscreenText = computed(() => isFullscreen.value ? $t("common.exitFullscreen") : $t("common.fullscreen"));
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exit();
  } else {
    enter();
  }
};

// 语言切换功能
const { getCurrentLocale, setLanguage } = useLanguage();
const langModel = ref(getCurrentLocale.value);
const showLangModal = ref(false);
watch(langModel, (newVal) => {
  showLangModal.value = false;
  setLanguage(newVal);
  layoutStore.closeMobileSettingsDrawer();
});

// 主题切换功能
const { getCurrentTheme, getCurrentThemeModel, toggleTheme } = useTheme();
const themeModel = ref(getCurrentThemeModel.value);
const showThemeModal = ref(false);
const effectiveTheme = computed<ThemeEnum>(() => getCurrentTheme.value);
const themeIcon = computed(() => effectiveTheme.value === ThemeEnum.DARK ? Moon : Sun);
const themeOptions = computed(() => [
  { label: "common.themeLight", value: ThemeEnum.LIGHT },
  { label: "common.themeDark", value: ThemeEnum.DARK },
  { label: "common.themeSystem", value: ThemeEnum.SYSTEM },
]);
watch(themeModel, (newVal) => {
  showThemeModal.value = false;
  toggleTheme(newVal);
  layoutStore.closeMobileSettingsDrawer();
});

// 退出登录功能
const handleLogout = () => {
  dialog.warning({
    title: $t("common.logoutTitle"),
    content: $t("common.logoutConfirm"),
    positiveText: $t("common.confirm"),
    negativeText: $t("common.cancel"),
    onPositiveClick: () => {
      userStore.logout();
      layoutStore.closeMobileSettingsDrawer();
      return true;
    }
  });
};

// 抽屉宽度
const drawerWidth = 240;
</script>
<template>
  <div
    flex
    items-center
    justify-between
    py-4
    px-2>
    <!-- 左侧：折叠按钮 -->
    <div
      flex
      items-center
      justify-start
      gap-3>
      <NButton
        :text="true"
        @click="handleMenuButtonClick">
        <NIcon size="2.2rem"><Menu2 /></NIcon>
      </NButton>
      <NavigationBack />
    </div>
    <div
      flex
      items-center
      justify-end
      gap-3>
      <NavigationForward />
      <NButton
        :text="true"
        @click="handleSettingsButtonClick">
        <NIcon size="2.2rem"><Settings /></NIcon>
      </NButton>
    </div>
    <!-- 右侧设置抽屉 -->
    <NDrawer
      v-model:show="showSettingsDrawer"
      :width="drawerWidth"
      placement="right"
      :trap-focus="false"
      :block-scroll="true">
      <div
        flex
        flex-col
        gap-6
        p-4>
        <h2
          text-xl
          font-bold
          text-center
          cursor-pointer
          @click="handleTitleClick">
          {{ $t("common.settings") }}
        </h2>
        <NList>
          <!-- 全屏 -->
          <NListItem @click="toggleFullscreen">
            <div
              flex
              items-center
              justify-between
              w-full>
              <span>{{ fullscreenText }}</span>
              <NIcon size="20">
                <component :is="fullscreenIcon" />
              </NIcon>
            </div>
          </NListItem>

          <!-- 切换语言 -->
          <NListItem @click="showLangModal = true">
            <div
              flex
              items-center
              justify-between
              w-full>
              <span>{{ $t("common.switchLanguage") }}</span>
              <NIcon size="20">
                <Language />
              </NIcon>
            </div>
          </NListItem>

          <!-- 切换主题 -->
          <NListItem @click="showThemeModal = true">
            <div
              flex
              items-center
              justify-between
              w-full>
              <span>{{ $t("common.switchTheme") }}</span>
              <NIcon size="20">
                <component :is="themeIcon" />
              </NIcon>
            </div>
          </NListItem>

          <!-- 退出登录 -->
          <NListItem @click="handleLogout">
            <div
              flex
              items-center
              justify-between
              w-full>
              <span>{{ $t("common.logoutTitle") }}</span>
              <NIcon size="20">
                <Logout />
              </NIcon>
            </div>
          </NListItem>
        </NList>

        <!-- 语言选择模态框 -->
        <NModal v-model:show="showLangModal">
          <div class="flex items-center justify-center">
            <NCard
              class="w-full max-w-sm rounded-xl shadow-xl"
              :bordered="false">
              <n-radio-group
                v-model:value="langModel"
                name="radiogroup"
                class="flex flex-col gap-3">
                <n-radio
                  v-for="item in languageOptions"
                  :key="item.value"
                  :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-radio-group>
            </NCard>
          </div>
        </NModal>

        <!-- 主题选择模态框 -->
        <NModal v-model:show="showThemeModal">
          <div class="flex items-center justify-center">
            <NCard
              class="w-full max-w-sm rounded-xl shadow-xl"
              :bordered="false">
              <n-radio-group
                v-model:value="themeModel"
                name="radiogroup"
                class="flex flex-col gap-3">
                <n-radio
                  v-for="item in themeOptions"
                  :key="item.value"
                  :value="item.value">
                  {{ $t(item.label) }}
                </n-radio>
              </n-radio-group>
            </NCard>
          </div>
        </NModal>
      </div>
    </NDrawer>
  </div>
</template>
