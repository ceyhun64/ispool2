// lib/iyzico.ts
import crypto from "crypto";

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
  const baseTotal = subtotal + serviceFee;

  const totalAfterDiscount = Math.max(0, baseTotal - discountAmount);

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
