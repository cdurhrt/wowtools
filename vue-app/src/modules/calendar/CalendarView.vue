<script setup lang="ts">
import { getYear, getMonth, getDate } from "date-fns";
import { NSpace } from "naive-ui";
import { ref, computed } from "vue";
import WowCalendar from "./components/WowCalendar.vue";
import type { CalendarDay } from "./models/calendar-day";
import CalendarPaper from "./components/CalendarPaper.vue";
import { CalendarUtil } from "@/libs/calendar/calendar";

const timestamp = ref(new Date().getTime());
const calendarYear = computed(() => getYear(timestamp.value));
const calendarMonth = computed(() => getMonth(timestamp.value) + 1);
const calendarDay = computed(() => getDate(timestamp.value));

const dayBoardDay = ref<CalendarDay>(
  CalendarUtil.solar2lunar(calendarYear, calendarMonth, calendarDay)
);

function calendarDaySelected(day: CalendarDay) {
  console.log("day :>> ", day);
  dayBoardDay.value = day;
}
</script>

<template>
  <!-- <n-space>
    <div class="calendar-wrapper">
      <WowCalendar
        :year="calendarYear"
        :month="calendarMonth"
        :day="calendarDay"
        @on-day-selected="calendarDaySelected"
      ></WowCalendar>
    </div>
    <div>
      <CalendarPaper :data="dayBoardDay"></CalendarPaper>
    </div>
  </n-space> -->

  <WowCalendar
    :year="calendarYear"
    :month="calendarMonth"
    :day="calendarDay"
    @on-day-selected="calendarDaySelected"
  ></WowCalendar>
</template>

<style scoped></style>
