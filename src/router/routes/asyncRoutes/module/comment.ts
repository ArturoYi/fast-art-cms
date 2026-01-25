import type { AppRouteRecord } from '@/router/router';
import { InfoCircle, AlertCircle } from '@vicons/tabler';

export const aboutRoutes: AppRouteRecord = {
  meta: {
    title: 'route.about',
    icon: InfoCircle
  },
  path: '/about',
  name: 'About',
  component: () => import('@/view/about/index.vue')
};

export const errorRoutes: AppRouteRecord = {
  meta: {
    title: 'route.error',
    icon: AlertCircle
  },
  path: '/error',
  name: 'Error',
  component: () => import('@/view/exception/404/404.vue')
};
