<script setup lang="ts">
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  subDays,
} from "date-fns";
import { computed, reactive, watchEffect, ref } from "vue";
import { CalendarUtil } from "@/libs/calendar/calendar.js";
import { NButton, NSpace, NSelect, NPopover, NSwitch } from "naive-ui";
import { compact, map, range } from "lodash";
import InlineBox from "@/components/global/InlineBox.vue";
import { ChevronBackSharp, ChevronForwardSharp } from "@vicons/ionicons5";
import type { CalendarDay } from "../models/calendar-day.js";
import {
  CalendarDayCircleSigns,
  CalendarDayTypeFields,
} from "../models/day-signs";
import { isHoliday, isHolidayFix } from "../models/holiday.js";
import { CalendarDayTypeEnum } from "../models/day.type";

const props = defineProps<{
  year?: number;
  month?: number;
  day?: number;
  sundayStart?: boolean;
}>();

const emit = defineEmits(["onDaySelected"]);

const todayDate = new Date();
const todayYear = todayDate.getFullYear();
const todayMonth = todayDate.getMonth() + 1;
// const todayWeek = todayDate.getDay();
const todayDay = todayDate.getDate();

const paramsYear = computed(() => props.year || todayYear);
const paramsMonth = computed(() => props.month || todayMonth);
const paramsDay = computed(() => props.day || todayDay);

// const paramsDate = computed(
//   () => new Date(paramsYear.value, paramsMonth.value - 1, paramsDay.value)
// );

const isSundayStart = ref(props.sundayStart || false);
const sundayStartOffset = computed(() => (isSundayStart.value ? 0 : 1));

const weekNames = computed(() => {
  const list = ["一", "二", "三", "四", "五", "六"];
  list[isSundayStart.value ? "unshift" : "push"]("日");
  return list;
});

const yearOpts = range(1901, 2101).map((m) => ({
  label: `${m}`,
  value: m,
}));
const monthOpts = range(1, 13).map((m) => ({
  label: `${m}`,
  value: m,
}));

const selectYear = ref(paramsYear.value);
const selectMonth = ref(paramsMonth.value);
const selectDay = ref(paramsDay.value);

const onTapYear = ref(paramsYear.value);
const onTapMonth = ref(paramsMonth.value);
const onTapDay = ref(paramsDay.value);

const selectDate = computed(
  () => new Date(selectYear.value, selectMonth.value - 1, selectDay.value)
);

const dateDetailsList = reactive<Array<CalendarDay>>([]);

const colors = reactive<Record<string, string>>({
  todaySecondary:
    CalendarDayCircleSigns[CalendarDayTypeFields[CalendarDayTypeEnum.today]]
      .color.secondary,
  holidaySecondary:
    CalendarDayCircleSigns[CalendarDayTypeFields[CalendarDayTypeEnum.holiday]]
      .color.secondary,
  holidayFixSecondary:
    CalendarDayCircleSigns[
      CalendarDayTypeFields[CalendarDayTypeEnum["holiday-fix"]]
    ].color.secondary,
});

watchEffect(() => {
  const monthStartDate = startOfMonth(selectDate.value);
  const monthEndDate = endOfMonth(selectDate.value);

  const monthStartDateWeek =
    monthStartDate.getDay() === 0
      ? isSundayStart.value
        ? 0
        : 7
      : monthStartDate.getDay();
  const monthEndDateWeek = monthEndDate.getDay();

  let prefixDatesList: Date[] = [],
    suffixDatesList: Date[] = [];

  if (monthStartDateWeek > sundayStartOffset.value) {
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
    ...map(
      [...prefixDatesList, ...monthDatesList, ...suffixDatesList],
      getDayDetail
    )
  );
});
console.log("dateDetailsList :>> ", dateDetailsList);

// 将一个Date转成CalendarDay
function getDayDetail(m: Date): CalendarDay {
  const calcDay = CalendarUtil.solar2lunar(
    m.getFullYear(),
    m.getMonth() + 1,
    m.getDate()
  );
  return {
    ...calcDay,
    oDate: m,
    oDateLabel: format(m, "yyyy-MM-dd"),
    isWeekend: calcDay.nWeek < 1 || calcDay.nWeek > 5,
    isCurPanelMonth: calcDay.cMonth === selectMonth.value,
    fests: compact([calcDay.Term, calcDay.lunarFestival, calcDay.festival]),
    isHoliday: isHoliday(calcDay.cYear, calcDay.cMonth, calcDay.cDay),
    isHolidayFix: isHolidayFix(calcDay.cYear, calcDay.cMonth, calcDay.cDay),
  };
}

