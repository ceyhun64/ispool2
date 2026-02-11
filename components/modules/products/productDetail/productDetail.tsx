"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  Sparkles,
  Info,
  Eye,
  ShoppingCart,
  Award,
  BadgeCheck,
  ShieldCheck,
  HardHat,
  TrendingUp,
  Users,
  Percent,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import ProductTabs from "./productTabs";
import ProductDetailSkeleton from "./productDetailSkeleton";
import { useFavorite } from "@/contexts/favoriteContext";
import { addToGuestCart } from "@/utils/cart";
import DesignPanel from "@/components/modules/products/productDetail/design/designPanel";
import ProductCard from "../productCard";
import ProductImageGallery from "./productImageGallery";
import ProductInfo from "./productInfo";
import ProductVariantSelector from "./productVariantSelector";
import ProductActions from "./productActions";

// --------------------
// İNTERFACES
// --------------------
interface Size {
  id: number;
  value: string;
  type: string;
  sortOrder: number;
}

interface StockEntry {
  id: number;
  sizeId: number | null;
  stock: number;
  priceModifier: number;
}

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
  color: { id: number; name: string; hexCode: string } | null;
  productGroupId: string | null;
  otherColors: Array<{
    id: number;
    title: string;
    price: number;
    oldPrice: number | null;
    mainImage: string;
    color: { id: number; name: string; hexCode: string } | null;
    hasDiscount: boolean;
    discountPercentage: number;
  }>;
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
  stock: { inStock: boolean; quantity: number; lowStock: boolean };
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
  availableSizes: Size[];
  stockMatrix: StockEntry[];
  bulkDiscountQty: number | null;
  bulkDiscountRate: number | null;
}

