import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ReviewRequestBody {
  productId: number;
  rating: number;
  title?: string;
  comment?: string;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  let body: ReviewRequestBody;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Geçersiz JSON verisi" },
      { status: 400 }
    );
  }

  const { productId, rating, title, comment } = body;

  // rating kontrolü
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Puanlama 1 ile 5 arasında olmalıdır" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId: Number(session.user.id),
        productId,
        rating,
        title,
        comment,
      },
    });
    return NextResponse.json(review);
  } catch (error: any) {
    if (error?.code === "P2002") {
      // unique constraint violation
      return NextResponse.json(
        { error: "Bir ürün için en fazla 1 yorum yapabilirsiniz." },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Geçersiz ürün veya başka bir hata oluştu." },
      { status: 400 }
    );
  }
}
