import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, price, stock, categoryId, description, images, featured } = body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
      stock,
      categoryId,
      description: description ?? null,
      images: images ?? [],
      featured: featured ?? false,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
