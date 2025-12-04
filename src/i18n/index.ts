import { createI18n } from "vue-i18n";
import type { I18n } from "vue-i18n";

// 导入多语言资源
import {
  getLanguageCode,
  LANGUAGE_EN_US,
  LANGUAGE_ZH_CN,
  LANGUAGE_AR_SA,
  LanguageConstants,
  type LanguageType,
  isRTLLanguage,
} from "../enums/appEnum";
import { enUSDatetimeFormats } from "./langs/en-US/datetimeFormats";
import { zhCNDatetimeFormats } from "./langs/zh-CN/datetimeFormats";
import { arSADatetimeFormats } from "./langs/ar-SA/datetimeFormats";
import enMessages from "./langs/en-US/message.json";
import zhMessages from "./langs/zh-CN/message.json";
import arMessages from "./langs/ar-SA/message.json";
import { STORAGE_KEY_USER_INFO, StorageKeyManager } from "../utils/storage";
import { enUSNumberFormats } from "./langs/en-US/numberFormats";
import { zhCNNumberFormats } from "./langs/zh-CN/numberFormats";
import { arSANumberFormats } from "./langs/ar-SA/numberFormats";
/**
 * 语言消息对象
 */
const messages = {
  [LANGUAGE_EN_US]: enMessages,
  [LANGUAGE_ZH_CN]: zhMessages,
  [LANGUAGE_AR_SA]: arMessages,
};

type enMessagesType = typeof enMessages;
type zhMessagesType = typeof zhMessages;
type arMessagesType = typeof arMessages;

/**
 * 从存储中获取语言设置
 * @returns 语言设置，如果获取失败则返回默认语言
 */
const getDefaultLanguage = (): LanguageType => {
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
  const html = document.getElementsByTagName("html")[0];
  html?.setAttribute("lang", getLanguageCode(result));
  // 设置文本方向
  html?.setAttribute("dir", isRTLLanguage(result) ? "rtl" : "ltr");
  return result;
};

const i18n: I18n = createI18n<
  [enMessagesType, zhMessagesType, arMessagesType],
  LanguageType
>({
  legacy: false,
  locale: getDefaultLanguage(),
  fallbackLocale: LANGUAGE_ZH_CN,
  messages,
  datetimeFormats: {
    [LANGUAGE_EN_US]: enUSDatetimeFormats,
    [LANGUAGE_ZH_CN]: zhCNDatetimeFormats,
    [LANGUAGE_AR_SA]: arSADatetimeFormats,
  },
  numberFormats: {
    [LANGUAGE_EN_US]: enUSNumberFormats,
    [LANGUAGE_ZH_CN]: zhCNNumberFormats,
    [LANGUAGE_AR_SA]: arSANumberFormats,
  },
});

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
  { value: LANGUAGE_AR_SA, label: "العربية" },
];

export default i18n;
