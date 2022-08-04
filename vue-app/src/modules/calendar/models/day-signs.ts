import { CalendarDayTypeEnum as TypeEnum } from "./day.type";
import type { CalendarDay } from "./calendar-day";

export const CalendarDayColors = {
  [TypeEnum.today]: {
    main: "rgb(0, 225, 82)",
    secondary: "rgba(0, 225, 82, 0.08)",
  },
  [TypeEnum.term]: {
    main: "rgb(255, 226, 62)",
    secondary: "rgba(255, 226, 62, 0.08)",
  },
  [TypeEnum.festival]: {
    main: "rgb(29, 127, 239)",
    secondary: "rgba(29, 127, 239, 0.08)",
  },
  [TypeEnum["lunar-festival"]]: {
    main: "rgb(249, 135, 55)",
    secondary: "rgba(249, 135, 55, 0.08)",
  },
  [TypeEnum.holiday]: {
    main: "rgb(227, 54, 54)",
    secondary: "rgba(227, 54, 54, 0.08)",
  },
  [TypeEnum["holiday-fix"]]: {
    main: "rgb(0, 8, 98)",
    secondary: "rgba(0, 8, 98, 0.08)",
  },
};

export const CalendarDayTypeFields = {
  [TypeEnum.today]: "is-today",
  [TypeEnum.term]: "is-term",
  [TypeEnum.festival]: "is-festival",
  [TypeEnum["lunar-festival"]]: "is-lunar-festival",
  [TypeEnum.holiday]: "is-holiday",
  [TypeEnum["holiday-fix"]]: "is-holiday-fix",
};

export const CalendarDayTypeNames = {
  [TypeEnum.today]: "今日",
  [TypeEnum.term]: "节气",
  [TypeEnum.festival]: "公历节日",
  [TypeEnum["lunar-festival"]]: "农历节日",
  [TypeEnum.holiday]: "休",
  [TypeEnum["holiday-fix"]]: "班",
};

export const CalendarDayCircleSigns = {
  [CalendarDayTypeFields[TypeEnum.today]]: {
    if: (item: CalendarDay) => item.isToday,
    title: CalendarDayTypeNames[TypeEnum.today],
    color: CalendarDayColors[TypeEnum.today],
  },
  [CalendarDayTypeFields[TypeEnum.term]]: {
    if: (item: CalendarDay) => item.isTerm,
    title: CalendarDayTypeNames[TypeEnum.term],
    color: CalendarDayColors[TypeEnum.term],
  },
  [CalendarDayTypeFields[TypeEnum["lunar-festival"]]]: {
    if: (item: CalendarDay) => item.lunarFestival,
    title: CalendarDayTypeNames[TypeEnum["lunar-festival"]],
    color: CalendarDayColors[TypeEnum["lunar-festival"]],
  },
  [CalendarDayTypeFields[TypeEnum.festival]]: {
    if: (item: CalendarDay) => item.festival,
    title: CalendarDayTypeNames[TypeEnum.festival],
    color: CalendarDayColors[TypeEnum.festival],
  },
  [CalendarDayTypeFields[TypeEnum.holiday]]: {
    if: (item: CalendarDay) => item.isHoliday,
    title: CalendarDayTypeNames[TypeEnum.holiday],
    color: CalendarDayColors[TypeEnum.holiday],
  },
  [CalendarDayTypeFields[TypeEnum["holiday-fix"]]]: {
    if: (item: CalendarDay) => item.isHolidayFix,
    title: CalendarDayTypeNames[TypeEnum["holiday-fix"]],
    color: CalendarDayColors[TypeEnum["holiday-fix"]],
  },
};
