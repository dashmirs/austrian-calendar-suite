import { useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { getAustrianHolidays } from "@/lib/holidays";
import { getNamenForDate } from "@/lib/namenstage";
import { DATE_LOCALE } from "@/lib/i18n";
import { Sparkles } from "lucide-react";

interface Props {
  year: number;
  month: number; // 0-11
  onSelectDate: (d: Date) => void;
}

export function MonthHolidays({ year, month, onSelectDate }: Props) {
  const { t, lang } = useApp();

  const items = useMemo(() => {
    const holidays = getAustrianHolidays(year)
      .filter((h) => {
        const d = new Date(h.date + "T00:00:00");
        return d.getMonth() === month;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return holidays.map((h) => {
      const d = new Date(h.date + "T00:00:00");
      const names = getNamenForDate(d);
      return { holiday: h, date: d, names };
    });
  }, [year, month]);

  const dayFmt = new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "2-digit", weekday: "short",
  });
  const monthName = new Intl.DateTimeFormat(DATE_LOCALE[lang], { month: "long" }).format(
    new Date(year, month, 1),
  );

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elegant">
      {/* decorative gradient header strip */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <header className="px-5 pt-5 pb-3 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary/70">
            {t("holidays")}
          </p>
          <h3 className="font-serif text-xl font-semibold capitalize text-foreground mt-0.5">
            {monthName}
          </h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {items.length} · {year}
        </span>
      </header>

      <ol className="px-2 pb-3">
        {items.map(({ holiday, date, names }, idx) => {
          const dayLabel = dayFmt.format(date);
          const [dayNum, weekday] = dayLabel.split(/[\s,.]+/).filter(Boolean);
          return (
            <li key={idx}>
              <button
                onClick={() => onSelectDate(date)}
                className="w-full text-left flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-accent/60 active:scale-[0.99] transition-all group"
              >
                {/* date pill */}
                <div
                  className={`shrink-0 w-12 flex flex-col items-center justify-center rounded-xl py-1.5 ${
                    holiday.isWorkFree
                      ? "bg-gradient-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <span className="text-lg font-bold leading-none tabular-nums">
                    {date.getDate()}
                  </span>
                  <span className="text-[9px] uppercase tracking-wide opacity-80 mt-0.5">
                    {weekday ?? dayLabel}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        holiday.isWorkFree ? "bg-holiday" : "bg-muted-foreground/50"
                      }`}
                    />
                    <p
                      className={`truncate text-sm ${
                        holiday.isWorkFree
                          ? "font-semibold text-holiday"
                          : "font-medium text-foreground"
                      }`}
                    >
                      {t(holiday.nameKey)}
                    </p>
                  </div>
                  {names.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 shrink-0 text-primary/60" />
                      {names.join(" · ")}
                    </p>
                  )}
                </div>

                <span className="text-[9px] uppercase tracking-widest text-muted-foreground/70 shrink-0 hidden sm:block">
                  {holiday.isWorkFree ? t("workFree") : t("observance")}
                </span>
              </button>
              {idx < items.length - 1 && (
                <div className="h-px bg-border/50 mx-5" />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
