import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, TRANSLATIONS } from "@/lib/i18n";

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reminderMinutes: number; // 0 = none
  notificationId?: number;
}

interface AppCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  appointments: Appointment[];
  addAppointment: (a: Omit<Appointment, "id">) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
}

const Ctx = createContext<AppCtx | null>(null);

const STORAGE_KEY = "at-cal-appointments";
const LANG_KEY = "at-cal-lang";

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedLang = localStorage.getItem(LANG_KEY) as Lang | null;
    if (storedLang && TRANSLATIONS[storedLang]) setLangState(storedLang);
    const storedApp = localStorage.getItem(STORAGE_KEY);
    if (storedApp) {
      try { setAppointments(JSON.parse(storedApp)); } catch {}
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, l);
  };

  const t = (key: string) => TRANSLATIONS[lang][key] ?? TRANSLATIONS.de[key] ?? key;

  const persist = (next: Appointment[]) => {
    setAppointments(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const scheduleNotification = async (apt: Appointment): Promise<number | undefined> => {
    if (apt.reminderMinutes <= 0) return undefined;
    if (typeof window === "undefined") return undefined;
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const [hh, mm] = apt.time.split(":").map(Number);
      const [yy, mo, dd] = apt.date.split("-").map(Number);
      const fire = new Date(yy, mo - 1, dd, hh, mm);
      fire.setMinutes(fire.getMinutes() - apt.reminderMinutes);
      if (fire.getTime() <= Date.now()) return undefined;
      const id = Math.floor(Math.random() * 2_000_000_000);
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [{
          id,
          title: apt.title,
          body: apt.description || `${apt.date} ${apt.time}`,
          schedule: { at: fire, allowWhileIdle: true },
          smallIcon: "ic_stat_icon_config_sample",
        }],
      });
      return id;
    } catch (e) {
      console.warn("Notification scheduling skipped:", e);
      return undefined;
    }
  };

  const addAppointment: AppCtx["addAppointment"] = async (a) => {
    const apt: Appointment = { ...a, id: crypto.randomUUID() };
    apt.notificationId = await scheduleNotification(apt);
    persist([...appointments, apt]);
  };

  const deleteAppointment: AppCtx["deleteAppointment"] = async (id) => {
    const apt = appointments.find((x) => x.id === id);
    if (apt?.notificationId) {
      try {
        const { LocalNotifications } = await import("@capacitor/local-notifications");
        await LocalNotifications.cancel({ notifications: [{ id: apt.notificationId }] });
      } catch {}
    }
    persist(appointments.filter((x) => x.id !== id));
  };

  return (
    <Ctx.Provider value={{ lang, setLang, t, appointments, addAppointment, deleteAppointment }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
