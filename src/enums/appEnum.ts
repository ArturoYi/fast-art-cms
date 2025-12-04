/**
/**
 * 多语言键名
 */
export const LANGUAGE_ZH_CN = "zh-CN";
export const LANGUAGE_EN_US = "en-US";
export const LANGUAGE_AR_SA = "ar-SA";
//通过 Object.values，需要额外处理
// 为了可遍历，你需要这样做
export const LanguageConstants = {
  LANGUAGE_ZH_CN: LANGUAGE_ZH_CN,
  LANGUAGE_EN_US: LANGUAGE_EN_US,
  LANGUAGE_AR_SA: LANGUAGE_AR_SA,
};
export type LanguageType =
  (typeof LanguageConstants)[keyof typeof LanguageConstants];
export const getLanguageCode = (language: LanguageType): string => {
  return language.split("-")[0] || "zh";
};

/**
 * 检查语言是否为RTL语言
 */
export const isRTLLanguage = (language: LanguageType): boolean => {
  return language.startsWith("ar");
};

/**
 * 系统主题
 */
export const SYSTEM_THEME_DARK = "dark";
export const SYSTEM_THEME_LIGHT = "light";
export const SYSTEM_THEME_AUTO = "auto";

export const SystemThemeConstants = {
  SYSTEM_THEME_DARK: SYSTEM_THEME_DARK,
  SYSTEM_THEME_LIGHT: SYSTEM_THEME_LIGHT,
  SYSTEM_THEME_AUTO: SYSTEM_THEME_AUTO,
};
export type SystemThemeType =
  (typeof SystemThemeConstants)[keyof typeof SystemThemeConstants];
