<script setup lang="ts">
import { ref } from "vue";
import DarkSwitch from "@/components/DarkSwitch.vue";
import {
  NMenu,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NSpace,
  NScrollbar,
} from "naive-ui";
import { routeNavs } from "./route-navs";

const activeKey = ref<string | null>(null);
const collapsed = ref(true);
const menuWidth = 240;
const collapsedWidth = 64;
</script>

<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        class="wfw-layout-sider"
        bordered
        collapse-mode="width"
        :collapsed-width="collapsedWidth"
        :width="menuWidth"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-scrollbar>
          <n-menu
            v-model:value="activeKey"
            :collapsed="collapsed"
            :collapsed-width="collapsedWidth"
            :options="routeNavs"
          />
          <n-space justify="center">
            <DarkSwitch />
          </n-space>
        </n-scrollbar>
      </n-layout-sider>
      <n-layout>
        <n-layout-content content-style="padding: 1rem;">
          <n-scrollbar style="max-height: 100vh; box-sizing: border-box">
            <slot></slot>
          </n-scrollbar>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<style scoped>
.wfw-layout-sider {
  height: 100vh;
}
</style>
