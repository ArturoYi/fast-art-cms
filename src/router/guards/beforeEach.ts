import { useUserStore } from '@/store/modules/user';
import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { RoutesAlias } from '@/router/router';

/** 路由全局前置守卫 */
export function setupBeforeEach(router: Router) {
  router.beforeEach((to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore();
    if (!userStore.isLogin && to.path !== RoutesAlias.Login) {
      next({
        path: RoutesAlias.Login
      });
    } else {
      next();
    }
  });
}
