"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

  const fetchCart = async () => {
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
  };

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
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
  };

  const removeFromCart = async (id: number) => {
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
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, fetchCart, addToCart, removeFromCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
