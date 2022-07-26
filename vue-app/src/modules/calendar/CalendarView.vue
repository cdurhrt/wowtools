<script setup lang="ts">
import { getYear, getMonth, getDate } from "date-fns";
import { NDatePicker } from "naive-ui";
import { ref, computed } from "vue";
import WowCalendar from "./components/WowCalendar.vue";

const timestamp = ref(new Date().getTime());
const calendarYear = computed(() => getYear(timestamp.value));
const calendarMonth = computed(() => getMonth(timestamp.value) + 1);
const calendarDay = computed(() => getDate(timestamp.value));
</script>

<template>
  <div class="calendar-wrapper">
    <n-date-picker v-model:value="timestamp" type="date" />
    <WowCalendar
      :year="calendarYear"
      :month="calendarMonth"
      :day="calendarDay"
      sunday-start
    ></WowCalendar>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  width: 50%;
}
</style>
