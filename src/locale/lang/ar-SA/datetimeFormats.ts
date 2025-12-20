import type { IntlDateTimeFormat } from 'vue-i18n';

/**
 * 阿拉伯语日期时间格式配置
 * @see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export const arSADatetimeFormats: IntlDateTimeFormat = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric'
  }
};
