<script setup lang="ts">
import LayoutView from "@/components/layout/LayoutView.vue";
import { NConfigProvider, darkTheme } from "naive-ui";
import { useThemeStore } from "@/stores/theme";
import lightThemeOverrides from "./modules/theme/light-overrides";
import darkThemeOverrides from "./modules/theme/dark-overrides";
import { computed } from "vue";

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.darkMode);
const theme = computed(() => (isDark.value ? darkTheme : null));
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="isDark ? darkThemeOverrides : lightThemeOverrides"
  >
    <div class="app-container">
      <layout-view>
        <RouterView />
      </layout-view>
    </div>
  </n-config-provider>
</template>

<style>
.app-container {
  max-height: 100vh;
  overflow-y: hidden;
}
</style>
