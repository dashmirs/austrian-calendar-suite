import { useMemo, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { getHolidayMap } from "@/lib/holidays";
import { getNamenForDate } from "@/lib/namenstage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Bell, Sparkles, Flag } from "lucide-react";
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
  const dayAppointments = appointments.filter((a) => a.date === dateKey);

  const fmtDate = new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(date);

  return (
    <div className="bg-card rounded-2xl shadow-soft p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold capitalize">{fmtDate}</h2>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="w-4 h-4" /> {t("newAppointment")}
        </Button>
      </div>

      {names.length > 0 && (
        <div className="flex items-start gap-2 text-sm">
          <Sparkles className="w-4 h-4 mt-0.5 text-primary shrink-0" />
          <div>
            <span className="font-medium">{t("namenstag")}: </span>
            <span className="text-muted-foreground">{names.join(", ")}</span>
          </div>
        </div>
      )}

      {holidays.length > 0 && (
        <div className="space-y-1">
          {holidays.map((h, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm rounded-md px-2 py-1.5 ${
                h.isWorkFree ? "bg-holiday-bg text-holiday font-medium" : "bg-muted text-foreground"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t(h.nameKey)}</span>
              <span className="ml-auto text-[10px] uppercase tracking-wide opacity-70">
                {h.isWorkFree ? t("workFree") : t("observance")}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
          {t("appointments")}
        </h3>
        {dayAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">{t("noAppointments")}</p>
        ) : (
          <ul className="space-y-2">
            {dayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 bg-secondary rounded-lg p-3"
                >
                  <div className="text-sm font-bold text-primary tabular-nums">{a.time}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{a.title}</div>
                    {a.description && (
                      <div className="text-xs text-muted-foreground truncate">{a.description}</div>
                    )}
                    {a.reminderMinutes > 0 && (
                      <div className="text-[10px] text-primary mt-0.5 flex items-center gap-1">
                        <Bell className="w-3 h-3" /> {a.reminderMinutes} {t("reminderMinutes")}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteAppointment(a.id)}
                    className="text-muted-foreground hover:text-destructive p-1"
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
    </div>
  );
}
