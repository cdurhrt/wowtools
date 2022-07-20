import { meta } from "@/router";
import { CalendarOutline } from "@vicons/ionicons5";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("./CalendarView.vue"),
    ...meta({
      label: "日历",
      icon: CalendarOutline,
    }),
  },
];

export default routes;
