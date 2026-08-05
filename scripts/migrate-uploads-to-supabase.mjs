/**
 * Upload public/uploads → Supabase Storage (site-media bucket).
 * Compresses JPEG/PNG; keeps GIF/SVG/MP4 as-is. Run once before deploy.
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Create a public bucket named "site-media" in Supabase Dashboard first.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const UPLOADS = path.join(ROOT, "public", "uploads");
const BUCKET = process.env.NEXT_PUBLIC_MEDIA_BUCKET?.trim() || "site-media";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, ".env.local"));
loadEnvFile(path.join(ROOT, ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default;
  } catch {
    return null;
  }
}

async function prepareFile(filePath, buffer, sharp) {
  const ext = path.extname(filePath).toLowerCase();
  if (!sharp || ![".jpg", ".jpeg", ".png"].includes(ext)) {
    return { buffer, contentType: mimeForExt(ext) };
  }

  const pipeline = sharp(buffer).rotate().resize({
    width: 1920,
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    return {
      buffer: await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer(),
      contentType: "image/png",
    };
  }

  return {
    buffer: await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
    contentType: "image/jpeg",
  };
}

function mimeForExt(ext) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

async function main() {
  if (!fs.existsSync(UPLOADS)) {
    console.error(`Missing folder: ${UPLOADS}`);
    process.exit(1);
  }

  const sharp = await loadSharp();
  if (!sharp) {
    console.warn("sharp not installed — uploading originals without compression");
  }

  const files = walkFiles(UPLOADS);
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Uploading ${files.length} files to ${BUCKET}…`);

  for (const file of files) {
    const rel = path.relative(UPLOADS, file).replace(/\\/g, "/");
    const objectPath = rel;
    const raw = fs.readFileSync(file);
    const { buffer, contentType } = await prepareFile(file, raw, sharp);

    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
      contentType,
      upsert: true,
      cacheControl: "31536000",
    });

    if (error) {
      failed += 1;
      console.error(`FAIL ${rel}: ${error.message}`);
    } else {
      uploaded += 1;
      if (uploaded % 50 === 0) console.log(`  … ${uploaded}/${files.length}`);
    }
  }

  console.log("\n=== MEDIA MIGRATION DONE ===");
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`CDN base: ${supabaseUrl}/storage/v1/object/public/${BUCKET}/`);
  console.log("\nNext: deploy with public/uploads excluded (.vercelignore already set).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
