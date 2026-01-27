import type { ComputedRef } from 'vue';

export interface MediaQueryProvider {
  isMaxSm: ComputedRef<boolean>;
  isMaxMd: ComputedRef<boolean>;
  isMaxLg: ComputedRef<boolean>;
  isMaxXl: ComputedRef<boolean>;
  isMax2Xl: ComputedRef<boolean>;
  /**
   * 当前匹配的断点列表
   */
  current: ComputedRef<string[]>;
}
