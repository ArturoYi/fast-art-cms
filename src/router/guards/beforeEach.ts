import { useUserStore } from '@/store/modules/user';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { RoutesAlias } from '@/router/router';
import { RouteRegistry } from '@/router/core/RouteRegistry';
import { asyncRoutes } from '@/router/routes/asyncRoutes';

let routeRegistry: RouteRegistry | null = null;

/** 路由全局前置守卫 */
export function setupBeforeEach(router: Router) {
  router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore();

    // 1. 检查登录状态
    if (!checkLoginStatus(to, from, next, userStore)) {
      return false;
    }

    // 2. 能走到这里说明已经登录，注册动态路由
    if (!routeRegistry?.isRegistered()) {
      registerDynamicRoutes(router);
      // 3. 注册后重新跳转，使用 fullPath 确保重新匹配且不带旧的 name
      next({ path: to.fullPath, replace: true });
      return;
    }

    // 4. 是否有匹配的路由
    if (to.matched.length > 0) {
      next();
    } else {
      // 5. 没有匹配的路由，跳转404
      next({
        path: '/:pathMatch(.*)*'
      });
    }
  });
}

/**
 * 登录状态判断
 * @param to 目标路由
 * @param from 来源路由
 * @param next 下一步
 * @param userStore 用户状态管理
 * @returns boolean 是否允许访问
 */
function checkLoginStatus(
  to: RouteLocationNormalized,
  _: RouteLocationNormalized,
  next: NavigationGuardNext,
  userStore: ReturnType<typeof useUserStore>
): boolean {
  // 已登录用户访问登录页面时重定向到首页
  if (userStore.isLogin && to.path === RoutesAlias.Login) {
    next({ path: '/' });
    return false;
  }

  // 已登录用户访问其他页面或未登录用户访问登录页面时允许通过
  if (userStore.isLogin || to.path === RoutesAlias.Login) {
    return true;
  }

  // 未登录用户访问其他页面时重定向到登录页
  next({
    path: RoutesAlias.Login,
    query: {
      redirect: to.fullPath
    }
  });
  return false;
}

/**
 * 注册动态路由
 * @param router 路由实例
 */
function registerDynamicRoutes(router: Router) {
  if (routeRegistry === null) {
    routeRegistry = new RouteRegistry(router);
  }
  routeRegistry.registerRoutes(asyncRoutes);
}
