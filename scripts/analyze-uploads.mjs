import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UPLOADS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/uploads");
const byExt = {};
const largest = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else {
      const size = fs.statSync(full).size;
      const ext = path.extname(entry.name).toLowerCase() || "(none)";
      byExt[ext] = (byExt[ext] || 0) + size;
      largest.push({ path: full, size });
    }
  }
}

walk(UPLOADS);
const total = Object.values(byExt).reduce((a, b) => a + b, 0);
console.log(`Total: ${(total / 1024 / 1024).toFixed(0)} MB`);
console.log("By extension:");
for (const [ext, size] of Object.entries(byExt).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${ext}: ${(size / 1024 / 1024).toFixed(0)} MB`);
}
largest.sort((a, b) => b.size - a.size);
console.log("\nTop 15 largest:");
for (const f of largest.slice(0, 15)) {
  console.log(`  ${(f.size / 1024 / 1024).toFixed(1)} MB  ${path.relative(UPLOADS, f.path)}`);
}
