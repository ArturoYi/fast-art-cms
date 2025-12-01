import { useUserStore } from "@/store/modules/user";
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";
import { routesAlias } from "../routesAlias";

/**
 * 设置路由前置守卫
 */
export function setupBeforeEachGuard(router: Router) {
  router.beforeEach(
    (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const userStore = useUserStore();

      if (!loginStatusGuard(to, userStore, next)) {
        return;
      }

      if (to.matched.length > 0) {
        next();
        return;
      }
      next({ name: "Exception404" });
    }
  );
}

/**
 * 登录状态拦截
 * @returns 是否允许访问路由 true: 允许访问 false: 不允许访问（内部已经处理跳转逻辑）
 */
function loginStatusGuard(
  to: RouteLocationNormalized,
  userStore: ReturnType<typeof useUserStore>,
  next: NavigationGuardNext
): boolean {
  if (userStore.isLogin || to.path === routesAlias.login) {
    return true;
  } else {
    next({
      name: "Login",
      query: {
        redirect: to.fullPath,
      },
    });
    return false;
  }
}
