import type { RouteRecordRaw } from 'vue-router';

/** 扩展的路由配置类型 */
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean;
};
