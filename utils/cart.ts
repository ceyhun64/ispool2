// utils/cart.ts

export interface GuestCartItem {
  productId: number;
  title: string;
  price: number; // Prisma modelinizde 'Int price' olduğu için buna uyarladık
  image: string;
  quantity: number;
  category?: string;
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
    // Navbar gibi bileşenlerin anlık güncellenmesi için custom event tetikler
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};

// Sepete ürün ekle
export const addToGuestCart = (
  product: Omit<GuestCartItem, "quantity">,
  quantity = 1
) => {
  const cart = getCart();
  const existing = cart.find((item) => item.productId === product.productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  saveCart(cart);
};

// Sepetteki ürün miktarını güncelle (+1 veya -1 için delta kullanılır)
export const updateGuestCartQuantity = (productId: number, delta: number) => {
  const cart = getCart();
  const index = cart.findIndex((c) => c.productId === productId);

  if (index !== -1) {
    cart[index].quantity = Math.max(1, cart[index].quantity + delta);
    saveCart(cart);
  }
};

// Sepetten ürün çıkar
export const removeFromGuestCart = (productId: number) => {
  const newCart = getCart().filter((c) => c.productId !== productId);
  saveCart(newCart);
};

// Sepetteki toplam ürün çeşidi sayısını getir
export const getGuestCartCount = (): number => {
  if (typeof window === "undefined") return 0;
  const cart = getCart();
  return cart.length;
};

// Sepeti tamamen temizle
export const clearGuestCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }
};
