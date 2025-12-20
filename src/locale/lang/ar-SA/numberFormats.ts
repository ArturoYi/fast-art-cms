import type { IntlNumberFormat } from 'vue-i18n';

export const arSANumberFormats: IntlNumberFormat = {
  // 货币格式化（沙特里亚尔）
  currency: {
    style: 'currency',
    currency: 'SAR',
    notation: 'standard',
    useGrouping: true,
    currencyDisplay: 'symbol'
  },
  // 小数格式化（保留 2 位小数）
  decimal: {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  },
  // 百分比格式化（不分组）
  percent: {
    style: 'percent',
    useGrouping: false,
    minimumFractionDigits: 1
  },
  // 科学计数法（保留 3 位有效数字）
  scientific: {
    style: 'decimal',
    notation: 'scientific',
    minimumSignificantDigits: 3,
    maximumSignificantDigits: 3
  },
  // 紧凑表示法（如 1.2K、3.4M）
  compact: {
    style: 'decimal',
    notation: 'compact',
    compactDisplay: 'short',
    useGrouping: false
  }
};
