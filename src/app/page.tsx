import { prisma } from "@/lib/db";
import HeroSection from "@/components/HeroSection";
import ShopSection from "@/components/ShopSection";
import FooterSection from "@/components/FooterSection";

export const revalidate = 60;

export default async function Home() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main>
      <HeroSection />
      <ShopSection products={products} categories={categories} />
      <FooterSection />
    </main>
  );
}
