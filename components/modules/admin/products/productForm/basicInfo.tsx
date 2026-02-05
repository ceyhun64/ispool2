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
              Alt Kategori
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
              <SelectTrigger className="w-full h-11 border-slate-200 bg-slate-50">
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

const InputGroup = ({ label, ...props }: any) => (
  <div>
    <Label className="text-sm font-semibold text-slate-700 mb-2 block">
      {label}
    </Label>
    <Input
      className="w-full h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all"
      {...props}
    />
  </div>
);
