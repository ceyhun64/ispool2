// app/api/coupon/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Aktif kuponları listele
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: coupons });
  } catch (error) {
    return NextResponse.json(
      { error: "Kuponlar yüklenemedi" },
      { status: 500 },
    );
  }
}

// POST: Yeni kupon oluştur
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { code, type, value, minAmount, usageLimit, expiryDate } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Kupon kodu gerekli" }, { status: 400 });
    }
    if (type !== "PERCENTAGE" && type !== "FIXED") {
      return NextResponse.json(
        { error: "Geçersiz kupon tipi" },
        { status: 400 },
      );
    }

    const parsedValue = parseFloat(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return NextResponse.json(
        { error: "Geçersiz indirim değeri" },
        { status: 400 },
      );
    }

    const parsedMinAmount =
      minAmount !== undefined && minAmount !== null && minAmount !== ""
        ? parseFloat(minAmount)
        : null;
    if (parsedMinAmount !== null && !Number.isFinite(parsedMinAmount)) {
      return NextResponse.json(
        { error: "Geçersiz minimum tutar" },
        { status: 400 },
      );
    }

    const parsedUsageLimit =
      usageLimit !== undefined && usageLimit !== null && usageLimit !== ""
        ? parseInt(usageLimit)
        : null;
    if (parsedUsageLimit !== null && !Number.isInteger(parsedUsageLimit)) {
      return NextResponse.json(
        { error: "Geçersiz kullanım limiti" },
        { status: 400 },
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: parsedValue,
        minAmount: parsedMinAmount,
        usageLimit: parsedUsageLimit,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
    });

    return NextResponse.json({ success: true, data: newCoupon });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Bu kupon kodu zaten mevcut" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Kupon oluşturulamadı" },
      { status: 500 },
    );
  }
}

// DELETE: Kupon sil
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Geçersiz kupon id" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Kupon silinemedi" }, { status: 500 });
  }
}
