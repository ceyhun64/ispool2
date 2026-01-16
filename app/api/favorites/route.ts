import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Tüm favorileri getir
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 }); // Giriş yok, boş liste dön
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(session.user.id) },
      include: { product: true },
    });

    return NextResponse.json(favorites);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Yeni favori ekle
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: { productId: string } = await req.json();
    const { productId } = body;
    const parsedProductId = Number(productId);
    if (isNaN(parsedProductId)) {
      return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: Number(session.user.id),
        productId: parsedProductId,
      },
    });

    return NextResponse.json(favorite);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Already exists or invalid product" },
      { status: 400 }
    );
  }
}
