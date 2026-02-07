"use client";

import React from "react";
import Image from "next/image";
import { Eye, Sparkles, ImagePlus, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomImageZoom } from "./imageZoom";

interface ProductImageGalleryProps {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  customDesign: string | null;
  uploadedImagePreview: string | null;
  hasDiscount: boolean;
  discountPercentage: number;
  onShowPreview: () => void;
  onRemoveCustomDesign: () => void;
  onRemoveUploadedImage: () => void;
  productTitle: string;
}

export default function ProductImageGallery({
  images,
  activeIndex,
  onIndexChange,
  customDesign,
  uploadedImagePreview,
  hasDiscount,
  discountPercentage,
  onShowPreview,
  onRemoveCustomDesign,
  onRemoveUploadedImage,
  productTitle,
}: ProductImageGalleryProps) {
  const finalCustomImage = customDesign || uploadedImagePreview;
  const displayImages = finalCustomImage
    ? [finalCustomImage, ...images]
    : images;

  return (
    <div className="lg:col-span-6 flex flex-col lg:flex-row gap-4">
      {/* Thumbnail Gallery */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[800px] no-scrollbar">
        {displayImages.map((img, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={cn(
              "relative w-20 md:w-27 aspect-[3/4] rounded-sm overflow-hidden transition-all border-2 flex-shrink-0 bg-white",
              activeIndex === i
                ? "border-orange-600 shadow-md"
                : "border-transparent opacity-60",
            )}
          >
            {i === 0 && finalCustomImage && (
              <div className="absolute top-0 left-0 bg-orange-600 text-white text-[6px] font-bold px-1 py-0.5 uppercase z-10">
                Özel
              </div>
            )}
            <Image src={img} alt="Thumb" fill className="object-contain p-1" />
          </button>
        ))}
      </div>

      {/* Ana Resim */}
      <div className="order-1 lg:order-2 flex-1 space-y-4">
        <div className="relative aspect-[3/4] w-full bg-white overflow-hidden border border-slate-100 group shadow-sm">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {customDesign ? (
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5 animate-pulse">
                <Sparkles size={11} /> Tasarım Paneli ile Özelleştirildi
              </span>
            ) : uploadedImagePreview ? (
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5">
                <ImagePlus size={11} /> Özel Resim Yüklendi
              </span>
            ) : (
              <span className="bg-slate-900/90 backdrop-blur text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-orange-500" />{" "}
                Sertifikalı Koruma
              </span>
            )}
            {hasDiscount && (
              <span className="bg-orange-600 text-white text-[8px] font-bold px-2.5 py-1 uppercase tracking-tight">
                %{discountPercentage} İndirim
              </span>
            )}
          </div>

          {/* Design Button */}
          <div className="absolute bottom-3 right-3 md:bottom-auto md:top-3 md:right-3 z-20 flex gap-2">
            <button
              onClick={onShowPreview}
              className="bg-orange-600 text-white px-3 py-2 text-[10px] sm:px-5 sm:py-3 sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 shadow-xl hover:bg-slate-900 transition-all sm:scale-100 sm:hover:scale-105 sm:active:scale-95 rounded-sm"
            >
              <Eye size={14} className="sm:w-4 sm:h-4" />
              {customDesign || uploadedImagePreview
                ? "Yeniden Tasarla"
                : "Logonu Ekle"}
            </button>
          </div>
          <CustomImageZoom
            src={displayImages[activeIndex]}
            alt={productTitle}
          />
        </div>

        {/* Bildirimler */}
        <div className="space-y-3">
          {uploadedImagePreview && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded">
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <ImagePlus size={14} />
                <span className="font-semibold">Özel resim yüklendi</span>
              </div>
              <button
                onClick={onRemoveUploadedImage}
                className="text-blue-600 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {customDesign && (
            <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-3 rounded">
              <div className="flex items-center gap-2 text-xs text-orange-700">
                <Sparkles size={14} />
                <span className="font-semibold">
                  Tasarım paneli ile özelleştirildi
                </span>
              </div>
              <button
                onClick={onRemoveCustomDesign}
                className="text-orange-600 hover:text-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
