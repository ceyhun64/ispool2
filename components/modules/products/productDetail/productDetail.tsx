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
  ShoppingCart,
  Eye,
  Sparkles,
  Upload,
  X,
  ImagePlus,
  Package,
  Award,
  Clock,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomImageZoom } from "./imageZoom";
import ProductTabs from "./productTabs";
import ProductDetailSkeleton from "./productDetailSkeleton";
import { useFavorite } from "@/contexts/favoriteContext";
import { addToGuestCart } from "@/utils/cart";
import Link from "next/link";
import DesignPanel from "@/components/modules/products/productDetail/design/designPanel";
import ProductCard from "../productCard";

interface ProductData {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  discountPercentage: number;
  hasDiscount: boolean;
  discountAmount: number;
  mainImage: string;
  images: string[];
  category: { id: number; name: string };
  middleCategory: { id: number; name: string } | null;
  subCategory: { id: number; name: string } | null;
  brand: { id: number; name: string; image: string | null } | null;
  rating: number;
  reviewCount: number;
  ratingDistribution: { [key: number]: number };
  reviews: Array<{
    id: number;
    rating: number;
    title: string | null;
    comment: string | null;
    createdAt: string;
    user: { name: string; surname: string };
  }>;
  stock: {
    inStock: boolean;
    quantity: number;
    lowStock: boolean;
  };
  shipping: {
    freeShipping: boolean;
    estimatedDelivery: string;
    shippingCost: number;
    expressAvailable: boolean;
    expressDelivery: string;
    expressCost: number;
  };
  specifications: {
    weight: string | null;
    dimensions: string | null;
    material: string | null;
    warranty: string;
    origin: string;
    certifications: string[];
  };
  relatedProducts: Array<{
    id: number;
    title: string;
    price: number;
    oldPrice: number | null;
    mainImage: string;
    category: string;
    brand: string | null;
    hasDiscount: boolean;
  }>;
  brandProducts: Array<{
    id: number;
    title: string;
    price: number;
    oldPrice: number | null;
    mainImage: string;
    category: string;
    hasDiscount: boolean;
  }>;
  meta: {
    views: number;
    favorites: number;
    purchaseCount: number;
    lastUpdated: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams() as { id?: string };
  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customDesign, setCustomDesign] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);

  const { isFavorited, addFavorite, removeFavorite } = useFavorite();
  const cartDropdownRef = useRef<{ open: () => void; refreshCart: () => void }>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
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

  const handleSaveDesign = (designUrl: string) => {
    setCustomDesign(designUrl);
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setActiveIndex(0);
    toast.success("Tasarımınız kaydedildi! Sepete ekleyebilirsiniz.");
  };

  const handleDirectUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen geçerli bir resim dosyası seçin.");
      return;
    }

    setUploadedImage(file);
    setCustomDesign(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImagePreview(e.target?.result as string);
      setActiveIndex(0);
    };
    reader.readAsDataURL(file);

    toast.success("Resim yüklendi! Sepete ekleyebilirsiniz.");
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Yüklenen resim kaldırıldı.");
  };

  const handleRemoveCustomDesign = () => {
    setCustomDesign(null);
    toast.info("Özel tasarım kaldırıldı.");
  };

  const handleAddToCart = async () => {
    if (!product) {
      toast.error("Ürün bilgisi bulunamadı.");
      return;
    }

    const finalCustomImage = customDesign || uploadedImagePreview;

    if (!isLoggedIn) {
      const item = {
        productId: product.id,
        title: finalCustomImage
          ? `${product.title} (Özelleştirilmiş)`
          : product.title,
        price: product.price,
        image: finalCustomImage || product.mainImage,
        customImage: finalCustomImage,
        isCustom: !!finalCustomImage,
        category: product.category.name,
      };

      addToGuestCart(item, quantity);
      toast.success(
        `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi!`,
      );
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", product.id.toString());
      formData.append("quantity", quantity.toString());

      if (customDesign) {
        formData.append("customImage", customDesign);
      } else if (uploadedImage) {
        formData.append("customImageFile", uploadedImage);
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        toast.success(
          `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi!`,
        );
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        cartDropdownRef.current?.open?.();
      } else {
        const error = await res.json();
        toast.error(error.error || "Sepete ekleme hatası.");
      }
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Sepete ekleme hatası.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Bağlantı kopyalandı!");
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Ürün bulunamadı.
      </div>
    );

  const finalCustomImage = customDesign || uploadedImagePreview;
  const displayImages = finalCustomImage
    ? [finalCustomImage, ...product.images]
    : product.images;

  // KDV Hesaplaması (%10)
  const subtotal = product.price * quantity;
  const vatRate = 0.1;
  const vatAmount = subtotal * vatRate;
  const totalWithVat = subtotal + vatAmount;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {showPreview && (
        <DesignPanel
          productImage={product.images[0] || product.mainImage}
          onClose={() => setShowPreview(false)}
          onSaveDesign={handleSaveDesign}
          onDirectUpload={handleDirectUpload}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-6 py-4">
        <nav className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <Link
            href="/products"
            className="hover:text-orange-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={12} /> Koleksiyon
          </Link>
          <ChevronRight size={10} />
          {product.category && (
            <>
              <span className="hover:text-orange-600 transition-colors cursor-pointer">
                {product.category.name}
              </span>
              {product.middleCategory && (
                <>
                  <ChevronRight size={10} />
                  <span className="hover:text-orange-600 transition-colors cursor-pointer">
                    {product.middleCategory.name}
                  </span>
                </>
              )}
              {product.subCategory && (
                <>
                  <ChevronRight size={10} />
                  <span className="hover:text-orange-600 transition-colors cursor-pointer">
                    {product.subCategory.name}
                  </span>
                </>
              )}
              <ChevronRight size={10} />
            </>
          )}
          <span className="text-slate-300">Ürün Detayı</span>
        </nav>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 pb-20 pt-4 md:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-6 flex flex-col lg:flex-row gap-4">
            {/* Thumbnail Gallery - Mobilde yatay (altta), Masaüstünde dikey (solda) */}
            <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[600px] no-scrollbar">
              {/* order-2: Mobilde alta atar | flex: Mobilde yan yana dizer | lg:flex-col: Masaüstünde üste dizer */}
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative w-16 aspect-[3/4] overflow-hidden transition-all border-2 flex-shrink-0 bg-white",
                    activeIndex === i
                      ? "border-orange-600 shadow-md"
                      : "border-transparent opacity-60",
                  )}
                >
                  {i === 0 && finalCustomImage && (
                    <div className="absolute top-0 left-0 bg-orange-600 text-white text-[6px] font-bold px-1 py-0.5 uppercase z-10">
                      Özel
                    </div>
                  )}
                  <Image
                    src={img}
                    alt="Thumb"
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
            {/* Ana Resim - Mobilde üstte, Masaüstünde sağda */}
            <div className="order-1 lg:order-2 flex-1 space-y-4">
              {/* order-1: Mobilde ilk sırada gösterir | lg:order-2: Masaüstünde ikinci sütun yapar */}
              <div className="relative aspect-[3/4] w-full bg-white overflow-hidden border border-slate-100 group shadow-sm">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                  {customDesign ? (
                    <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5 animate-pulse">
                      <Sparkles size={11} /> Tasarım Paneli ile Özelleştirildi
                    </span>
                  ) : uploadedImagePreview ? (
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5">
                      <ImagePlus size={11} /> Özel Resim Yüklendi
                    </span>
                  ) : (
                    <span className="bg-slate-900/90 backdrop-blur text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5">
                      <ShieldCheck size={11} className="text-orange-500" />{" "}
                      Sertifikalı Koruma
                    </span>
                  )}
                  {product.hasDiscount && (
                    <span className="bg-orange-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight">
                      %{product.discountPercentage} İndirim
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 z-20 flex gap-2">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="bg-orange-600 text-white px-3 py-2 text-[10px] sm:px-5 sm:py-3 sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 shadow-xl hover:bg-slate-900 transition-all sm:scale-100 sm:hover:scale-105 sm:active:scale-95 rounded-sm"
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    {customDesign || uploadedImagePreview
                      ? "Yeniden Tasarla"
                      : "Logonu Ekle"}
                  </button>
                </div>

                <CustomImageZoom
                  src={displayImages[activeIndex]}
                  alt={product.title}
                />
              </div>

              {/* Bildirimler Bölümü */}
              <div className="space-y-3">
                {uploadedImagePreview && (
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded">
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                      <ImagePlus size={14} />
                      <span className="font-semibold">Özel resim yüklendi</span>
                    </div>
                    <button
                      onClick={handleRemoveUploadedImage}
                      className="text-blue-600 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {customDesign && (
                  <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-3 rounded">
                    <div className="flex items-center gap-2 text-xs text-orange-700">
                      <Sparkles size={14} />
                      <span className="font-semibold">
                        Tasarım paneli ile özelleştirildi
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCustomDesign}
                      className="text-orange-600 hover:text-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-6 flex flex-col pt-2">
            <div className="space-y-8">
              <header className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[9px] font-bold tracking-widest uppercase text-orange-600 flex items-center gap-2">
                    <span className="bg-orange-50 px-2 py-0.5 rounded text-orange-700">
                      {product.category.name}
                    </span>
                    <span className="text-slate-300">ID: PRO-{product.id}</span>
                  </div>
                  {product.brand && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      {product.brand.image && (
                        <Image
                          src={product.brand.image}
                          alt={product.brand.name}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      )}
                      <span className="font-semibold">
                        {product.brand.name}
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {product.title}
                  {finalCustomImage && (
                    <span className="ml-2 text-sm font-normal text-orange-600">
                      (Özelleştirilmiş)
                    </span>
                  )}
                </h1>

                {/* Rating Section */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < Math.round(product.rating)
                              ? "currentColor"
                              : "none"
                          }
                          className={
                            i < Math.round(product.rating)
                              ? ""
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    ({product.reviewCount} değerlendirme)
                  </span>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock.inStock ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-600">
                        Stokta Var
                      </span>
                      {product.stock.lowStock && (
                        <span className="text-xs text-orange-600 ml-2">
                          (Son {product.stock.quantity} adet!)
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <X size={16} className="text-red-600" />
                      <span className="text-sm font-semibold text-red-600">
                        Stokta Yok
                      </span>
                    </>
                  )}
                </div>
              </header>

              <div className="space-y-6">
                {/* Price Section */}
                <div className="flex flex-col border-t border-b border-slate-100 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black tracking-tighter text-slate-900">
                      {product.price.toLocaleString("tr-TR")}{" "}
                      <small className="text-sm">TL</small>
                    </span>
                    {product.hasDiscount && (
                      <>
                        <span className="text-lg text-slate-400 line-through font-semibold">
                          {product.oldPrice?.toLocaleString("tr-TR")} TL
                        </span>
                        <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                          %{product.discountPercentage} İndirim
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Customization Notice */}
                {finalCustomImage && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 p-4 rounded space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wider">
                      <Sparkles size={14} />
                      Özelleştirilmiş Ürün
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bu ürün{" "}
                      {customDesign
                        ? "tasarım paneliyle"
                        : "yüklediğiniz resimle"}{" "}
                      özelleştirilmiştir. Sepete eklediğinizde bu özel tasarım
                      kaydedilecektir.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "h-12 w-full text-[11px] rounded-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm border",
                      uploadedImagePreview
                        ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-900 hover:bg-slate-50",
                    )}
                  >
                    {uploadedImagePreview ? (
                      <>
                        <BadgeCheck size={16} className="text-orange-600" />
                        Farklı Resim Seç
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="text-slate-500" />
                        Kendi Resmini Yükle
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white h-12 px-4 gap-5 border border-slate-200 rounded-sm">
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
                      disabled={!product.stock.inStock}
                      className={cn(
                        "flex-1 h-12 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2",
                        product.stock.inStock
                          ? "bg-slate-900 text-white hover:bg-orange-600"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed",
                      )}
                    >
                      <ShoppingCart size={14} fill="currentColor" />
                      {product.stock.inStock ? "Sepete Ekle" : "Stokta Yok"}
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
                        "flex-1 h-11 border rounded-sm flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                        isFavorited(product.id)
                          ? "bg-slate-50 border-slate-200 text-slate-900"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      <Heart
                        size={14}
                        className={cn(
                          isFavorited(product.id) &&
                            "fill-orange-500 text-orange-500",
                        )}
                      />
                      {isFavorited(product.id) ? "Listede" : "Listeye Ekle"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-11 h-11 rounded-sm bg-white border border-slate-200 flex items-center justify-center hover:border-orange-600 hover:text-orange-600 transition-all shadow-sm"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Price Summary with KDV */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Ürün Fiyatı ({quantity} adet)
                    </span>
                    <span className="font-bold text-slate-900">
                      {subtotal.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      TL
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      KDV (%10)
                    </span>
                    <span className="font-bold text-slate-900">
                      {vatAmount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      TL
                    </span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Toplam (KDV Dahil)
                    </span>
                    <span className="text-md font-black text-orange-600">
                      {totalWithVat.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      TL
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <Info size={14} className="text-orange-600" /> Ürün
                  Özellikleri
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600">
                      <Award size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Garanti
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {product.specifications.warranty}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600">
                      <BadgeCheck size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Menşei
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {product.specifications.origin}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Sertifikalar
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {product.specifications.certifications.join(", ")}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600">
                      <HardHat size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        İSG Uyumu
                      </div>
                      <div className="text-[10px] text-slate-500">Onaylı</div>
                    </div>
                  </div>
                </div>

                <div
                  className="prose prose-slate max-w-none text-slate-600 text-[13px] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white border border-slate-100 p-4 rounded text-center">
            <div className="flex items-center justify-center text-orange-600 mb-2">
              <Eye size={20} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {product.meta.views}
            </div>
            <div className="text-[7px] md:text-[10px] text-slate-500 uppercase tracking-wider">
              Görüntülenme
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded text-center">
            <div className="flex items-center justify-center text-pink-600 mb-2">
              <Heart size={20} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {product.meta.favorites}
            </div>
            <div className="text-[7px] md:text-[10px] text-slate-500 uppercase tracking-wider">
              Favori
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded text-center">
            <div className="flex items-center justify-center text-emerald-600 mb-2">
              <ShoppingCart size={20} />
            </div>
            <div className="text-lg font-bold text-slate-900">
              {product.meta.purchaseCount}
            </div>
            <div className="text-[7px] md:text-[10px] text-slate-500 uppercase tracking-wider">
              Satıldı
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Benzer Ürünler
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Same Brand Products */}
        {product.brand && product.brandProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                {product.brand.name} Markalı Diğer Ürünler
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {product.brandProducts.map((brandProduct) => (
                <ProductCard key={brandProduct.id} product={brandProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Product Tabs */}
        <div className="mt-12 pt-8 border-t border-slate-100">
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
