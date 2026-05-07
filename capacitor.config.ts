import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "at.lovable.kalender",
  appName: "Österreichischer Kalender",
  webDir: "dist/client",
  // Ngarkojmë app-in direkt nga versioni i botuar (SSR funksionon atje).
  server: {
    url: "https://austria-fest-kalendar.lovable.app",
    cleartext: true,
    androidScheme: "https",
    allowNavigation: ["*.lovable.app", "*.lovable.dev"],
  },
  android: {
    allowMixedContent: true,
    webContentsDebuggingEnabled: true,
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
