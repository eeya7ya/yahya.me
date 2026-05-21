// Copies pdfjs-dist's web worker into /public so the browser can fetch it
// at /pdfjs/pdf.worker.min.mjs. Runs on `postinstall` and `prebuild` so the
// version is always in sync with the installed pdfjs-dist.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const src = resolve(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const dstDir = resolve(root, "public/pdfjs");
const dst = resolve(dstDir, "pdf.worker.min.mjs");

if (!existsSync(src)) {
  // pdfjs-dist not installed yet (e.g. fresh clone before npm install). Skip silently.
  process.exit(0);
}

mkdirSync(dstDir, { recursive: true });
copyFileSync(src, dst);
console.log(`copied ${src} -> ${dst}`);
