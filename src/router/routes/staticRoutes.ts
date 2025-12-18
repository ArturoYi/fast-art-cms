import type { AppRouteRecordRaw } from '@/router/router';

/**
 * 静态路由
 */
export const staticRoutes: AppRouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/view/auth/login/login.vue'),
    meta: {
      title: '登录',
      isHide: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Exception404',
    component: () => import('@/view/exception/404/404.vue'),
    meta: { title: '404' }
  }
];
