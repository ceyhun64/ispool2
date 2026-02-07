// utils/cart.ts
// Guest sepet yönetimi (localStorage tabanlı)

export interface GuestCartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  sizeId?: number | null;
  customImage?: string | null;
  bulkDiscountQty?: number | null;
  bulkDiscountRate?: number | null;
  category: string;
}

const CART_KEY = "guest_cart";

/**
 * Sepeti localStorage'dan al
 */
export function getCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

/**
 * Sepeti localStorage'a kaydet
 */
function saveCart(cart: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Custom event trigger for cart updates
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Cart save error:", error);
  }
}

/**
 * Sepete ürün ekle veya miktarını arttır
 */
export function addToGuestCart(
  productId: number,
  title: string,
  price: number,
  image: string,
  category?: string,
  quantity: number = 1,
  sizeId?: number | null,
  customImage?: string | null,
  bulkDiscountQty?: number | null,
  bulkDiscountRate?: number | null,
): void {
  const cart = getCart();

  // Aynı ürün + beden + özel resim kombinasyonu var mı kontrol et
  const existingIndex = cart.findIndex(
    (item) =>
      item.productId === productId &&
      item.sizeId === sizeId &&
      item.customImage === customImage,
  );

  if (existingIndex > -1) {
    // Mevcut varsa miktarı arttır
    cart[existingIndex].quantity += quantity;
  } else {
    // Yeni ürün ekle
    cart.push({
      productId,
      title,
      price,
      image,
      quantity,
      category: category ?? "",
      sizeId: sizeId ?? null,
      customImage: customImage ?? null,
      bulkDiscountQty: bulkDiscountQty ?? null,
      bulkDiscountRate: bulkDiscountRate ?? null,
    });
  }

  saveCart(cart);
}

/**
 * Sepetten ürün çıkar
 */
export function removeFromGuestCart(
  productId: number,
  sizeId?: number | null,
  customImage?: string | null,
): void {
  const cart = getCart();
  const filtered = cart.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.sizeId === sizeId &&
        item.customImage === customImage
      ),
  );
  saveCart(filtered);
}

/**
 * Ürün miktarını güncelle (delta ile +/-)
 */
export function updateGuestCartQuantity(
  productId: number,
  delta: number,
  sizeId?: number | null,
  customImage?: string | null,
): void {
  const cart = getCart();
  const item = cart.find(
    (i) =>
      i.productId === productId &&
      i.sizeId === sizeId &&
      i.customImage === customImage,
  );

  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
  }
}

/**
 * Sepeti temizle
 */
export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event("cartUpdated"));
  } catch (error) {
    console.error("Cart clear error:", error);
  }
}

/**
 * Sepetteki toplam ürün sayısını al
 */
export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Sepetteki belirli bir ürünün miktarını al
 */
export function getCartItemQuantity(
  productId: number,
  sizeId?: number | null,
  customImage?: string | null,
): number {
  const cart = getCart();
  const item = cart.find(
    (i) =>
      i.productId === productId &&
      i.sizeId === sizeId &&
      i.customImage === customImage,
  );
  return item ? item.quantity : 0;
}
