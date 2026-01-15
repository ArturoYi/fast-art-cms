import type { AppRouteRecord } from '@/router/router';
import { LayoutBoard } from '@vicons/tabler';

export const dashboardRoutes: AppRouteRecord = {
  meta: {
    title: 'Dashboard',
    icon: LayoutBoard
  },
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/view/dashboard/index.vue')
};
