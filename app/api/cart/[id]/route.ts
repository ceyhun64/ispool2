import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PatchRequestBody {
  quantity?: number; // Opsiyonel yaptık
  customImage?: string; // Yeni ekledik
}

/**
 * DELETE /api/cart/[id]
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const deleted = await prisma.cartItem.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/cart/[id]
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: PatchRequestBody = await req.json();

  try {
    const updated = await prisma.cartItem.update({
      where: { id: Number(id) },
      data: {
        // Sadece gelen alanları güncelle
        ...(body.quantity !== undefined && { quantity: body.quantity }),
        ...(body.customImage !== undefined && {
          customImage: body.customImage,
        }),
      },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 },
    );
  }
}
