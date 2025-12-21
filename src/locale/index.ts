import { createI18n, type I18n, type I18nOptions } from 'vue-i18n';
import enUSMessage from '@/locale/lang/en-US/message';
import zhCNMessage from '@/locale/lang/zh-CN/message';
import arDZMessage from '@/locale/lang/ar-DZ/message';
import { enUSDatetimeFormats } from '@/locale/lang/en-US/datetimeFormats';
import { zhCNDatetimeFormats } from '@/locale/lang/zh-CN/datetimeFormats';
import { arDZDatetimeFormats } from '@/locale/lang/ar-DZ/datetimeFormats';
import { zhCNNumberFormats } from '@/locale/lang/zh-CN/numberFormats';
import { arDZNumberFormats } from '@/locale/lang/ar-DZ/numberFormats';
import { enUSNumberFormats } from '@/locale/lang/en-US/numberFormats';
/**
 * 语言枚举
 */
export enum LANGUAGE {
  EN_US = 'en-US',
  ZH_CN = 'zh-CN',
  AR_DZ = 'ar-DZ'
}
/**
 * 语言消息对象
 */
const messages = {
  [LANGUAGE.EN_US]: enUSMessage,
  [LANGUAGE.ZH_CN]: zhCNMessage,
  [LANGUAGE.AR_DZ]: arDZMessage
};
/**
 * 语言格式化对象
 */
const datetimeFormats = {
  [LANGUAGE.EN_US]: enUSDatetimeFormats,
  [LANGUAGE.ZH_CN]: zhCNDatetimeFormats,
  [LANGUAGE.AR_DZ]: arDZDatetimeFormats
};

/**
 * 语言数字格式化对象
 */
const numberFormats = {
  [LANGUAGE.EN_US]: enUSNumberFormats,
  [LANGUAGE.ZH_CN]: zhCNNumberFormats,
  [LANGUAGE.AR_DZ]: arDZNumberFormats
};

const options: I18nOptions = {
  legacy: false,
  locale: LANGUAGE.ZH_CN,
  messages: messages,
  datetimeFormats: datetimeFormats,
  numberFormats: numberFormats
};

/**
 * 国际化实例
 */
const i18n: I18n = createI18n(options);

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
 * 检查语言是否为RTL语言
 */
export const isRTLLanguage = (language: LANGUAGE): boolean => {
  return language.startsWith('ar');
};

/**
 * 至此的语言列表option
 */
export const languageOptions = [
  {
    label: 'English',
    value: LANGUAGE.EN_US
  },
  {
    label: '中文(简体)',
    value: LANGUAGE.ZH_CN
  },
  {
    label: '阿拉伯语(阿尔及利亚)',
    value: LANGUAGE.AR_DZ
  }
];

export default i18n;
