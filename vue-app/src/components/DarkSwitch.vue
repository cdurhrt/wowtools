<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { NSwitch } from "naive-ui";
import { computed } from "vue";
import { DarkModeOutlined, LightModeFilled } from "@vicons/material";

const themeStore = useThemeStore();
const darkMode = computed(() => themeStore.darkMode);
</script>

<template>
  <n-switch
    v-model:value="darkMode"
    @update-value="themeStore.darken"
    size="small"
  >
    <template #checked>
      <DarkModeOutlined></DarkModeOutlined>
    </template>
    <template #unchecked>
      <LightModeFilled></LightModeFilled>
    </template>
  </n-switch>
</template>
