import type { AppRouteRecord } from '@/router/router';
import { FileText, Pencil } from '@vicons/tabler';

export const blogRoutes: AppRouteRecord = {
  meta: {
    title: 'route.blog',
    icon: FileText
  },
  path: '/blog',
  name: 'Blog',
  redirect: '/blog/list',
  children: [
    {
      meta: {
        title: 'route.blogList',
        icon: FileText
      },
      path: '/list',
      name: 'BlogList',
      component: () => import('@/view/blog/List.vue')
    },
    {
      meta: {
        title: 'route.blogWrite',
        icon: Pencil
      },
      path: '/write',
      name: 'BlogWrite',
      component: () => import('@/view/blog/Write.vue')
    }
  ]
};
