import { createI18n } from "vue-i18n";
import type { I18n, I18nOptions } from "vue-i18n";

// 导入多语言资源
import {
  getLanguageCode,
  LANGUAGE_EN_US,
  LANGUAGE_ZH_CN,
  LanguageConstants,
  type LanguageEnum,
} from "../enums/appEnum";
import { enUSDatetimeFormats } from "./langs/en-US/datetimeFormats";
import { zhCNDatetimeFormats } from "./langs/zh-CN/datetimeFormats";
import enMessages from "./langs/en-US/message.json";
import zhMessages from "./langs/zh-CN/message.json";
import { STORAGE_KEY_USER_INFO, StorageKeyManager } from "../utils/storage";
import { enUSNumberFormats } from "./langs/en-US/numberFormats";
import { zhCNNumberFormats } from "./langs/zh-CN/numberFormats";
/**
 * 语言消息对象
 */
const messages = {
  [LANGUAGE_EN_US]: enMessages,
  [LANGUAGE_ZH_CN]: zhMessages,
};

/**
 * 从存储中获取语言设置
 * @returns 语言设置，如果获取失败则返回默认语言
 */
const getDefaultLanguage = (): LanguageEnum => {
  let result = LANGUAGE_ZH_CN;
  try {
    const key = StorageKeyManager.getStorageKey(STORAGE_KEY_USER_INFO);
    const userStore = localStorage.getItem(key);
    if (userStore) {
      const { language } = JSON.parse(userStore);
      if (language && Object.values(LanguageConstants).includes(language)) {
        result = language;
      }
    }
  } catch (error) {
    console.warn("getDefaultLanguage error", error);
  }
  document
    .getElementsByTagName("html")[0]
    ?.setAttribute("lang", getLanguageCode(result));
  return result as LanguageEnum;
};

const i18nOptions: I18nOptions = {
  legacy: false,
  locale: getDefaultLanguage(),
  fallbackLocale: LANGUAGE_ZH_CN,
  messages: messages,
  datetimeFormats: {
    [LANGUAGE_EN_US]: enUSDatetimeFormats,
    [LANGUAGE_ZH_CN]: zhCNDatetimeFormats,
  },
  numberFormats: {
    [LANGUAGE_EN_US]: enUSNumberFormats,
    [LANGUAGE_ZH_CN]: zhCNNumberFormats,
  },
};

const i18n: I18n = createI18n(i18nOptions);

/**
 * 翻译函数类型
 */
interface Translation {
  (key: string): string;
}

/**
 * 日期时间格式化函数类型
 */
interface DateTimeFormat {
  (date: Date, format: string): string;
}

/**
 * 数字格式化函数类型
 */
interface NumberFormat {
  (number: number, format: string): string;
}

/**
 * 翻译函数
 */
export const $t = i18n.global.t as Translation;

/**
 * 日期时间格式化函数
 */
export const $d = i18n.global.d as DateTimeFormat;

/**
 * 数字格式化函数
 */
export const $n = i18n.global.n as NumberFormat;

/**
 * 语言选项列表
 * 用于语言切换下拉框
 */
export const languageOptions = [
  { value: LANGUAGE_ZH_CN, label: "简体中文" },
  { value: LANGUAGE_EN_US, label: "English" },
];

export default i18n;
