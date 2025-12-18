import type { Router } from 'vue-router';

/** 路由全局后置守卫 */
export function setupAfterEach(router: Router) {
  router.afterEach(() => {
    // This is a hook for after navigation;
    // you can handle navigation failure, side effects, etc., here.
    // No call to next() is needed in afterEach.
  });
}
