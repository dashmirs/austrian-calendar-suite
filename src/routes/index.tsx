import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { CalendarGrid } from "@/components/CalendarGrid";
import { DayDetails } from "@/components/DayDetails";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AdBanner } from "@/components/AdBanner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { DATE_LOCALE } from "@/lib/i18n";

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
    month: "long", year: "numeric",
  }).format(cursor);

  const prev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-soft">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h1 className="font-bold text-base">{t("appTitle")}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-3 py-4 space-y-4 pb-24">
        <div className="flex items-center justify-between bg-card rounded-2xl shadow-soft p-2">
          <Button variant="ghost" size="icon" onClick={prev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <button
            onClick={goToday}
            className="font-semibold capitalize text-base hover:text-primary transition-colors"
          >
            {monthLabel}
          </button>
          <Button variant="ghost" size="icon" onClick={next}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <CalendarGrid
          year={cursor.getFullYear()}
          month={cursor.getMonth()}
          selected={selected}
          onSelect={setSelected}
        />

        <DayDetails date={selected} />
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <AdBanner />
      </div>
    </div>
  );
}
