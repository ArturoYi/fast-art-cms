import { LANGUAGE } from '@/locale';
import { router } from '@/router';
import { MenuProcessor } from '@/router/core/MenuProcessor';
import { RouteRegistry } from '@/router/core/RouteRegistry';
import { RoutesAlias } from '@/router/router';
import { ThemeEnum } from '@/theme/index';
import { StorageConfig } from '@/utils';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(StorageConfig.USER_KEY, {
  state: () =>
    useLocalStorage(
      StorageConfig.USER_KEY,
      {
        _accessToken: '',
        _currentTheme: ThemeEnum.LIGHT,
        _currentThemeModel: ThemeEnum.SYSTEM,
        _currentLocale: LANGUAGE.ZH_CN
      },
      {
        listenToStorageChanges: true,
        mergeDefaults: true
      }
    ),
  getters: {
    isLogin: state => state._accessToken !== '',
    getAccessToken: state => state._accessToken,
    getCurrentTheme: state => state._currentTheme,
    getCurrentThemeModel: state => state._currentThemeModel,
    getCurrentLocale: state => state._currentLocale
  },
  actions: {
    setAccessToken(accessToken: string) {
      this._accessToken = accessToken;
    },
    setCurrentTheme(theme: ThemeEnum) {
      this._currentTheme = theme;
    },
    setCurrentThemeModel(themeModel: ThemeEnum) {
      this._currentThemeModel = themeModel;
    },
    setCurrentLocale(locale: LANGUAGE) {
      this._currentLocale = locale;
    },
    /**
     *  退出登录
     */
    logout() {
      this._accessToken = '';
      this._currentTheme = ThemeEnum.LIGHT;
      this._currentThemeModel = ThemeEnum.SYSTEM;
      this._currentLocale = LANGUAGE.ZH_CN;
      RouteRegistry.getInstance(router).unregisterRoutes();
      MenuProcessor.getInstance().unregisterMenuList();
      router.replace({ path: RoutesAlias.Login });
    }
  }
});
