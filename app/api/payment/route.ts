// app/api/payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isInternalRequest } from "@/lib/internalAuth";
import { calculatePricing, formatDateForIyzipay, iyzicoRequest } from "@/lib/iyzico";

// --- ANA ROUTE ---

export async function POST(req: NextRequest) {
  // Bu uç yalnızca sunucu içi (order route) çağrılarını kabul eder; tutarlar
  // ve sepet içeriği order route tarafından veritabanından doğrulanıp
  // hesaplandıktan sonra buraya iletilir. Doğrudan dış erişim kapalıdır.
  if (!isInternalRequest(req)) {
    return NextResponse.json(
      { status: "error", error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const {
      paymentCard,
      buyer,
      shippingAddress,
      billingAddress,
      basketItems,
      currency = "TRY",
      basketId,
      installment = 1,
      discountAmount = 0,
      couponCode = null,
    } = body;

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return NextResponse.json(
        { status: "error", error: "API Keys missing" },
        { status: 500 },
      );
    }

    const pricing = calculatePricing(basketItems, installment, discountAmount);

    // 🎯 İNDİRİM DAĞITIM MANTIĞI
    // İyzipay negatif fiyat kabul etmez. İndirimi her kalemin paidPrice'ına yedirmeliyiz.
    const discountRate =
      pricing.baseTotal > 0 ? pricing.discountAmount / pricing.baseTotal : 0;

    // 1. Ürünleri Formatla
    let formattedBasketItems: any[] = basketItems.map((item: any) => {
      const originalPrice =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const itemPaidPrice = originalPrice - originalPrice * discountRate;

      return {
        id: item.id.toString(),
        name: item.name || "Ürün",
        category1: item.category1 || "Genel",
        itemType: "PHYSICAL",
        price: originalPrice.toFixed(2), // Ürünün ham fiyatı
        paidPrice: itemPaidPrice.toFixed(2), // Ürünün indirimli fiyatı
      };
    });

    // 2. Hizmet Bedelini Kalem Olarak Ekle
    const serviceFeePaidPrice =
      pricing.serviceFee - pricing.serviceFee * discountRate;
    formattedBasketItems.push({
      id: "SERVICE_FEE",
      name: "Hizmet Bedeli",
      category1: "Hizmet",
      itemType: "VIRTUAL",
      price: pricing.serviceFee.toFixed(2),
      paidPrice: serviceFeePaidPrice.toFixed(2),
    });

    // 3. Taksit Farkını Ekle (Varsa)
    if (installment > 1 && pricing.installmentFee > 0) {
      formattedBasketItems.push({
        id: "INSTALLMENT_FEE",
        name: "Taksit Farkı",
        category1: "Hizmet",
        itemType: "VIRTUAL",
        price: pricing.installmentFee.toFixed(2),
        paidPrice: pricing.installmentFee.toFixed(2), // Taksit farkına indirim uygulanmaz
      });
    }

    // ⚖️ KURUŞ FARKI DÜZELTME
    // Yuvarlamalardan dolayı paidPrice toplamı finalTotal'den farklı çıkabilir.
    const currentItemsTotal = formattedBasketItems.reduce(
      (sum, item) => sum + parseFloat(item.paidPrice),
      0,
    );
    const diff = parseFloat((pricing.total - currentItemsTotal).toFixed(2));

    if (Math.abs(diff) > 0) {
      const lastIndex = formattedBasketItems.length - 1;
      const correctedPrice = (
        parseFloat(formattedBasketItems[lastIndex].paidPrice) + diff
      ).toFixed(2);
      formattedBasketItems[lastIndex].paidPrice = correctedPrice;
    }

    // --- IYZICO REQUEST ---

    const paymentRequest = {
      locale: "tr",
      conversationId: Date.now().toString(),
      price: (pricing.baseTotal + (pricing.installmentFee || 0)).toFixed(2), // Brüt toplam
      paidPrice: pricing.total.toFixed(2), // Müşterinin ödeyeceği net tutar
      currency,
      installment,
      basketId: basketId || `B${Date.now()}`,
      paymentChannel: "WEB",
      paymentCard: {
        cardHolderName: paymentCard.cardHolderName,
        cardNumber: paymentCard.cardNumber.replace(/\s/g, ""),
        expireMonth: paymentCard.expireMonth,
        expireYear: paymentCard.expireYear,
        cvc: paymentCard.cvc,
        registerCard: 0,
      },
      buyer: {
        ...buyer,
        registrationDate: formatDateForIyzipay(buyer.registrationDate),
        lastLoginDate: formatDateForIyzipay(buyer.lastLoginDate),
      },
      shippingAddress,
      billingAddress,
      basketItems: formattedBasketItems,
    };

    const result = await iyzicoRequest("/payment/auth", paymentRequest);

    if (result.status === "success") {
      return NextResponse.json({
        status: "success",
        pricing, // Frontend'de göstermek istersen
        ...result,
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          error: result.errorMessage,
          errorCode: result.errorCode,
        },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { status: "error", error: "Ödeme işlemi sırasında bir hata oluştu" },
      { status: 500 },
    );
  }
}
