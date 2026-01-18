"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Heart,
  Minus,
  Plus,
  Share2,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  HardHat,
  BadgeCheck,
  Star,
  Info,
  ShoppingCart, // Yeni eklendi
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomImageZoom } from "./imageZoom";
import ProductTabs from "./productTabs";
import ProductDetailSkeleton from "./productDetailSkeleton";
import { useFavorite } from "@/contexts/favoriteContext";
import { addToGuestCart } from "@/utils/cart";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams() as { id?: string };
  const productId = Number(params.id);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { isFavorited, addFavorite, removeFavorite } = useFavorite();

  const cartDropdownRef = useRef<{ open: () => void; refreshCart: () => void }>(
    null
  );

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/account/check", {
          credentials: "include",
        });
        if (!res.ok) return setIsLoggedIn(false);
        const data = await res.json();
        setIsLoggedIn(!!data.user?.id);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleAddToCart = async () => {
    if (!product) {
      toast.error("Ürün bilgisi bulunamadı.");
      return;
    }

    const item = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.mainImage,
    };

    if (!isLoggedIn) {
      addToGuestCart(item, quantity);
      toast.success(
        `${quantity} adet ürün sepete eklendi! Toplam: ₺${(
          product.price * quantity
        ).toLocaleString("tr-TR")}`
      );
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, quantity }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          `${quantity} adet ürün sepete eklendi! Toplam: ₺${(
            product.price * quantity
          ).toLocaleString("tr-TR")}`
        );
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        cartDropdownRef.current?.open?.();
        cartDropdownRef.current?.refreshCart?.();
      } else {
        toast.error(data.error || "Sepete eklenemedi");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sepete ekleme sırasında bir hata oluştu.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `${product.title} - İşPool Tasarım`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Paylaşım hatası:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Ürün bağlantısı panoya kopyalandı.");
      } catch (err) {
        toast.error("Bağlantı kopyalanamadı.");
      }
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center italic text-slate-400">
        Ürün bulunamadı.
      </div>
    );

  const images = [
    product.mainImage,
    product.subImage,
    product.subImage2,
    product.subImage3,
    product.subImage4,
  ].filter(Boolean);

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = product.discountPercentage;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <Link
            href="/products"
            className="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Koleksiyon
          </Link>
          <ChevronRight size={10} />
          <span className="text-slate-300">Ürün Detayı</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* SOL: GÖRSEL GALERİSİ */}
          <div className="lg:col-span-7 space-y-4">
            {/* Ana Görsel Kutusu: aspect-square ile tam kare oran sabitlendi */}
            <div className="relative aspect-square w-full bg-white overflow-hidden border border-slate-100 group">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                <span className="bg-slate-900/90 backdrop-blur text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5">
                  <ShieldCheck size={11} className="text-orange-500" />{" "}
                  Sertifikalı Koruma
                </span>
                {hasDiscount && (
                  <span className="bg-orange-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight">
                    %{discountPercentage} İndirim
                  </span>
                )}
              </div>

              {/* CustomImageZoom bileşeninin içindeki img etiketinin object-contain veya object-cover 
        olduğundan emin olun. Ürün görselleri için genelde 'object-contain' (boşluk kalsa da resmi bozmaz) 
        veya 'object-cover' (kareyi tam doldurur) tercih edilir. */}
              <CustomImageZoom
                src={images[activeIndex]}
                alt={product.title}
              />
            </div>

            {/* Küçük Resimler (Thumbnail) */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative w-20 h-20 overflow-hidden transition-all border-2 flex-shrink-0 bg-white",
                    activeIndex === i
                      ? "border-orange-600"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Ürün görseli ${i + 1}`}
                    fill
                    className="object-contain p-1" // Ürün detayını bozmamak için contain
                  />
                </button>
              ))}
            </div>
          </div>
          {/* SAĞ: SATIN ALMA ALANI VE TEKNİK ÖZET */}
          <div className="lg:col-span-5 flex flex-col pt-2">
            <div className="space-y-8">
              <header className="space-y-2">
                <div className="text-[9px] font-bold tracking-widest uppercase text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-50 px-2 py-0.5 rounded text-orange-700">
                    {product.category}
                  </span>
                  <span className="text-slate-300">ID: PRO-{product.id}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <span className="font-medium text-[11px] uppercase tracking-tighter">
                    Saha Testi Onaylı
                  </span>
                </div>
              </header>

              <div className="space-y-6">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tracking-tighter text-slate-900">
                      {product.price.toLocaleString("tr-TR")}{" "}
                      <small className="text-sm font-bold uppercase">TL</small>
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-slate-400 line-through font-semibold">
                        {product.oldPrice.toLocaleString("tr-TR")} TL
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <Truck size={12} /> Hızlı Sevkiyat
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 h-12 px-4 gap-5">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="text-slate-500 hover:text-orange-600 transition-colors"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-4 text-center text-sm font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="text-slate-500 hover:text-orange-600 transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} fill="currentColor" /> Sepete Ekle
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        isFavorited(product.id)
                          ? removeFavorite(product.id)
                          : addFavorite(product.id)
                      }
                      className={cn(
                        "flex-1 h-11 border flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                        isFavorited(product.id)
                          ? "bg-slate-50 border-slate-200 text-slate-900"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <Heart
                        size={14}
                        className={cn(
                          isFavorited(product.id) &&
                            "fill-orange-500 text-orange-500"
                        )}
                      />
                      {isFavorited(product.id) ? "Listede" : "Listeye Ekle"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-11 h-11 bg-white border border-slate-200 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 transition-all"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* YENİ: TEKNİK DETAYLAR ÖZET ALANI */}
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Info size={14} className="text-orange-600" /> Teknik
                  Dökümantasyon
                </div>

                {product.description ? (
                  <div
                    className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-[13px] 
                               [&>ul]:list-none [&>ul]:p-0 [&>ul>li]:flex [&>ul>li]:items-start [&>ul>li]:gap-2 
                               [&>ul>li]:before:content-['✓'] [&>ul>li]:before:text-orange-600 [&>ul>li]:before:font-bold
                               line-clamp-6 overflow-hidden relative"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-[12px] italic text-slate-400">
                    Teknik detaylar yükleniyor...
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600">
                      <BadgeCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-tighter leading-none">
                        Dayanıklılık
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                        Test edilmiş kumaş.
                      </p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600">
                      <HardHat size={16} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-tighter leading-none">
                        İSG Uyumu
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                        %100 Standartlara uygun.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Alanı - Alt kısımda tüm detaylar, yorumlar ve taksitler kalmaya devam eder */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          <ProductTabs
            productId={product.id}
            productTitle={product.title}
            productPrice={product.price}
            productDescription={product.description}
          />
        </div>
      </div>
    </div>
  );
}
