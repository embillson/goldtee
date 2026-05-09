import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json(order);
}
