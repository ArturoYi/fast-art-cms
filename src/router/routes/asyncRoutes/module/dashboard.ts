import type { AppRouteRecord } from '@/router/router';
import { LayoutBoard } from '@vicons/tabler';

export const dashboardRoutes: AppRouteRecord = {
  meta: {
    title: 'route.dashboard',
    icon: LayoutBoard
  },
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/view/dashboard/index.vue')
};
