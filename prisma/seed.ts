import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories from original site
  const [cleaning, caps, ballMarkers, launchMonitors, accessories] =
    await Promise.all([
      prisma.category.create({ data: { name: "Cleaning", slug: "cleaning" } }),
      prisma.category.create({ data: { name: "Caps", slug: "caps" } }),
      prisma.category.create({ data: { name: "Ball Markers & Pitch", slug: "ball-markers-pitch" } }),
      prisma.category.create({ data: { name: "Launch Monitors", slug: "launch-monitors" } }),
      prisma.category.create({ data: { name: "Accessories", slug: "accessories" } }),
    ]);

  const products = [
    {
      name: "Cleaning & Accessories Kit",
      slug: "cleaning-accessories-kit",
      categoryId: cleaning.id,
      price: 270,
      stock: 20,
      featured: true,
      images: ["/products/img1.jpg", "/products/img2.jpg", "/products/img3.jpg", "/products/img4.jpg"],
      description:
        "Keep your clubs performing at their peak. This all-in-one kit includes a spray bottle, groove brush and microfibre cloth — everything you need to clean dirt, grass and debris off your irons and wedges after every round. Clean grooves mean better spin, more control and lower scores.",
    },
    {
      name: "Ryder Cup Cap",
      slug: "ryder-cup-cap",
      categoryId: caps.id,
      price: 125,
      stock: 15,
      featured: true,
      images: ["/products/product-2-1.jpg", "/products/product-2-2.jpg", "/products/product-2-3.jpg"],
      description:
        "Rep the greatest team event in golf with this premium Ryder Cup cap. Moisture-wicking fabric keeps you cool and dry on the course, while the structured fit and iconic Ryder Cup badge make it the sharpest cap in the clubhouse. Available in Black, Grey and Navy.",
    },
    {
      name: "Divot Repair Tool",
      slug: "divot-repair-tool",
      categoryId: ballMarkers.id,
      price: 180,
      stock: 30,
      featured: false,
      images: [],
      description:
        "Fix your pitch marks and leave the green better than you found it. This solid stainless steel divot repair tool fits comfortably in your pocket and makes quick work of ball marks. A must-have for every serious golfer who respects the course.",
    },
    {
      name: "Ball Markers",
      slug: "ball-markers",
      categoryId: ballMarkers.id,
      price: 90,
      stock: 25,
      featured: false,
      images: [],
      description:
        "Never lose your place on the green again. These premium ball markers are slim, durable and easy to spot — perfect for marking your ball cleanly without interfering with your playing partners. Small enough to forget you have them, essential enough that you'll notice when you don't.",
    },
    {
      name: "Tees",
      slug: "tees",
      categoryId: accessories.id,
      price: 100,
      stock: 50,
      featured: false,
      images: ["/products/product-8-1.jpg", "/products/product-8-2.jpg"],
      description:
        "The right tee makes a real difference. Our premium bamboo tees are strong, consistent and eco-friendly. Available in 5 sizes from 38mm to 83mm — whether you're teeing up a wedge or a driver, we have the perfect height for your game. 100pcs per pack so you'll never run short.",
    },
    {
      name: "Alignment Sticks",
      slug: "alignment-sticks",
      categoryId: accessories.id,
      price: 220,
      stock: 20,
      featured: false,
      images: ["/products/product-9-1.jpg"],
      description:
        "The simplest training aid with the biggest impact. Professional alignment sticks help you dial in your stance, club path and ball position on the range. Used by tour pros and weekend warriors alike — set them up in seconds and groove a repeatable, accurate swing. 39.37 inch, 2pcs per set.",
    },
    {
      name: "Shot Scope LM1",
      slug: "shot-scope-lm1",
      categoryId: launchMonitors.id,
      price: 4320,
      stock: 5,
      featured: true,
      images: ["/products/product-4-1.jpg", "/products/product-4-2.jpg", "/products/product-4-3.jpg"],
      description:
        "Take your game to the next level with real data. The Shot Scope LM1 is a Doppler radar launch monitor that measures club speed, ball speed, smash factor, carry distance and total distance — instantly, accurately, and with zero subscription fees. Set it behind the ball, hit your shot, and read the numbers. Perfect for the range, the garden or the simulator.",
    },
    {
      name: "Groove Cleaner Pro",
      slug: "groove-cleaner-pro",
      categoryId: cleaning.id,
      price: 120,
      stock: 10,
      featured: false,
      images: ["/products/product-5-1.jpg", "/products/product-5-2.jpg"],
      description:
        "Sharp grooves spin the ball. Dull grooves don't. This heavy-duty groove cleaner features a hardened steel tip and knurled aluminium body for a confident grip — built to blast out compacted mud, grass and sand from every groove on your irons and wedges. Comes with a retractable carabiner clip so it's always on your bag. Available in Blue and Red.",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products across 5 categories.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
