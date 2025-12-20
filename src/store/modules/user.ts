import { LANGUAGE } from '@/locale';
import { ThemeEnum } from '@/theme/index';
import { StorageConfig } from '@/utils';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(StorageConfig.USER_KEY, {
  state: () =>
    useLocalStorage(
      StorageConfig.USER_KEY,
      {
        accessToken: '',
        currentTheme: ThemeEnum.LIGHT,
        currentThemeModel: ThemeEnum.SYSTEM,
        currentLocale: LANGUAGE.ZH_CN
      },
      {
        listenToStorageChanges: true,
        mergeDefaults: true
      }
    ),
  getters: {
    isLogin: state => state.accessToken !== '',
    getCurrentTheme: state => state.currentTheme,
    getCurrentThemeModel: state => state.currentThemeModel,
    getCurrentLocale: state => state.currentLocale
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
    setCurrentTheme(theme: ThemeEnum) {
      this.currentTheme = theme;
    },
    setCurrentThemeModel(themeModel: ThemeEnum) {
      this.currentThemeModel = themeModel;
    },
    setCurrentLocale(locale: LANGUAGE) {
      this.currentLocale = locale;
    }
  }
});
