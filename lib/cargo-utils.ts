// lib/cargo-utils.ts

/**
 * Kargo durumunu Türkçe açıklamaya çevirir
 */
export function getCargoStatusText(statusCode: string): string {
  const statusMap: Record<string, string> = {
    "100": "Gönderi Alındı",
    "200": "Transfer Merkezinde",
    "300": "Dağıtım Merkezinde",
    "400": "Dağıtımda",
    "500": "Teslim Edildi",
    "600": "Teslim Edilemedi",
    "700": "İade Sürecinde",
  };

  return statusMap[statusCode] || "Bilinmeyen Durum";
}

/**
 * Durum koduna göre renk döndürür
 */
export function getStatusColor(statusCode: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colorMap: Record<string, { bg: string; text: string; border: string }> =
    {
      "100": {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
      },
      "200": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
      },
      "300": {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        border: "border-indigo-300",
      },
      "400": {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
      },
      "500": {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
      },
      "600": {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
      },
      "700": {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300",
      },
    };

  return (
    colorMap[statusCode] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    }
  );
}

/**
 * Kargo durumunun yüzde ilerleme değerini hesaplar
 */
export function calculateProgress(statusCode: string): number {
  const progressMap: Record<string, number> = {
    "100": 20,
    "200": 40,
    "300": 60,
    "400": 80,
    "500": 100,
    "600": 75, // Teslim edilemedi
    "700": 50, // İade
  };

  return progressMap[statusCode] || 0;
}

/**
 * Takip numarasını formatlar
 */
export function formatTrackingNumber(trackingNumber: string): string {
  // Örnek: 1234567890 -> 1234-5678-90
  const cleaned = trackingNumber.replace(/\D/g, "");
  const match = cleaned.match(/(\d{4})(\d{4})(\d{2})/);

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  return trackingNumber;
}

/**
 * Tarihi Türkçe formata çevirir
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("tr-TR", options);
}

/**
 * Tahmini teslimat süresini hesaplar
 */
export function calculateEstimatedDelivery(
  shipmentDate: Date,
  serviceType: string
): Date {
  const estimatedDays: Record<string, number> = {
    express: 1,
    standard: 3,
    economy: 5,
  };

  const days = estimatedDays[serviceType] || 3;
  const deliveryDate = new Date(shipmentDate);
  deliveryDate.setDate(deliveryDate.getDate() + days);

  return deliveryDate;
}

/**
 * Kargo geçmişini tarihe göre sıralar (en yeni en üstte)
 */
export function sortCargoHistory(movements: any[]): any[] {
  return movements.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Toplu takip sonuçlarını kategorilere ayırır
 */
export function categorizeTrackingResults(results: any[]) {
  return {
    delivered: results.filter((r) => r.data?.statusCode === "500"),
    inTransit: results.filter((r) =>
      ["200", "300", "400"].includes(r.data?.statusCode)
    ),
    exception: results.filter((r) =>
      ["600", "700"].includes(r.data?.statusCode)
    ),
    pending: results.filter((r) => r.data?.statusCode === "100"),
    failed: results.filter((r) => r.status === "failed"),
  };
}

/**
 * Kargo durumuna göre simge döndürür
 */
export function getStatusIcon(statusCode: string): string {
  const iconMap: Record<string, string> = {
    "100": "📦",
    "200": "🚛",
    "300": "🏢",
    "400": "🚚",
    "500": "✅",
    "600": "❌",
    "700": "↩️",
  };

  return iconMap[statusCode] || "📦";
}

/**
 * API hatalarını kullanıcı dostu mesajlara çevirir
 */
export function getErrorMessage(error: any): string {
  const errorMessages: Record<string, string> = {
    "404": "Kargo bulunamadı. Lütfen takip numarasını kontrol edin.",
    "401": "Yetkilendirme hatası. Lütfen daha sonra tekrar deneyin.",
    "429": "Çok fazla istek. Lütfen biraz bekleyip tekrar deneyin.",
    "500": "Sunucu hatası. Lütfen daha sonra tekrar deneyin.",
  };

  if (error.response?.status) {
    return errorMessages[error.response.status] || "Bir hata oluştu.";
  }

  return error.message || "Beklenmeyen bir hata oluştu.";
}

/**
 * Takip numarası doğrulama
 */
export function validateTrackingNumber(trackingNumber: string): {
  valid: boolean;
  error?: string;
} {
  const cleaned = trackingNumber.trim();

  if (!cleaned) {
    return { valid: false, error: "Takip numarası boş olamaz" };
  }

  if (cleaned.length < 8) {
    return { valid: false, error: "Takip numarası çok kısa" };
  }

  if (cleaned.length > 20) {
    return { valid: false, error: "Takip numarası çok uzun" };
  }

  // Sadece rakam ve harf içermeli
  if (!/^[A-Za-z0-9]+$/.test(cleaned)) {
    return {
      valid: false,
      error: "Takip numarası sadece harf ve rakam içermelidir",
    };
  }

  return { valid: true };
}
