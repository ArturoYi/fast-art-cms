import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRoutes } from '@/router/routes/staticRoutes';
import type { App } from 'vue';
import { setupAfterEach } from '@/router/guards/afterEach';
import { setupBeforeEach } from '@/router/guards/beforeEach';

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
});

export function setupRouter(app: App<Element>): void {
  setupBeforeEach(router);
  setupAfterEach(router);
  app.use(router);
}
