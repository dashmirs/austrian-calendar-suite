import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "at.lovable.kalender",
  appName: "Österreichischer Kalender",
  webDir: "dist/client",
  // Ngarko app-in direkt nga versioni i botuar (SSR funksionon atje).
  // Kjo e zgjidh problemin "ekran bardh" në Android, sepse build-i lokal
  // përfshin SSR/hydration që kërkon server, dhe një shell statik bosh
  // dështon në hidratim.
  server: {
    url: "https://austria-fest-kalendar.lovable.app",
    cleartext: false,
    androidScheme: "https",
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#C8102E",
      sound: "beep.wav",
    },
  },
};

export default config;
