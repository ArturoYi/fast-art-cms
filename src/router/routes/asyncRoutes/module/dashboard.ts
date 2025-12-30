import type { AppRouteRecord } from '@/router/router';

export const dashboardRoutes: AppRouteRecord = {
  meta: {
    title: 'Dashboard'
  },
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/view/dashboard/index.vue')
};
