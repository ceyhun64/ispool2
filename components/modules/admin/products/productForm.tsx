// components/modules/admin/products/productForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import BasicInfoSection from "./productForm/basicInfo";
import ImageUploadSection from "./productForm/imageUpload";
import VariantsSection from "./productForm/variant";
import type { ProductFormData } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  id: number;
  name: string;
  middleCategories: MiddleCategory[];
}
interface MiddleCategory {
  id: number;
  name: string;
  subCategories: SubCategory[];
}
interface SubCategory {
  id: number;
  name: string;
}
interface Brand {
  id: number;
  name: string;
}
interface Color {
  id: number;
  name: string;
  hexCode: string;
}
interface Size {
  id: number;
  value: string;
  type: string;
  sortOrder: number;
  isActive?: boolean;
}
interface ProductFormPageProps {
  productId?: number;
}

export default function ProductForm({ productId }: ProductFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
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
    colorId: undefined,
    productGroupId: undefined,
    sizes: [],
    stock: [],
    bulkDiscountQty: undefined,
    bulkDiscountRate: undefined,
  });

  const [mainFile, setMainFile] = useState<File | null>(null);
  const [sub1, setSub1] = useState<File | null>(null);
  const [sub2, setSub2] = useState<File | null>(null);
  const [sub3, setSub3] = useState<File | null>(null);
  const [sub4, setSub4] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null); // ← YENİ

  const [mainUrl, setMainUrl] = useState<string | null>(null);
  const [subUrl1, setSubUrl1] = useState<string | null>(null);
  const [subUrl2, setSubUrl2] = useState<string | null>(null);
  const [subUrl3, setSubUrl3] = useState<string | null>(null);
  const [subUrl4, setSubUrl4] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // ← YENİ
  const [removeVideo, setRemoveVideo] = useState(false); // ← YENİ

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [availableMiddleCategories, setAvailableMiddleCategories] = useState<
    MiddleCategory[]
  >([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<
    SubCategory[]
  >([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [categoriesRes, sizesRes, colorsRes] = await Promise.all([
          fetch("/api/category"),
          fetch("/api/size"),
          fetch("/api/color"),
        ]);

        let categoriesData: Category[] = [];
        let brandsData: Brand[] = [];
        let colorsData: Color[] = [];

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          categoriesData = data.categories || [];
          brandsData = data.brands || [];
          setCategories(categoriesData);
          setBrands(brandsData);
        }

        if (sizesRes.ok) {
          const sizesData = await sizesRes.json();
          if (sizesData.success && Array.isArray(sizesData.data)) {
            setAllSizes(sizesData.data);
          }
        }

        if (colorsRes.ok) {
          const colorsResponse = await colorsRes.json();
          if (colorsResponse.success && Array.isArray(colorsResponse.data)) {
            colorsData = colorsResponse.data;
            setColors(colorsData);
          }
        }

        if (productId) {
          const productRes = await fetch(`/api/products/${productId}`);
          if (productRes.ok) {
            const response = await productRes.json();
            const product = response.product;

            const cat = categoriesData.find(
              (c: Category) => c.name === product.category.name,
            );
            if (cat) {
              setAvailableMiddleCategories(cat.middleCategories || []);
              if (product.middleCategory) {
                const midCat = cat.middleCategories?.find(
                  (mc: MiddleCategory) =>
                    mc.name === product.middleCategory.name,
                );
                if (midCat)
                  setAvailableSubCategories(midCat.subCategories || []);
              }
            }

            setProductData({
              title: product.title || "",
              description: product.description || "",
              price: product.price || 0,
              oldPrice: product.oldPrice ?? undefined,
              discountPercentage: product.discountPercentage ?? undefined,
              rating: product.rating || 0,
              reviewCount: product.reviewCount || 0,
              category: product.category?.name || "",
              middleCategory: product.middleCategory?.name || "",
              subCategory: product.subCategory?.name || "",
              brandId: product.brand?.id ?? undefined,
              colorId: product.color?.id ?? undefined,
              productGroupId: product.productGroupId ?? undefined,
              sizes: [],
              stock: product.stockMatrix || [],
              bulkDiscountQty: product.bulkDiscountQty ?? undefined,
              bulkDiscountRate: product.bulkDiscountRate ?? undefined,
            });

            if (product.availableSizes && product.availableSizes.length > 0) {
              setSelectedSizeIds(product.availableSizes.map((s: any) => s.id));
            }

            setMainUrl(product.mainImage || null);
            setSubUrl1(product.images?.[1] || null);
            setSubUrl2(product.images?.[2] || null);
            setSubUrl3(product.images?.[3] || null);
            setSubUrl4(product.images?.[4] || null);
            setVideoUrl(product.videoUrl || null); // ← YENİ
          } else {
            toast.error("Ürün bilgileri yüklenemedi");
            router.push("/admin/products");
          }
        }
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        toast.error("Veriler yüklenirken hata oluştu");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData.title || !productData.category) {
      toast.error("Lütfen zorunlu alanları doldurun");
      return;
    }
    if (productData.price <= 0) {
      toast.error("Fiyat sıfırdan büyük olmalıdır");
      return;
    }
    if (!productId && !mainFile && !mainUrl) {
      toast.error("Ana görsel zorunludur");
      return;
    }
    if (productData.bulkDiscountQty && productData.bulkDiscountQty > 0) {
      if (!productData.bulkDiscountRate || productData.bulkDiscountRate <= 0) {
        toast.error("Toplu satış için indirim oranı girilmelidir");
        return;
      }
      if (productData.bulkDiscountRate > 100) {
        toast.error("İndirim oranı 100'den fazla olamaz");
        return;
      }
    }
    if (selectedSizeIds.length === 0) {
      toast.error("En az bir beden seçmelisiniz");
      return;
    }

    const dataForm = new FormData();
    dataForm.append("title", productData.title);
    dataForm.append("description", productData.description);
    dataForm.append("price", String(productData.price));
    dataForm.append("rating", String(productData.rating));
    dataForm.append("reviewCount", String(productData.reviewCount));
    dataForm.append("category", productData.category);

    if (productData.oldPrice !== undefined && productData.oldPrice > 0)
      dataForm.append("oldPrice", String(productData.oldPrice));
    if (productData.discountPercentage !== undefined)
      dataForm.append(
        "discountPercentage",
        String(productData.discountPercentage),
      );
    if (productData.middleCategory)
      dataForm.append("middleCategory", productData.middleCategory);
    if (productData.subCategory)
      dataForm.append("subCategory", productData.subCategory);
    if (productData.brandId !== undefined)
      dataForm.append("brandId", String(productData.brandId));
    if (productData.colorId !== undefined)
      dataForm.append("colorId", String(productData.colorId));
    if (
      productData.productGroupId !== undefined &&
      productData.productGroupId !== ""
    )
      dataForm.append("productGroupId", productData.productGroupId);
    if (
      productData.bulkDiscountQty !== undefined &&
      productData.bulkDiscountQty > 0
    )
      dataForm.append("bulkDiscountQty", String(productData.bulkDiscountQty));
    if (
      productData.bulkDiscountRate !== undefined &&
      productData.bulkDiscountRate > 0
    )
      dataForm.append("bulkDiscountRate", String(productData.bulkDiscountRate));

    if (selectedSizeIds.length > 0) {
      dataForm.append(
        "sizes",
        JSON.stringify(selectedSizeIds.map((id) => ({ sizeId: id }))),
      );
      dataForm.append(
        "stock",
        JSON.stringify(
          selectedSizeIds.map((sizeId) => {
            const existing = productData.stock.find((s) => s.sizeId === sizeId);
            return {
              sizeId,
              stock: existing?.stock ?? 0,
              priceModifier: existing?.priceModifier ?? 0,
            };
          }),
        ),
      );
    } else {
      dataForm.append("sizes", JSON.stringify([]));
      const singleStock = productData.stock.find((s) => s.sizeId === null) || {
        sizeId: null,
        stock: 50,
        priceModifier: 0,
      };
      dataForm.append("stock", JSON.stringify([singleStock]));
    }

    if (mainFile) dataForm.append("file", mainFile);
    if (sub1) dataForm.append("subImageFile", sub1);
    if (sub2) dataForm.append("subImage2File", sub2);
    if (sub3) dataForm.append("subImage3File", sub3);
    if (sub4) dataForm.append("subImage4File", sub4);
    if (videoFile) dataForm.append("videoFile", videoFile); // ← YENİ
    if (removeVideo) dataForm.append("removeVideo", "true"); // ← YENİ

    const url = productId ? `/api/products/${productId}` : "/api/products";
    const method = productId ? "PUT" : "POST";

    setLoading(true);
    try {
      const res = await fetch(url, { method, body: dataForm });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İşlem başarısız");
      toast.success(productId ? "Ürün güncellendi" : "Ürün eklendi");
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      <header className="mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-fit gap-2"
          >
            <ArrowLeft size={16} />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              {productId ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h1>
            <p className="text-sm text-slate-600">
              {productId
                ? `Ürün ID: #${productId} - Bilgileri güncelleyin`
                : "Ürün bilgilerini girin ve kaydedin"}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-white">
            <TabsTrigger
              value="basic"
              className="text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-xl"
            >
              Temel Bilgiler
            </TabsTrigger>
            <TabsTrigger
              value="variants"
              className="text-sm font-semibold data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-xl"
            >
              Beden & Stok
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BasicInfoSection
                productData={productData}
                setProductData={setProductData}
                categories={categories}
                brands={brands}
                colors={colors}
                availableMiddleCategories={availableMiddleCategories}
                availableSubCategories={availableSubCategories}
                setAvailableMiddleCategories={setAvailableMiddleCategories}
                setAvailableSubCategories={setAvailableSubCategories}
              />

              {/* ← YENİ: videoFile/videoUrl props eklendi */}
              <ImageUploadSection
                mainFile={mainFile}
                setMainFile={setMainFile}
                sub1={sub1}
                setSub1={setSub1}
                sub2={sub2}
                setSub2={setSub2}
                sub3={sub3}
                setSub3={setSub3}
                sub4={sub4}
                setSub4={setSub4}
                mainUrl={mainUrl}
                setMainUrl={setMainUrl}
                subUrl1={subUrl1}
                setSubUrl1={setSubUrl1}
                subUrl2={subUrl2}
                setSubUrl2={setSubUrl2}
                subUrl3={subUrl3}
                setSubUrl3={setSubUrl3}
                subUrl4={subUrl4}
                setSubUrl4={setSubUrl4}
                videoFile={videoFile}
                setVideoFile={setVideoFile}
                videoUrl={videoUrl}
                setVideoUrl={setVideoUrl}
                onRemoveVideo={() => setRemoveVideo(true)}
              />
            </div>
          </TabsContent>

          <TabsContent value="variants">
            <VariantsSection
              allSizes={allSizes}
              selectedSizeIds={selectedSizeIds}
              setSelectedSizeIds={setSelectedSizeIds}
              productData={productData}
              setProductData={setProductData}
            />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="sm:w-auto rounded-full"
            disabled={loading}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={loading || !productData.title || !productData.category}
            className="sm:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-full"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {productId ? "Güncelleniyor..." : "Ekleniyor..."}
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {productId ? "Güncelle" : "Kaydet"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
