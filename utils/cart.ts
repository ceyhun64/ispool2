// utils/cart.ts
export interface GuestCartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  customImage?: string | null; // Özelleştirilmiş resim URL'si (base64 veya cloudinary URL)
  isCustom?: boolean; // Ürünün özelleştirilmiş olup olmadığını belirtir
}

const CART_KEY = "guestCart";

// Sepeti getir
export const getCart = (): GuestCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Sepet okunurken hata oluştu:", error);
    return [];
  }
};

// Sepeti kaydet ve diğer bileşenleri bilgilendir
export const saveCart = (cart: GuestCartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};

// Sepete ürün ekle (özelleştirilmiş ürünler için destek)
export const addToGuestCart = (
  product: Omit<GuestCartItem, "quantity">,
  quantity = 1,
) => {
  const cart = getCart();

  // Özelleştirilmiş ürünler için aynı productId + aynı customImage kontrolü
  const existing = cart.find((item) => {
    if (product.isCustom && product.customImage) {
      // Özelleştirilmiş ürün: hem ID hem de customImage eşleşmeli
      return (
        item.productId === product.productId &&
        item.customImage === product.customImage &&
        item.isCustom === true
      );
    }
    // Normal ürün: sadece ID eşleşmeli ve özelleştirilmiş olmamalı
    return item.productId === product.productId && !item.isCustom;
  });

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
};

// Sepetteki ürün miktarını güncelle
export const updateGuestCartQuantity = (
  productId: number,
  delta: number,
  customImage?: string | null,
) => {
  const cart = getCart();

  const index = cart.findIndex((item) => {
    // Özelleştirilmiş ürünler için hem ID hem customImage kontrolü
    if (customImage) {
      return (
        item.productId === productId &&
        item.customImage === customImage &&
        item.isCustom === true
      );
    }
    // Normal ürünler için sadece ID kontrolü ve özelleştirilmiş olmama kontrolü
    return item.productId === productId && !item.isCustom;
  });

  if (index !== -1) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
  }
};

// Sepetten ürün çıkar
export const removeFromGuestCart = (
  productId: number,
  customImage?: string | null,
) => {
  const cart = getCart();

  const newCart = cart.filter((item) => {
    // Özelleştirilmiş ürünler için hem ID hem customImage kontrolü
    if (customImage) {
      return !(
        item.productId === productId &&
        item.customImage === customImage &&
        item.isCustom === true
      );
    }
    // Normal ürünler için sadece ID kontrolü ve özelleştirilmiş olmama kontrolü
    return !(item.productId === productId && !item.isCustom);
  });

  saveCart(newCart);
};

// Sepetteki toplam ürün çeşidi sayısını getir
export const getGuestCartCount = (): number => {
  if (typeof window === "undefined") return 0;
  const cart = getCart();
  return cart.length;
};

// Sepetteki toplam ürün adedini getir (adet bazlı)
export const getGuestCartTotalItems = (): number => {
  if (typeof window === "undefined") return 0;
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

// Sepetteki toplam tutarı hesapla
export const getGuestCartTotal = (): number => {
  if (typeof window === "undefined") return 0;
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Sepeti tamamen temizle
export const clearGuestCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};
