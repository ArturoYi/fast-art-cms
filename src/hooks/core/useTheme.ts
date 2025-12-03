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
    const htmlElement = document.documentElement;
    let newTheme: SystemThemeType = theme;

    if (theme === SYSTEM_THEME_AUTO) {
      newTheme = prefersDark.value ? SYSTEM_THEME_DARK : SYSTEM_THEME_LIGHT;
    }

    // 设置 data-theme 属性 (为了兼容可能的 CSS 变量选择器)
    htmlElement.setAttribute("data-theme", newTheme);

    // 核心：控制 class="dark" 以激活 UnoCSS/Tailwind 的暗黑模式
    if (newTheme === SYSTEM_THEME_DARK) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }

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
    // 简单逻辑：如果是 Auto，则根据当前实际显示来反转？或者简单地在 Light/Dark 之间轮转
    // 这里我们简化逻辑：点击切换时，不再保留 Auto 状态，而是强制设为 Dark 或 Light

    let targetTheme: SystemThemeType;

    // 如果当前是 Auto，根据系统偏好决定下一个状态
    if (currentTheme === SYSTEM_THEME_AUTO) {
      targetTheme = prefersDark.value ? SYSTEM_THEME_LIGHT : SYSTEM_THEME_DARK;
    } else {
      targetTheme =
        currentTheme === SYSTEM_THEME_DARK
          ? SYSTEM_THEME_LIGHT
          : SYSTEM_THEME_DARK;
    }

    setSystemTheme(targetTheme);
  };

  return {
    setSystemTheme,
    switchTheme,
    prefersDark,
    getSystemThemeStyle: () => userStore.getSystemThemeStyle,
  };
}

/**
 * 初始化主题方法
 */
export function initializeTheme() {
  const prefersDark = usePreferredDark();
  const userStore = useUserStore();
  const htmlElement = document.documentElement;

  //获取用户设置的主题样式
  const applySystemThemeByMode = () => {
    let cachedSystemThemeStyle: SystemThemeType = userStore.getSystemThemeStyle;
    let activeTheme = cachedSystemThemeStyle;

    try {
      // 如果是 AUTO 模式，检测系统偏好
      if (cachedSystemThemeStyle === SYSTEM_THEME_AUTO) {
        activeTheme = prefersDark.value
          ? SYSTEM_THEME_DARK
          : SYSTEM_THEME_LIGHT;
      }
    } finally {
      htmlElement.setAttribute("data-theme", activeTheme);
      if (activeTheme === SYSTEM_THEME_DARK) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
  };

  applySystemThemeByMode();

  /**
   * 如果是AUTO模式，监听系统偏好变化
   */
  watch(
    [() => userStore.getSystemThemeStyle, prefersDark],
    ([newThemeStyle]) => {
      // 只有当系统偏好发生变化并且主题样式为AUTO时，才需要更新主题样式
      if (newThemeStyle === SYSTEM_THEME_AUTO) {
        applySystemThemeByMode();
      }
    },
    { immediate: false } // 初始化时已经调用过一次了
  );
}
