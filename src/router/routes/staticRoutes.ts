import type { RouteRecordRaw } from "vue-router";

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: "/auth/login",
    name: "Login",
    component: () => import("@/views/auth/login/index.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Exception404",
    component: () => import("@/views/exception/404/index.vue"),
    meta: { title: "404" },
  },
];
