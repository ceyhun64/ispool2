// lib/iyzico.ts
import crypto from "crypto";
import { getShippingFee } from "./pricing";

const INSTALLMENT_RATES: { [key: number]: number } = {
  1: 0,
  2: 3.5,
  3: 5.2,
  6: 9.8,
  9: 13.5,
  12: 17.0,
};

function generateIyzicoSignature(
  randomKey: string,
  uri: string,
  requestBody: string,
  secretKey: string,
): string {
  const dataToSign = randomKey + uri + requestBody;
  return crypto.createHmac("sha256", secretKey).update(dataToSign).digest("hex");
}

function createAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  uri: string,
  requestBody: string,
) {
  const randomKey = crypto.randomBytes(16).toString("hex");
  const signature = generateIyzicoSignature(randomKey, uri, requestBody, secretKey);
  const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  const authorization = `IYZWSv2 ${Buffer.from(authString).toString("base64")}`;
  return { authorization, randomKey };
}

export function formatDateForIyzipay(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

export function calculatePricing(
  basketItems: any[],
  installment: number = 1,
  discountAmount: number = 0,
) {
  const subtotal = basketItems.reduce(
    (sum, item) =>
      sum + (typeof item.price === "string" ? parseFloat(item.price) : item.price),
    0,
  );
  const serviceFee = subtotal * 0.1;
  const shippingFee = getShippingFee(subtotal + serviceFee);
  const baseTotal = subtotal + serviceFee + shippingFee;

  const totalAfterDiscount = Math.max(0, baseTotal - discountAmount);

  const installmentRate = INSTALLMENT_RATES[installment] || 0;
  const installmentFee = totalAfterDiscount * (installmentRate / 100);
  const finalTotal = totalAfterDiscount + installmentFee;

  return {
    subtotal,
    serviceFee,
    shippingFee,
    baseTotal,
    discountAmount,
    totalAfterDiscount,
    installmentFee,
    installmentRate,
    total: finalTotal,
  };
}

function getIyzicoCredentials() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
  if (!apiKey || !secretKey) {
    throw new Error("IYZICO_API_KEY / IYZICO_SECRET_KEY tanımlı değil");
  }
  return { apiKey, secretKey, baseUrl };
}

export async function iyzicoRequest(uri: string, payload: Record<string, any>) {
  const { apiKey, secretKey, baseUrl } = getIyzicoCredentials();
  const requestBody = JSON.stringify(payload);
  const { authorization, randomKey } = createAuthorizationHeader(
    apiKey,
    secretKey,
    uri,
    requestBody,
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

  return response.json();
}

interface ProcessPaymentPayload {
  paymentCard: {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
  };
  buyer: Record<string, any>;
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any>;
  basketItems: any[];
  currency?: string;
  basketId?: string;
  installment?: number;
  discountAmount?: number;
}

// order route'un doğrudan çağırdığı ödeme işleme fonksiyonu. Önceden bu
// mantık ayrı bir /api/payment route'unda yaşıyordu ve order route kendi
// kendine (NEXT_PUBLIC_BASE_URL üzerinden) bir HTTP isteğiyle çağırıyordu;
// bu domain www'ye yönlendirme yaptığından istek kırılgandı (bkz. resim
// yükleme düzeltmesindeki aynı kök sorun). Aynı process içinde doğrudan
// fonksiyon çağrısı bu ağ round-trip'ini tamamen ortadan kaldırır.
export async function processPayment(payload: ProcessPaymentPayload) {
  try {
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
    } = payload;

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return { status: "error", error: "API Keys missing" };
    }

    const pricing = calculatePricing(basketItems, installment, discountAmount);

    // 🎯 İNDİRİM DAĞITIM MANTIĞI
    // İyzipay negatif fiyat kabul etmez. İndirimi her kalemin paidPrice'ına yedirmeliyiz.
    const discountRate =
      pricing.baseTotal > 0 ? pricing.discountAmount / pricing.baseTotal : 0;

    // 1. Ürünleri Formatla
    const formattedBasketItems: any[] = basketItems.map((item: any) => {
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

    // 2b. Kargo Ücretini Kalem Olarak Ekle (Varsa — 3000 TL altı siparişlerde)
    if (pricing.shippingFee > 0) {
      const shippingFeePaidPrice =
        pricing.shippingFee - pricing.shippingFee * discountRate;
      formattedBasketItems.push({
        id: "SHIPPING_FEE",
        name: "Kargo Ücreti",
        category1: "Hizmet",
        itemType: "VIRTUAL",
        price: pricing.shippingFee.toFixed(2),
        paidPrice: shippingFeePaidPrice.toFixed(2),
      });
    }

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
      return {
        status: "success" as const,
        pricing,
        ...result,
      };
    }

    return {
      status: "error" as const,
      error: result.errorMessage,
      errorCode: result.errorCode,
    };
  } catch (error) {
    console.error("Payment Error:", error);
    return {
      status: "error" as const,
      error: "Ödeme işlemi sırasında bir hata oluştu",
    };
  }
}

/**
 * Ödeme başarıyla alınmış ama sipariş kaydı DB'de oluşturulamamışsa (ör. FK
 * hatası) tahsilatı geri almak için kullanılır. Başarısız olsa bile hata
 * fırlatmaz — çağıran taraf zaten bir hata yanıtı dönecektir; burada asıl
 * amaç para iadesini "best effort" tetiklemek ve durumu loglamaktır.
 */
export async function voidIyzicoPayment(paymentId: string, ip = "127.0.0.1") {
  try {
    const result = await iyzicoRequest("/payment/cancel", {
      locale: "tr",
      conversationId: Date.now().toString(),
      paymentId,
      ip,
    });
    if (result?.status !== "success") {
      console.error("⚠️ İyzico ödeme iptali başarısız:", result);
    }
    return result;
  } catch (err) {
    console.error("💥 İyzico ödeme iptali sırasında hata:", err);
    return null;
  }
}