// 选中日历某日
function calendarOnDaySelected(calendarDay: CalendarDay) {
  emit("onDaySelected", calendarDay);
  onTapYear.value = calendarDay.cYear;
  onTapMonth.value = calendarDay.cMonth;
  onTapDay.value = calendarDay.cDay;
}

// 回到今天
function backToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  selectYear.value = year;
  selectMonth.value = month;
  selectDay.value = day;

  calendarOnDaySelected(getDayDetail(new Date()));
}
</script>

<template>
  <div class="">
    <!-- <h1>{{ onTapYear }}年{{ onTapMonth }}月{{ onTapDay }}日</h1> -->
    <n-space class="date-selector-bar">
      <n-space :wrap="false">
        <n-button :disabled="selectYear < 1902" @click="selectYear--">
          <template #icon>
            <ChevronBackSharp />
          </template>
        </n-button>
        <InlineBox :width="80">
          <n-select v-model:value="selectYear" :options="yearOpts" />
        </InlineBox>
        <n-button :disabled="selectYear > 2099" @click="selectYear++">
          <template #icon>
            <ChevronForwardSharp />
          </template>
        </n-button>
      </n-space>
      <n-space :wrap="false">
        <n-button :disabled="selectMonth < 2" @click="selectMonth--">
          <template #icon>
            <ChevronBackSharp />
          </template>
        </n-button>
        <InlineBox :width="80">
          <n-select v-model:value="selectMonth" :options="monthOpts" />
        </InlineBox>
        <n-button :disabled="selectMonth > 11" @click="selectMonth++">
          <template #icon>
            <ChevronForwardSharp />
          </template>
        </n-button>
      </n-space>
      <n-space align="center">
        <n-button @click="backToday"> 回到今天 </n-button>
        <n-switch v-model:value="isSundayStart" size="large">
          <template #checked> 周日开始 </template>
          <template #unchecked> 周一开始 </template>
        </n-switch>
        <router-link to="/news">新闻头条</router-link>
      </n-space>
    </n-space>
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
          @click="calendarOnDaySelected(item)"
        >
          <div
            :class="{
              'wow-calendar-day--itembody': true,
              'is-weekend-day': item.isWeekend,
              'not-cur-month-day': !item.isCurPanelMonth,
              'is-on-selected':
                item.cYear === onTapYear &&
                item.cMonth === onTapMonth &&
                item.cDay === onTapDay,
              'is-today': item.isToday,
              'is-holiday': item.isHoliday,
              'is-holiday-fix': item.isHolidayFix,
            }"
          >
            <n-space class="circle-signs" :wrap="false">
              <template
                v-for="(value, key) in CalendarDayCircleSigns"
                :key="key"
              >
                <n-popover v-if="value.if(item)" trigger="hover">
                  <template #trigger>
                    <div
                      :class="['circle-signs-item', key]"
                      :style="{ backgroundColor: value.color.main }"
                    ></div>
                  </template>
                  <span>{{ value.title }}</span>
                </n-popover>
              </template>
            </n-space>
            <div class="solar-day-text">{{ item.cDay }}</div>
            <n-space v-if="item.fests.length">
              <span class="festival-text">
                {{ item.fests[0] }}
              </span>
            </n-space>
            <div v-else class="lunar-day-text">
              {{ item.IDayCn }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-selector-bar {
  margin: 12px auto;
}
.wow-calendar {
  border-style: solid;
  border-color: #e0e0e6;
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
  grid-auto-columns: minmax(100px, auto);
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
  border-color: #e0e0e6;
  border-width: 0 1px 1px 0;
}

.wow-calendar-day--item {
  cursor: pointer;
}

.wow-calendar-day--itembody {
  height: 100%;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  transition: all 0.2s ease;
}

.is-weekend-day {
  background-color: #fffcfc;
}
.circle-signs {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 0 8px;
}

.circle-signs-item {
  display: inline-flex;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  /* color: #00e152; */
}

.solar-day-text {
  font-size: 1.5rem;
  color: #333;
}

.lunar-day-text {
  font-size: 0.9rem;
  color: rgb(156, 156, 156);
}

.festival-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(204, 53, 53);
}

.not-cur-month-day div {
  opacity: 0.2;
}
.calendar-selector {
  margin: 8px auto;
}

.is-today {
  background-color: v-bind("colors.todaySecondary");
}

.is-holiday {
  background-color: v-bind("colors.holidaySecondary");
}
.is-holiday-fix {
  background-color: v-bind("colors.holidayFixSecondary");
}
.is-on-selected {
  background-color: #eaf2fd;
}
</style>
