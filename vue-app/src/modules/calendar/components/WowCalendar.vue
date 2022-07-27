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
import { computed, reactive, watchEffect, ref } from "vue";
import { CalendarUtil } from "@/libs/calendar/calendar.js";
import { NButton, NSpace, NSelect, NGrid, NGridItem } from "naive-ui";
import { ChevronLeft24Filled } from "@vicons/fluent";
import { range } from "lodash";
import InlineBox from "@/components/global/InlineBox.vue";

// console.log("CalendarUtil :>> ", CalendarUtil);

const props = defineProps<{
  year?: number;
  month?: number;
  day?: number;
  sundayStart?: boolean;
}>();

const todayDate = new Date();
const todayYear = todayDate.getFullYear();
const todayMonth = todayDate.getMonth() + 1;
// const todayWeek = todayDate.getDay();
const todayDay = todayDate.getDate();

const paramsYear = computed(() => props.year || todayYear);
const paramsMonth = computed(() => props.month || todayMonth);
const paramsDay = computed(() => props.day || todayDay);
const isSundayStart = computed(() => props.sundayStart || false);
const paramsDate = computed(
  () => new Date(paramsYear.value, paramsMonth.value - 1, paramsDay.value)
);
const sundayStartOffset = computed(() => (isSundayStart.value ? 0 : 1));
const weekNames = computed(() => {
  const list = ["一", "二", "三", "四", "五", "六"];
  list[isSundayStart.value ? "unshift" : "push"]("日");
  return list;
});

const selectYear = ref(todayYear);
const yearOpts = range(1901, 2101).map((m) => ({
  label: `${m}`,
  value: m,
}));

const dateDetailsList = reactive<Array<{ [key: string]: unknown }>>([]);

const watcher = watchEffect(() => {
  const monthStartDate = startOfMonth(paramsDate.value);
  const monthEndDate = endOfMonth(paramsDate.value);

  const monthStartDateWeek = monthStartDate.getDay();
  const monthEndDateWeek = monthEndDate.getDay();

  let prefixDatesList: Date[] = [],
    suffixDatesList: Date[] = [];

  if (monthStartDateWeek > 0 + sundayStartOffset.value) {
    prefixDatesList = eachDayOfInterval({
      start: subDays(
        monthStartDate,
        monthStartDateWeek - sundayStartOffset.value
      ),
      end: subDays(monthStartDate, 1),
    });
  }

  if (isSundayStart.value ? monthEndDateWeek !== 6 : monthEndDateWeek !== 0) {
    suffixDatesList = eachDayOfInterval({
      start: addDays(monthEndDate, 1),
      end: addDays(
        monthEndDate,
        6 - monthEndDateWeek + sundayStartOffset.value
      ),
    });
  }

  const monthDatesList = eachDayOfInterval({
    start: monthStartDate,
    end: monthEndDate,
  });

  dateDetailsList.splice(0, dateDetailsList.length);
  dateDetailsList.push(
    ...[...prefixDatesList, ...monthDatesList, ...suffixDatesList]
      .map((m) => {
        return {
          oDate: m,
          oDateLabel: format(m, "yyyy-MM-dd"),
          ...CalendarUtil.solar2lunar(
            m.getFullYear(),
            m.getMonth() + 1,
            m.getDate()
          ),
        };
      })
      .map((m) => ({
        ...m,
        isWeekend: m.nWeek < 1 || m.nWeek > 5,
        isCurrentMonth: m.cMonth === paramsMonth.value,
      }))
  );
});
console.log("dateDetailsList :>> ", dateDetailsList);
</script>

<template>
  <h1>{{ year }}年{{ month }}月{{ day }}日</h1>
  <n-grid :x-gap="14" :cols="4">
    <n-grid-item>
      <n-space>
        <n-button>
          <n-icon size="18">
            <ChevronLeft24Filled />
          </n-icon>
        </n-button>
        <InlineBox :width="80">
          <n-select v-model:value="selectYear" :options="yearOpts" />
        </InlineBox>
        <n-button>
          <n-icon size="18">
            <ChevronLeft24Filled />
          </n-icon>
        </n-button>
      </n-space>
    </n-grid-item>
    <n-grid-item>
      <n-space>
        <n-button>
          <n-icon size="18">
            <ChevronLeft24Filled />
          </n-icon>
        </n-button>
        <InlineBox :width="80">
          <n-select v-model:value="selectYear" :options="yearOpts" />
        </InlineBox>
        <n-button>
          <n-icon size="18">
            <ChevronLeft24Filled />
          </n-icon>
        </n-button>
      </n-space>
    </n-grid-item>
    <n-grid-item></n-grid-item>
  </n-grid>
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
        class="wow-calendar-day--item"
      >
        <div
          :class="{
            'wow-calendar-day--itembody': true,
            'today-style': isToday(item.oDate as Date),
            'weekend-day': item.isWeekend,
            'not-this-month-day': !item.isCurrentMonth,
          }"
        >
          <div class="solar-day-text">
            {{ item.cDay }}
          </div>
          <div v-if="!item.lunarFestival" class="lunar-day-text">
            {{ item.IDayCn }}
          </div>
          <div v-else class="lunar-festival-text">
            {{ item.lunarFestival }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wow-calendar {
  border-style: solid;
  border-color: #efefef;
  border-width: 1px 0 0 1px;
}
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

.wow-calendar-week--item {
  padding: 1rem;
}

.wow-calendar-week--item,
.wow-calendar-day--item,
.wow-calendar-day--itembody {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.wow-calendar-week--item,
.wow-calendar-day--item {
  border-style: solid;
  border-color: #f4f4f4;
  border-width: 0 1px 1px 0;
}

.wow-calendar-day--itembody {
  height: 100%;
}

.weekend-day {
  background-color: #ebfdf5;
}
.today-style {
  background-color: #fff7f7;
}
.solar-day-text {
  font-size: 1.5rem;
  color: #333;
}
.lunar-day-text {
  font-size: 0.9rem;
  color: rgb(156, 156, 156);
}
.lunar-festival-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(204, 53, 53);
}
.not-this-month-day div {
  opacity: 0.2;
}
</style>
