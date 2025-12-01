/**
/**
 * 多语言键名
 */
export const LANGUAGE_ZH_CN = "zh-CN";
export const LANGUAGE_EN_US = "en-US";
export type LanguageEnum = typeof LANGUAGE_ZH_CN | typeof LANGUAGE_EN_US;
//通过 Object.values，需要额外处理
// 为了可遍历，你需要这样做
export const LanguageConstants = {
  LANGUAGE_ZH_CN: "zh-CN",
  LANGUAGE_EN_US: "en-US",
};
export type LanguageType =
  (typeof LanguageConstants)[keyof typeof LanguageConstants];
export const getLanguageCode = (language: LanguageType): string => {
  return language.split("-")[0] || "zh";
};
