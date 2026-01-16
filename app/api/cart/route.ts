import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
// Düzeltme: authOptions'ı artık Route Handler'dan değil, config dosyasından içe aktarıyoruz.
// '@/lib/auth' dosyasının içeriği, bir önceki yanıttaki authOptions yapısı olmalıdır.
import { authOptions } from "@/lib/auth";

interface CartItemRequestBody {
  productId: number;
  quantity?: number;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 }); // Giriş yok, boş liste dön

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(session.user.id) },
      include: { product: true },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: CartItemRequestBody = await req.json();

    const { productId, quantity = 1 } = body;

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: Number(session.user.id),
        productId,
      },
    });

    if (existing) {
      // Varsa miktarı artır
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return NextResponse.json(updated);
    } // Yoksa yeni kayıt oluştur

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: Number(session.user.id),
        productId,
        quantity,
      },
      include: { product: true },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: Number(session.user.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete cart items" },
      { status: 500 }
    );
  }
}
