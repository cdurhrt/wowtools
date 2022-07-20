import router from "@/router/index";
import { NIcon, type MenuOption } from "naive-ui";
import { type Component, h } from "vue";
import { map } from "lodash-es";
import { RouterLink, type RouteRecordRaw } from "vue-router";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function routesToMenus(
  routes: readonly RouteRecordRaw[] | undefined
): MenuOption[] {
  return map(routes, (m) => {
    return {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: m.name,
            },
          },
          { default: () => m.meta?.label }
        ),
      key: `menu-key-${m.name as string}`,
      icon: renderIcon(m.meta?.icon as Component),
      children: m?.children && routesToMenus(m.children),
    };
  });
}

export const routeNavs: MenuOption[] = routesToMenus(router.options.routes);
