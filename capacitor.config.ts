import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "at.lovable.kalender",
  appName: "Österreichischer Kalender",
  webDir: "dist",
  server: {
    // For live-reload from the Lovable preview during development.
    // Remove `url` before producing the final release APK so the bundled web assets are used.
    url: "https://35208567-a06c-46d9-afd6-6845cc48b9c7.lovableproject.com?forceHideBadge=true",
    cleartext: true,
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
