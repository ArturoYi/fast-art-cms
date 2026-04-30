import type { AppRouteRecord } from '@/router/router';
import { Key, User, UserCircle } from '@vicons/tabler';

export const profileRoutes: AppRouteRecord = {
  meta: {
    title: 'route.profile',
    icon: UserCircle
  },
  path: '/profile',
  name: 'Profile',
  redirect: '/profile/info',
  children: [
    {
      meta: {
        title: 'route.profileInfo',
        icon: User
      },
      path: '/profile/info',
      name: 'ProfileInfo',
      component: () => import('@/view/profile/ProfileInfo.vue')
    },
    {
      meta: {
        title: 'route.profilePassword',
        icon: Key
      },
      path: '/profile/password',
      name: 'ProfilePassword',
      component: () => import('@/view/profile/ChangePassword.vue')
    }
  ]
};
