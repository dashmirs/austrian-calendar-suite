import { useMemo, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getHolidayMap } from "@/lib/holidays";
import { getNamenForDate } from "@/lib/namenstage";
import { Trash2, Bell, Sparkles, Plus, Clock, CalendarHeart } from "lucide-react";
import { AppointmentDialog } from "./AppointmentDialog";
import { DATE_LOCALE } from "@/lib/i18n";

export function DayDetails({ date }: { date: Date }) {
  const { t, lang, appointments, deleteAppointment } = useApp();
  const [open, setOpen] = useState(false);

  const dateKey = useMemo(() => {
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${m}-${day}`;
  }, [date]);

  const holidays = useMemo(
    () => getHolidayMap(date.getFullYear()).get(dateKey) ?? [],
    [date, dateKey],
  );
  const names = getNamenForDate(date);
  const dayAppointments = appointments
    .filter((a) => a.date === dateKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  const weekday = new Intl.DateTimeFormat(DATE_LOCALE[lang], { weekday: "long" }).format(date);
  const monthShort = new Intl.DateTimeFormat(DATE_LOCALE[lang], { month: "short" }).format(date);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-elegant">
      {/* gold top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="absolute -top-32 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Hero header: big date + new button */}
      <header className="relative px-5 pt-5 pb-4 flex items-center gap-4">
        <div className="relative shrink-0 w-20 h-20 rounded-2xl bg-gradient-primary text-primary-foreground flex flex-col items-center justify-center shadow-soft overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1/3 bg-white/15" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-90">
            {monthShort.replace(".", "")}
          </span>
          <span className="font-serif text-4xl font-bold leading-none tabular-nums">
            {date.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] tracking-[0.25em] uppercase font-bold text-primary/70">
            {t("appointments")}
          </p>
          <h2 className="font-serif text-xl font-semibold capitalize text-foreground leading-tight mt-0.5 truncate">
            {weekday}
          </h2>
          {names.length > 0 && (
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-gold shrink-0" />
              <span className="truncate">{names.slice(0, 2).join(" · ")}</span>
            </p>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-elegant hover:scale-105 active:scale-95 transition-transform"
          aria-label={t("newAppointment")}
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </header>

      {/* Holiday badges if any */}
      {holidays.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {holidays.map((h, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 ${
                h.isWorkFree
                  ? "bg-holiday-bg text-holiday border border-holiday/20"
                  : "bg-secondary text-secondary-foreground border border-border"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  h.isWorkFree ? "bg-holiday" : "bg-muted-foreground/60"
                }`}
              />
              {t(h.nameKey)}
            </span>
          ))}
        </div>
      )}

      {/* Divider with label */}
      <div className="px-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[9px] tracking-[0.25em] uppercase font-bold text-muted-foreground/70 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {t("appointments")}
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      {/* Appointments list */}
      <div className="px-3 pt-3 pb-4">
        {dayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-2">
              <CalendarHeart className="w-5 h-5 text-muted-foreground/60" />
            </div>
            <p className="text-sm text-muted-foreground italic">{t("noAppointments")}</p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {dayAppointments.map((a) => (
              <li
                key={a.id}
                className="group relative flex items-stretch gap-3 rounded-2xl bg-gradient-to-br from-secondary/80 to-secondary/40 hover:from-accent/80 hover:to-accent/40 border border-border/40 hover:border-primary/30 transition-all overflow-hidden"
              >
                {/* left vertical accent */}
                <div className="w-1 shrink-0 bg-gradient-to-b from-primary to-primary-glow" />

                {/* time block */}
                <div className="flex flex-col items-start justify-center py-3 min-w-[58px]">
                  <span className="font-serif text-xl font-bold text-primary tabular-nums leading-none">
                    {a.time}
                  </span>
                  {a.reminderMinutes > 0 && (
                    <span className="text-[9px] uppercase tracking-wider text-primary/60 font-semibold mt-1 flex items-center gap-0.5">
                      <Bell className="w-2.5 h-2.5" />
                      {a.reminderMinutes}′
                    </span>
                  )}
                </div>

                {/* divider */}
                <div className="w-px bg-border/60 my-3" />

                {/* content */}
                <div className="flex-1 min-w-0 py-3 pr-3">
                  <p className="font-semibold text-sm text-foreground truncate leading-tight">
                    {a.title}
                  </p>
                  {a.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {a.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteAppointment(a.id)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity self-center mr-3 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label={t("delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AppointmentDialog open={open} onOpenChange={setOpen} defaultDate={dateKey} />
    </section>
  );
}
