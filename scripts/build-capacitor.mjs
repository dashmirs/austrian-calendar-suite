// Fallback: if SPA prerender did not emit dist/client/index.html, synthesize one.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = "dist/client";
const indexPath = join(clientDir, "index.html");

if (existsSync(indexPath)) {
  console.log(`[build-capacitor] ${indexPath} already exists (from SPA prerender). Skipping.`);
  process.exit(0);
}

const assetsDir = join(clientDir, "_build/assets");
const fallbackAssets = join(clientDir, "assets");
const dir = existsSync(assetsDir) ? assetsDir : fallbackAssets;
const urlBase = existsSync(assetsDir) ? "/_build/assets" : "/assets";

if (!existsSync(dir)) {
  console.error(`[build-capacitor] ${dir} not found. Run \`vite build\` first.`);
  process.exit(1);
}

const files = readdirSync(dir);
const cssFile = files.find((f) => f.endsWith(".css"));
const jsEntry =
  files.find((f) => /^main-.*\.js$/.test(f)) ||
  files.find((f) => /^index-.*\.js$/.test(f));

if (!jsEntry) {
  console.error(`[build-capacitor] Could not find JS entry in ${dir}`);
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Österreichischer Kalender</title>
    ${cssFile ? `<link rel="stylesheet" href="${urlBase}/${cssFile}" />` : ""}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${urlBase}/${jsEntry}"></script>
  </body>
</html>
`;

writeFileSync(indexPath, html);
console.log(`[build-capacitor] Wrote ${indexPath} (entry: ${jsEntry}${cssFile ? ", css: " + cssFile : ""})`);
