import type { AppRouteRecord } from '@/router/router';
import { dashboardRoutes } from '@/router/routes/asyncRoutes/module/dashboard';
import { aboutRoutes, errorRoutes } from '@/router/routes/asyncRoutes/module/comment';
import { blogRoutes } from '@/router/routes/asyncRoutes/module/bloc';
import { profileRoutes } from '@/router/routes/asyncRoutes/module/profile';
export const asyncRoutes: AppRouteRecord[] = [dashboardRoutes, aboutRoutes, errorRoutes, blogRoutes, profileRoutes];
