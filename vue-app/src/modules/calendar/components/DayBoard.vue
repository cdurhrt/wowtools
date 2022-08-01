<script setup lang="ts">
import type { CalendarDay } from "../models/calendar-day.js";
import { CalendarDayDict } from "../models/calendar-day.js";

const props = defineProps<{ data: CalendarDay }>();
console.log("props :>> ", props);
</script>

<template>
  <div v-for="(item, key, index) in CalendarDayDict" :key="index">
    {{ item }}：{{ data[key] }}
  </div>
</template>

<style scoped></style>
