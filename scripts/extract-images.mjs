import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const html = readFileSync("C:/Users/ethan/Downloads/golf_store_36.html", "utf8");

function extractBase64(label, regex) {
  const match = html.match(regex);
  if (!match) { console.log(`  ✗ ${label} not found`); return null; }
  return match[1];
}

function save(dir, filename, b64) {
  mkdirSync(dir, { recursive: true });
  const buf = Buffer.from(b64, "base64");
  writeFileSync(join(dir, filename), buf);
  console.log(`  ✓ ${filename} (${(buf.length/1024).toFixed(0)}KB)`);
}

const pub = "public";

// --- Hero backgrounds (bg1–bg5 in CSS) ---
console.log("\nHero backgrounds:");
for (let i = 1; i <= 5; i++) {
  const re = new RegExp(`\\.hero-bg\\.bg${i}\\{background-image:url\\("data:image\\/jpeg;base64,([^"]+)"\\)`);
  const b64 = extractBase64(`bg${i}`, re);
  if (b64) save(join(pub, "hero"), `bg${i}.jpg`, b64);
}

// --- Product images (IMG1–IMG4 JS variables) ---
console.log("\nProduct images:");
for (let i = 1; i <= 4; i++) {
  const re = new RegExp(`const IMG${i}\\s*=\\s*"data:image\\/jpeg;base64,([^"]+)"`);
  const b64 = extractBase64(`IMG${i}`, re);
  if (b64) save(join(pub, "products"), `img${i}.jpg`, b64);
}

// --- Try to grab any other product images from imgs arrays ---
console.log("\nExtra product images:");
const imgMatches = [...html.matchAll(/"data:image\/jpeg;base64,([A-Za-z0-9+/=]{500,})"/g)];
const seen = new Set();
let extra = 1;
for (const m of imgMatches) {
  const key = m[1].slice(0, 50);
  if (!seen.has(key)) {
    seen.add(key);
    save(join(pub, "products"), `extra${extra++}.jpg`, m[1]);
    if (extra > 20) break;
  }
}

console.log("\nDone.");
