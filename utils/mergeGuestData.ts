// utils/mergeGuestData.ts
// Misafirken localStorage'a eklenen sepet/favori kayıtlarını, kullanıcı giriş
// yaptığında (veya checkout sırasında hesap oluşturulup oturum açıldığında)
// hesaba taşır. Taşıma sonrası ilgili localStorage kayıtları temizlenir.
import { getCart, clearGuestCart } from "./cart";

const FAVORITES_KEY = "favorites";
const REQUEST_TIMEOUT_MS = 8000;

export interface MergeGuestDataResult {
  cartFailedCount: number;
  favoritesFailedCount: number;
}

// Ağ isteği askıda kalırsa (ör. sunucu yanıt vermiyorsa) çağıran tarafın
// (ör. login butonunun spinner'ı) sonsuza kadar beklememesi için timeout.
function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeoutId),
  );
}

async function mergeGuestCart(): Promise<number> {
  const guestCart = getCart();
  if (guestCart.length === 0) return 0;

  const results = await Promise.allSettled(
    guestCart.map((item) => {
      const fd = new FormData();
      fd.append("productId", String(item.productId));
      fd.append("quantity", String(item.quantity || 1));
      if (item.sizeId) fd.append("sizeId", String(item.sizeId));
      if (item.customImage) fd.append("customImage", item.customImage);
      return fetchWithTimeout("/api/cart", { method: "POST", body: fd });
    }),
  );

  const failedCount = results.filter(
    (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok),
  ).length;

  // Kısmi başarısızlık olsa bile misafir sepeti temizlenir — aksi halde
  // başarıyla taşınan kalemler bir sonraki girişte tekrar taşınmaya
  // çalışılır ve yinelenir. Başarısız kalan kalem sayısı çağırana raporlanır.
  clearGuestCart();
  return failedCount;
}

async function mergeGuestFavorites(): Promise<number> {
  let localFavs: number[] = [];
  try {
    localFavs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    localFavs = [];
  }
  if (localFavs.length === 0) return 0;

  const results = await Promise.allSettled(
    localFavs.map((productId) =>
      fetchWithTimeout("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }),
    ),
  );

  const failedCount = results.filter(
    (r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok),
  ).length;

  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch {
    // erişilemiyorsa (örn. gizli sekme) sessizce geç
  }

  return failedCount;
}

export async function mergeGuestDataIntoAccount(): Promise<MergeGuestDataResult> {
  if (typeof window === "undefined") {
    return { cartFailedCount: 0, favoritesFailedCount: 0 };
  }
  const [cartFailedCount, favoritesFailedCount] = await Promise.all([
    mergeGuestCart(),
    mergeGuestFavorites(),
  ]);
  return { cartFailedCount, favoritesFailedCount };
}
