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
import { ImagePlus, X, Calculator, Loader2 } from "lucide-react";

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
    const [availableMiddleCategories, setAvailableMiddleCategories] = useState<
      MiddleCategory[]
    >([]);
    const [availableSubCategories, setAvailableSubCategories] = useState<
      SubCategory[]
    >([]);

    // API'den kategorileri ve markaları çek
    useEffect(() => {
      const fetchData = async () => {
        setDataLoading(true);
        try {
          const response = await fetch("/api/categories");
          if (response.ok) {
            const data = await response.json();
            setCategories(data.categories || []);
            setBrands(data.brands || []);
          } else {
            console.error("Veriler yüklenemedi");
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

        setOpen(true);
      } else {
        resetForm();
      }
    }, [product, categories]);

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
                  className="absolute rounded-sm top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
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
            className={`bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-sm font-semibold shadow-lg shadow-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105  ${className}`}
            onClick={() => setOpen(true)}
            disabled={dataLoading}
          >
            {dataLoading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Yükleniyor...
              </>
            ) : (
              <>
                <ImagePlus size={18} className="mr-2" />
                Yeni Ürün Ekle
              </>
            )}
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-gray-900 max-w-7xl w-[95vw] sm:w-[90vw] shadow-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-6 lg:p-8">
            <DialogHeader className="space-y-3 pb-4 border-b border-slate-100">
              <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                {product ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                Ürün bilgilerini ve görsellerini ekleyerek kataloğunuzu
                zenginleştirin
              </p>
            </DialogHeader>

            {dataLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-sm text-slate-500 font-medium">
                  Veriler yükleniyor...
                </p>
              </div>
            ) : (
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
                          className="w-full min-h-[100px] px-4 py-3 rounded-sm border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-sm"
                        />
                      </div>

                      {/* Fiyat ve İndirim Bölümü */}
                      <div className="space-y-4 p-4 bg-gradient-to-br from-amber-50 to-white rounded-sm border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calculator size={16} className="text-amber-600" />
                          <h4 className="text-sm font-semibold text-slate-700">
                            Fiyatlandırma & İndirim
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputGroup
                            label="Güncel Fiyat (₺)"
                            value={
                              productData.price === 0 ? "" : productData.price
                            } // Eğer 0 ise boş göster
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
                              className="absolute rounded-sm right-2 top-8 text-xs bg-indigo-100 text-indigo-700 px-3 py-1 hover:bg-indigo-200 transition-colors"
                            >
                              Hesapla
                            </button>
                          )}
                        </div>

                        {productData.oldPrice &&
                          productData.price > 0 &&
                          productData.oldPrice > productData.price && (
                            <div className="text-xs text-green-700 bg-green-50 p-2 rounded-sm border border-green-200">
                              ✓ İndirim:{" "}
                              {productData.oldPrice.toLocaleString("tr-TR")} TL
                              → {productData.price.toLocaleString("tr-TR")} TL
                              {productData.discountPercentage &&
                                ` (-%${productData.discountPercentage})`}
                            </div>
                          )}
                      </div>

                      {/* Kategori Seçimi - Hiyerarşik */}
                      <div className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-white rounded-sm border border-indigo-100">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <div className="w-1 h-4 bg-indigo-600"></div>
                          Kategori Hiyerarşisi
                        </h4>

                        {/* Ana Kategori */}
                        <div>
                          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                            Ana Kategori *
                          </Label>
                          <Select
                            value={productData.category}
                            onValueChange={handleCategoryChange}
                          >
                            <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                              <SelectValue placeholder="Ana kategori seçin" />
                            </SelectTrigger>
                            <SelectContent className="rounded-sm">
                              {categories.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.name}
                                  className="rounded-sm"
                                >
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Orta Kategori */}
                        {availableMiddleCategories.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                              Orta Kategori (Opsiyonel)
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
                              <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                                <SelectValue placeholder="Orta kategori seçin" />
                              </SelectTrigger>
                              <SelectContent className="rounded-sm">
                                <SelectItem value="none" className="rounded-sm">
                                  Seçim yapma
                                </SelectItem>
                                {availableMiddleCategories.map((mid) => (
                                  <SelectItem
                                    key={mid.id}
                                    value={mid.name}
                                    className="rounded-sm"
                                  >
                                    {mid.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Alt Kategori */}
                        {availableSubCategories.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                              Alt Kategori (Opsiyonel)
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
                              <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                                <SelectValue placeholder="Alt kategori seçin" />
                              </SelectTrigger>
                              <SelectContent className="rounded-sm">
                                <SelectItem value="none" className="rounded-sm">
                                  Seçim yapma
                                </SelectItem>
                                {availableSubCategories.map((sub) => (
                                  <SelectItem
                                    key={sub.id}
                                    value={sub.name}
                                    className="rounded-sm"
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
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Marka (Opsiyonel)
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
                              brandId: val === "none" ? undefined : Number(val),
                            }))
                          }
                        >
                          <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
                            <SelectValue placeholder="Marka seçin" />
                          </SelectTrigger>
                          <SelectContent className="rounded-sm">
                            <SelectItem value="none" className="rounded-sm">
                              Marka yok
                            </SelectItem>
                            {brands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={String(brand.id)}
                                className="rounded-sm"
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Right Column - Image Previews */}
                  <div className="space-y-4 order-1 lg:order-2">
                    <div className="bg-gradient-to-br from-indigo-50 to-white p-5 sm:p-6 rounded-sm border border-indigo-100 shadow-sm">
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
                            onRemove={() =>
                              removeImage(setMainFile, setMainUrl)
                            }
                          />
                        </label>
                      </div>

                      {/* Sub Images - Horizontal Grid */}
                      <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                          Ek Görseller
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
                          ].map(
                            ({ file, setter, url, urlSetter, id }, index) => (
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

                    {/* Live Preview Card - Only on Desktop */}
                    {!isMobile &&
                      (mainFile || mainUrl || productData.title) && (
                        <div className="hidden lg:block bg-white p-6 rounded-sm border border-slate-200 shadow-lg">
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
                                          "tr-TR",
                                        )}`
                                      : "Fiyat belirtilmedi"}
                                  </span>
                                  {productData.oldPrice &&
                                    productData.oldPrice >
                                      productData.price && (
                                      <span className="text-sm text-slate-400 line-through">
                                        ₺
                                        {productData.oldPrice.toLocaleString(
                                          "tr-TR",
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
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-sm text-xs font-semibold">
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
                    className="flex-1 sm:flex-none rounded-sm border-slate-300 hover:bg-slate-50 font-semibold h-11"
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      loading || !productData.title || !productData.category
                    }
                    className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-lg shadow-indigo-200 rounded-sm h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
      {label}
    </Label>
    <Input
      className="w-full h-11 rounded-sm border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
      {...props}
    />
  </div>
);

export default ProductDialog;
