<script setup lang="ts">
import { compact, flatten, map } from "lodash";
import { NGrid, NGi, NDivider, NSpace, NTag, NIcon, NPopover } from "naive-ui";
import { reactive, shallowRef, watchEffect, type Component } from "vue";
import type { CalendarDay } from "../models/calendar-day.js";
import {
  ZodiacAquarius,
  ZodiacAries,
  ZodiacCancer,
  ZodiacCapricorn,
  ZodiacGemini,
  ZodiacLeo,
  ZodiacLibra,
  ZodiacPisces,
  ZodiacSagittarius,
  ZodiacScorpio,
  ZodiacTaurus,
  ZodiacVirgo,
} from "@vicons/tabler";

import {
  CalendarDayColors,
  CalendarDayTypeNames,
} from "../models/day-signs.js";
import { CalendarDayTypeEnum as TypeEnum } from "../models/day.type.js";

interface FestTag {
  text: string;
  type: TypeEnum;
  nTagColor: {
    color?: string;
    borderColor?: string;
    textColor?: string;
  };
}

const props = defineProps<{ data: CalendarDay }>();
console.log("props :>> ", props);

const astroIcons = shallowRef<Record<string, Component>>({
  白羊座: ZodiacAries,
  金牛座: ZodiacTaurus,
  双子座: ZodiacGemini,
  巨蟹座: ZodiacCancer,
  狮子座: ZodiacLeo,
  处女座: ZodiacVirgo,
  天秤座: ZodiacLibra,
  天蝎座: ZodiacScorpio,
  射手座: ZodiacSagittarius,
  摩羯座: ZodiacCapricorn,
  水瓶座: ZodiacAquarius,
  双鱼座: ZodiacPisces,
});

const tagFns = [
  gTagFn(TypeEnum.today, (d: CalendarDay) => [
    d.isToday ? CalendarDayTypeNames[TypeEnum.today] : "",
  ]),
  gTagFn(TypeEnum.term, (d: CalendarDay) => [d.isTerm ? d.Term : ""]),
  gTagFn(TypeEnum["lunar-festival"], (d: CalendarDay) => [d.lunarFestival]),
  gTagFn(TypeEnum.festival, (d: CalendarDay) => [d.festival]),
  gTagFn(TypeEnum.holiday, (d: CalendarDay) => [
    d.isHoliday ? CalendarDayTypeNames[TypeEnum.holiday] : "",
  ]),
  gTagFn(TypeEnum["holiday-fix"], (d: CalendarDay) => [
    d.isHolidayFix ? CalendarDayTypeNames[TypeEnum["holiday-fix"]] : "",
  ]),
];

const dayTags = reactive<FestTag[]>([]);

watchEffect(() => {
  dayTags.splice(
    0,
    dayTags.length,
    ...flatten(map(tagFns, (gfn) => gfn(props.data)))
  );

  console.log("dayTags :>> ", dayTags);
});

function gTagFn(type: TypeEnum, fn: (d: CalendarDay) => string[]) {
  return (day: CalendarDay): FestTag[] => {
    return map(
      compact(fn(day)),
      (m: string): FestTag => ({
        text: m,
        type: type,
        nTagColor: {
          color: CalendarDayColors[type].secondary,
          borderColor: CalendarDayColors[type].secondary,
          textColor: CalendarDayColors[type].main,
        },
      })
    );
  };
}
</script>

<template>
  <div class="calendar-paper">
    <n-grid x-gap="12" y-gap="24" :cols="2">
      <n-gi>
        <n-space align="center">
          <span>{{ data.cYear }}年{{ data.cMonth }}月</span>
          <span>
            <n-icon size="16" :component="astroIcons[data.astro]"> </n-icon>
            {{ data.astro }}
          </span>
        </n-space>
        <div>{{ data.ncWeek }}</div>
        <div class="cDay">{{ data.cDay }}</div>
        <n-divider />
      </n-gi>
      <n-gi>
        <div>
          {{ data.gzYear }}（{{ data.Animal }}）年 {{ data.gzMonth }}月
          {{ data.gzDay }}日
        </div>
        <div>{{ data.IMonthCn }}</div>
        <div class="IDayCn">{{ data.IDayCn }}</div>
        <n-divider />
      </n-gi>
    </n-grid>
    <n-space>
      <n-tag
        v-for="(item, index) in dayTags"
        :key="index"
        :color="item.nTagColor"
      >
        {{ item.text }}
      </n-tag>
    </n-space>
    <!-- <n-grid x-gap="12" y-gap="12" :cols="2">
      <n-gi v-for="(item, key, index) in CalendarDayDict" :key="index">
        <div>{{ item }}：{{ data[key] }}</div>
      </n-gi>
    </n-grid> -->
  </div>
</template>

<style scoped>
.calendar-paper {
  min-width: 600px;
  padding: 40px 32px;
  margin: 12px;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
    rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
}
.cDay {
  font-size: 60px;
  font-weight: 600;
  text-align: center;
}
.IDayCn {
  font-size: 60px;
  font-weight: 600;
  text-align: center;
}
</style>
