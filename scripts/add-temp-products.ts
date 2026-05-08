import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const accessories = await prisma.category.findFirst({ where: { slug: "accessories" } });
  if (!accessories) throw new Error("Category not found");

  const temps = [
    { name: "Temp Product A", slug: "temp-a", price: 299 },
    { name: "Temp Product B", slug: "temp-b", price: 499 },
    { name: "Temp Product C", slug: "temp-c", price: 799 },
    { name: "Temp Product D", slug: "temp-d", price: 999 },
  ];

  for (const t of temps) {
    await prisma.product.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, categoryId: accessories.id, stock: 10, description: "Temporary product for layout testing." },
    });
  }
  console.log("Added 4 temp products.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
