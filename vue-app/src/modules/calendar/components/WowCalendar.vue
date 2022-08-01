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
import { NButton, NSpace, NSelect, NGrid, NGridItem, NPopover } from "naive-ui";
import { compact, range } from "lodash";
import InlineBox from "@/components/global/InlineBox.vue";
import { ChevronBackSharp, ChevronForwardSharp } from "@vicons/ionicons5";
import type { CalendarDay } from "../models/calendar-day.js";
import { circleSigns } from "../models/circle-signs";
import { isHoliday, isHolidayFix } from "../models/holiday.js";

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

const onSelectYear = ref(paramsYear.value);
const onSelectMonth = ref(paramsMonth.value);
const onSelectDay = ref(paramsDay.value);

const selectDate = computed(
  () => new Date(selectYear.value, selectMonth.value - 1, selectDay.value)
);
console.log("selectDate :>> ", selectDate.value);

const dateDetailsList = reactive<Array<CalendarDay>>([]);

watchEffect(() => {
  const monthStartDate = startOfMonth(selectDate.value);
  const monthEndDate = endOfMonth(selectDate.value);

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
    ...[...prefixDatesList, ...monthDatesList, ...suffixDatesList].map((m) => {
      const calcDay = CalendarUtil.solar2lunar(
        m.getFullYear(),
        m.getMonth() + 1,
        m.getDate()
      );
      return {
        oDate: m,
        oDateLabel: format(m, "yyyy-MM-dd"),
        ...calcDay,
        isWeekend: calcDay.nWeek < 1 || calcDay.nWeek > 5,
        isCurrentMonth: calcDay.cMonth === selectMonth.value,
        fests: compact([calcDay.Term, calcDay.lunarFestival, calcDay.festival]),
        isHoliday: isHoliday(calcDay.cYear, calcDay.cMonth, calcDay.cDay),
        isHolidayFix: isHolidayFix(calcDay.cYear, calcDay.cMonth, calcDay.cDay),
      };
    })
  );
});
console.log("dateDetailsList :>> ", dateDetailsList);

// 选中日历
function calendarOnDaySelected(calendarDay: CalendarDay) {
  emit("onDaySelected", calendarDay);
  onSelectYear.value = calendarDay.cYear;
  onSelectMonth.value = calendarDay.cMonth;
  onSelectDay.value = calendarDay.cDay;
}

// 回到今天
function backToday() {
  selectYear.value = todayYear;
  selectMonth.value = todayMonth;
  selectDay.value = todayDay;

  calendarOnDaySelected(
    CalendarUtil.solar2lunar(todayYear, todayMonth, todayDay)
  );
}
</script>

<template>
  <!-- <h1>{{ year }}年{{ month }}月{{ day }}日</h1> -->
  <n-grid :x-gap="14" :cols="4" class="calendar-selector">
    <n-grid-item>
      <n-space :wrap="false">
        <n-button :disabled="selectYear < 1902" @click="selectYear--">
          <template #icon>
            <ChevronBackSharp />
          </template>
        </n-button>
        <InlineBox :width="100">
          <n-select v-model:value="selectYear" :options="yearOpts" />
        </InlineBox>
        <n-button :disabled="selectYear > 2099" @click="selectYear++">
          <template #icon>
            <ChevronForwardSharp />
          </template>
        </n-button>
      </n-space>
    </n-grid-item>
    <n-grid-item>
      <n-space :wrap="false">
        <n-button :disabled="selectMonth < 2" @click="selectMonth--">
          <template #icon>
            <ChevronBackSharp />
          </template>
        </n-button>
        <InlineBox :width="100">
          <n-select v-model:value="selectMonth" :options="monthOpts" />
        </InlineBox>
        <n-button :disabled="selectMonth > 11" @click="selectMonth++">
          <template #icon>
            <ChevronForwardSharp />
          </template>
        </n-button>
      </n-space>
    </n-grid-item>
    <n-grid-item>
      <n-button @click="backToday"> 回到今天 </n-button>
    </n-grid-item>
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
        @click="calendarOnDaySelected(item)"
      >
        <div
          :class="{
            'wow-calendar-day--itembody': true,
            'is-weekend-day': item.isWeekend,
            'not-cur-month-day': !item.isCurrentMonth,
            'is-on-selected':
              item.cYear === onSelectYear &&
              item.cMonth === onSelectMonth &&
              item.cDay === onSelectDay,
          }"
        >
          <n-space class="circle-signs" :wrap="false">
            <template v-for="(value, key) in circleSigns" :key="key">
              <n-popover v-if="value.if(item)" trigger="hover">
                <template #trigger>
                  <div
                    :class="['circle-signs-item', key]"
                    :style="{ backgroundColor: value.color }"
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

.is-on-selected {
  background-color: #eaf2fd;
  /* border-color: #96e1ff; */
}
</style>
