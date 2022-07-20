import { meta } from "@/router";
import { HomeOutline } from "@vicons/ionicons5";
import type { RouteRecordRaw } from "vue-router";
import HomeViewVue from "./HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeViewVue,
    ...meta({
      label: "首页",
      icon: HomeOutline,
    }),
  },
];

export default routes;
