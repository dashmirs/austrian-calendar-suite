// Austrian holidays calculator with regional + Namenstage support
// Easter algorithm (Meeus/Jones/Butcher)
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export type HolidayType = "public" | "regional" | "observance";

export interface Holiday {
  date: string; // YYYY-MM-DD
  nameKey: string; // i18n key
  type: HolidayType;
  region?: string; // e.g., "Wien", "Tirol"
  isWorkFree: boolean; // true => red day, no work
}

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function getAustrianHolidays(year: number): Holiday[] {
  const easter = easterSunday(year);
  const list: Holiday[] = [
    // Federal public holidays (work-free, RED)
    { date: fmt(new Date(year, 0, 1)), nameKey: "neujahr", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 0, 6)), nameKey: "heiligeDreiKoenige", type: "public", isWorkFree: true },
    { date: fmt(addDays(easter, 1)), nameKey: "ostermontag", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 4, 1)), nameKey: "staatsfeiertag", type: "public", isWorkFree: true },
    { date: fmt(addDays(easter, 39)), nameKey: "christiHimmelfahrt", type: "public", isWorkFree: true },
    { date: fmt(addDays(easter, 50)), nameKey: "pfingstmontag", type: "public", isWorkFree: true },
    { date: fmt(addDays(easter, 60)), nameKey: "fronleichnam", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 7, 15)), nameKey: "mariaeHimmelfahrt", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 9, 26)), nameKey: "nationalfeiertag", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 10, 1)), nameKey: "allerheiligen", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 11, 8)), nameKey: "mariaeEmpfaengnis", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 11, 25)), nameKey: "christtag", type: "public", isWorkFree: true },
    { date: fmt(new Date(year, 11, 26)), nameKey: "stefanitag", type: "public", isWorkFree: true },

    // Observances (NOT work-free, shown but not red)
    { date: fmt(addDays(easter, -7)), nameKey: "palmsonntag", type: "observance", isWorkFree: false },
    { date: fmt(addDays(easter, -3)), nameKey: "gruendonnerstag", type: "observance", isWorkFree: false },
    { date: fmt(addDays(easter, -2)), nameKey: "karfreitag", type: "observance", isWorkFree: false },
    { date: fmt(easter), nameKey: "ostersonntag", type: "observance", isWorkFree: false },
    { date: fmt(addDays(easter, 49)), nameKey: "pfingstsonntag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 1, 14)), nameKey: "valentinstag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 4, 4)), nameKey: "florianitag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 9, 31)), nameKey: "reformationstag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 10, 11)), nameKey: "martinstag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 10, 15)), nameKey: "leopolditag", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 11, 6)), nameKey: "nikolaus", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 11, 24)), nameKey: "heiligabend", type: "observance", isWorkFree: false },
    { date: fmt(new Date(year, 11, 31)), nameKey: "silvester", type: "observance", isWorkFree: false },
  ];
  return list;
}

export function getHolidayMap(year: number): Map<string, Holiday[]> {
  const map = new Map<string, Holiday[]>();
  for (const h of getAustrianHolidays(year)) {
    const arr = map.get(h.date) ?? [];
    arr.push(h);
    map.set(h.date, arr);
  }
  return map;
}
