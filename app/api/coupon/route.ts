// app/api/coupon/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type, value, minAmount, usageLimit, expiryDate } = body;

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type: type, // "PERCENTAGE" veya "FIXED"
        value: parseFloat(value),
        minAmount: minAmount ? parseFloat(minAmount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return NextResponse.json(newCoupon);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kupon kodu zaten mevcut" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Kupon oluşturulamadı" },
      { status: 500 }
    );
  }
}
