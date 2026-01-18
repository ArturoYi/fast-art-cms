import type { AppRouteRecord } from '@/router/router';
import { InfoCircle, AlertCircle } from '@vicons/tabler';

export const aboutRoutes: AppRouteRecord = {
  meta: {
    title: 'About',
    icon: InfoCircle
  },
  path: '/about',
  name: 'About',
  component: () => import('@/view/about/index.vue')
};

export const errorRoutes: AppRouteRecord = {
  meta: {
    title: 'Error',
    icon: AlertCircle
  },
  path: '/error',
  name: 'Error',
  component: () => import('@/view/exception/404/404.vue')
};

export const moreRoutes: AppRouteRecord = {
  meta: {
    title: 'More',
    icon: InfoCircle
  },
  path: '/more',
  name: 'More',
  redirect: '/morea',
  children: [
    {
      meta: {
        title: 'MoreA',
        icon: InfoCircle
      },
      path: '/morea',
      name: 'MoreA',
      component: () => import('@/view/more/morea.vue')
    },
    {
      meta: {
        title: 'MoreB',
        icon: AlertCircle
      },
      path: '/moreb',
      name: 'MoreB',
      children: [
        {
          meta: {
            title: 'MoreB1',
            icon: AlertCircle
          },
          path: '/moreb1',
          name: 'MoreB1',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB2',
            icon: AlertCircle
          },
          path: '/moreb2',
          name: 'MoreB2',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB3',
            icon: AlertCircle
          },
          path: '/moreb3',
          name: 'MoreB3',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB4',
            icon: AlertCircle
          },
          path: '/moreb4',
          name: 'MoreB4',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB5',
            icon: AlertCircle
          },
          path: '/moreb5',
          name: 'MoreB5',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB6',
            icon: AlertCircle
          },
          path: '/moreb6',
          name: 'MoreB6',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB7',
            icon: AlertCircle
          },
          path: '/moreb7',
          name: 'MoreB7',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB8',
            icon: AlertCircle
          },
          path: '/moreb8',
          name: 'MoreB8',
          component: () => import('@/view/more/morea.vue')
        },
        {
          meta: {
            title: 'MoreB9',
            icon: AlertCircle
          },
          path: '/moreb9',
          name: 'MoreB9',
          component: () => import('@/view/more/morea.vue')
        }
      ]
    }
  ]
};
