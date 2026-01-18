import type { AppRouteRecord } from '@/router/router';
import { dashboardRoutes } from '@/router/routes/asyncRoutes/module/dashboard';
import { aboutRoutes, errorRoutes, moreRoutes } from '@/router/routes/asyncRoutes/module/comment';
export const asyncRoutes: AppRouteRecord[] = [dashboardRoutes, aboutRoutes, errorRoutes, moreRoutes];
