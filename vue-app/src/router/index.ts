import type { Component } from "vue";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import homeRoutes from "@/modules/home/routes";
import calendarRoutes from "@/modules/calendar/routes";
import newsRoutes from "@/modules/news/routes";

const mainRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/news",
  },
];

export type RouteMeta = {
  label: string;
  icon?: Component;
};

export function meta(m: RouteMeta) {
  return { meta: m };
}

export const routes = [
  ...mainRoutes,
  ...homeRoutes,
  ...newsRoutes,
  ...calendarRoutes,
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
