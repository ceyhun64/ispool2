// utils/cart.ts
export interface GuestCartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  sizeId?: number | null; // ← Beden ID (schema CartItem.sizeId)
  customImage?: string | null; // Özel resim URL / base64
  isCustom?: boolean; // Özelleştirilmiş mi
}

const CART_KEY = "guestCart";

// ---------------------------------------------------------------------------
// İki sepet satırı "aynı ürün" mü?
//   → productId  +  sizeId  +  isCustom/customImage üçlüsü eşleşmeli
// ---------------------------------------------------------------------------
function isSameItem(
  a: GuestCartItem,
  b: Pick<GuestCartItem, "productId" | "sizeId" | "customImage" | "isCustom">,
) {
  if (a.productId !== b.productId) return false;
  if ((a.sizeId ?? null) !== (b.sizeId ?? null)) return false;

  // Özel resim kontrolü: her iki taraf da özel → URL eşleşmeli,
  //   biri özel diğeri değilse → farklı satır
  if (a.isCustom && b.isCustom) return a.customImage === b.customImage;
  return !a.isCustom && !b.isCustom;
}

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------
export const getCart = (): GuestCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: GuestCartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------
export const addToGuestCart = (
  product: Omit<GuestCartItem, "quantity">,
  quantity = 1,
) => {
  const cart = getCart();
  const existing = cart.find((item) => isSameItem(item, product));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
};

export const updateGuestCartQuantity = (
  productId: number,
  delta: number,
  sizeId?: number | null,
  customImage?: string | null,
) => {
  const cart = getCart();
  const index = cart.findIndex((item) =>
    isSameItem(item, {
      productId,
      sizeId: sizeId ?? null,
      customImage,
      isCustom: !!customImage,
    }),
  );

  if (index !== -1) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
  }
};

export const removeFromGuestCart = (
  productId: number,
  sizeId?: number | null,
  customImage?: string | null,
) => {
  const cart = getCart();
  const newCart = cart.filter(
    (item) =>
      !isSameItem(item, {
        productId,
        sizeId: sizeId ?? null,
        customImage,
        isCustom: !!customImage,
      }),
  );
  saveCart(newCart);
};

// ---------------------------------------------------------------------------
// Readers
// ---------------------------------------------------------------------------
export const getGuestCartCount = (): number => {
  if (typeof window === "undefined") return 0;
  return getCart().length;
};

export const getGuestCartTotalItems = (): number => {
  if (typeof window === "undefined") return 0;
  return getCart().reduce((t, i) => t + i.quantity, 0);
};

export const getGuestCartTotal = (): number => {
  if (typeof window === "undefined") return 0;
  return getCart().reduce((t, i) => t + i.price * i.quantity, 0);
};

export const clearGuestCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};
