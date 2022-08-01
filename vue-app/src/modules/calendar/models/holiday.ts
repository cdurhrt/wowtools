import holidaysJson from "./holidays.json";
export interface HolidaysJson {
  [prop: string]: {
    name: string;
    holiday: string[];
    holidayFix: string[];
  }[];
}

function isHolidayOrFix(type: "holiday" | "holidayFix") {
  return (year: number, month: number, day: number): boolean => {
    const datas: HolidaysJson = holidaysJson;
    let result = false;
    for (const item of datas[`${year}`] || []) {
      if ((item[type] as string[]).includes(`${month}-${day}`)) {
        result = true;
        break;
      }
    }
    return result;
  };
}

export function isHoliday(year: number, month: number, day: number): boolean {
  return isHolidayOrFix("holiday")(year, month, day);
}

export function isHolidayFix(
  year: number,
  month: number,
  day: number
): boolean {
  return isHolidayOrFix("holidayFix")(year, month, day);
}
