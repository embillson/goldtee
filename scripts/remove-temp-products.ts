import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })) });

async function main() {
  const r = await prisma.product.deleteMany({
    where: { slug: { in: ["temp-a", "temp-b", "temp-c", "temp-d"] } },
  });
  console.log(`Deleted ${r.count} temp products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
