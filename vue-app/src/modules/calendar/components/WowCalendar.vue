<script setup lang="ts">
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
  isToday,
} from "date-fns";
import { reactive } from "vue";
import { CalendarUtil } from "@/libs/calendar/calendar.js";

console.log("CalendarUtil :>> ", CalendarUtil);

const weekNames = reactive(["日", "一", "二", "三", "四", "五", "六"]);
const startFormSun = true;

const paramsYear = 2022;
const paramsMonth = 7;
const paramsDay = 25;
const paramsDate = new Date(paramsYear, paramsMonth - 1, paramsDay);

const todayDate = new Date();
const todayWeek = todayDate.getDay();

const monthStartDate = startOfMonth(paramsDate);
const monthEndDate = endOfMonth(paramsDate);

const startDateWeek = monthStartDate.getDay();
const endDateWeek = monthEndDate.getDay();

let prefixDatesList: Date[] = [],
  suffixDatesList: Date[] = [];

if (startDateWeek > 0) {
  prefixDatesList = eachDayOfInterval({
    start: subDays(monthStartDate, startDateWeek),
    end: subDays(monthStartDate, 1),
  });
}

if (endDateWeek < 6) {
  suffixDatesList = eachDayOfInterval({
    start: addDays(monthEndDate, 1),
    end: addDays(monthEndDate, 6 - endDateWeek),
  });
}

const monthAllDatesList = eachDayOfInterval({
  start: monthStartDate,
  end: monthEndDate,
});

const dateDetailsList = [
  ...prefixDatesList,
  ...monthAllDatesList,
  ...suffixDatesList,
].map((m) => {
  return {
    oDate: m,
    oDateLabel: format(m, "yyyy-MM-dd"),
    ...CalendarUtil.solar2lunar(m.getFullYear(), m.getMonth() + 1, m.getDate()),
  };
});
console.log("dateDetailsList :>> ", dateDetailsList);
</script>

<template>
  <div class="wow-calendar">
    <div class="wow-calendar-week">
      <div
        v-for="(item, index) in weekNames"
        :key="index"
        class="wow-calendar-week--item"
      >
        {{ item }}
      </div>
    </div>
    <div class="wow-calendar-day">
      <div
        v-for="(item, index) in dateDetailsList"
        :key="index"
        :class="{
          'wow-calendar-day--item': true,
          'today-style': isToday(item.oDate),
        }"
      >
        <div>
          {{ item.cDay }}
        </div>
        <div>
          {{ item.IDayCn }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wow-calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(30px, auto);
}

.wow-calendar-day {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
}
.wow-calendar-week--item,
.wow-calendar-day--item {
  width: 100%;
  padding: 1rem;
}
.today-style {
  border: 1px solid red;
}
</style>
