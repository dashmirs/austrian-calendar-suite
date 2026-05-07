import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// SPA mode with a prerendered shell at /index.html.
// This produces dist/client/index.html that Capacitor can load offline.
export default defineConfig({
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        outputPath: "/index.html",
      },
    },
  },
});
