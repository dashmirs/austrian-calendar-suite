import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "at.lovable.kalender",
  appName: "Österreichischer Kalender",
  webDir: "dist/client",
  // No server.url -> WebView loads bundled assets (offline-capable).
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
