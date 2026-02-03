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
import { ImagePlus, X, Calculator, Loader2, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ProductVariant {
  sizeId: number | null;
  stock: number;
  priceModifier?: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brandId?: number;
  hasVariants: boolean;
  sizes: { sizeId: number }[];
  stock: ProductVariant[];
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
  middleCategory?: string;
  subCategory?: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  brandId?: number;
  hasVariants?: boolean;
}

interface ProductDialogProps {
  onSubmit: (
    formData: ProductFormData,
    mainFile: File | null,
    subFile?: File | null,
    subFile2?: File | null,
    subFile3?: File | null,
    subFile4?: File | null,
    productId?: number,
  ) => void;
  product?: Product;
  className?: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Size {
  id: number;
  value: string;
  type: string;
  sortOrder: number;
  isActive?: boolean;
}

interface SubCategory {
  id: number;
  name: string;
}

interface MiddleCategory {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

interface Category {
  id: number;
  name: string;
  middleCategories: MiddleCategory[];
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
      middleCategory: "",
      subCategory: "",
      brandId: undefined,
      hasVariants: false,
      sizes: [],
      stock: [],
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
    const [dataLoading, setDataLoading] = useState(true);

    // Dinamik veriler
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [allSizes, setAllSizes] = useState<Size[]>([]);
    const [availableMiddleCategories, setAvailableMiddleCategories] = useState<
      MiddleCategory[]
    >([]);
    const [availableSubCategories, setAvailableSubCategories] = useState<
      SubCategory[]
    >([]);

    // Varyant yönetimi - seçili bedenler
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);

    // API'den kategorileri, markaları ve bedenleri çek
    useEffect(() => {
      const fetchData = async () => {
        setDataLoading(true);
        try {
          const [categoriesRes, sizesRes] = await Promise.all([
            fetch("/api/category"),
            fetch("/api/size"),
          ]);

          if (categoriesRes.ok) {
            const data = await categoriesRes.json();
            setCategories(data.categories || []);
            setBrands(data.brands || []);
          }

          if (sizesRes.ok) {
            const sizesData = await sizesRes.json();
            setAllSizes(sizesData.sizes || []);
          }
        } catch (error) {
          console.error("Veri çekme hatası:", error);
        } finally {
          setDataLoading(false);
        }
      };

      fetchData();
    }, []);

    // Ürün güncellendiğinde form verilerini doldur
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
          middleCategory: product.middleCategory || "",
          subCategory: product.subCategory || "",
          brandId: product.brandId,
          hasVariants: product.hasVariants || false,
          sizes: [],
          stock: [],
        });

        // Seçilen kategoriye göre alt kategorileri yükle
        if (product.category) {
          const selectedCategory = categories.find(
            (cat) => cat.name === product.category,
          );
          if (selectedCategory) {
            setAvailableMiddleCategories(
              selectedCategory.middleCategories || [],
            );

            if (product.middleCategory) {
              const selectedMiddle = selectedCategory.middleCategories.find(
                (mid) => mid.name === product.middleCategory,
              );
              if (selectedMiddle) {
                setAvailableSubCategories(selectedMiddle.subCategories || []);
              }
            }
          }
        }

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

        setSelectedSizeIds([]);
        setOpen(true);
      } else {
        resetForm();
      }
    }, [product, categories, allSizes]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setProductData((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "oldPrice" ||
          name === "rating" ||
          name === "reviewCount" ||
          name === "discountPercentage" ||
          name === "brandId"
            ? value === ""
              ? name === "oldPrice" ||
                name === "discountPercentage" ||
                name === "brandId"
                ? undefined
                : 0
              : Number(value)
            : value,
      }));
    };

    // Ana kategori değiştiğinde orta kategorileri güncelle
    const handleCategoryChange = (categoryName: string) => {
      const selectedCategory = categories.find(
        (cat) => cat.name === categoryName,
      );

      setProductData((prev) => ({
        ...prev,
        category: categoryName,
        middleCategory: "",
        subCategory: "",
      }));

      setAvailableMiddleCategories(selectedCategory?.middleCategories || []);
      setAvailableSubCategories([]);
    };

    // Orta kategori değiştiğinde alt kategorileri güncelle
    const handleMiddleCategoryChange = (middleCategoryName: string) => {
      const selectedMiddle = availableMiddleCategories.find(
        (mid) => mid.name === middleCategoryName,
      );

      setProductData((prev) => ({
        ...prev,
        middleCategory: middleCategoryName,
        subCategory: "",
      }));

      setAvailableSubCategories(selectedMiddle?.subCategories || []);
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
      setFile: (file: File | null) => void,
    ) => {
      const file = e.target.files?.[0] || null;
      setFile(file);
    };

    // Beden seçimi toggle
    const toggleSizeSelection = (sizeId: number) => {
      setSelectedSizeIds((prev) => {
        if (prev.includes(sizeId)) {
          return prev.filter((id) => id !== sizeId);
        } else {
          return [...prev, sizeId];
        }
      });
    };

    // Stok güncelleme
    const updateStock = (
      sizeId: number,
      field: keyof ProductVariant,
      value: number,
    ) => {
      setProductData((prev) => {
        const existingStock = prev.stock.find((s) => s.sizeId === sizeId);

        if (existingStock) {
          return {
            ...prev,
            stock: prev.stock.map((s) =>
              s.sizeId === sizeId ? { ...s, [field]: value } : s,
            ),
          };
        } else {
          return {
            ...prev,
            stock: [
              ...prev.stock,
              {
                sizeId,
                stock: field === "stock" ? value : 0,
                priceModifier: field === "priceModifier" ? value : 0,
              },
            ],
          };
        }
      });
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
        middleCategory: "",
        subCategory: "",
        brandId: undefined,
        hasVariants: false,
        sizes: [],
        stock: [],
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
      setAvailableMiddleCategories([]);
      setAvailableSubCategories([]);
      setSelectedSizeIds([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!productData.title || !productData.category) return;

      // sizes ve stock verilerini hazırla
      const finalData = {
        ...productData,
        sizes: selectedSizeIds.map((id) => ({ sizeId: id })),
      };

      setLoading(true);
      onSubmit(finalData, mainFile, sub1, sub2, sub3, sub4, product?.id);
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
      urlSetter: (url: string | null) => void,
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
          <div className="relative w-full aspect-[16/9] overflow-hidden border border-slate-200 hover:border-indigo-400 transition-all bg-slate-50">
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
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <ImagePlus size={20} className="mb-1.5" />
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            )}
          </div>
        </div>
      );
    };

    // Bedenleri type'a göre grupla
    const groupedSizes = allSizes.reduce(
      (acc, size) => {
        if (!acc[size.type]) {
          acc[size.type] = [];
        }
        acc[size.type].push(size);
        return acc;
      },
      {} as Record<string, Size[]>,
    );

    // Type label'ları
    const typeLabels: Record<string, string> = {
      NUMBER: "Sayı Bedeni (36, 38, 40...)",
      ROMAN: "Roman Bedeni (XS, S, M, L...)",
      SHOE: "Ayakkabı Bedeni",
      GLOVE: "Eldiven Bedeni",
      STANDARD: "Standart",
      CLOTHING_TEXT: "Tekstil Bedeni",
      CLOTHING_NUMBER: "Sayı Bedeni",
    };

    return (
      <>
        {!product && (
          <Button
            className={`bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105 ${className}`}
            onClick={() => setOpen(true)}
            disabled={dataLoading}
          >
            {dataLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                <span className="text-xs">Yükleniyor...</span>
              </>
            ) : (
              <>
                <ImagePlus size={16} className="mr-2" />
                <span className="text-xs">Yeni Ürün Ekle</span>
              </>
            )}
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-gray-900 max-w-6xl w-[95vw] sm:w-[90vw] shadow-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-5">
            <DialogHeader className="space-y-2 pb-3 border-b border-slate-100">
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                {product ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
              </DialogTitle>
              <p className="text-[11px] text-slate-500">
                Ürün bilgilerini ve varyantlarını ekleyin
              </p>
            </DialogHeader>

            {dataLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
                <p className="text-xs text-slate-500 font-medium">
                  Veriler yükleniyor...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-4 sm:space-y-5"
              >
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
                    <TabsTrigger value="basic" className="text-xs">
                      Temel Bilgiler
                    </TabsTrigger>
                    <TabsTrigger value="variants" className="text-xs">
                      Beden & Stok
                    </TabsTrigger>
                  </TabsList>

                  {/* TEMEL BİLGİLER TAB */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                      {/* Left Column - Form Inputs */}
                      <div className="space-y-3 order-2 lg:order-1">
                        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3">
                          <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                            <div className="w-0.5 h-4 bg-indigo-600"></div>
                            Ürün Bilgileri
                          </h3>

                          <InputGroup
                            label="Ürün Adı"
                            value={productData.title}
                            name="title"
                            onChange={handleChange}
                            placeholder="Örn: Premium İş Eldiveni"
                            required
                          />

                          <div>
                            <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
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
                              placeholder="Ürün açıklaması..."
                              className="w-full min-h-[80px] px-3 py-2 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 outline-none transition-all resize-none text-xs"
                            />
                          </div>

                          {/* Fiyat ve İndirim */}
                          <div className="space-y-3 p-3 bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                            <div className="flex items-center gap-2 mb-1">
                              <Calculator
                                size={14}
                                className="text-amber-600"
                              />
                              <h4 className="text-[11px] font-semibold text-slate-700">
                                Fiyatlandırma & İndirim
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <InputGroup
                                label="Güncel Fiyat (₺)"
                                value={
                                  productData.price === 0
                                    ? ""
                                    : productData.price
                                }
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
                                placeholder="İndirim varsa"
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
                                placeholder="Otomatik"
                              />
                              {productData.oldPrice &&
                                productData.price > 0 && (
                                  <button
                                    type="button"
                                    onClick={calculateDiscount}
                                    className="absolute right-1.5 top-6 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 hover:bg-indigo-200 transition-colors"
                                  >
                                    Hesapla
                                  </button>
                                )}
                            </div>
                          </div>

                          {/* Kategori Seçimi */}
                          <div className="space-y-3 p-3 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                            <h4 className="text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                              <div className="w-0.5 h-3 bg-indigo-600"></div>
                              Kategori
                            </h4>

                            <div>
                              <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
                                Ana Kategori *
                              </Label>
                              <Select
                                value={productData.category}
                                onValueChange={handleCategoryChange}
                              >
                                <SelectTrigger className="w-full h-9 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 text-xs">
                                  <SelectValue placeholder="Ana kategori seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem
                                      key={cat.id}
                                      value={cat.name}
                                      className="text-xs"
                                    >
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {availableMiddleCategories.length > 0 && (
                              <div>
                                <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
                                  Orta Kategori
                                </Label>
                                <Select
                                  value={productData.middleCategory || "none"}
                                  onValueChange={(val) => {
                                    if (val === "none") {
                                      setProductData((prev) => ({
                                        ...prev,
                                        middleCategory: "",
                                        subCategory: "",
                                      }));
                                      setAvailableSubCategories([]);
                                    } else {
                                      handleMiddleCategoryChange(val);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-full h-9 text-xs">
                                    <SelectValue placeholder="Orta kategori" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value="none"
                                      className="text-xs"
                                    >
                                      Seçim yapma
                                    </SelectItem>
                                    {availableMiddleCategories.map((mid) => (
                                      <SelectItem
                                        key={mid.id}
                                        value={mid.name}
                                        className="text-xs"
                                      >
                                        {mid.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {availableSubCategories.length > 0 && (
                              <div>
                                <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
                                  Alt Kategori
                                </Label>
                                <Select
                                  value={productData.subCategory || "none"}
                                  onValueChange={(val) =>
                                    setProductData((prev) => ({
                                      ...prev,
                                      subCategory: val === "none" ? "" : val,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-full h-9 text-xs">
                                    <SelectValue placeholder="Alt kategori" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      value="none"
                                      className="text-xs"
                                    >
                                      Seçim yapma
                                    </SelectItem>
                                    {availableSubCategories.map((sub) => (
                                      <SelectItem
                                        key={sub.id}
                                        value={sub.name}
                                        className="text-xs"
                                      >
                                        {sub.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          {/* Marka Seçimi */}
                          <div>
                            <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
                              Marka
                            </Label>
                            <Select
                              value={
                                productData.brandId
                                  ? String(productData.brandId)
                                  : "none"
                              }
                              onValueChange={(val) =>
                                setProductData((prev) => ({
                                  ...prev,
                                  brandId:
                                    val === "none" ? undefined : Number(val),
                                }))
                              }
                            >
                              <SelectTrigger className="w-full h-9 text-xs">
                                <SelectValue placeholder="Marka seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none" className="text-xs">
                                  Marka yok
                                </SelectItem>
                                {brands.map((brand) => (
                                  <SelectItem
                                    key={brand.id}
                                    value={String(brand.id)}
                                    className="text-xs"
                                  >
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InputGroup
                              label="Puan (0-5)"
                              value={productData.rating}
                              name="rating"
                              onChange={handleChange}
                              type="number"
                              min={0}
                              max={5}
                              step="0.1"
                              placeholder="0.0"
                            />

                            <InputGroup
                              label="Yorum Sayısı"
                              value={productData.reviewCount}
                              name="reviewCount"
                              onChange={handleChange}
                              type="number"
                              min={0}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Images */}
                      <div className="space-y-3 order-1 lg:order-2">
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-3 sm:p-4 border border-indigo-100 shadow-sm">
                          <h3 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                            <div className="w-0.5 h-4 bg-indigo-600"></div>
                            Ürün Görselleri
                          </h3>

                          <div className="mb-3">
                            <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
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
                                label="Ana Görsel"
                                onRemove={() =>
                                  removeImage(setMainFile, setMainUrl)
                                }
                              />
                            </label>
                          </div>

                          <div>
                            <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
                              Ek Görseller
                            </Label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
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
                              ].map(
                                (
                                  { file, setter, url, urlSetter, id },
                                  index,
                                ) => (
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
                                        onRemove={() =>
                                          removeImage(setter, urlSetter)
                                        }
                                      />
                                    </label>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* BEDEN & STOK TAB */}
                  <TabsContent value="variants" className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-white p-4 border border-purple-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Palette className="text-purple-600" size={18} />
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">
                              Beden Varyantları
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Beden ve stok ayarları
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productData.hasVariants}
                            onChange={(e) => {
                              setProductData((prev) => ({
                                ...prev,
                                hasVariants: e.target.checked,
                              }));
                              if (!e.target.checked) {
                                setSelectedSizeIds([]);
                              }
                            }}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-[11px] font-semibold text-slate-700">
                            Beden Kullan
                          </span>
                        </label>
                      </div>

                      {productData.hasVariants && (
                        <>
                          {/* Beden Seçimi - Type'lara göre gruplandırılmış */}
                          <div className="bg-white p-3 border border-slate-200 mb-4">
                            <h4 className="font-semibold text-slate-900 mb-3 text-xs">
                              Bedenleri Seçin
                            </h4>
                            <div className="space-y-4">
                              {Object.entries(groupedSizes).map(
                                ([type, sizes]) => (
                                  <div key={type}>
                                    <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                      {typeLabels[type] || type}
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                      {sizes
                                        .filter((s) => s.isActive !== false)
                                        .sort(
                                          (a, b) => a.sortOrder - b.sortOrder,
                                        )
                                        .map((size) => {
                                          const isSelected =
                                            selectedSizeIds.includes(size.id);
                                          return (
                                            <button
                                              key={size.id}
                                              type="button"
                                              onClick={() =>
                                                toggleSizeSelection(size.id)
                                              }
                                              className={`h-9 px-2 border transition-all text-[11px] font-semibold ${
                                                isSelected
                                                  ? "bg-purple-600 text-white border-purple-600"
                                                  : "bg-white text-slate-700 border-slate-300 hover:border-purple-400"
                                              }`}
                                            >
                                              {size.value}
                                            </button>
                                          );
                                        })}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Stok Ayarları */}
                          {selectedSizeIds.length > 0 && (
                            <div className="bg-white p-3 border border-slate-200">
                              <h4 className="font-semibold text-slate-900 mb-3 text-xs">
                                Stok ve Fiyat Ayarları
                              </h4>
                              <div className="space-y-2 max-h-64 overflow-y-auto">
                                {selectedSizeIds.map((sizeId) => {
                                  const size = allSizes.find(
                                    (s) => s.id === sizeId,
                                  );
                                  const stockData = productData.stock.find(
                                    (s) => s.sizeId === sizeId,
                                  );

                                  return (
                                    <div
                                      key={sizeId}
                                      className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200"
                                    >
                                      <div className="w-16 text-center">
                                        <span className="text-[11px] font-bold text-slate-900">
                                          {size?.value}
                                        </span>
                                        <div className="text-[8px] text-slate-500">
                                          {
                                            typeLabels[size?.type || ""]?.split(
                                              " ",
                                            )[0]
                                          }
                                        </div>
                                      </div>
                                      <div className="flex-1 grid grid-cols-2 gap-2">
                                        <div>
                                          <Label className="text-[9px] text-slate-600 mb-1 block">
                                            Stok
                                          </Label>
                                          <Input
                                            type="number"
                                            min={0}
                                            value={stockData?.stock ?? 0}
                                            onChange={(e) =>
                                              updateStock(
                                                sizeId,
                                                "stock",
                                                Number(e.target.value),
                                              )
                                            }
                                            className="h-7 text-xs"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-[9px] text-slate-600 mb-1 block">
                                            Fiyat Farkı (₺)
                                          </Label>
                                          <Input
                                            type="number"
                                            value={
                                              stockData?.priceModifier ?? 0
                                            }
                                            onChange={(e) =>
                                              updateStock(
                                                sizeId,
                                                "priceModifier",
                                                Number(e.target.value),
                                              )
                                            }
                                            className="h-7 text-xs"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {selectedSizeIds.length === 0 && (
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                              <p className="text-xs text-amber-800">
                                ℹ️ Yukarıdaki beden gruplarından en az bir beden
                                seçin
                              </p>
                            </div>
                          )}
                        </>
                      )}

                      {!productData.hasVariants && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                          <p className="text-xs text-blue-800">
                            ℹ️ Beden varyantı kullanılmayacak. Ürün tek stok
                            kaydıyla oluşturulacak.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-50 font-semibold h-9 text-xs"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading || !productData.title || !productData.category
                    }
                    className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg shadow-indigo-200 h-9 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {product ? "Güncelleniyor..." : "Ekleniyor..."}
                      </span>
                    ) : (
                      <>{product ? "Güncelle" : "Ekle"}</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  },
);

ProductDialog.displayName = "ProductDialog";

const InputGroup = ({ label, ...props }: any) => (
  <div>
    <Label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">
      {label}
    </Label>
    <Input
      className="w-full h-9 border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-xs"
      {...props}
    />
  </div>
);

export default ProductDialog;
