import { createRouter, createWebHashHistory } from 'vue-router';
import { staticRoutes } from './routes/staticRoutes';
import type { App } from 'vue';

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes
});

export function setupRouter(app: App<Element>): void {
  app.use(router);
}
