"use client";

import React, { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Trash2,
  Star,
  MessageSquare,
  ImageOff,
  Calendar,
} from "lucide-react";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount?: number;
  mainImage: string;
  category: string;
  subCategory?: string;
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

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime())
        ? "-"
        : new Intl.DateTimeFormat("tr-TR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(d);
    } catch {
      return "-";
    }
  };

  return (
    <div className="w-full bg-white">
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 pl-6 pr-0">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 &&
                    selectedIds.length === products.length
                  }
                  onChange={onSelectAll}
                  className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
                />
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5 px-6">
                Ürün Detayı
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5 px-4">
                Kategori
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5 px-4">
                Fiyat
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5 px-4">
                Performans
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5 px-4">
                Kayıt Tarihi
              </TableHead>
              <TableHead className="text-right pr-6 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 py-5">
                İşlemler
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => {
                const imgPath = getSafeImagePath(product.mainImage);
                return (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={`group border-b border-slate-100 last:border-0 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all ${
                      selectedIds.includes(product.id)
                        ? "bg-gradient-to-r from-indigo-50/50 to-transparent"
                        : ""
                    }`}
                  >
                    <TableCell className="pl-6 pr-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => onSelectOne(product.id)}
                        className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all"
                      />
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {/* Horizontal aspect ratio image */}
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center shadow-sm">
                          {imgPath ? (
                            <Image
                              src={imgPath}
                              alt={product.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <ImageOff size={18} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {product.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            ID: #{product.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <Badge className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200 shadow-none hover:shadow-sm hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 hover:border-indigo-200 text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all">
                        {product.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-4 font-bold text-slate-900 text-sm whitespace-nowrap">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(product.price)}
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-amber-500">
                          <Star size={13} fill="currentColor" />
                          {product.rating.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                          <MessageSquare size={11} />
                          {product.reviewCount || 0} Yorum
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4">
                      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium whitespace-nowrap">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(product.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 border border-transparent hover:border-indigo-200 text-slate-400 hover:text-indigo-600 transition-all hover:shadow-sm"
                          onClick={() => onUpdateClick(product)}
                        >
                          <Edit3 size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 text-slate-400 hover:text-red-500 hover:border-red-200 border border-transparent transition-all hover:shadow-sm"
                          onClick={() => onDeleteClick(product)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="lg:hidden space-y-3 p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-white">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => {
            const imgPath = getSafeImagePath(product.mainImage);
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 shadow-md border transition-all ${
                  selectedIds.includes(product.id)
                    ? "border-indigo-300 shadow-indigo-100 bg-gradient-to-br from-indigo-50/30 to-white"
                    : "border-slate-200 hover:shadow-lg hover:border-slate-300"
                }`}
              >
                {/* Header with Checkbox */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => onSelectOne(product.id)}
                      className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border border-slate-200"
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    #{product.id}
                  </span>
                </div>

                {/* Product Image - Horizontal Aspect */}
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 mb-4 shadow-sm">
                  {imgPath ? (
                    <Image
                      src={imgPath}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageOff size={28} className="text-slate-300 mb-2" />
                      <span className="text-xs text-slate-400 font-medium">
                        Görsel Yok
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                        <Star size={14} fill="currentColor" />
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold">
                        {product.reviewCount || 0} yorum
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <Calendar size={11} />
                      {formatDate(product.createdAt)}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-xl font-black text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text">
                    {product.price.toLocaleString("tr-TR")} ₺
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 rounded-xl h-10 font-semibold text-sm border-slate-300 text-slate-700 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 hover:border-indigo-300 transition-all"
                      onClick={() => onUpdateClick(product)}
                    >
                      <Edit3 size={14} className="mr-2" />
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl h-10 w-10 p-0 text-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 hover:text-red-600 border border-transparent hover:border-red-200 transition-all"
                      onClick={() => onDeleteClick(product)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
