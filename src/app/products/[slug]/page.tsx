import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return { title: "Product Not Found — GoldTee" };
  }

  const image = product.images[0];
  const description =
    product.description ??
    `${product.name} — premium golf accessory from GoldTee. Shop the collection.`;

  return {
    title: `${product.name} — GoldTee`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/?product=${slug}`);
}
