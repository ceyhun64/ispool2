"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3, Trash2, ImageOff } from "lucide-react";

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
  const getSafeImagePath = (image?: string) => {
    if (!image || image.trim() === "") return null;
    return image.startsWith("http") ? image : "/" + image.replace(/^\/+/, "");
  };

  return (
    <div className="w-full ">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-sm ">
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
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const imgPath = getSafeImagePath(product.mainImage);
              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => onSelectOne(product.id)}
                      className="w-4 h-4 rounded border-slate-300"
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
                      <div>
                        <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                          {product.title}
                        </p>
                        <p className="text-xs text-slate-500">#{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 border-slate-200 text-xs"
                    >
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-slate-900">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </p>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <p className="text-xs text-slate-400 line-through">
                          {product.oldPrice.toLocaleString("tr-TR")} ₺
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-slate-900"
                        onClick={() => onUpdateClick(product)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                        onClick={() => onDeleteClick(product)}
                      >
                        <Trash2 className="w-4 h-4" />
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
          return (
            <div
              key={product.id}
              className="bg-white p-4 border border-slate-200 rounded space-y-3"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => onSelectOne(product.id)}
                  className="w-5 h-5 rounded border-slate-300 mt-1"
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
                  <Badge
                    variant="outline"
                    className="mt-1 bg-slate-50 text-slate-700 border-slate-200 text-xs"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div>
                  <p className="font-bold text-base text-slate-900">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </p>
                  {product.oldPrice && product.oldPrice > product.price && (
                    <p className="text-xs text-slate-400 line-through">
                      {product.oldPrice.toLocaleString("tr-TR")} ₺
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateClick(product)}
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => onDeleteClick(product)}
                  >
                    <Trash2 className="w-3 h-3" />
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
