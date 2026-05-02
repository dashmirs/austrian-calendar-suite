import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { CalendarGrid } from "@/components/CalendarGrid";
import { DayDetails } from "@/components/DayDetails";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdBanner } from "@/components/AdBanner";
import { MonthHolidays } from "@/components/MonthHolidays";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DATE_LOCALE } from "@/lib/i18n";
import { AppointmentDialog } from "@/components/AppointmentDialog";

export const Route = createFileRoute("/")({
  component: () => (
    <AppProvider>
      <Home />
    </AppProvider>
  ),
});

function Home() {
  const { t, lang } = useApp();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());
  const [addOpen, setAddOpen] = useState(false);

  const selectedKey = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;

  const monthLabel = new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    month: "long",
  }).format(cursor);
  const yearLabel = cursor.getFullYear();

  const prev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
  };

  const onSelectFromList = (d: Date) => {
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelected(d);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Premium header with serif wordmark */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Austrian flag — premium circular badge */}
            <div
              className="relative w-10 h-10 rounded-full shadow-elegant ring-1 ring-border/60 overflow-hidden"
              aria-label="Österreich"
              title="Österreich"
            >
              <div className="absolute inset-0 flex flex-col">
                <div className="h-1/3" style={{ background: "oklch(0.55 0.22 27)" }} />
                <div className="h-1/3 bg-white" />
                <div className="h-1/3" style={{ background: "oklch(0.55 0.22 27)" }} />
              </div>
              {/* Glossy highlight */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-black/15 pointer-events-none" />
              <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30 pointer-events-none" />
            </div>
            <div className="leading-tight">
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                Österreich · {yearLabel}
              </p>
              <h1 className="font-serif text-lg font-semibold text-foreground -mt-0.5">
                {t("appTitle")}
              </h1>
              <p className="text-[10px] font-serif italic mt-1 tracking-wide">
                <span className="bg-gradient-to-r from-primary via-gold to-primary-glow bg-clip-text text-transparent font-semibold">
                  Erstellt von DS Interactive
                </span>
              </p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5 space-y-5 pb-28">
        {/* Month switcher — elevated */}
        <div className="relative flex items-center justify-between rounded-2xl bg-card/80 backdrop-blur border border-border/60 px-2 py-2 shadow-soft">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent active:scale-95 transition-all text-foreground/70 hover:text-foreground"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToday}
            className="flex flex-col items-center group"
          >
            <span className="text-[9px] tracking-[0.25em] uppercase text-primary/70 font-semibold">
              {t("monthly")}
            </span>
            <span className="font-serif text-2xl font-semibold capitalize text-foreground group-hover:text-primary transition-colors leading-tight">
              {monthLabel}
            </span>
            <span className="text-[10px] tabular-nums text-muted-foreground tracking-wider">
              {yearLabel}
            </span>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-accent active:scale-95 transition-all text-foreground/70 hover:text-foreground"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <CalendarGrid
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          selected={selected}
          onSelect={setSelected}
        />

        <DayDetails date={selected} />

        <MonthHolidays
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          onSelectDate={onSelectFromList}
        />
      </main>

      {/* Floating premium FAB — sits above the ad banner */}
      <button
        onClick={() => setAddOpen(true)}
        aria-label={t("newAppointment")}
        className="fixed right-5 bottom-24 z-30 group"
      >
        <span className="absolute inset-0 rounded-full bg-primary/30 blur-xl scale-110 group-hover:scale-125 transition-transform" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold/40 via-primary/40 to-primary-glow/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground shadow-premium ring-1 ring-white/20 group-hover:scale-105 group-active:scale-95 transition-transform">
          <span className="absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/20 blur-[2px]" />
          <Plus className="w-7 h-7 relative" strokeWidth={2.75} />
        </span>
      </button>

      <AppointmentDialog open={addOpen} onOpenChange={setAddOpen} defaultDate={selectedKey} />

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <AdBanner />
      </div>
    </div>
  );
}
