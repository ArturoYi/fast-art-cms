import { LANGUAGE } from '@/locale';
import { getUserPermissionsService } from '@/api/client';
import { router } from '@/router';
import { MenuProcessor } from '@/router/core/MenuProcessor';
import { RouteRegistry } from '@/router/core/RouteRegistry';
import { RoutesAlias } from '@/router/router';
import { usePermissionStore } from '@/store/modules/permission';
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
    async initPermissions(): Promise<void> {
      const permissionStore = usePermissionStore();
      const res = await getUserPermissionsService();
      const perms = (res?.data ?? []) as string[];
      permissionStore.setPermissions(perms);
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
      const permissionStore = usePermissionStore();
      this._accessToken = '';
      this._currentTheme = ThemeEnum.LIGHT;
      this._currentThemeModel = ThemeEnum.SYSTEM;
      this._currentLocale = LANGUAGE.ZH_CN;
      if (typeof document !== 'undefined') {
        // 与 store 同步：否则 data-theme 仍为登出前暗色，页面背景为暗而 Naive 从 store 已切到浅色
        document.documentElement.setAttribute('data-theme', ThemeEnum.LIGHT);
      }
      permissionStore.resetPermissions();
      RouteRegistry.getInstance(router).unregisterRoutes();
      MenuProcessor.getInstance().unregisterMenuList();
      router.replace({ path: RoutesAlias.Login });
    }
  }
});
