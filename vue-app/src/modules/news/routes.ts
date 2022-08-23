import { meta } from "@/router";
import { HomeOutline } from "@vicons/ionicons5";
import type { RouteRecordRaw } from "vue-router";
import NewsViewVue from "./NewsView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/news",
    name: "news",
    component: NewsViewVue,
    ...meta({
      label: "热榜",
      icon: HomeOutline,
    }),
  },
];

export default routes;
