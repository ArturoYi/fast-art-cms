import type { RouteLocationNormalized } from 'vue-router';
import type { AppRouteRecord, RouteMeta } from '@/router/router';

/** 与 Pinia permission store 兼容的最小能力（避免循环依赖） */
export type PermissionChecker = {
  hasAll: (codes: string[]) => boolean;
  hasAny: (codes: string[]) => boolean;
};

/**
 * 与后端约定一致：无 permissions 或空数组视为可访问（与登录态无关的“公共可配置项”在路由上自行控制）
 */
export function canAccessRouteMeta(meta: RouteMeta, store: PermissionChecker): boolean {
  const perms = meta.permissions ?? [];
  if (perms.length === 0) return true;
  const mode = meta.permissionMode ?? 'any';
  return mode === 'all' ? store.hasAll(perms) : store.hasAny(perms);
}

/**
 * 按当前用户权限过滤全量 asyncRoutes，用于注册动态路由与侧边菜单（同源过滤避免菜单/路由不一致）
 */
export function filterAsyncRoutes(routes: AppRouteRecord[], store: PermissionChecker): AppRouteRecord[] {
  const out: AppRouteRecord[] = [];
  for (const route of routes) {
    const one = filterOneAsyncRoute(route, store);
    if (one) out.push(one);
  }
  return out;
}

function filterOneAsyncRoute(route: AppRouteRecord, store: PermissionChecker): AppRouteRecord | null {
  const hasChildren = Boolean(route.children?.length);

  if (hasChildren) {
    const filteredChildren = filterAsyncRoutes(route.children!, store);
    if (filteredChildren.length === 0) {
      if (route.component && canAccessRouteMeta(route.meta, store)) {
        return { ...route, children: undefined };
      }
      return null;
    }
    if (!canAccessRouteMeta(route.meta, store)) {
      return null;
    }
    return { ...route, children: filteredChildren };
  }

  if (!canAccessRouteMeta(route.meta, store)) {
    return null;
  }
  return { ...route };
}

/**
 * 导航兜底：对 matched 中每一项显式声明了非空 permissions 的 meta 都做校验（AND）
 */
export function canAccessNavigation(to: RouteLocationNormalized, store: PermissionChecker): boolean {
  for (const record of to.matched) {
    const meta = record.meta as RouteMeta;
    if (!meta?.permissions?.length) {
      continue;
    }
    if (!canAccessRouteMeta(meta, store)) {
      return false;
    }
  }
  return true;
}
