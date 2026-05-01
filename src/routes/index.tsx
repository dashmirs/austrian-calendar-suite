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
            <div className="relative w-9 h-9 rounded-xl bg-gradient-primary shadow-soft flex items-center justify-center overflow-hidden">
              <span className="font-serif text-primary-foreground text-lg font-bold leading-none">
                Ö
              </span>
              <span className="absolute inset-x-0 top-0 h-1/2 bg-white/15" />
            </div>
            <div className="leading-tight">
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                Austria · {yearLabel}
              </p>
              <h1 className="font-serif text-lg font-semibold text-foreground -mt-0.5">
                {t("appTitle")}
              </h1>
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

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <AdBanner />
      </div>
    </div>
  );
}
