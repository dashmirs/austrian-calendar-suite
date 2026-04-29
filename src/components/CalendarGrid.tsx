import { useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { getHolidayMap } from "@/lib/holidays";
import { getNamenForDate } from "@/lib/namenstage";
import { cn } from "@/lib/utils";

interface Props {
  year: number;
  month: number; // 0-11
  selected: Date;
  onSelect: (d: Date) => void;
}

export function CalendarGrid({ year, month, selected, onSelect }: Props) {
  const { t, appointments } = useApp();
  const holidayMap = useMemo(() => getHolidayMap(year), [year]);
  const today = new Date();

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startWeekday = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: ({ date: Date } | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push({ date: new Date(year, month, d) });
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [year, month]);

  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const fmt = (d: Date) => {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  };
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="bg-card/90 backdrop-blur rounded-3xl border border-border/60 shadow-elegant p-4">
      <div className="grid grid-cols-7 gap-1 mb-2 pb-2 border-b border-border/40">
        {weekDays.map((w, i) => (
          <div
            key={w}
            className={cn(
              "text-center text-[10px] font-bold tracking-[0.15em] uppercase py-1.5",
              i >= 5 ? "text-holiday/80" : "text-muted-foreground/70",
            )}
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="aspect-square" />;
          const dateKey = fmt(c.date);
          const holidays = holidayMap.get(dateKey) ?? [];
          const workFreeHoliday = holidays.find((h) => h.isWorkFree);
          const observance = !workFreeHoliday && holidays[0];
          const isWeekend = c.date.getDay() === 0; // Sunday = work free
          const isToday = isSameDay(c.date, today);
          const isSelected = isSameDay(c.date, selected);
          const hasApt = appointments.some((a) => a.date === dateKey);
          const names = getNamenForDate(c.date);

          const redDay = !!workFreeHoliday || isWeekend;

          return (
            <button
              key={i}
              onClick={() => onSelect(c.date)}
              className={cn(
                "aspect-square rounded-lg text-sm flex flex-col items-center justify-center relative transition-all",
                "hover:bg-accent active:scale-95",
                isSelected && "ring-2 ring-primary",
                isToday && !isSelected && "bg-today-bg text-today font-bold",
                workFreeHoliday && "bg-holiday-bg text-holiday font-semibold",
                !workFreeHoliday && isWeekend && c.date.getDay() === 0 && "text-holiday",
                !workFreeHoliday && c.date.getDay() === 6 && "text-foreground/80",
                observance && !redDay && "underline decoration-primary/40 decoration-2 underline-offset-2",
              )}
              title={[...holidays.map((h) => t(h.nameKey)), ...names].join(" · ")}
            >
              <span className="leading-none">{c.date.getDate()}</span>
              {names.length > 0 && (
                <span className="text-[8px] leading-none mt-0.5 text-muted-foreground truncate w-full px-0.5">
                  {names[0]}
                </span>
              )}
              {hasApt && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
