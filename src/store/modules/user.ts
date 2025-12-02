import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { STORAGE_KEY_USER_INFO, StorageKeyManager } from "@/utils/storage";
import {
  LANGUAGE_ZH_CN,
  SYSTEM_THEME_AUTO,
  type LanguageType,
  type SystemThemeType,
} from "@/enums/appEnum";

const key = StorageKeyManager.getStorageKey(STORAGE_KEY_USER_INFO);
export const useUserStore = defineStore(key, {
  state: () =>
    useLocalStorage(
      key,
      {
        accessToken: "", //token
        language: LANGUAGE_ZH_CN, //语言
        systemThemeStyle: SYSTEM_THEME_AUTO, // 主题样式
      },
      { mergeDefaults: true }
    ),
  /**
   * 计算属性--我记得好像有缓存，参考computed
   */
  getters: {
    getSystemThemeStyle: (state): SystemThemeType => state.systemThemeStyle,
    getLanguage: (state): LanguageType => state.language,
    isLogin: (state) =>
      state.accessToken !== "" &&
      state.accessToken !== null &&
      state.accessToken !== undefined,
  },
  actions: {
    setSystemThemeStyle(theme: SystemThemeType) {
      this.systemThemeStyle = theme;
    },
  },
});
