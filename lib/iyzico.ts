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

export const IYZICO_SANDBOX_BASE_URL = "https://sandbox-api.iyzipay.com";

/**
 * Ödeme altyapısı yapılandırma hatalarının ayırt edici kodları. Client'a
 * yalnızca bu kod ve genel bir mesaj döner; hangi değişkenin eksik olduğu
 * sadece sunucu log'una yazılır.
 */
export type IyzicoConfigErrorCode =
  | "IYZICO_CONFIG_API_KEY_MISSING"
  | "IYZICO_CONFIG_SECRET_KEY_MISSING"
  | "IYZICO_CONFIG_BASE_URL_INVALID"
  | "IYZICO_CONFIG_LIVE_BLOCKED_IN_DEV";

export class IyzicoConfigError extends Error {
  readonly code: IyzicoConfigErrorCode;
  constructor(code: IyzicoConfigErrorCode, message: string) {
    super(message);
    this.name = "IyzicoConfigError";
    this.code = code;
  }
}

export interface IyzicoEnvIssue {
  code: IyzicoConfigErrorCode;
  variable: string;
  /** Sorunun açıklaması — değişken DEĞERİ asla yer almaz. */
  detail: string;
}

export interface IyzicoEnvReport {
  ok: boolean;
  /** Hangi iyzico ortamına çıkılıyor (değer ifşa edilmeden). */
  environment: "sandbox" | "production" | "bilinmiyor";
  /** IYZICO_BASE_URL tanımsız olduğu için sandbox varsayılanına düşüldü mü. */
  usingDefaultBaseUrl: boolean;
  issues: IyzicoEnvIssue[];
}

/**
 * Gerekli iyzico ortam değişkenlerini tek seferde doğrular. Saf fonksiyondur
 * (log/ağ yok), böylece birim testlerinden çağrılabilir — bkz.
 * tests/iyzicoEnv.test.ts.
 *
 * Hiçbir dönüş alanı gizli değer taşımaz: yalnızca değişken adı, durum ve
 * türetilmiş ortam etiketi.
 */
export function checkIyzicoEnv(
  env: NodeJS.ProcessEnv = process.env,
): IyzicoEnvReport {
  const issues: IyzicoEnvIssue[] = [];

  // Vercel panosuna yapıştırırken araya kaçan boşluk/yeni satır, iyzico'da
  // "api bilgileri bulunamadı" (errorCode 1001) olarak geri döner. Bu yüzden
  // hem doğrulamada hem kullanımda trim'liyoruz.
  const apiKey = env.IYZICO_API_KEY?.trim();
  const secretKey = env.IYZICO_SECRET_KEY?.trim();
  const rawBaseUrl = env.IYZICO_BASE_URL?.trim();

  const usingDefaultBaseUrl = !rawBaseUrl;
  const baseUrl = rawBaseUrl || IYZICO_SANDBOX_BASE_URL;

  if (!apiKey) {
    issues.push({
      code: "IYZICO_CONFIG_API_KEY_MISSING",
      variable: "IYZICO_API_KEY",
      detail: "tanımlı değil veya boş",
    });
  }
  if (!secretKey) {
    issues.push({
      code: "IYZICO_CONFIG_SECRET_KEY_MISSING",
      variable: "IYZICO_SECRET_KEY",
      detail: "tanımlı değil veya boş",
    });
  }

  let environment: IyzicoEnvReport["environment"] = "bilinmiyor";
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    parsedUrl = null;
  }

  const isIyzicoHost =
    parsedUrl !== null &&
    parsedUrl.protocol === "https:" &&
    (parsedUrl.hostname === "iyzipay.com" ||
      parsedUrl.hostname.endsWith(".iyzipay.com"));

  if (!isIyzicoHost) {
    issues.push({
      code: "IYZICO_CONFIG_BASE_URL_INVALID",
      variable: "IYZICO_BASE_URL",
      detail:
        "geçerli bir iyzico adresi değil — https://api.iyzipay.com (canlı) " +
        "veya https://sandbox-api.iyzipay.com (sandbox) olmalı (değer loglanmaz)",
    });
  } else {
    environment = parsedUrl!.hostname.includes("sandbox")
      ? "sandbox"
      : "production";
  }

  // Next.js'te .env.local, .env'i ezer. .env sandbox'ı gösterirken .env.local
  // (vercel env pull çıktısı) canlı ortamı gösterdiği için yerel geliştirmede
  // farkında olmadan GERÇEK tahsilat yapılabiliyordu. Production dışı bir
  // ortamdan canlı iyzico'ya çıkışı açıkça izin verilmedikçe engelle.
  if (
    environment === "production" &&
    env.NODE_ENV !== "production" &&
    env.IYZICO_ALLOW_PRODUCTION_IN_DEV !== "1"
  ) {
    issues.push({
      code: "IYZICO_CONFIG_LIVE_BLOCKED_IN_DEV",
      variable: "IYZICO_BASE_URL",
      detail:
        "Güvenlik: production iyzico endpoint'i production dışı bir ortamdan " +
        "kullanılamaz (gerçek para çekilir). Yerelde IYZICO_BASE_URL değerini " +
        "sandbox'a çevirin veya bilinçli olarak IYZICO_ALLOW_PRODUCTION_IN_DEV=1 tanımlayın.",
    });
  }

  return { ok: issues.length === 0, environment, usingDefaultBaseUrl, issues };
}

