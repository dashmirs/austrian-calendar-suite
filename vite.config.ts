import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// SPA mode: prerender a static shell at /index.html so the app can be
// packaged into Capacitor (Android) and run fully offline.
// Disable Cloudflare plugin so the prerender server entry is the
// standard Node `server.js` that TanStack expects.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },
});
