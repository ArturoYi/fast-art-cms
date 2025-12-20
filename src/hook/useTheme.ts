import { useUserStore } from '@/store/modules/user';
import { ThemeEnum } from '@/theme/index';
import { usePreferredDark } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { darkTheme, lightTheme } from 'naive-ui';
import { darkThemeOverrides } from '@/theme/dark/dark';
import { lightThemeOverrides } from '@/theme/light/light';

export function useTheme() {
  const userStore = useUserStore();
  const { getCurrentTheme, getCurrentThemeModel } = storeToRefs(userStore);
  const { setCurrentTheme, setCurrentThemeModel } = userStore;
  const prefersDark = usePreferredDark();

  // 监听系统主题变化，当用户选择 SYSTEM 模式时自动切换
  watch(prefersDark, isDark => {
    if (getCurrentThemeModel.value === ThemeEnum.SYSTEM) {
      const newTheme = isDark ? ThemeEnum.DARK : ThemeEnum.LIGHT;
      setCurrentTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });

  /**
   * 自动设置主题
   * @param theme 主题
   * @param themeModel 主题模式
   */
  const setSystemThemeModel = (theme?: ThemeEnum, themeModel?: ThemeEnum) => {
    const htmlElement = document.documentElement;
    let newTheme: ThemeEnum = theme || getCurrentTheme.value;
    let newThemeModel: ThemeEnum = themeModel || getCurrentThemeModel.value;

    if (newThemeModel === ThemeEnum.SYSTEM) {
      newTheme = prefersDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    }
    setCurrentTheme(newTheme);
    setCurrentThemeModel(newThemeModel);
    htmlElement.setAttribute('data-theme', newTheme);
  };

  /**
   * 切换主题
   * @param theme 主题
   */
  const toggleTheme = (theme: ThemeEnum) => {
    const htmlElement = document.documentElement;
    let newTheme: ThemeEnum = theme;
    let newThemeModel: ThemeEnum = theme;
    if (newTheme === ThemeEnum.SYSTEM) {
      newTheme = prefersDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    }
    setCurrentTheme(newTheme);
    setCurrentThemeModel(newThemeModel);
    htmlElement.setAttribute('data-theme', newTheme);
  };

  /**
   * 获取主题
   * @returns 主题
   */
  const getCurrentNaiveTheme = computed(() => {
    if (getCurrentTheme.value === ThemeEnum.SYSTEM) {
      return prefersDark.value ? darkTheme : lightTheme;
    }
    return getCurrentTheme.value === ThemeEnum.DARK ? darkTheme : lightTheme;
  });

  /**
   * 获取主题覆盖
   * @returns 主题覆盖
   */
  const getCurrentThemeOverrides = computed(() => {
    if (getCurrentTheme.value === ThemeEnum.SYSTEM) {
      return prefersDark.value ? darkThemeOverrides() : lightThemeOverrides();
    }
    return getCurrentTheme.value === ThemeEnum.DARK ? darkThemeOverrides() : lightThemeOverrides();
  });

  return {
    getCurrentTheme,
    getCurrentThemeModel,
    prefersDark,
    getCurrentNaiveTheme,
    getCurrentThemeOverrides,
    setSystemThemeModel,
    toggleTheme
  };
}
