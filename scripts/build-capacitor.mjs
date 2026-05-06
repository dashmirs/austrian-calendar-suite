// Generates dist/client/index.html for Capacitor (Android/iOS) after `vite build`.
// The Cloudflare Worker build does not emit a static index.html, so we synthesize one
// that loads the client entry + CSS produced by Vite.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = "dist/client";
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error(`[build-capacitor] ${assetsDir} not found. Run \`vite build\` first.`);
  process.exit(1);
}

const files = readdirSync(assetsDir);
const cssFile = files.find((f) => f.endsWith(".css"));
// Client entry is "main-*.js" emitted by TanStack Start
const jsEntry =
  files.find((f) => /^main-.*\.js$/.test(f)) ||
  files.find((f) => /^index-.*\.js$/.test(f));

if (!jsEntry) {
  console.error("[build-capacitor] Could not find JS entry in dist/client/assets");
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Österreichischer Kalender</title>
    ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${jsEntry}"></script>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`[build-capacitor] Wrote ${clientDir}/index.html (entry: ${jsEntry}${cssFile ? ", css: " + cssFile : ""})`);
