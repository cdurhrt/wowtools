import { reactive } from "vue";
import type { CalendarDay } from "./calendar-day";

export const circleSigns = reactive({
  "is-today": {
    if: (item: CalendarDay) => item.isToday,
    title: "今日",
    color: "#00e152",
  },
  "is-s-fest": {
    if: (item: CalendarDay) => item.festival,
    title: "公历节日",
    color: "#1d7fef",
  },
  "is-l-fest": {
    if: (item: CalendarDay) => item.lunarFestival,
    title: "农历节日",
    color: "#f98737",
  },
  "is-term": {
    if: (item: CalendarDay) => item.isTerm,
    title: "节气",
    color: "#ffe23e",
  },
  "is-xiu": {
    if: (item: CalendarDay) => item.isHoliday,
    title: "法定假日",
    color: "#e33636",
  },
  "is-tiaoxiu": {
    if: (item: CalendarDay) => item.isHolidayFix,
    title: "调休上班",
    color: "#000862",
  },
});
