// api/coupon/validate/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Kupon kodu gerekli" },
        { status: 400 }
      );
    }

    // 1. Kuponu bul
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    // 2. Temel Geçerlilik Kontrolleri
    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { error: "Geçersiz veya süresi dolmuş kupon" },
        { status: 404 }
      );
    }

    // 3. Tarih Kontrolü
    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return NextResponse.json(
        { error: "Kuponun süresi dolmuş" },
        { status: 400 }
      );
    }

    // 4. Kullanım Sınırı Kontrolü
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "Kupon kullanım sınırı doldu" },
        { status: 400 }
      );
    }

    // 5. Alt Limit Kontrolü
    if (coupon.minAmount && cartTotal < coupon.minAmount) {
      return NextResponse.json(
        {
          error: `Bu kupon en az ${coupon.minAmount} TL tutarındaki sepetlerde geçerlidir.`,
        },
        { status: 400 }
      );
    }

    // 6. İndirim Hesaplama
    let discountAmount = 0;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = (cartTotal * coupon.value) / 100;
      // Eğer bir max indirim sınırı varsa kontrol et
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      // FIXED (Nakit) İndirim
      discountAmount = Math.min(coupon.value, cartTotal);
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      type: coupon.type,
      discountAmount: discountAmount,
      finalPrice: cartTotal - discountAmount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
