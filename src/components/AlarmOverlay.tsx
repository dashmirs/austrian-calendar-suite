import { useEffect, useRef, useState } from "react";
import { useApp, type Appointment } from "@/contexts/AppContext";
import { Bell, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Web Audio API alarm tone generator (no asset file needed, works offline)
function startAlarmSound(): () => void {
  if (typeof window === "undefined") return () => {};
  const AC = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AC) return () => {};
  let ctx: AudioContext;
  try { ctx = new AC(); } catch { return () => {}; }
  // Some browsers start suspended until a user gesture
  try { ctx.resume?.(); } catch {}
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
const SNOOZE_KEY = "at-cal-snooze-until";

function getMap(key: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch { return {}; }
}
function setMap(key: string, m: Record<string, number>) {
  localStorage.setItem(key, JSON.stringify(m));
}
function markFired(id: string) {
  const m = getMap(FIRED_KEY); m[id] = Date.now(); setMap(FIRED_KEY, m);
}
function clearFired(id: string) {
  const m = getMap(FIRED_KEY); delete m[id]; setMap(FIRED_KEY, m);
}
function setSnooze(id: string, until: number) {
  const m = getMap(SNOOZE_KEY); m[id] = until; setMap(SNOOZE_KEY, m);
}
function getSnooze(id: string): number {
  return getMap(SNOOZE_KEY)[id] ?? 0;
}
function clearSnooze(id: string) {
  const m = getMap(SNOOZE_KEY); delete m[id]; setMap(SNOOZE_KEY, m);
}

function fireTimeOf(a: Appointment): number {
  const [hh, mm] = a.time.split(":").map(Number);
  const [yy, mo, dd] = a.date.split("-").map(Number);
  return new Date(yy, mo - 1, dd, hh, mm).getTime() - (a.reminderMinutes || 0) * 60_000;
}

async function showNativeNotification(a: Appointment) {
  if (typeof window === "undefined") return;
  // Web Notifications API fallback (works in browsers / PWA)
  try {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch {}
      }
      if (Notification.permission === "granted") {
        new Notification(`🔔 ${a.title}`, {
          body: a.description || `${a.date} · ${a.time}`,
          tag: a.id,
          requireInteraction: true,
        });
      }
    }
  } catch {}
}

export function AlarmOverlay() {
  const { appointments, t } = useApp();
  const [active, setActive] = useState<Appointment | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // Request permissions on mount (web Notifications + native)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    } catch {}
    (async () => {
      try {
        const { LocalNotifications } = await import("@capacitor/local-notifications");
        await LocalNotifications.requestPermissions();
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const tick = () => {
      if (active) return;
      const now = Date.now();
      const fired = getMap(FIRED_KEY);
      // Find earliest due appointment that hasn't been dismissed yet
      let due: Appointment | null = null;
      let dueAt = Infinity;
      for (const a of appointments) {
        const snoozeUntil = getSnooze(a.id);
        const baseFire = fireTimeOf(a);
        const effectiveFire = Math.max(baseFire, snoozeUntil);
        // If fired in the past AND no active snooze pending, skip
        if (fired[a.id] && snoozeUntil <= fired[a.id]) continue;
        // Trigger if fire time has passed and within last 24h (so reopening app catches missed ones)
        if (now >= effectiveFire && now - effectiveFire < 24 * 60 * 60_000) {
          if (effectiveFire < dueAt) {
            due = a;
            dueAt = effectiveFire;
          }
        }
      }
      if (due) {
        markFired(due.id);
        clearSnooze(due.id);
        setActive(due);
        stopRef.current = startAlarmSound();
        showNativeNotification(due);
      }
    };
    tick();
    const id = setInterval(tick, 5_000);
    const onVis = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [appointments, active]);

  const stopSound = () => {
    stopRef.current?.();
    stopRef.current = null;
  };

  const dismiss = () => {
    stopSound();
    setActive(null);
  };

  const snooze = () => {
    if (!active) return;
    stopSound();
    const until = Date.now() + 5 * 60_000;
    setSnooze(active.id, until);
    clearFired(active.id); // allow re-trigger after snooze window
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
          <div className="flex flex-col gap-2">
            <Button onClick={snooze} size="lg" variant="outline" className="w-full gap-2">
              <Clock className="w-4 h-4" /> Snooze 5 min
            </Button>
            <Button onClick={dismiss} size="lg" className="w-full gap-2">
              <X className="w-4 h-4" /> OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
