import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface PatchRequestBody {
  quantity: number;
}

/**
 * DELETE /api/cart/[id]
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params artık Promise
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cartItemId = Number(id);

  try {
    const deleted = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete cart item" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/cart/[id]
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params artık Promise
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cartItemId = Number(id);
  const body: PatchRequestBody = await req.json();

  if (!body.quantity || body.quantity < 1)
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });

  try {
    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: body.quantity },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}
