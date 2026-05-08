import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const html = readFileSync("C:/Users/ethan/Downloads/golf_store_36.html", "utf8");

// Find the products array block
const start = html.indexOf("let products = [");
const end = html.indexOf("\n];", start) + 3;
const block = html.slice(start, end);

// Extract each product's id and its inline base64 images
const productMatches = [...block.matchAll(/\{id:(\d+),name:"([^"]+)"[^}]*imgs:\[([^\]]*)\]/g)];

mkdirSync("public/products", { recursive: true });

for (const m of productMatches) {
  const id = m[1];
  const name = m[2];
  const imgsRaw = m[3];

  // Find inline base64 strings within this product's imgs array
  const b64s = [...imgsRaw.matchAll(/"data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/g)];

  if (b64s.length > 0) {
    console.log(`Product ${id} (${name}): ${b64s.length} inline image(s)`);
    b64s.forEach((bm, i) => {
      const filename = `product-${id}-${i + 1}.jpg`;
      const buf = Buffer.from(bm[1], "base64");
      writeFileSync(join("public/products", filename), buf);
      console.log(`  ✓ ${filename} (${(buf.length/1024).toFixed(0)}KB)`);
    });
  } else {
    // Check for IMG variable references
    const varRefs = imgsRaw.match(/IMG\d+/g);
    if (varRefs) {
      console.log(`Product ${id} (${name}): uses variables ${varRefs.join(", ")}`);
    } else {
      console.log(`Product ${id} (${name}): no images`);
    }
  }
}
