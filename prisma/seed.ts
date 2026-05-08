import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: { name: "Accessories", slug: "accessories" },
    }),
    prisma.category.upsert({
      where: { slug: "apparel" },
      update: {},
      create: { name: "Apparel", slug: "apparel" },
    }),
    prisma.category.upsert({
      where: { slug: "technology" },
      update: {},
      create: { name: "Technology", slug: "technology" },
    }),
    prisma.category.upsert({
      where: { slug: "training" },
      update: {},
      create: { name: "Training", slug: "training" },
    }),
  ]);

  const [accessories, apparel, technology, training] = categories;

  const products = [
    {
      name: "Ryder Cup Premium Cap",
      slug: "ryder-cup-premium-cap",
      description: "Official Ryder Cup cap with moisture-wicking technology.",
      price: 850,
      stock: 24,
      featured: true,
      categoryId: apparel.id,
      images: [],
    },
    {
      name: "Garmin Approach S62 GPS Watch",
      slug: "garmin-approach-s62",
      description: "Premium GPS golf watch with 42,000+ preloaded courses.",
      price: 12999,
      stock: 8,
      featured: true,
      categoryId: technology.id,
      images: [],
    },
    {
      name: "ProV1 Practice Balls (12-pack)",
      slug: "prov1-practice-12pack",
      description: "Premium practice balls with consistent flight and feel.",
      price: 699,
      stock: 50,
      featured: false,
      categoryId: accessories.id,
      images: [],
    },
    {
      name: "Golf Swing Trainer Stick",
      slug: "swing-trainer-stick",
      description: "Improve your swing arc and tempo with this training aid.",
      price: 499,
      stock: 15,
      featured: false,
      categoryId: training.id,
      images: [],
    },
    {
      name: "Bushnell Tour V5 Rangefinder",
      slug: "bushnell-tour-v5",
      description: "Tournament-legal laser rangefinder with slope technology.",
      price: 8499,
      stock: 6,
      featured: true,
      categoryId: technology.id,
      images: [],
    },
    {
      name: "Titleist Players Glove",
      slug: "titleist-players-glove",
      description: "Premium cabretta leather glove for exceptional feel.",
      price: 349,
      stock: 30,
      featured: false,
      categoryId: accessories.id,
      images: [],
    },
    {
      name: "Under Armour Polo Shirt",
      slug: "ua-polo-shirt",
      description: "Heat Gear technology keeps you cool in the South African sun.",
      price: 1199,
      stock: 18,
      featured: false,
      categoryId: apparel.id,
      images: [],
    },
    {
      name: "Golf Putting Mat 3m",
      slug: "putting-mat-3m",
      description: "Practice your putting stroke at home with this tour-quality mat.",
      price: 1899,
      stock: 12,
      featured: false,
      categoryId: training.id,
      images: [],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
