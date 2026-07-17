// Ürün fiyatları veritabanında KDV hariç saklanır; müşteriye her yerde
// (ürün kartı, ürün detayı, sepet, ödeme) KDV dahil fiyat gösterilir.
// Oran, sunucu tarafındaki lib/iyzico.ts -> calculatePricing ile aynı
// tutulmalıdır (orada "hizmet bedeli" olarak adlandırılır).
export const KDV_RATE = 0.1;

export function withKdv(price: number): number {
  return price * (1 + KDV_RATE);
}

// Kargo ücreti: KDV dahil sepet tutarı bu eşiğin altındaysa sabit ücret
// alınır, eşit veya üzerindeyse kargo ücretsizdir. Sunucu tarafında
// (lib/iyzico.ts -> calculatePricing) gerçek tahsilat için, istemci
// tarafında ise (sepet/ödeme sayfaları) gösterim için kullanılır.
export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 149.9;

export function getShippingFee(kdvDahilSepetTutari: number): number {
  return kdvDahilSepetTutari >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
