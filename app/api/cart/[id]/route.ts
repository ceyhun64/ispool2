// app/api/cart/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const MAX_QUANTITY = 999;

interface PatchRequestBody {
  quantity?: number;
  customImage?: string;
}

// ---------------------------------------------------------------------------
// DELETE  /api/cart/:id
// ---------------------------------------------------------------------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const cartItemId = Number(id);

    // ─── Ownership kontrolü: sadece kendi sepet satırını silebilir ────────
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: Number(session.user.id), // ← bu kullanıcıya ait mi?
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Sepet öğesi bulunamadı" },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH  /api/cart/:id   — quantity / customImage güncelle
// ---------------------------------------------------------------------------
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const cartItemId = Number(id);
    const body: PatchRequestBody = await req.json();

    // ─── Ownership kontrolü ───────────────────────────────────────────────
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: Number(session.user.id), // ← bu kullanıcıya ait mi?
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Sepet öğesi bulunamadı" },
        { status: 404 },
      );
    }

    // ─── Miktar validasyon ─────────────────────────────────────────────────
    if (
      body.quantity !== undefined &&
      (body.quantity < 1 || body.quantity > MAX_QUANTITY)
    ) {
      return NextResponse.json(
        { error: "Geçersiz miktar" },
        { status: 400 },
      );
    }

    // ─── Güncelle ──────────────────────────────────────────────────────────
    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        ...(body.quantity !== undefined && { quantity: body.quantity }),
        ...(body.customImage !== undefined && {
          customImage: body.customImage,
        }),
      },
      include: { product: true, size: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 },
    );
  }
}
