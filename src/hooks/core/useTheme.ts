import {
  SYSTEM_THEME_AUTO,
  SYSTEM_THEME_DARK,
  SYSTEM_THEME_LIGHT,
  type SystemThemeType,
} from "@/enums/appEnum";
import { useUserStore } from "@/store/modules/user";
import { usePreferredDark } from "@vueuse/core";
import { watch } from "vue";

export function useTheme() {
  const userStore = useUserStore();

  /**
   * 禁用过度效果
   */
  const disableTransitions = () => {
    const style = document.createElement("style");
    style.setAttribute("id", "disable-transitions");
    style.textContent = "* { transition: none !important; }";
    document.head.appendChild(style);
  };

  /**
   * 启用过度效果
   */
  const enableTransitions = () => {
    const style = document.getElementById("disable-transitions");
    if (style) {
      style.remove();
    }
  };

  // 使用 VueUse 的 usePreferredDark 检测系统主题偏好
  const prefersDark = usePreferredDark();

  /**
   * 应用系统主题样式
   */
  const setSystemTheme = (theme: SystemThemeType) => {
    // 临时禁用过度效果
    disableTransitions();
    const htmlElement = document.getElementsByTagName("html")[0];
    let newTheme: SystemThemeType = theme;
    if (theme === SYSTEM_THEME_AUTO) {
      newTheme = prefersDark.value ? SYSTEM_THEME_DARK : SYSTEM_THEME_LIGHT;
    }
    htmlElement?.setAttribute("data-theme", newTheme);
    userStore.setSystemThemeStyle(theme);
    /**
     * 使用 requestAnimationFrame 确保在下一帧恢复过渡效果
     */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        enableTransitions();
      });
    });
  };

  /**
   * 切换主题
   * 切换当前显示的主题，在自动模式下时：
   * 获取当前显示的主题，如果当前显示的主题为暗黑主题，则切换为亮色主题，反之亦然
   */
  const switchTheme = () => {
    const currentTheme = userStore.getSystemThemeStyle;
    let newTheme = prefersDark.value ? SYSTEM_THEME_LIGHT : SYSTEM_THEME_DARK;
    if (currentTheme !== SYSTEM_THEME_AUTO) {
      newTheme =
        currentTheme === SYSTEM_THEME_DARK
          ? SYSTEM_THEME_LIGHT
          : SYSTEM_THEME_DARK;
    }
    setSystemTheme(newTheme);
  };

  return {
    setSystemTheme,
    switchTheme,
    prefersDark,
  };
}

/**
 * 初始化主题方法
 */
export function initializeTheme() {
  const prefersDark = usePreferredDark();
  const userStore = useUserStore();
  const htmlElement = document.getElementsByTagName("html")[0];

  //获取用户设置的主题样式
  const applySystemThemeByMode = () => {
    let cachedSystemThemeStyle: SystemThemeType = userStore.getSystemThemeStyle;
    try {
      // 如果是 AUTO 模式，检测系统偏好
      if (cachedSystemThemeStyle === SYSTEM_THEME_AUTO) {
        cachedSystemThemeStyle = prefersDark.value
          ? SYSTEM_THEME_DARK
          : SYSTEM_THEME_LIGHT;
      }
    } finally {
      htmlElement?.setAttribute("data-theme", cachedSystemThemeStyle);
    }
  };

  applySystemThemeByMode();

  /**
   * 如果是AUTO模式，监听系统偏好变化
   */
  if (userStore.getSystemThemeStyle === SYSTEM_THEME_AUTO) {
    watch(
      prefersDark,
      () => {
        // 只有当系统偏好发生变化并且主题样式为AUTO时，才需要更新主题样式
        if (userStore.getSystemThemeStyle === SYSTEM_THEME_AUTO) {
          applySystemThemeByMode();
        }
      },
      { immediate: true }
    );
  }
}
