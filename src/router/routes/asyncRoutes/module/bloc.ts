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
        icon: FileText,
        permissions: ['blog_post:list']
      },
      path: '/blog/list',
      name: 'BlogList',
      component: () => import('@/view/blog/List.vue')
    },
    {
      meta: {
        title: 'route.blogWrite',
        icon: Pencil,
        permissions: ['blog_post:create', 'blog_post:update'],
        permissionMode: 'any'
      },
      path: '/blog/write',
      name: 'BlogWrite',
      component: () => import('@/view/blog/Write.vue')
    },
    {
      meta: {
        title: 'route.blogCategory',
        icon: FileText,
        permissions: ['blog_category:list']
      },
      path: '/blog/category',
      name: 'BlogCategory',
      component: () => import('@/view/blog/category/List.vue')
    },
    {
      meta: {
        title: 'route.blogTag',
        icon: FileText,
        permissions: ['blog_tag:list']
      },
      path: '/blog/tag',
      name: 'BlogTag',
      component: () => import('@/view/blog/tag/List.vue')
    }
  ]
};
