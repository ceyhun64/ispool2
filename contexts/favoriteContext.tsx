"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

interface FavoriteContextType {
  favorites: number[];
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorited: (productId: number) => boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Oturum durumu yalnızca mount anında değil, client-side login/logout
  // sonrası da bu fonksiyon yeniden çağrılarak tazelenebilir — aksi halde
  // context router.push sonrası remount olmadığı için "misafir modunda"
  // takılı kalır ve favori ekle/çıkar sunucuya değil localStorage'a yazılır.
  const fetchUserAndFavorites = useCallback(async () => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchUserAndFavorites();
  }, [fetchUserAndFavorites]);

  const addFavorite = useCallback(
    async (productId: number) => {
      if (!user) {
        if (!favorites.includes(productId)) {
          const newFavs = [...favorites, productId];
          setFavorites(newFavs);
          try {
            localStorage.setItem("favorites", JSON.stringify(newFavs));
          } catch (err) {
            console.error("Favoriler kaydedilemedi:", err);
          }
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
    },
    [user, favorites],
  );

  const removeFavorite = useCallback(
    async (productId: number) => {
      if (!user) {
        const newFavs = favorites.filter((id) => id !== productId);
        setFavorites(newFavs);
        try {
          localStorage.setItem("favorites", JSON.stringify(newFavs));
        } catch (err) {
          console.error("Favoriler kaydedilemedi:", err);
        }
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
    },
    [user, favorites],
  );

  const isFavorited = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorited,
      loading,
      refreshSession: fetchUserAndFavorites,
    }),
    [favorites, addFavorite, removeFavorite, isFavorited, loading, fetchUserAndFavorites],
  );

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const ctx = useContext(FavoriteContext);
  if (!ctx) throw new Error("useFavorite must be used inside <FavoriteProvider>");
  return ctx;
};
