import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  console.log("\nCategories:");
  categories.forEach(c => console.log(`  ${c.name}`));

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
  console.log("\nProducts:");
  products.forEach(p =>
    console.log(`  [${p.category.name}] ${p.name} — R${p.price} | stock:${p.stock} | ${p.images.length} photo(s)`)
  );
}

main().finally(() => prisma.$disconnect());
