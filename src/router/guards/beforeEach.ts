import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import type { Router } from 'vue-router';
import type { AppRouteRecord } from '@/router/router';
import { RoutesAlias } from '@/router/router';
import { RouteRegistry } from '@/router/core/RouteRegistry';
import { asyncRoutes } from '@/router/routes/asyncRoutes';
import { MenuProcessor } from '@/router/core/MenuProcessor';
import { canAccessNavigation, filterAsyncRoutes } from '@/router/core/permission';

/** 不走路由级权限校验的静态名（无权限/未找到等） */
const NO_ROUTE_PERM_CHECK_NAMES = new Set(['Login', 'Exception403', 'Exception404']);

/**
 * 全局前置守卫（异步：支持登录后拉取权限、注册动态路由、权限兜底）
 */
export function setupBeforeEach(router: Router) {
  router.beforeEach(async to => {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();

    if (userStore.isLogin && to.path === RoutesAlias.Login) {
      return { path: '/', replace: true };
    }

    if (!userStore.isLogin) {
      if (to.path === RoutesAlias.Login || to.path === RoutesAlias.Forbidden) {
        return true;
      }
      return {
        path: RoutesAlias.Login,
        query: { redirect: to.fullPath }
      };
    }

    if (!permissionStore.isLoaded) {
      try {
        await userStore.initPermissions();
      } catch {
        userStore.logout();
        return { path: RoutesAlias.Login, query: { redirect: to.fullPath } };
      }
    }

    if (!RouteRegistry.getInstance(router).isRegistered()) {
      const filtered = filterAsyncRoutes(asyncRoutes, permissionStore);
      registerDynamicRoutes(router, filtered);
      return { path: to.fullPath, replace: true };
    }

    if (to.matched.length === 0) {
      return { name: 'Exception404' };
    }

    const name = to.name;
    if (name != null && NO_ROUTE_PERM_CHECK_NAMES.has(String(name))) {
      return true;
    }

    if (!canAccessNavigation(to, permissionStore)) {
      return { name: 'Exception403', replace: true };
    }

    return true;
  });
}

/**
 * 注册动态路由与菜单
 */
function registerDynamicRoutes(router: Router, routes: AppRouteRecord[]) {
  RouteRegistry.getInstance(router).registerRoutes(routes);
  MenuProcessor.getInstance().registerMenuList(routes);
}
