<script setup lang="ts">
import {
  NIcon,
  NButton,
  NTooltip,
  NPopselect,
  NRadioGroup,
  NRadio,
  NCard,
  NModal,
} from "naive-ui";
import { Language } from "@vicons/tabler";
import { languageOptions } from "@/locale";
import { useInjection } from "@/hook/useInjection";
import { useLanguage } from "@/hook/useLanguage";
import { ref, watch } from "vue";
import { mediaQueryInjectionKey } from "@/injection";

const { isMaxSm } = useInjection(mediaQueryInjectionKey);

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
    :disabled="isMaxSm"
    placement="bottom">
    <template #trigger>
      <div>
        <NPopselect
          v-model:value="langModel"
          :options="languageOptions"
          trigger="click">
          <NButton
            tertiary
            circle
            :hidden="isMaxSm">
            <template #icon>
              <NIcon>
                <Language />
              </NIcon>
            </template>
          </NButton>
        </NPopselect>
        <NButton
          tertiary
          circle
          :hidden="!isMaxSm"
          @click="showModal = true">
          <template #icon>
            <NIcon>
              <Language />
            </NIcon>
          </template>
        </NButton>
      </div>
    </template>
    {{ $t("common.switchLanguage") }}
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
