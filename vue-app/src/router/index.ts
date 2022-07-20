import type { Component } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import homeRoutes from "@/modules/home/routes";
import calendarRoutes from "@/modules/calendar/routes";

export type RouteMeta = {
  label: string;
  icon?: Component;
};

export function meta(m: RouteMeta) {
  return { meta: m };
}

export const routes = [...homeRoutes, ...calendarRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
