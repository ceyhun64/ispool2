// types/horoz-cargo.ts

// Horoz API İstek ve Yanıt Tipleri

export interface HorozTrackingRequest {
  requestNumber: string; // Sipariş numarası
}

export interface ShippingDeliveryState {
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
}

export interface Shipment {
  productCode: string;
  productName: string;
  quantity: number;
  weight: number;
  desi: number;
}

export interface CargoMovement {
  requestNumber: string;
  atfNumber: string;
  deliveryType: string;
  senderName: string;
  receiverName: string;
  quantity: number;
  desi: number;
  status: CargoStatus;
  statusDate: string;
  deliveryStatus: string;
  deliveryProblem?: string;
  amount: number;
}

export interface HorozApiResponse {
  responseCode: string;
  responseMessage: string;
  shippingDeliveryState: ShippingDeliveryState;
  listOfShipments: Shipment[];
  listOfMovements: CargoMovement[];
}

// Horoz Lojistik Kargo Durum Kodları
export type CargoStatus =
  | "BEKLİYOR"
  | "GİRİŞ"
  | "ÇIKIŞ"
  | "TESLİM SORUN"
  | "TESLİM";

// Kargo Durum Açıklamaları
export const CARGO_STATUS_DESCRIPTIONS: Record<CargoStatus, string> = {
  BEKLİYOR:
    "Teslimat için mal kabul yapılarak barkod etiketi oluşturulma durumunu ifade eder.",
  GİRİŞ: "Sevkiyat başlamış ve bir aktarma merkezine giriş yapılmış.",
  ÇIKIŞ: "Sevkiyat başlamış ve bir aktarma merkezinden çıkış yapılmış.",
  "TESLİM SORUN":
    "Teslimat için dağıtıma çıkmış ve teslim edilememiş ve bir sorun girilmiş.",
  TESLİM: "Teslimata çıkmış ve teslim edilmiş.",
};

// Horoz API Response Kodları
export type HorozResponseCode =
  | "STA-100" // Başarılı
  | "ERR-20002" // Frekans sınırı
  | "ERR-20004"; // Sipariş bulunamadı

export interface HorozErrorResponse {
  responseCode: HorozResponseCode;
  responseMessage: string;
}

// Teslimat Sorun Kodları (Dokümanda belirtilmiş olabilir)
export type DeliveryProblem =
  | "ADRESİNDE YOK"
  | "ADRES BULUNAMADI"
  | "MÜŞTERİ REDDETTİ"
  | "TELEFON ULAŞILAMADI"
  | "ERTELENDİ"
  | "GÜVENLİK SORUNU"
  | "DİĞER";

// Kargo Durum Renkleri (UI için)
export interface StatusColor {
  bg: string;
  text: string;
  border: string;
}

export const CARGO_STATUS_COLORS: Record<CargoStatus, StatusColor> = {
  BEKLİYOR: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  GİRİŞ: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    border: "border-indigo-300",
  },
  ÇIKIŞ: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  "TESLİM SORUN": {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  TESLİM: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
};

// Kargo Durum İkonları
export const CARGO_STATUS_ICONS: Record<CargoStatus, string> = {
  BEKLİYOR: "⏳",
  GİRİŞ: "📦",
  ÇIKIŞ: "🚛",
  "TESLİM SORUN": "⚠️",
  TESLİM: "✅",
};

// API Frekans Limiti
export interface RateLimitInfo {
  allowed: boolean;
  nextAllowedTime?: Date;
  remainingMinutes?: number;
}

// Horoz Lojistik Tracking URL'leri
export const HOROZ_TRACKING_URLS = {
  public: "https://www.horoz.com.tr/kargo-takip",
  portal: "https://app3.horoz.com.tr/kargo",
} as const;

// Yardımcı Tip Kontrolleri
export function isSuccessResponse(code: string): code is "STA-100" {
  return code === "STA-100";
}

export function isRateLimitError(code: string): code is "ERR-20002" {
  return code === "ERR-20002";
}

export function isNotFoundError(code: string): code is "ERR-20004" {
  return code === "ERR-20004";
}

// Frontend için basitleştirilmiş tip
export interface SimplifiedCargoData {
  orderNumber: string;
  trackingNumber: string;
  currentStatus: CargoStatus;
  lastUpdate: string;
  sender: {
    name: string;
    phone: string;
  };
  receiver: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  shipments: Array<{
    product: string;
    quantity: number;
    weight: number;
  }>;
  history: Array<{
    status: CargoStatus;
    date: string;
    problem?: string;
  }>;
}
