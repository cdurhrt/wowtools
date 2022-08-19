import type { Component } from "vue";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import homeRoutes from "@/modules/home/routes";
import calendarRoutes from "@/modules/calendar/routes";

const mainRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/calendar",
  },
];

export type RouteMeta = {
  label: string;
  icon?: Component;
};

export function meta(m: RouteMeta) {
  return { meta: m };
}

export const routes = [...mainRoutes, ...homeRoutes, ...calendarRoutes];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
