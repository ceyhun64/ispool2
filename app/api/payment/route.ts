// app/api/payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const INSTALLMENT_RATES: { [key: number]: number } = {
  1: 0,
  2: 3.5,
  3: 5.2,
  6: 9.8,
  9: 13.5,
  12: 17.0,
};

// --- YARDIMCI FONKSİYONLAR ---

function generateIyzicoSignature(
  randomKey: string,
  uri: string,
  requestBody: string,
  secretKey: string
): string {
  const dataToSign = randomKey + uri + requestBody;
  return crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("hex");
}

function createAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  uri: string,
  requestBody: string
) {
  const randomKey = crypto.randomBytes(16).toString("hex");
  const signature = generateIyzicoSignature(
    randomKey,
    uri,
    requestBody,
    secretKey
  );
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const authorization = `IYZWSv2 ${Buffer.from(authString).toString("base64")}`;
  return { authorization, randomKey };
}

function formatDateForIyzipay(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

function calculatePricing(
  basketItems: any[],
  installment: number = 1,
  discountAmount: number = 0
) {
  const subtotal = basketItems.reduce(
    (sum, item) =>
      sum +
      (typeof item.price === "string" ? parseFloat(item.price) : item.price),
    0
  );
  const serviceFee = subtotal * 0.1;
  const baseTotal = subtotal + serviceFee;

  // İndirim sonrası tutar (negatif olamaz)
  const totalAfterDiscount = Math.max(0, baseTotal - discountAmount);

  // Taksit farkı indirimli tutar üzerinden hesaplanır
  const installmentRate = INSTALLMENT_RATES[installment] || 0;
  const installmentFee = totalAfterDiscount * (installmentRate / 100);
  const finalTotal = totalAfterDiscount + installmentFee;

  return {
    subtotal,
    serviceFee,
    baseTotal,
    discountAmount,
    totalAfterDiscount,
    installmentFee,
    installmentRate,
    total: finalTotal,
  };
}

// --- ANA ROUTE ---

export async function POST(req: NextRequest) {
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

    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const baseUrl =
      process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        { status: "error", error: "API Keys missing" },
        { status: 500 }
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
      0
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

    const requestBody = JSON.stringify(paymentRequest);
    const uri = "/payment/auth";
    const { authorization, randomKey } = createAuthorizationHeader(
      apiKey,
      secretKey,
      uri,
      requestBody
    );

    const response = await fetch(`${baseUrl}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
        "x-iyzi-rnd": randomKey,
      },
      body: requestBody,
    });

    const result = await response.json();

    if (result.status === "success") {
      return NextResponse.json({
        status: "success",
        pricing: pricing, // Frontend'de göstermek istersen
        ...result,
      });
    } else {
      return NextResponse.json(
        {
          status: "error",
          error: result.errorMessage,
          errorCode: result.errorCode,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { status: "error", error: error.message },
      { status: 500 }
    );
  }
}
