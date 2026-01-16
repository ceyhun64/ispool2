// app/api/cargo-tracking/route.ts
import { NextRequest, NextResponse } from "next/server";

const HOROZ_API_BASE_URL =
  process.env.HOROZ_API_BASE_URL ||
  "http://b2btest.horoz.com.tr:7801/listsrestservice_test/v1";
const HOROZ_PROCESS_KEY = process.env.HOROZ_PROCESS_KEY;

interface HorozShippingResponse {
  responseCode: string;
  responseMessage: string;
  shippingDeliveryState: {
    requestNumber: string;
    cargoTrackingNumber: string;
    atfNumber: string;
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    receiverCity: string;
    receiverDistrict: string;
    totalPieces: number;
    deliveryStatus: string;
  };
  listOfShipments: Array<{
    productCode: string;
    productName: string;
    quantity: number;
    weight: number;
    desi: number;
  }>;
  listOfMovements: Array<{
    requestNumber: string;
    atfNumber: string;
    deliveryType: string;
    senderName: string;
    receiverName: string;
    quantity: number;
    desi: number;
    status: string;
    statusDate: string;
    deliveryStatus: string;
    deliveryProblem?: string;
    amount: number;
  }>;
}

// Frekans kontrolü için cache
const requestCache = new Map<string, number>();

function checkRateLimit(requestNumber: string): {
  allowed: boolean;
  nextAllowedTime?: Date;
} {
  const now = Date.now();
  const lastRequest = requestCache.get(requestNumber);

  // 1 saat = 3600000 ms
  const ONE_HOUR = 3600000;

  if (lastRequest && now - lastRequest < ONE_HOUR) {
    const nextAllowed = new Date(lastRequest + ONE_HOUR);
    return {
      allowed: false,
      nextAllowedTime: nextAllowed,
    };
  }

  return { allowed: true };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestNumber = searchParams.get("requestNumber");

    if (!requestNumber) {
      return NextResponse.json(
        { error: "Sipariş numarası (requestNumber) gereklidir" },
        { status: 400 }
      );
    }

    if (!HOROZ_PROCESS_KEY) {
      return NextResponse.json(
        { error: "Process Key yapılandırılmamış" },
        { status: 500 }
      );
    }

    // Frekans kontrolü
    const rateLimit = checkRateLimit(requestNumber);
    if (!rateLimit.allowed) {
      const nextTime = rateLimit.nextAllowedTime!;
      const formattedTime = nextTime.toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      return NextResponse.json(
        {
          error: `Yeni sorgulama ${formattedTime} tarihinden sonra yapılabilir.`,
          code: "ERR-20002",
          nextAllowedTime: nextTime.toISOString(),
        },
        { status: 429 }
      );
    }

    // Horoz Lojistik API'sine GET isteği
    const response = await fetch(
      `${HOROZ_API_BASE_URL}/listShippingDetails?requestNumber=${encodeURIComponent(
        requestNumber
      )}`,
      {
        method: "GET",
        headers: {
          processKey: HOROZ_PROCESS_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data: HorozShippingResponse = await response.json();

    // Başarılı yanıt kontrolü
    if (data.responseCode === "STA-100") {
      // Cache'e kaydet
      requestCache.set(requestNumber, Date.now());

      return NextResponse.json({
        success: true,
        data: data,
      });
    }

    // Hata yanıtları
    if (data.responseCode === "ERR-20002") {
      return NextResponse.json(
        {
          error: data.responseMessage,
          code: data.responseCode,
        },
        { status: 429 }
      );
    }

    if (data.responseCode === "ERR-20004") {
      return NextResponse.json(
        {
          error: "Sipariş bulunamadı veya mal kabulü henüz yapılmadı",
          code: data.responseCode,
          message: data.responseMessage,
        },
        { status: 404 }
      );
    }

    // Diğer hatalar
    return NextResponse.json(
      {
        error: data.responseMessage || "Kargo takibi başarısız",
        code: data.responseCode,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Kargo takip hatası:", error);
    return NextResponse.json(
      {
        error: "Sunucu hatası oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
