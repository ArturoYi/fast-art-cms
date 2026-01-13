import type { Router, RouteRecordRaw } from 'vue-router';
import type { AppRouteRecord } from '@/router/router';

export class RouteRegistry {
  private static instance: RouteRegistry | null = null;
  private router: Router;
  private registered = false;

  private constructor(router: Router) {
    this.router = router;
  }

  /**
   * 将 AppRouteRecord 转换为 RouteRecordRaw
   * @param appRoute AppRouteRecord
   * @returns RouteRecordRaw
   */
  private convertToRouteRecordRaw(appRoute: AppRouteRecord): RouteRecordRaw {
    const route: RouteRecordRaw = {
      path: appRoute.path,
      name: appRoute.name,
      component: appRoute.component,
      redirect: appRoute.redirect,
      children: appRoute.children ? appRoute.children.map(child => this.convertToRouteRecordRaw(child)) : [],
      meta: appRoute.meta
    };

    return route;
  }

  /**
   * 注册路由
   * @param routes 路由配置
   */
  registerRoutes(routes: AppRouteRecord[]) {
    // 1. 如果已经注册过，则直接返回
    if (this.registered) {
      return;
    }

    // 2. 注册路由,避免重复注册
    this.router.addRoute({
      path: '/',
      name: 'layout',
      component: () => import('@/layout/index.vue'),
      redirect: '/dashboard',
      children: routes.map(route => this.convertToRouteRecordRaw(route))
    });
    this.registered = true;
  }

  /**
   * 注销路由
   */
  unregisterRoutes() {
    this.router.removeRoute('layout');
    this.registered = false;
  }

  /**
   * 检查是否已经注册过
   * @returns boolean
   */
  isRegistered() {
    return this.registered;
  }

  /**
   * 获取单例实例
   * @param router 路由实例
   * @returns RouteRegistry
   */
  static getInstance(router: Router): RouteRegistry {
    if (!RouteRegistry.instance) {
      RouteRegistry.instance = new RouteRegistry(router);
    }
    return RouteRegistry.instance;
  }
}
