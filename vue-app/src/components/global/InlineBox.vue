<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ width?: string | number }>();
const cWidth = computed(() => {
  const pWidth = props.width;
  if (typeof pWidth === "string") {
    return pWidth;
  }
  if (typeof pWidth === "number") {
    return `${pWidth}px`;
  }
  return "";
});
</script>

<template>
  <div class="wow-inline-box" :style="{ width: cWidth }">
    <slot></slot>
  </div>
</template>

<style scoped>
.wow-inline-box {
  display: inline-flex;
}
</style>
