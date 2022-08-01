export interface CalendarDay {
  oDate: Date; // 日期
  oDateLabel: string; // 日期标签
  date: string; // 公历日期
  lunarDate: string; // 农历日期
  fests: string[]; // 节日、节气
  festival: string; // 公历节日
  lunarFestival: string; // 农历节日
  isTerm: boolean; // 是否节气
  Term: string; // 节气名
  Animal: string; // 生肖
  isLeap: boolean; // 是否闰月
  lYear: number; // 农历年
  lMonth: number; // 农历月
  lDay: number; // 农历日
  IMonthCn: string; // 大写农历月
  IDayCn: string; // 大写农历日
  gzYear: string; // 干支年
  gzMonth: string; // 干支月
  gzDay: string; // 干支日
  cYear: number; // 公历年
  cMonth: number; // 公历月
  cDay: number; // 公历日
  nWeek: number; // 周n
  ncWeek: string; // 周几
  astro: string; // 星座名
  isToday: boolean; // 是否今日
  isWeekend: boolean; // 是否周末
  isCurrentMonth: boolean; // 是否是面板当月
  isHoliday: boolean; // 是否是假期
  isHolidayFix: boolean; // 是否是调休
}

export const CalendarDayDict = {
  oDate: "日期",
  oDateLabel: "日期标签",
  date: "公历日期",
  lunarDate: "农历日期",
  fests: "节日、节气",
  festival: "公历节日",
  lunarFestival: "农历节日",
  isTerm: "是否节气",
  Term: "节气名",
  Animal: "生肖",
  isLeap: "是否闰月",
  lYear: "农历年",
  lMonth: "农历月",
  lDay: "农历日",
  IMonthCn: "大写农历月",
  IDayCn: "大写农历日",
  gzYear: "干支年",
  gzMonth: "干支月",
  gzDay: "干支日",
  cYear: "公历年",
  cMonth: "公历月",
  cDay: "公历日",
  nWeek: "周n",
  ncWeek: "周几",
  astro: "星座名",
  isToday: "是否今日",
  isWeekend: "是否周末",
  isCurrentMonth: "是否是面板当月",
  isHoliday: "是否是假期",
  isHolidayFix: "是否是调休",
};
