<script setup lang="ts">
import { getYear, getMonth, getDate } from "date-fns";
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
  <div class="calendar-view">
    <div class="calendar-wrapper">
      <WowCalendar
        :year="calendarYear"
        :month="calendarMonth"
        :day="calendarDay"
        @on-day-selected="calendarDaySelected"
      ></WowCalendar>
    </div>
    <div class="calendar-paper-wrapper">
      <CalendarPaper :data="dayBoardDay"></CalendarPaper>
    </div>
  </div>

  <!-- <WowCalendar
    :year="calendarYear"
    :month="calendarMonth"
    :day="calendarDay"
    @on-day-selected="calendarDaySelected"
  ></WowCalendar> -->
</template>

<style scoped>
.calendar-view {
  display: flex;
  flex-wrap: wrap;
  /* min-width: 888px; */
  margin: 0 auto;
}
.calendar-wrapper {
  flex: 2;
  min-width: 888px;
  margin: 12px;
}
.calendar-paper-wrapper {
  flex: 1;
  margin: 12px;
  padding-top: 58px;
  /* margin: 58px -12px 24px; */
}
</style>
