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

  // Next.js'te .env.local, .env'i ezer. .env sandbox'ı gösterirken .env.local
  // (vercel env pull çıktısı) canlı ortamı gösterdiği için yerel geliştirmede
  // farkında olmadan GERÇEK tahsilat yapılabiliyordu. Production dışı bir
  // ortamdan canlı iyzico'ya çıkışı açıkça izin verilmedikçe engelle.
  const isProductionEndpoint =
    !baseUrl.includes("sandbox") && baseUrl.includes("iyzipay.com");
  if (
    isProductionEndpoint &&
    process.env.NODE_ENV !== "production" &&
    process.env.IYZICO_ALLOW_PRODUCTION_IN_DEV !== "1"
  ) {
    throw new Error(
      "Güvenlik: production iyzico endpoint'i production dışı bir ortamdan " +
        "kullanılamaz (gerçek para çekilir). Yerelde IYZICO_BASE_URL değerini " +
        "sandbox'a çevirin veya bilinçli olarak IYZICO_ALLOW_PRODUCTION_IN_DEV=1 tanımlayın.",
    );
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

  // iyzico kesintilerinde (5xx / HTML hata sayfası) response.json() istisna
  // atıyor ve çağıranın genel catch'i gerçek sebebi "bilinmeyen hata"ya
  // çeviriyordu. HTTP durumunu ve ham gövdeyi koruyarak teşhisi mümkün kıl.
  const rawBody = await response.text();
  try {
    return JSON.parse(rawBody);
  } catch {
    console.error(
      `iyzico ${uri} JSON olmayan yanıt döndürdü — HTTP ${response.status}:`,
      rawBody.slice(0, 500),
    );
    return {
      status: "error",
      errorCode: `HTTP_${response.status}`,
      errorMessage: `iyzico servisine ulaşılamadı (HTTP ${response.status})`,
    };
  }
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

    const { basketItems: formattedBasketItems, price: priceToSend, paidPrice: paidPriceToSend, pricing } =
      buildIyzicoBasket(basketItems, installment, discountAmount);

    // --- IYZICO REQUEST ---

    const paymentRequest = {
      locale: "tr",
      conversationId: Date.now().toString(),
      price: priceToSend, // Sepet toplam tutarı (= kalem toplamı, vade farkı hariç)
      paidPrice: paidPriceToSend, // Müşterinin ödeyeceği net tutar (vade farkı dahil)
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

export interface IyzicoBasketItem {
  id: string;
  name: string;
  category1: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  price: string;
  paidPrice: string;
}

/**
 * iyzico ödeme isteğinin tutar kısmını kurar: sepet kalemleri, `price` ve
 * `paidPrice`. Saf fonksiyondur (ağ/ortam bağımlılığı yok) — böylece tutar
 * zinciri birim testlerinden doğrulanabilir (bkz. tests/pricing.test.ts).
 *
 * Garantiler:
 *  - `sum(basketItems[].price) === price` (iyzico errorCode 5062)
 *  - `paidPrice` indirim ve vade farkını içerir; `price` içermez
 *  - Hiçbir kalem negatif tutar taşımaz
 */
export function buildIyzicoBasket(
  basketItems: any[],
  installment: number = 1,
  discountAmount: number = 0,
) {
  const pricing = calculatePricing(basketItems, installment, discountAmount);

  // 🎯 İNDİRİM DAĞITIM MANTIĞI
  // İyzipay negatif fiyat kabul etmez. İndirimi her kalemin paidPrice'ına yedirmeliyiz.
  const discountRate =
    pricing.baseTotal > 0
      ? Math.min(1, pricing.discountAmount / pricing.baseTotal)
      : 0;

  // 1. Ürünleri Formatla
  const formattedBasketItems: IyzicoBasketItem[] = basketItems.map(
    (item: any) => {
      const originalPrice =
        typeof item.price === "string" ? parseFloat(item.price) : item.price;
      const itemPaidPrice = originalPrice - originalPrice * discountRate;

      return {
        id: item.id.toString(),
        name: item.name || "Ürün",
        category1: item.category1 || "Genel",
        itemType: "PHYSICAL" as const,
        price: originalPrice.toFixed(2), // Ürünün ham fiyatı
        paidPrice: itemPaidPrice.toFixed(2), // Ürünün indirimli fiyatı
      };
    },
  );

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

  // 2b. Kargo Ücretini Kalem Olarak Ekle (Varsa — kargo eşiği altındaki
  // siparişlerde; eşik ve tutar için bkz. lib/pricing.ts)
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

  // 3. Taksit farkı BİLEREK sepet kalemi DEĞİLDİR.
    // iyzico dokümantasyonuna göre `price` "sepet toplam tutarı" (ham mal
    // bedeli), `paidPrice` ise "kullanıcıdan tahsil edilecek toplam tutar"dır;
    // vade farkı yalnızca paidPrice'a bindirilir (price=100 / paidPrice=110
    // örneğindeki 10 TL, üye iş yerinin vade komisyonudur). Önceden buraya bir
    // INSTALLMENT_FEE kalemi eklenip `price` de aynı tutar kadar şişiriliyordu;
    // bu hem dokümana aykırıydı hem de aşağıdaki yuvarlama sapmasının tek
    // kaynağıydı.

  // ⚖️ KURUŞ FARKI DÜZELTME — `price` kalem toplamından TÜRETİLİR
  // iyzico, sepet kalemlerinin toplamının `price` alanına birebir eşit
  // olmasını şart koşar; eşit değilse errorCode 5062 ("Gönderilen tutar tüm
  // kırılımların toplam tutarına eşit olmalıdır") ile işlemi reddeder.
  // Toplamı bağımsız hesaplamak yerine gönderilen kalem string'lerinden
  // toplayarak eşitliği yapısal olarak garanti ediyoruz.
  const itemsPriceTotal = formattedBasketItems.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0,
  );
  const priceToSend = itemsPriceTotal.toFixed(2);

  // paidPrice = sepet tutarı − indirim + vade farkı. Hedef tutar da aynı
  // yuvarlama düzleminde (2 ondalık) karşılaştırılmalı; aksi halde düzeltme
  // kendisi 1 kuruşluk artık sapma bırakır.
  const paidPriceToSend = pricing.total.toFixed(2);
  const currentItemsTotal = formattedBasketItems.reduce(
    (sum, item) => sum + parseFloat(item.paidPrice),
    0,
  );
  const diff = parseFloat(
    (parseFloat(paidPriceToSend) - currentItemsTotal).toFixed(2),
  );

  if (Math.abs(diff) > 0) {
    // Düzeltmeyi negatife düşmeyecek bir kaleme uygula.
    const targetIndex = [...formattedBasketItems.keys()]
      .reverse()
      .find((i) => parseFloat(formattedBasketItems[i].paidPrice) + diff >= 0);
    if (targetIndex !== undefined) {
      formattedBasketItems[targetIndex].paidPrice = (
        parseFloat(formattedBasketItems[targetIndex].paidPrice) + diff
      ).toFixed(2);
    }
  }

  return {
    basketItems: formattedBasketItems,
    price: priceToSend,
    paidPrice: paidPriceToSend,
    pricing,
  };
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
