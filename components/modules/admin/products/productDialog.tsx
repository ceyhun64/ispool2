"use client";

import React, { useState, ChangeEvent, forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImagePlus, X, Calculator } from "lucide-react";

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  category: string;
  subCategory?: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  category: string;
  subCategory?: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
}

interface ProductDialogProps {
  onSubmit: (
    formData: ProductFormData,
    mainFile: File | null,
    subFile?: File | null,
    subFile2?: File | null,
    subFile3?: File | null,
    subFile4?: File | null,
    productId?: number
  ) => void;
  product?: Product;
  className?: string;
}

const ProductDialog = forwardRef<HTMLDivElement, ProductDialogProps>(
  ({ onSubmit, product, className }, ref) => {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();

    const [productData, setProductData] = useState<ProductFormData>({
      title: "",
      description: "",
      price: 0,
      oldPrice: undefined,
      discountPercentage: undefined,
      rating: 0,
      reviewCount: 0,
      category: "",
      subCategory: "",
    });

    const [mainFile, setMainFile] = useState<File | null>(null);
    const [sub1, setSub1] = useState<File | null>(null);
    const [sub2, setSub2] = useState<File | null>(null);
    const [sub3, setSub3] = useState<File | null>(null);
    const [sub4, setSub4] = useState<File | null>(null);

    const [mainUrl, setMainUrl] = useState<string | null>(null);
    const [subUrl1, setSubUrl1] = useState<string | null>(null);
    const [subUrl2, setSubUrl2] = useState<string | null>(null);
    const [subUrl3, setSubUrl3] = useState<string | null>(null);
    const [subUrl4, setSubUrl4] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const categories = [
      "Oturma Takımları",
      "Masa Takımları",
      "Salıncak",
      "Şezlong",
      "Şemsiye",
      "Barbekü",
    ];

    useEffect(() => {
      if (product) {
        setProductData({
          title: product.title,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          reviewCount: product.reviewCount || 0,
          category: product.category,
          subCategory: product.subCategory || "",
        });

        setMainFile(null);
        setSub1(null);
        setSub2(null);
        setSub3(null);
        setSub4(null);

        setMainUrl(product.mainImage || null);
        setSubUrl1(product.subImage || null);
        setSubUrl2(product.subImage2 || null);
        setSubUrl3(product.subImage3 || null);
        setSubUrl4(product.subImage4 || null);

        setOpen(true);
      } else {
        resetForm();
      }
    }, [product]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setProductData((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "oldPrice" ||
          name === "rating" ||
          name === "reviewCount" ||
          name === "discountPercentage"
            ? value === ""
              ? name === "oldPrice" || name === "discountPercentage"
                ? undefined
                : 0
              : Number(value)
            : value,
      }));
    };

    // Otomatik indirim yüzdesi hesaplama
    const calculateDiscount = () => {
      const { price, oldPrice } = productData;
      if (oldPrice && oldPrice > price && price > 0) {
        const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
        setProductData((prev) => ({ ...prev, discountPercentage: discount }));
      }
    };

    // Eski fiyattan otomatik yeni fiyat hesaplama
    const calculatePriceFromDiscount = () => {
      const { oldPrice, discountPercentage } = productData;
      if (
        oldPrice &&
        discountPercentage &&
        discountPercentage > 0 &&
        discountPercentage < 100
      ) {
        const newPrice = Math.round(oldPrice * (1 - discountPercentage / 100));
        setProductData((prev) => ({ ...prev, price: newPrice }));
      }
    };

    const handleFile = (
      e: ChangeEvent<HTMLInputElement>,
      setFile: (file: File | null) => void
    ) => {
      const file = e.target.files?.[0] || null;
      setFile(file);
    };

    const resetForm = () => {
      setProductData({
        title: "",
        description: "",
        price: 0,
        oldPrice: undefined,
        discountPercentage: undefined,
        rating: 0,
        reviewCount: 0,
        category: "",
        subCategory: "",
      });
      setMainFile(null);
      setSub1(null);
      setSub2(null);
      setSub3(null);
      setSub4(null);
      setMainUrl(null);
      setSubUrl1(null);
      setSubUrl2(null);
      setSubUrl3(null);
      setSubUrl4(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!productData.title || !productData.category) return;

      setLoading(true);
      onSubmit(productData, mainFile, sub1, sub2, sub3, sub4, product?.id);
      setLoading(false);
      resetForm();
      setOpen(false);
    };

    const preview = (file: File | null, url?: string | null) => {
      if (file) return URL.createObjectURL(file);
      return url || null;
    };

    const removeImage = (
      setter: (file: File | null) => void,
      urlSetter: (url: string | null) => void
    ) => {
      setter(null);
      urlSetter(null);
    };

    const ImagePreview = ({
      file,
      url,
      label,
      onRemove,
    }: {
      file: File | null;
      url: string | null;
      label: string;
      onRemove: () => void;
    }) => {
      const previewUrl = preview(file, url);

      return (
        <div className="relative group">
          <div className="relative w-full aspect-[16/9]  overflow-hidden border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all bg-slate-50">
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={onRemove}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImagePlus size={24} className="mb-2" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        {!product && (
          <Button
            className={`bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105  ${className}`}
            onClick={() => setOpen(true)}
          >
            <ImagePlus size={18} className="mr-2" />
            Yeni Ürün Ekle
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-gray-900 max-w-7xl w-[95vw] sm:w-[90vw]  shadow-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
            <DialogHeader className="space-y-3 pb-4 border-b border-slate-100">
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                {product ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Ürün bilgilerini ve görsellerini ekleyerek kataloğunuzu
                zenginleştirin
              </p>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6 sm:space-y-8"
            >
              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Column - Form Inputs */}
                <div className="space-y-5 order-2 lg:order-1">
                  <div className="bg-gradient-to-br from-slate-50 to-white p-5 sm:p-6  border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-600 "></div>
                      Ürün Bilgileri
                    </h3>

                    <InputGroup
                      label="Ürün Adı"
                      value={productData.title}
                      name="title"
                      onChange={handleChange}
                      placeholder="Örn: Premium Bahçe Oturma Takımı"
                      required
                    />

                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Açıklama
                      </Label>
                      <textarea
                        name="description"
                        value={productData.description}
                        onChange={(e) =>
                          setProductData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Ürün hakkında detaylı açıklama yazın..."
                        className="w-full min-h-[100px] px-4 py-3  border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
                      />
                    </div>

                    {/* Fiyat ve İndirim Bölümü */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-amber-50 to-white  border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator size={16} className="text-amber-600" />
                        <h4 className="text-sm font-semibold text-slate-700">
                          Fiyatlandırma & İndirim
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputGroup
                          label="Güncel Fiyat (₺)"
                          value={productData.price}
                          name="price"
                          onChange={handleChange}
                          type="number"
                          min={0}
                          step="any"
                          placeholder="0.00"
                          required
                        />
                        <InputGroup
                          label="Eski Fiyat (₺)"
                          value={productData.oldPrice ?? ""}
                          name="oldPrice"
                          onChange={handleChange}
                          onBlur={calculateDiscount}
                          type="number"
                          min={0}
                          step="any"
                          placeholder="İndirim varsa girin"
                        />
                      </div>

                      <div className="relative">
                        <InputGroup
                          label="İndirim Yüzdesi (%)"
                          value={productData.discountPercentage ?? ""}
                          name="discountPercentage"
                          onChange={handleChange}
                          onBlur={calculatePriceFromDiscount}
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Otomatik hesaplanır"
                        />
                        {productData.oldPrice && productData.price > 0 && (
                          <button
                            type="button"
                            onClick={calculateDiscount}
                            className="absolute right-2 top-8 text-xs bg-indigo-100 text-indigo-700 px-3 py-1  hover:bg-indigo-200 transition-colors"
                          >
                            Hesapla
                          </button>
                        )}
                      </div>

                      {productData.oldPrice &&
                        productData.price > 0 &&
                        productData.oldPrice > productData.price && (
                          <div className="text-xs text-green-700 bg-green-50 p-2  border border-green-200">
                            ✓ İndirim:{" "}
                            {productData.oldPrice.toLocaleString("tr-TR")} TL →{" "}
                            {productData.price.toLocaleString("tr-TR")} TL
                            {productData.discountPercentage &&
                              ` (-%${productData.discountPercentage})`}
                          </div>
                        )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Kategori
                      </Label>
                      <Select
                        value={productData.category}
                        onValueChange={(val) =>
                          setProductData((prev) => ({
                            ...prev,
                            category: val,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full h-11  border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                        <SelectContent className="">
                          {categories.map((cat) => (
                            <SelectItem
                              key={cat}
                              value={cat}
                              className=""
                            >
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image Previews (Horizontal Layout) */}
                <div className="space-y-4 order-1 lg:order-2">
                  <div className="bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6  border border-indigo-100 shadow-sm">
                    <h3 className="font-semibold text-slate-900 text-lg mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-600 "></div>
                      Ürün Görselleri
                    </h3>

                    {/* Main Image - Full Width */}
                    <div className="mb-4">
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Ana Görsel
                      </Label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFile(e, setMainFile)}
                        className="hidden"
                        id="main-image"
                      />
                      <label
                        htmlFor="main-image"
                        className="cursor-pointer block"
                      >
                        <ImagePreview
                          file={mainFile}
                          url={mainUrl}
                          label="Ana Görsel Ekle"
                          onRemove={() => removeImage(setMainFile, setMainUrl)}
                        />
                      </label>
                    </div>

                    {/* Sub Images - Horizontal Grid */}
                    <div>
                      <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                        Ek Görseller (Yatay)
                      </Label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                        {[
                          {
                            file: sub1,
                            setter: setSub1,
                            url: subUrl1,
                            urlSetter: setSubUrl1,
                            id: "sub1",
                          },
                          {
                            file: sub2,
                            setter: setSub2,
                            url: subUrl2,
                            urlSetter: setSubUrl2,
                            id: "sub2",
                          },
                          {
                            file: sub3,
                            setter: setSub3,
                            url: subUrl3,
                            urlSetter: setSubUrl3,
                            id: "sub3",
                          },
                          {
                            file: sub4,
                            setter: setSub4,
                            url: subUrl4,
                            urlSetter: setSubUrl4,
                            id: "sub4",
                          },
                        ].map(({ file, setter, url, urlSetter, id }, index) => (
                          <div key={id}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFile(e, setter)}
                              className="hidden"
                              id={id}
                            />
                            <label
                              htmlFor={id}
                              className="cursor-pointer block"
                            >
                              <ImagePreview
                                file={file}
                                url={url}
                                label={`#${index + 1}`}
                                onRemove={() => removeImage(setter, urlSetter)}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Preview Card - Only on Desktop */}
                  {!isMobile && (mainFile || mainUrl || productData.title) && (
                    <div className="hidden lg:block bg-white p-6  border border-slate-200 shadow-lg">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Önizleme
                      </h3>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-slate-900 line-clamp-2">
                          {productData.title || "Ürün Adı"}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {productData.description || "Açıklama girilmedi"}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-indigo-600">
                                {productData.price > 0
                                  ? `₺${productData.price.toLocaleString(
                                      "tr-TR"
                                    )}`
                                  : "Fiyat belirtilmedi"}
                              </span>
                              {productData.oldPrice &&
                                productData.oldPrice > productData.price && (
                                  <span className="text-sm text-slate-400 line-through">
                                    ₺
                                    {productData.oldPrice.toLocaleString(
                                      "tr-TR"
                                    )}
                                  </span>
                                )}
                            </div>
                            {productData.discountPercentage &&
                              productData.discountPercentage > 0 && (
                                <span className="text-xs font-bold text-amber-600">
                                  -%{productData.discountPercentage}
                                </span>
                              )}
                          </div>
                          {productData.category && (
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700  text-xs font-semibold">
                              {productData.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  className="flex-1 sm:flex-none  border-slate-300 hover:bg-slate-50 font-semibold h-11"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={
                    loading || !productData.title || !productData.category
                  }
                  className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg shadow-indigo-200  h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin"></div>
                      {product ? "Güncelleniyor..." : "Ekleniyor..."}
                    </span>
                  ) : (
                    <>{product ? "Güncelle" : "Ekle"}</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ProductDialog.displayName = "ProductDialog";

const InputGroup = ({ label, ...props }: any) => (
  <div>
    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
      {label}
    </Label>
    <Input
      className="w-full h-11  border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
      {...props}
    />
  </div>
);

export default ProductDialog;
