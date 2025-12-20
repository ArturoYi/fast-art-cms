import type { IntlDateTimeFormat } from 'vue-i18n';

/**
 * 英文日期时间格式配置
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export const enUSDatetimeFormats: IntlDateTimeFormat = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }
};
