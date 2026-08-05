/**
 * Compress images in public/uploads (in-place).
 *
 *   npm run compress:uploads
 *   npm run compress:uploads:strong   # ~800 MB target (PNG→JPG, smaller dims)
 *   npm run compress:uploads -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const UPLOADS = path.resolve(ROOT, "public/uploads");
const SRC = path.resolve(ROOT, "src");

const dryRun = process.argv.includes("--dry-run");
const aggressive = process.argv.includes("--aggressive");
const strong = process.argv.includes("--strong") || aggressive;

const maxWidth = Number(
  process.env.COMPRESS_MAX_WIDTH || (strong ? 800 : aggressive ? 1024 : 1280),
);
const jpegQuality = Number(
  process.env.COMPRESS_JPEG_QUALITY || (strong ? 48 : aggressive ? 62 : 68),
);
const webpQuality = Number(
  process.env.COMPRESS_WEBP_QUALITY || (strong ? 58 : aggressive ? 65 : 72),
);
const maxGifWidth = strong ? 1280 : 1600;

const skipExt = new Set([".svg", ".mp4", ".webm", ".ico", ".pdf", ".zip"]);

/** old web path → new web path (e.g. /uploads/a.png → /uploads/a.jpg) */
const urlRewrites = new Map();

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function formatMb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function toWebPath(filePath) {
  const rel = path.relative(path.join(ROOT, "public"), filePath).replace(/\\/g, "/");
  return `/${rel}`;
}

function recordRewrite(oldFilePath, newFilePath) {
  const oldUrl = toWebPath(oldFilePath);
  const newUrl = toWebPath(newFilePath);
  if (oldUrl !== newUrl) urlRewrites.set(oldUrl, newUrl);
}

function shouldKeepPng(filePath) {
  const base = path.basename(filePath).toLowerCase();
  return (
    base.includes("logo") ||
    base.includes("removebg") ||
    base.includes("icon") ||
    base.includes("-preview") ||
    base.includes("whatsapp_image")
  );
}

async function compressFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (skipExt.has(ext)) return { before: 0, after: 0, skipped: true };

  const before = fs.statSync(filePath).size;
  if (before < 8 * 1024) return { before, after: before, skipped: true };

  const input = fs.readFileSync(filePath);
  let output = input;
  let targetPath = filePath;

  try {
    const img = sharp(input, { animated: ext === ".gif" }).rotate();
    const meta = await img.metadata();
    const width = meta.width ?? maxWidth;

    if (ext === ".gif") {
      if (width <= maxGifWidth) {
        return { before, after: before, skipped: true };
      }
      output = await img
        .resize({ width: maxGifWidth, withoutEnlargement: true })
        .gif()
        .toBuffer();
    } else {
      if (width > maxWidth) {
        img.resize({ width: maxWidth, withoutEnlargement: true });
      }

      if (ext === ".jpg" || ext === ".jpeg") {
        output = await img.jpeg({ quality: jpegQuality, mozjpeg: true }).toBuffer();
      } else if (ext === ".png") {
        const keepPng = shouldKeepPng(filePath);
        const convertToJpeg = strong ? !keepPng : !meta.hasAlpha;
        if (convertToJpeg) {
          const pipeline = meta.hasAlpha ? img.flatten({ background: "#ffffff" }) : img;
          output = await pipeline.jpeg({ quality: jpegQuality, mozjpeg: true }).toBuffer();
          targetPath = filePath.replace(/\.png$/i, ".jpg");
        } else {
          output = await img
            .png({
              compressionLevel: 9,
              palette: !meta.hasAlpha,
              quality: strong ? 70 : 80,
            })
            .toBuffer();
        }
      } else if (ext === ".webp") {
        output = await img.webp({ quality: webpQuality }).toBuffer();
      } else {
        return { before, after: before, skipped: true };
      }
    }
  } catch {
    return { before, after: before, skipped: true };
  }

  if (output.length >= before) {
    return { before, after: before, skipped: true };
  }

  if (!dryRun) {
    if (targetPath !== filePath) {
      fs.writeFileSync(targetPath, output);
      fs.unlinkSync(filePath);
      recordRewrite(filePath, targetPath);
    } else {
      fs.writeFileSync(filePath, output);
    }
  } else if (targetPath !== filePath) {
    recordRewrite(filePath, targetPath);
  }

  return { before, after: output.length, skipped: false, renamed: targetPath !== filePath };
}

function walkSrcFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkSrcFiles(full));
    else if (/\.(tsx?|json|css|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function applyUrlRewrites() {
  if (urlRewrites.size === 0 && !strong) return;

  const files = walkSrcFiles(SRC);
  let changedFiles = 0;

  for (const file of files) {
    let text = fs.readFileSync(file, "utf8");
    let changed = false;
    for (const [oldUrl, newUrl] of urlRewrites) {
      if (text.includes(oldUrl)) {
        text = text.split(oldUrl).join(newUrl);
        changed = true;
      }
    }
    if (strong) {
      const fixed = text.replace(/\/uploads\/([^"'?\s]+)\.png/gi, (match, rel) => {
        const jpgPath = path.join(UPLOADS, `${rel}.jpg`);
        if (fs.existsSync(jpgPath)) return `/uploads/${rel}.jpg`;
        return match;
      });
      if (fixed !== text) {
        text = fixed;
        changed = true;
      }
    }
    if (changed && !dryRun) {
      fs.writeFileSync(file, text);
      changedFiles += 1;
    }
  }

  if (urlRewrites.size > 0 || strong) {
    console.log(
      `\nURL rewrites: ${urlRewrites.size} paths${dryRun ? " (dry run)" : `, ${changedFiles} src files updated`}`,
    );
  }
}

async function main() {
  if (!fs.existsSync(UPLOADS)) {
    console.error(`Missing ${UPLOADS}`);
    process.exit(1);
  }

  const files = walkFiles(UPLOADS);
  let totalBefore = 0;
  let totalAfter = 0;
  let compressed = 0;
  let renamed = 0;
  let skipped = 0;

  const mode = strong ? "strong" : aggressive ? "aggressive" : "normal";
  console.log(`=== COMPRESS public/uploads [${mode}] ${dryRun ? "(dry run)" : ""} ===`);
  console.log(`maxWidth=${maxWidth}, jpegQ=${jpegQuality}, files=${files.length}\n`);

  for (const file of files) {
    const rel = path.relative(UPLOADS, file).replace(/\\/g, "/");
    const result = await compressFile(file);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.skipped) {
      skipped += 1;
    } else {
      compressed += 1;
      if (result.renamed) renamed += 1;
      const saved = ((1 - result.after / result.before) * 100).toFixed(0);
      const tag = result.renamed ? " → jpg" : "";
      console.log(`  ${rel}: ${saved}% smaller${tag}`);
    }
  }

  applyUrlRewrites();

  console.log("\n=== SUMMARY ===");
  console.log(`Compressed: ${compressed} (${renamed} PNG→JPG)`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Before: ${formatMb(totalBefore)}`);
  console.log(`After:  ${formatMb(totalAfter)}`);
  console.log(
    `Saved:  ${formatMb(totalBefore - totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`,
  );

  const zipPath = path.join(UPLOADS, "2025.zip");
  if (fs.existsSync(zipPath)) {
    const zipMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(0);
    console.log(`\nNote: ${zipMb} MB local backup at public/uploads/2025.zip (gitignored, not deployed).`);
  }

  if (dryRun) console.log("\nRe-run without --dry-run to apply.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
