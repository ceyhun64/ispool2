"use client";

import React, { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";
import type { ProductFormData } from "@/types/product";

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

interface BasicInfoSectionProps {
  productData: ProductFormData;
  setProductData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  categories: Category[];
  brands: Brand[];
  availableMiddleCategories: MiddleCategory[];
  availableSubCategories: SubCategory[];
  setAvailableMiddleCategories: React.Dispatch<
    React.SetStateAction<MiddleCategory[]>
  >;
  setAvailableSubCategories: React.Dispatch<
    React.SetStateAction<SubCategory[]>
  >;
}

export default function BasicInfoSection({
  productData,
  setProductData,
  categories,
  brands,
  availableMiddleCategories,
  availableSubCategories,
  setAvailableMiddleCategories,
  setAvailableSubCategories,
}: BasicInfoSectionProps) {
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
        name === "brandId" ||
        name === "bulkDiscountQty" ||
        name === "bulkDiscountRate"
          ? value === ""
            ? name === "oldPrice" ||
              name === "discountPercentage" ||
              name === "brandId" ||
              name === "bulkDiscountQty" ||
              name === "bulkDiscountRate"
              ? undefined
              : 0
            : Number(value)
          : value,
    }));
  };

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

  return (
    <div className="space-y-6 w-full">
      {/* Basic Info */}
      <div className="bg-white p-6 border border-slate-200 rounded space-y-4">
        <h3 className="font-semibold text-slate-900 text-base mb-4">
          Temel Bilgiler
        </h3>

        <InputGroup
          label="Ürün Adı *"
          value={productData.title}
          name="title"
          onChange={handleChange}
          placeholder="Ürün adı..."
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
            placeholder="Ürün açıklaması..."
            className="w-full min-h-[120px] px-4 py-3 border border-slate-200 rounded bg-slate-50 focus:border-slate-400 focus:bg-white outline-none transition-all resize-none text-sm"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 border border-slate-200 rounded space-y-4">
        <h3 className="font-semibold text-slate-900 text-base mb-4">
          Fiyatlandırma
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup
            label="Güncel Fiyat (₺) *"
            value={productData.price === 0 ? "" : productData.price}
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
            type="number"
            min={0}
            step="any"
            placeholder="İndirim varsa"
          />
        </div>

        <InputGroup
          label="İndirim Yüzdesi (%)"
          value={productData.discountPercentage ?? ""}
          name="discountPercentage"
          onChange={handleChange}
          type="number"
          min={0}
          max={100}
          placeholder="Otomatik hesaplanır"
        />
      </div>

      {/* Bulk Discount Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 border-2 border-emerald-200 rounded-lg space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Toplu Satış İndirimi
            </h3>
            <p className="text-xs text-slate-600">
              Çoklu alımlarda otomatik indirim uygulayın
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup
            label="Minimum Adet"
            value={productData.bulkDiscountQty ?? ""}
            name="bulkDiscountQty"
            onChange={handleChange}
            type="number"
            min={2}
            placeholder="Örn: 3"
            helperText="Bu adetten itibaren indirim uygulanır"
          />
          <InputGroup
            label="İndirim Oranı (%)"
            value={productData.bulkDiscountRate ?? ""}
            name="bulkDiscountRate"
            onChange={handleChange}
            type="number"
            min={1}
            max={100}
            step="0.1"
            placeholder="Örn: 10"
            helperText="Uygulanacak indirim yüzdesi"
          />
        </div>

        {productData.bulkDiscountQty &&
          productData.bulkDiscountQty > 0 &&
          productData.bulkDiscountRate &&
          productData.bulkDiscountRate > 0 && (
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-emerald-300">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-emerald-700">Örnek:</span>{" "}
                {productData.bulkDiscountQty} veya daha fazla ürün alındığında{" "}
                <span className="font-bold text-emerald-700">
                  %{productData.bulkDiscountRate}
                </span>{" "}
                indirim uygulanacak.
                {productData.price > 0 && (
                  <>
                    {" "}
                    Birim fiyat:{" "}
                    <span className="font-bold">
                      {(
                        productData.price *
                        (1 - productData.bulkDiscountRate / 100)
                      ).toFixed(2)}{" "}
                      ₺
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
          <p className="text-xs text-amber-800">
            💡 <span className="font-semibold">İpucu:</span> Toplu satış
            indirimi, müşterilerinizin daha fazla ürün almasını teşvik eder ve
            satışlarınızı artırır.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 border border-slate-200 rounded space-y-4">
        <h3 className="font-semibold text-slate-900 text-base mb-4">
          Kategori
        </h3>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Ana Kategori *
          </Label>
          <Select
            value={productData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full h-11 border-slate-200 bg-slate-50">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {availableMiddleCategories.length > 0 && (
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
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
              <SelectTrigger className="w-full h-11 border-slate-200 bg-slate-50 rounded-xl">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seçim yapma</SelectItem>
                {availableMiddleCategories.map((mid) => (
                  <SelectItem key={mid.id} value={mid.name}>
                    {mid.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {availableSubCategories.length > 0 && (
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
              Alt Kategori
            </Label>
            <Select
              value={productData.subCategory || "none"}
              onValueChange={(val) => {
                if (val === "none") {
                  setProductData((prev) => ({
                    ...prev,
                    subCategory: "",
                  }));
                } else {
                  setProductData((prev) => ({
                    ...prev,
                    subCategory: val,
                  }));
                }
              }}
            >
              <SelectTrigger className="w-full h-11 border-slate-200 bg-slate-50 rounded-xl">
                <SelectValue placeholder="Seçiniz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seçim yapma</SelectItem>
                {availableSubCategories.map((sub) => (
                  <SelectItem key={sub.id} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Brand & Rating */}
      <div className="bg-white p-6 border border-slate-200 rounded space-y-4">
        <h3 className="font-semibold text-slate-900 text-base mb-4">
          Diğer Bilgiler
        </h3>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Marka
          </Label>
          <Select
            value={productData.brandId ? String(productData.brandId) : "none"}
            onValueChange={(val) =>
              setProductData((prev) => ({
                ...prev,
                brandId: val === "none" ? undefined : Number(val),
              }))
            }
          >
            <SelectTrigger className="w-full h-11 border-slate-200 bg-slate-50">
              <SelectValue placeholder="Marka seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Marka yok</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={String(brand.id)}>
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
  );
}

const InputGroup = ({ label, helperText, ...props }: any) => (
  <div>
    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
      {label}
    </Label>
    <Input
      className="w-full h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all rounded-xl"
      {...props}
    />
    {helperText && (
      <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
    )}
  </div>
);
