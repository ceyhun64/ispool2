"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  pricePerM2: number;
  mainImage: string;
  category: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  m2?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", { credentials: "include" });
      const data = await res.json();
      setCartItems(data);
    } catch (err) {
      console.error("Sepet yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = React.useCallback(
    async (productId: number, quantity = 1) => {
      try {
        const fd = new FormData();
        fd.append("productId", String(productId));
        fd.append("quantity", String(quantity));
        const res = await fetch("/api/cart", {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        if (res.ok) {
          toast.success("Ürün sepete eklendi!");
          fetchCart(); // 🔄 Anında güncelle
        } else {
          toast.error("Sepete eklenemedi");
        }
      } catch {
        toast.error("Bağlantı hatası");
      }
    },
    [fetchCart],
  );

  const removeFromCart = React.useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      toast.error("Ürün silinemedi");
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const value = useMemo(
    () => ({ cartItems, fetchCart, addToCart, removeFromCart, loading }),
    [cartItems, fetchCart, addToCart, removeFromCart, loading],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