export default function ProductDetailPage() {
  const params = useParams() as { id?: string };
  const router = useRouter();
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

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockEntry | null>(null);

  const { isFavorited, addFavorite, removeFavorite } = useFavorite();
  const cartDropdownRef = useRef<{ open: () => void; refreshCart: () => void }>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------- Ürün yükleme ----------
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        console.log("productId", data);
        if (data.success) {
          setProduct(data.product);
          setSelectedSizeId(null);
          setSelectedStock(null);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Ürün yükleme hatası:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  // ---------- Seçili stok satırını güncelle ----------
  useEffect(() => {
    if (!product) {
      setSelectedStock(null);
      return;
    }

    if (product.availableSizes.length > 0) {
      if (selectedSizeId) {
        const entry =
          product.stockMatrix.find((s) => s.sizeId === selectedSizeId) ?? null;
        setSelectedStock(entry);
      } else {
        setSelectedStock(null);
      }
    } else {
      const entry = product.stockMatrix.find((s) => s.sizeId === null) ?? null;
      setSelectedStock(entry);
    }
  }, [selectedSizeId, product]);

  // ---------- Login kontrolü ----------
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

  // ─────────────────────────────────────────────────────────────────────────
  // ─── TOPLU ALIM İNDİRİMİ HESAPLAMA ──────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────
  const calculateBulkDiscount = () => {
    if (!product) return { hasDiscount: false, discountRate: 0 };

    const { bulkDiscountQty, bulkDiscountRate } = product;

    if (
      !bulkDiscountQty ||
      !bulkDiscountRate ||
      bulkDiscountQty <= 0 ||
      bulkDiscountRate <= 0
    ) {
      return { hasDiscount: false, discountRate: 0 };
    }

    if (quantity >= bulkDiscountQty) {
      return { hasDiscount: true, discountRate: bulkDiscountRate };
    }

    return { hasDiscount: false, discountRate: 0 };
  };

  // ---------- Handlers ----------
  const handleSaveDesign = (designUrl: string) => {
    setCustomDesign(designUrl);
    setUploadedImage(null);
    setUploadedImagePreview(null);
    setActiveIndex(0);
    toast.success("Tasarımınız kaydedildi! Sepete ekleyebilirsiniz.");
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

  const handleAddToCart = async () => {
    if (!product) {
      toast.error("Ürün bilgisi bulunamadı.");
      return;
    }

    if (product.availableSizes.length > 0 && !selectedSizeId) {
      toast.error("Lütfen bir beden seçin.");
      return;
    }

    if (selectedStock && selectedStock.stock <= 0) {
      toast.error("Seçilen beden stokta yok.");
      return;
    }

    const finalCustomImage = customDesign || uploadedImagePreview;

    const bulkDiscount = calculateBulkDiscount();
    let basePrice = product.price + (selectedStock?.priceModifier ?? 0);

    if (bulkDiscount.hasDiscount) {
      basePrice = basePrice * (1 - bulkDiscount.discountRate / 100);
    }

    const finalPrice = basePrice;

    if (!isLoggedIn) {
      addToGuestCart(
        product.id,
        finalCustomImage ? `${product.title} (Özelleştirilmiş)` : product.title,
        finalPrice,
        finalCustomImage || product.mainImage,
        product.category.name,
        quantity,
        selectedSizeId,
        finalCustomImage,
        product.bulkDiscountQty,
        product.bulkDiscountRate,
      );

      const message = bulkDiscount.hasDiscount
        ? `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi! 🎉 %${bulkDiscount.discountRate} toplu alım indirimi uygulandı!`
        : `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi!`;

      toast.success(message);
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", product.id.toString());
      formData.append("quantity", quantity.toString());
      if (selectedSizeId) formData.append("sizeId", selectedSizeId.toString());
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
        const message = bulkDiscount.hasDiscount
          ? `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi! 🎉 %${bulkDiscount.discountRate} toplu alım indirimi uygulandı!`
          : `${quantity} adet ${finalCustomImage ? "özelleştirilmiş " : ""}ürün sepete eklendi!`;

        toast.success(message);
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
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Bağlantı kopyalandı!");
    }
  };

  // ---------- Render ----------
  if (loading) return <ProductDetailSkeleton />;
  if (!product)
    return (
      <div className="h-screen flex items-center justify-center">
        Ürün bulunamadı.
      </div>
    );

  const finalCustomImage = customDesign || uploadedImagePreview;
  const bulkDiscount = calculateBulkDiscount();

  let currentPrice = product.price + (selectedStock?.priceModifier ?? 0);
  if (bulkDiscount.hasDiscount) {
    currentPrice = currentPrice * (1 - bulkDiscount.discountRate / 100);
  }

  const subtotal = currentPrice * quantity;
  const vatAmount = subtotal * 0.1;
  const totalWithVat = subtotal + vatAmount;

  const remainingForBulk = product.bulkDiscountQty
    ? Math.max(0, product.bulkDiscountQty - quantity)
    : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {showPreview && (
        <DesignPanel
          productImage={product.images[0] || product.mainImage}
          onClose={() => setShowPreview(false)}
          onSaveDesign={handleSaveDesign}
          onDirectUpload={() => fileInputRef.current?.click()}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="mx-auto px-6 pb-20 pt-4 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Galeri */}
          <div className="lg:col-span-6 h-fit">
            <ProductImageGallery
              images={product.images}
              activeIndex={activeIndex}
              onIndexChange={setActiveIndex}
              customDesign={customDesign}
              uploadedImagePreview={uploadedImagePreview}
              hasDiscount={product.hasDiscount}
              discountPercentage={product.discountPercentage}
              onShowPreview={() => setShowPreview(true)}
              onRemoveCustomDesign={() => {
                setCustomDesign(null);
                toast.info("Özel tasarım kaldırıldı.");
              }}
              onRemoveUploadedImage={() => {
                setUploadedImage(null);
                setUploadedImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                toast.info("Yüklenen resim kaldırıldı.");
              }}
              productTitle={product.title}
            />
          </div>

          {/* Ürün Bilgileri */}
          <div className="lg:col-span-6 flex flex-col pt-2">
            <div className="space-y-8">
              <ProductInfo
                id={product.id}
                title={product.title}
                category={product.category}
                middleCategory={product.middleCategory}
                subCategory={product.subCategory}
                brand={product.brand}
                rating={product.rating}
                reviewCount={product.reviewCount}
                currentPrice={currentPrice}
                oldPrice={product.oldPrice}
                hasDiscount={product.hasDiscount}
                discountPercentage={product.discountPercentage}
                inStock={product.stock.inStock}
                lowStock={product.stock.lowStock}
                stockQuantity={product.stock.quantity}
                hasCustomImage={!!finalCustomImage}
                selectedStock={selectedStock}
              />

              <div className="space-y-6">
                {/* ─── DİĞER RENK SEÇENEKLERİ ─── */}
                {product.productGroupId && product.otherColors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Palette size={16} className="text-purple-600" />
                      <label className="text-sm font-bold text-slate-900">
                        Diğer Renk Seçenekleri
                        {product.color && (
                          <span className="ml-2 text-purple-600">
                            (Mevcut: {product.color.name})
                          </span>
                        )}
                      </label>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {/* Mevcut ürün */}
                      <button
                        className="relative group border-2 border-purple-600 bg-purple-50 rounded-lg p-2 cursor-default"
                        title={product.color?.name || "Mevcut Renk"}
                      >
                        <div className="aspect-square rounded overflow-hidden bg-white mb-2">
                          <img
                            src={product.mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {product.color && (
                          <div className="flex items-center gap-1 justify-center">
                            <div
                              className="w-4 h-4 rounded-full border border-slate-300"
                              style={{ backgroundColor: product.color.hexCode }}
                            />
                            <span className="text-[10px] font-semibold text-purple-700">
                              Seçili
                            </span>
                          </div>
                        )}
                      </button>

                      {/* Diğer renkler */}
                      {product.otherColors.map((colorOption) => (
                        <button
                          key={colorOption.id}
                          onClick={() =>
                            router.push(`/product/${colorOption.id}`)
                          }
                          className="relative group border-2 border-slate-200 hover:border-purple-400 rounded-lg p-2 transition-all"
                          title={colorOption.color?.name || colorOption.title}
                        >
                          <div className="aspect-square rounded overflow-hidden bg-white mb-2">
                            <img
                              src={colorOption.mainImage}
                              alt={colorOption.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          {colorOption.color && (
                            <div className="flex items-center gap-1 justify-center">
                              <div
                                className="w-4 h-4 rounded-full border border-slate-300"
                                style={{
                                  backgroundColor: colorOption.color.hexCode,
                                }}
                              />
                              <span className="text-[10px] font-medium text-slate-600 truncate max-w-[60px]">
                                {colorOption.color.name}
                              </span>
                            </div>
                          )}
                          {colorOption.hasDiscount && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                              -{colorOption.discountPercentage}%
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beden Seçimi */}
                <ProductVariantSelector
                  availableSizes={product.availableSizes}
                  stockMatrix={product.stockMatrix}
                  selectedSizeId={selectedSizeId}
                  selectedStock={selectedStock}
                  onSizeChange={setSelectedSizeId}
                />

                {/* Özelleştirme bildirim */}
                {finalCustomImage && (
                  <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 p-4 rounded space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wider">
                      <Sparkles size={14} /> Özelleştirilmiş Ürün
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

                {/* Toplu alım indirimi bildirimi */}
                {product.bulkDiscountQty !== null &&
                  product.bulkDiscountRate !== null &&
                  product.bulkDiscountQty > 0 &&
                  product.bulkDiscountRate > 0 && (
                    <div
                      className={`border p-4 rounded space-y-2 ${
                        bulkDiscount.hasDiscount
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
                          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <Percent
                          size={14}
                          className={
                            bulkDiscount.hasDiscount
                              ? "text-emerald-700"
                              : "text-blue-700"
                          }
                        />
                        <span
                          className={
                            bulkDiscount.hasDiscount
                              ? "text-emerald-700"
                              : "text-blue-700"
                          }
                        >
                          {bulkDiscount.hasDiscount
                            ? `🎉 Toplu Alım İndirimi Uygulandı! %${bulkDiscount.discountRate}`
                            : `Toplu Alım Fırsatı`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bulkDiscount.hasDiscount ? (
                          <>
                            Bu üründen {product.bulkDiscountQty} adet ve üzeri
                            alımlarda{" "}
                            <strong>%{product.bulkDiscountRate}</strong> indirim
                            kazanıyorsunuz! Sepetinizdeki{" "}
                            <strong>{quantity} adet</strong> için indirim
                            uygulandı.
                          </>
                        ) : (
                          <>
                            Bu üründen{" "}
                            <strong>{product.bulkDiscountQty} adet</strong> ve
                            üzeri alımlarda{" "}
                            <strong>%{product.bulkDiscountRate} indirim</strong>{" "}
                            kazanın!
                            {remainingForBulk > 0 && (
                              <>
                                {" "}
                                Toplu alım için{" "}
                                <strong className="text-blue-700">
                                  {remainingForBulk} adet
                                </strong>{" "}
                                daha ekleyin.
                              </>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  )}

                {/* Aksiyon Butonları */}
                <ProductActions
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={() =>
                    isFavorited(product.id)
                      ? removeFavorite(product.id)
                      : addFavorite(product.id)
                  }
                  onShare={handleShare}
                  onUploadImage={() => fileInputRef.current?.click()}
                  isFavorited={isFavorited(product.id)}
                  hasUploadedImage={!!uploadedImagePreview}
                  inStock={product.stock.inStock}
                  sizeStockAvailable={!selectedStock || selectedStock.stock > 0}
                />

                {/* Fiyat Özeti */}
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
                  {bulkDiscount.hasDiscount && (
                    <div className="flex justify-between text-sm bg-emerald-50 -mx-4 px-4 py-2">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Percent size={14} />
                        Toplu Alım İndirimi (%{bulkDiscount.discountRate})
                      </span>
                      <span className="font-bold text-emerald-700">
                        -
                        {(
                          (product.price +
                            (selectedStock?.priceModifier ?? 0)) *
                          quantity *
                          (bulkDiscount.discountRate / 100)
                        ).toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        TL
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">KDV (%10)</span>
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

              {/* Özellikler */}
              <div className="flex">
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
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-3 mt-8">
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

        {/* İlgili Ürünler */}
        {product.relatedProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={20} className="text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                Benzer Ürünler
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

        {/* Marka Ürünleri */}
        {product.brand && product.brandProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <Users size={20} className="text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                {product.brand.name} Markalı Diğer Ürünler
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {product.brandProducts.map((bp) => (
                <ProductCard key={bp.id} product={bp} />
              ))}
            </div>
          </div>
        )}

        {/* Sekmeleri */}
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
