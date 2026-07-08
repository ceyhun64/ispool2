// utils/mergeGuestData.ts
// Misafirken localStorage'a eklenen sepet/favori kayıtlarını, kullanıcı giriş
// yaptığında (veya checkout sırasında hesap oluşturulup oturum açıldığında)
// hesaba taşır. Taşıma sonrası ilgili localStorage kayıtları temizlenir.
import { getCart, clearGuestCart } from "./cart";

const FAVORITES_KEY = "favorites";

async function mergeGuestCart(): Promise<void> {
  const guestCart = getCart();
  if (guestCart.length === 0) return;

  await Promise.all(
    guestCart.map((item) => {
      const fd = new FormData();
      fd.append("productId", String(item.productId));
      fd.append("quantity", String(item.quantity || 1));
      if (item.sizeId) fd.append("sizeId", String(item.sizeId));
      if (item.customImage) fd.append("customImage", item.customImage);
      return fetch("/api/cart", { method: "POST", body: fd }).catch(() => null);
    }),
  );

  clearGuestCart();
}

async function mergeGuestFavorites(): Promise<void> {
  let localFavs: number[] = [];
  try {
    localFavs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    localFavs = [];
  }
  if (localFavs.length === 0) return;

  await Promise.all(
    localFavs.map((productId) =>
      fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }).catch(() => null),
    ),
  );

  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch {
    // erişilemiyorsa (örn. gizli sekme) sessizce geç
  }
}

export async function mergeGuestDataIntoAccount(): Promise<void> {
  if (typeof window === "undefined") return;
  await Promise.all([mergeGuestCart(), mergeGuestFavorites()]);
}
