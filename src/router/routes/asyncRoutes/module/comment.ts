import type { AppRouteRecord } from '@/router/router';

export const aboutRoutes: AppRouteRecord = {
  meta: {
    title: 'About'
  },
  path: '/about',
  name: 'About',
  component: () => import('@/view/about/index.vue')
};

export const errorRoutes: AppRouteRecord = {
  meta: {
    title: 'Error'
  },
  path: '/error',
  name: 'Error',
  component: () => import('@/view/exception/404/404.vue')
};
