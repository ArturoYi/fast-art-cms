import { createRouter, createWebHistory } from "vue-router";
import { staticRoutes } from "./routes/staticRoutes";
import type { App } from "vue";
import { setupBeforeEachGuard } from "./guards/beforeEach";

export const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
});

/**
 * 初始化路由
 */
export function initRouter(app: App<Element>): void {
  setupBeforeEachGuard(router);
  app.use(router);
}
