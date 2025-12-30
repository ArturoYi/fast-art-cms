import type { RouteRecordRaw } from 'vue-router';

/**
 * 公共路由别名
 * 存放系统级公共路由路径，如布局容器、登录页等
 */
export enum RoutesAlias {
  Layout = '/index/index', // 布局容器
  Login = '/auth/login' // 登录页
}

/** 扩展的路由配置类型 */
export type AppRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean;
};

/**
 * 路由元数据接口
 * 定义路由的各种配置属性
 */
export interface RouteMeta extends Record<string | number | symbol, unknown> {
  /** 路由标题 */
  title: string;
  /** 路由图标 */
  icon?: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否缓存 */
  keepAlive?: boolean;
  /** 是否固定在标签栏 */
  affix?: boolean;
  /** 是否为iframe嵌套 */
  iframe?: boolean;
}

/**
 * 应用路由记录接口
 * 扩展 Vue Router 的路由记录类型
 */
export interface AppRouteRecord extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  id?: number;
  meta: RouteMeta;
  children?: AppRouteRecord[];
}
