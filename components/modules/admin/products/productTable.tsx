// components/modules/admin/products/productTable.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Trash2,
  ImageOff,
  Star,
  TrendingUp,
  Package,
  Loader2,
} from "lucide-react";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  mainImage: string;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brandId?: number;
  bulkDiscountQty?: number;
  bulkDiscountRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductTableProps {
  products: Product[];
  selectedIds: number[];
  onDeleteClick: (product: Product) => void;
  onUpdateClick: (product: Product) => void;
  onSelectAll: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
}

export default function ProductTable({
  products,
  selectedIds,
  onDeleteClick,
  onUpdateClick,
  onSelectAll,
  onSelectOne,
}: ProductTableProps) {
  // Loading state for individual operations - EKLENDİ
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [operationType, setOperationType] = useState<"edit" | "delete" | null>(
    null,
  );

  const getSafeImagePath = (image?: string) => {
    if (!image || image.trim() === "") return null;
    return image.startsWith("http") ? image : "/" + image.replace(/^\/+/, "");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Handler wrappers with loading state - EKLENDİ
  const handleEdit = (product: Product) => {
    setProcessingId(product.id);
    setOperationType("edit");
    onUpdateClick(product);
  };

  const handleDelete = (product: Product) => {
    setProcessingId(product.id);
    setOperationType("delete");
    onDeleteClick(product);
    // Reset after a delay to allow for toast messages
    setTimeout(() => {
      setProcessingId(null);
      setOperationType(null);
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded border-slate-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Ürün
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Değerlendirme
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                İndirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Toplu İndirim
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">
                Tarih
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const imgPath = getSafeImagePath(product.mainImage);
              const hasDiscount =
                product.oldPrice && product.oldPrice > product.price;
              const hasBulkDiscount =
                product.bulkDiscountQty && product.bulkDiscountRate;
              const isProcessing = processingId === product.id;

              return (
                <tr
                  key={product.id}
                  className={`hover:bg-slate-50 transition-colors group ${
                    isProcessing ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => onSelectOne(product.id)}
                      className="w-4 h-4 rounded border-slate-300"
                      disabled={isProcessing}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-slate-100 rounded flex-shrink-0">
                        {imgPath ? (
                          <Image
                            src={imgPath}
                            alt={product.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <ImageOff size={20} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="max-w-xs">
                        <p className="font-semibold text-sm text-slate-900 line-clamp-2">
                          {product.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          ID: #{product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                      >
                        {product.category}
                      </Badge>
                      {product.middleCategory && (
                        <p className="text-xs text-slate-500">
                          {product.middleCategory}
                        </p>
                      )}
                      {product.subCategory && (
                        <p className="text-xs text-slate-400">
                          {product.subCategory}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-xs text-slate-900">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </p>
                      {hasDiscount && (
                        <p className="text-xs text-slate-400 line-through">
                          {product.oldPrice?.toLocaleString("tr-TR")} ₺
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {product.rating}
                        </span>
                      </div>
                      {product.reviewCount !== undefined && (
                        <span className="text-xs text-slate-500">
                          ({product.reviewCount})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {hasDiscount ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <TrendingUp className="w-3 h-3 mr-1" />%
                        {product.discountPercentage || 0}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {hasBulkDiscount ? (
                      <div className="text-xs">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <Package className="w-3 h-3 mr-1" />%
                          {product.bulkDiscountRate}
                        </Badge>
                        <p className="text-slate-500 mt-1">
                          {product.bulkDiscountQty}+ adet
                        </p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p className="text-slate-600">
                        {formatDate(product.createdAt)}
                      </p>
                      <p className="text-slate-400">
                        Güncelleme: {formatDate(product.updatedAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-900"
                        onClick={() => handleEdit(product)}
                        disabled={isProcessing}
                      >
                        {isProcessing && operationType === "edit" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => handleDelete(product)}
                        disabled={isProcessing}
                      >
                        {isProcessing && operationType === "delete" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {products.map((product) => {
          const imgPath = getSafeImagePath(product.mainImage);
          const hasDiscount =
            product.oldPrice && product.oldPrice > product.price;
          const hasBulkDiscount =
            product.bulkDiscountQty && product.bulkDiscountRate;
          const isProcessing = processingId === product.id;

          return (
            <div
              key={product.id}
              className={`bg-white p-4 border border-slate-200 rounded space-y-3 ${
                isProcessing ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => onSelectOne(product.id)}
                  className="w-5 h-5 rounded border-slate-300 mt-1"
                  disabled={isProcessing}
                />
                <div className="relative w-20 h-20 bg-slate-100 rounded flex-shrink-0">
                  {imgPath ? (
                    <Image
                      src={imgPath}
                      alt={product.title}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageOff size={24} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 line-clamp-2">
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                    >
                      {product.category}
                    </Badge>
                    {hasDiscount && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        %{product.discountPercentage || 0}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-500">Değerlendirme</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    {product.reviewCount !== undefined && (
                      <span className="text-slate-400">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>
                </div>
                {hasBulkDiscount && (
                  <div>
                    <p className="text-slate-500">Toplu İndirim</p>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                      >
                        %{product.bulkDiscountRate}
                      </Badge>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {product.bulkDiscountQty}+ adet
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div>
                  <p className="font-bold text-base text-slate-900">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </p>
                  {hasDiscount && (
                    <p className="text-xs text-slate-400 line-through">
                      {product.oldPrice?.toLocaleString("tr-TR")} ₺
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    disabled={isProcessing}
                  >
                    {isProcessing && operationType === "edit" ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Edit3 className="w-3 h-3 mr-1" />
                    )}
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(product)}
                    disabled={isProcessing}
                  >
                    {isProcessing && operationType === "delete" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
