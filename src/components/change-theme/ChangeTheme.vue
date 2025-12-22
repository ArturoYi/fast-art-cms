<script setup lang="ts">
import {
  NIcon,
  NPopselect,
  NTooltip,
  NModal,
  NRadioGroup,
  NRadio,
  NCard,
  type SelectOption,
} from "naive-ui";
import { Moon, Sun } from "@vicons/tabler";
import { useTheme } from "@/hook/useTheme";
import { ThemeEnum } from "@/theme";
import { computed, h, ref, watch, type VNodeChild } from "vue";
import { useDeviceStore } from "@/store/modules/device";
import { storeToRefs } from "pinia";
import { $t } from "@/locale";

const deviceStore = useDeviceStore();
const { isMobile } = storeToRefs(deviceStore);
const { getCurrentTheme, getCurrentThemeModel, toggleTheme } = useTheme();

const themeModel = ref(getCurrentThemeModel.value);
const showModal = ref(false);
watch(themeModel, (newVal) => {
  showModal.value = false;
  toggleTheme(newVal);
});
// 当前“实际生效”的主题（SYSTEM 时按系统偏好折算）
const effectiveTheme = computed<ThemeEnum>(() => {
  return getCurrentTheme.value;
});
// 根据当前主题展示不同图标：亮色 Sun / 暗色 Moon
const currentThemeIcon = computed(() =>
  effectiveTheme.value === ThemeEnum.DARK ? Moon : Sun
);
//主题选择器选项
const themeOptions = computed(() => [
  {
    label: "common.themeLight",
    value: ThemeEnum.LIGHT,
  },
  {
    label: "common.themeDark",
    value: ThemeEnum.DARK,
  },
  {
    label: "common.themeSystem",
    value: ThemeEnum.SYSTEM,
  },
]);

function renderLabel(option: SelectOption): VNodeChild {
  return h("div", [
    h("span", $t(typeof option.label === "string" ? option.label : "")),
  ]);
}
</script>
<template>
  <NTooltip
    trigger="hover"
    :disabled="isMobile"
    placement="bottom">
    <template #trigger>
      <div>
        <NPopselect
          v-model:value="themeModel"
          :options="themeOptions"
          trigger="click"
          :render-label="renderLabel">
          <NIcon
            size="1.6rem"
            :hidden="isMobile"
            block
            text-neutral-text-base>
            <component :is="currentThemeIcon" />
          </NIcon>
        </NPopselect>
        <NIcon
          @click="showModal = true"
          size="1.6rem"
          :hidden="!isMobile"
          block
          text-neutral-text-base>
          <component :is="currentThemeIcon" />
        </NIcon>
      </div>
    </template>
    {{ $t("common.switchTheme") }}
  </NTooltip>
  <NModal v-model:show="showModal">
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
</template>
