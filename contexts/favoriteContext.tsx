"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FavoriteContextType {
  favorites: number[];
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorited: (productId: number) => boolean;
  loading: boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const res = await fetch("/api/account/check");
        const data = await res.json();
        setUser(data.user || null);

        if (data.user) {
          const favRes = await fetch("/api/favorites", { credentials: "include" });
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavorites(favData.map((f: { productId: number }) => f.productId));
          }
        } else {
          const localFavs: number[] = JSON.parse(localStorage.getItem("favorites") || "[]");
          setFavorites(localFavs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, []);

  const addFavorite = async (productId: number) => {
    if (!user) {
      if (!favorites.includes(productId)) {
        const newFavs = [...favorites, productId];
        setFavorites(newFavs);
        localStorage.setItem("favorites", JSON.stringify(newFavs));
      }
      return;
    }

    try {
      if (!favorites.includes(productId)) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
          credentials: "include",
        });
        setFavorites([...favorites, productId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (productId: number) => {
    if (!user) {
      const newFavs = favorites.filter((id) => id !== productId);
      setFavorites(newFavs);
      localStorage.setItem("favorites", JSON.stringify(newFavs));
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await fetch(`/api/favorites/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        setFavorites(favorites.filter((id) => id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isFavorited = (productId: number) => favorites.includes(productId);

  return (
    <FavoriteContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorited, loading }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error("useFavorite must be used inside <FavoriteProvider>");
  return ctx;
};
