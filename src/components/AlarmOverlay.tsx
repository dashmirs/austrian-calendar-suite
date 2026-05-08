import { useEffect, useRef, useState } from "react";
import { useApp, type Appointment } from "@/contexts/AppContext";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Web Audio API alarm tone generator (no asset file needed, works offline)
function startAlarmSound(): () => void {
  if (typeof window === "undefined") return () => {};
  const AC = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AC) return () => {};
  const ctx = new AC();
  let stopped = false;
  const playBeep = (when: number, freq: number) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.6, when + 0.02);
    g.gain.linearRampToValueAtTime(0, when + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start(when);
    o.stop(when + 0.4);
  };
  const loop = () => {
    if (stopped) return;
    const t = ctx.currentTime;
    playBeep(t, 880);
    playBeep(t + 0.45, 660);
    playBeep(t + 0.9, 880);
    setTimeout(loop, 1500);
  };
  loop();
  // Vibrate if available
  try { (navigator as any).vibrate?.([400, 200, 400, 200, 400]); } catch {}
  const vibInt = setInterval(() => {
    try { (navigator as any).vibrate?.([400, 200, 400]); } catch {}
  }, 1500);
  return () => {
    stopped = true;
    clearInterval(vibInt);
    try { ctx.close(); } catch {}
    try { (navigator as any).vibrate?.(0); } catch {}
  };
}

const FIRED_KEY = "at-cal-fired-alarms";

function getFired(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(FIRED_KEY) || "[]")); }
  catch { return new Set(); }
}
function markFired(id: string) {
  const s = getFired(); s.add(id);
  localStorage.setItem(FIRED_KEY, JSON.stringify([...s]));
}

export function AlarmOverlay() {
  const { appointments, t } = useApp();
  const [active, setActive] = useState<Appointment | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const tick = () => {
      if (active) return;
      const now = Date.now();
      const fired = getFired();
      for (const a of appointments) {
        if (fired.has(a.id)) continue;
        const [hh, mm] = a.time.split(":").map(Number);
        const [yy, mo, dd] = a.date.split("-").map(Number);
        const fire = new Date(yy, mo - 1, dd, hh, mm).getTime() - a.reminderMinutes * 60_000;
        // Trigger if we are within window: fire time passed but no more than 2 min ago
        if (now >= fire && now - fire < 2 * 60_000) {
          markFired(a.id);
          setActive(a);
          stopRef.current = startAlarmSound();
          break;
        }
      }
    };
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [appointments, active]);

  const dismiss = () => {
    stopRef.current?.();
    stopRef.current = null;
    setActive(null);
  };

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-card border-2 border-primary shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-gold to-primary animate-pulse" />
        <div className="p-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mb-4 animate-pulse">
            <Bell className="w-10 h-10 text-primary" />
          </div>
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-primary mb-2">
            {t("reminder")}
          </p>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2 break-words">
            {active.title}
          </h2>
          {active.description && (
            <p className="text-sm text-muted-foreground mb-3 break-words">{active.description}</p>
          )}
          <p className="text-sm font-semibold text-primary tabular-nums mb-5">
            {active.date} · {active.time}
          </p>
          <Button onClick={dismiss} size="lg" className="w-full gap-2">
            <X className="w-4 h-4" /> OK
          </Button>
        </div>
      </div>
    </div>
  );
}