let envReportLogged = false;

/**
 * Yapılandırma durumunu sunucu log'una konsolide biçimde yazar. Başarılı
 * durum process başına bir kez, hatalı durum her çağrıda loglanır (her
 * başarısız ödemenin sebebi log'da görünsün diye).
 *
 * ASLA değer loglamaz — yalnızca değişken adı ve "tanımlı / tanımlı değil".
 */
export function logIyzicoEnvReport(context: string): IyzicoEnvReport {
  const report = checkIyzicoEnv();

  if (report.ok) {
    if (!envReportLogged) {
      envReportLogged = true;
      console.info(
        `💳 iyzico yapılandırması tamam (${context}) — endpoint ortamı: ${report.environment}`,
      );
      if (report.usingDefaultBaseUrl) {
        console.warn(
          "💳 IYZICO_BASE_URL tanımlı değil — sandbox varsayılanı kullanılıyor. " +
            "Canlı anahtarlarla sandbox'a çıkılırsa iyzico errorCode 1001 " +
            '("api bilgileri bulunamadı") döner.',
        );
      }
    }
    return report;
  }

  const durum = (name: string) =>
    `${name}=${process.env[name]?.trim() ? "tanımlı" : "tanımlı değil"}`;

  console.error(
    `💳 iyzico yapılandırması eksik/hatalı (${context}) — endpoint ortamı: ${report.environment}. ` +
      `${durum("IYZICO_API_KEY")}, ${durum("IYZICO_SECRET_KEY")}, ${durum("IYZICO_BASE_URL")}` +
      `${report.usingDefaultBaseUrl ? " (sandbox varsayılanına düşüldü)" : ""}`,
  );
  for (const issue of report.issues) {
    console.error(`   • [${issue.code}] ${issue.variable}: ${issue.detail}`);
  }

  return report;
}

function getIyzicoCredentials() {
  const report = logIyzicoEnvReport("ödeme çağrısı");
  if (!report.ok) {
    // İlk sorun en eyleme dönük olanıdır (eksik anahtar → hatalı adres →
    // canlı ortam koruması).
    const first = report.issues[0];
    throw new IyzicoConfigError(first.code, `${first.variable}: ${first.detail}`);
  }

  return {
    apiKey: process.env.IYZICO_API_KEY!.trim(),
    secretKey: process.env.IYZICO_SECRET_KEY!.trim(),
    baseUrl: process.env.IYZICO_BASE_URL?.trim() || IYZICO_SANDBOX_BASE_URL,
  };
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

/**
 * Yapılandırma hatalarında kullanıcıya gösterilen genel mesaj. Ayrıntı
 * (hangi değişken eksik) yalnızca sunucu log'unda kalır; client tarafı
 * ayrımı `errorCode` üzerinden yapar.
 */
export const IYZICO_CONFIG_USER_MESSAGE =
  "Ödeme altyapısına ulaşılamadı. Lütfen daha sonra tekrar deneyin.";

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

    // Yapılandırma eksikse iyzico'ya hiç çıkma: hangi değişkenin eksik
    // olduğunu sunucu log'una yaz, client'a genel mesaj + ayırt edici kod dön.
    try {
      getIyzicoCredentials();
    } catch (configError) {
      if (configError instanceof IyzicoConfigError) {
        return {
          status: "error" as const,
          error: IYZICO_CONFIG_USER_MESSAGE,
          errorCode: configError.code,
        };
      }
      throw configError;
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

    // iyzico 1000/1001 = "api bilgileri bulunamadı" / imza doğrulanamadı:
    // anahtarlar gönderildi ama sorgulanan ortamda (sandbox ↔ canlı) kayıtlı
    // değil. Ortam etiketini log'a düş ki teşhis ilk denemede yapılabilsin.
    if (result.errorCode === "1000" || result.errorCode === "1001") {
      const report = checkIyzicoEnv();
      console.error(
        `💳 iyzico kimlik doğrulama hatası [errorCode ${result.errorCode}] — ` +
          `endpoint ortamı: ${report.environment}` +
          `${report.usingDefaultBaseUrl ? " (IYZICO_BASE_URL tanımsız, sandbox varsayılanı)" : ""}. ` +
          "Anahtarların bu ortama ait olduğunu doğrulayın (değerler loglanmaz).",
      );
    }

    return {
      status: "error" as const,
      error: result.errorMessage,
      errorCode: result.errorCode,
    };
  } catch (error) {
    // Yapılandırma hatası buraya normalde düşmez (yukarıda ön kontrol var),
    // ama iyzicoRequest üzerinden gelirse de ayırt edici kodu koru.
    if (error instanceof IyzicoConfigError) {
      return {
        status: "error" as const,
        error: IYZICO_CONFIG_USER_MESSAGE,
        errorCode: error.code,
      };
    }
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
