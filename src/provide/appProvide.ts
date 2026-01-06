import { mediaQueryInjectionKey } from '@/injection';
import { provide } from 'vue';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

/**
 * 提供应用级依赖注入
 */
export function appProvide() {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  provide(mediaQueryInjectionKey, {
    isMaxSm: breakpoints.smaller('sm'),
    isMaxMd: breakpoints.smaller('md'),
    isMaxLg: breakpoints.smaller('lg'),
    isMaxXl: breakpoints.smaller('xl'),
    isMax2Xl: breakpoints.smaller('2xl')
  });
}
