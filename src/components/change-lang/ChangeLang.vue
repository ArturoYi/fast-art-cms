<script setup lang="ts">
import {
  NIcon,
  NTooltip,
  NPopselect,
  NRadioGroup,
  NRadio,
  NCard,
  NModal,
} from "naive-ui";
import { Language } from "@vicons/tabler";
import { useDeviceStore } from "@/store/modules/device";
import { storeToRefs } from "pinia";
import { languageOptions } from "@/locale";
import { useLanguage } from "@/hook/useLanguage";
import { ref, watch } from "vue";

const deviceStore = useDeviceStore();
const { isMobile } = storeToRefs(deviceStore);
const { getCurrentLocale, setLanguage } = useLanguage();

const showModal = ref(false);
const langModel = ref(getCurrentLocale.value);
watch(langModel, (newVal) => {
  showModal.value = false;
  setLanguage(newVal);
});
</script>
<template>
  <NTooltip
    trigger="hover"
    :disabled="isMobile"
    placement="bottom">
    <template #trigger>
      <div>
        <NPopselect
          v-model:value="langModel"
          :options="languageOptions"
          trigger="click">
          <NIcon
            size="40"
            :hidden="isMobile"
            block
            text-neutral-text-base>
            <Language />
          </NIcon>
        </NPopselect>
        <NIcon
          @click="showModal = true"
          size="40"
          :hidden="!isMobile"
          block
          text-neutral-text-base>
          <Language />
        </NIcon>
      </div>
    </template>
    切换语言
  </NTooltip>
  <NModal v-model:show="showModal">
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
</template>
