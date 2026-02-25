// components/modules/admin/products/productForm/imageUpload.tsx
"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ImagePlus, X, Video, Play } from "lucide-react";
import Image from "next/image";

interface ImageUploadSectionProps {
  mainFile: File | null;
  setMainFile: (file: File | null) => void;
  sub1: File | null;
  setSub1: (file: File | null) => void;
  sub2: File | null;
  setSub2: (file: File | null) => void;
  sub3: File | null;
  setSub3: (file: File | null) => void;
  sub4: File | null;
  setSub4: (file: File | null) => void;
  mainUrl: string | null;
  setMainUrl: (url: string | null) => void;
  subUrl1: string | null;
  setSubUrl1: (url: string | null) => void;
  subUrl2: string | null;
  setSubUrl2: (url: string | null) => void;
  subUrl3: string | null;
  setSubUrl3: (url: string | null) => void;
  subUrl4: string | null;
  setSubUrl4: (url: string | null) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;
  onRemoveVideo?: () => void;
  // ← YENİ: showVideo props
  showVideo: boolean;
  setShowVideo: (val: boolean) => void;
}

export default function ImageUploadSection({
  mainFile,
  setMainFile,
  sub1,
  setSub1,
  sub2,
  setSub2,
  sub3,
  setSub3,
  sub4,
  setSub4,
  mainUrl,
  setMainUrl,
  subUrl1,
  setSubUrl1,
  subUrl2,
  setSubUrl2,
  subUrl3,
  setSubUrl3,
  subUrl4,
  setSubUrl4,
  videoFile,
  setVideoFile,
  videoUrl,
  setVideoUrl,
  onRemoveVideo,
  showVideo,
  setShowVideo,
}: ImageUploadSectionProps) {
  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
  ) => {
    const file = e.target.files?.[0] || null;
    setFile(file);
  };

  const removeImage = (
    setter: (file: File | null) => void,
    urlSetter: (url: string | null) => void,
  ) => {
    setter(null);
    urlSetter(null);
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setShowVideo(false);
    onRemoveVideo?.();
  };

  const hasVideo = !!(videoFile || videoUrl);

  return (
    <div className="space-y-6 w-full">
      <div className="bg-white p-6 border border-slate-200 rounded-sm">
        <h3 className="font-semibold text-slate-900 text-base mb-4">
          Ürün Görselleri
        </h3>

        {/* Main Image */}
        <div className="mb-6">
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Ana Görsel <span className="text-red-500">*</span>
          </Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e, setMainFile)}
            className="hidden"
            id="main-image"
          />
          <label htmlFor="main-image" className="cursor-pointer block">
            <ImagePreview
              file={mainFile}
              url={mainUrl}
              label="Ana Görsel Ekle"
              onRemove={() => removeImage(setMainFile, setMainUrl)}
              isMain={true}
            />
          </label>
        </div>

        {/* Additional Images */}
        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Ek Görseller
          </Label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                <label htmlFor={id} className="cursor-pointer block">
                  <ImagePreview
                    file={file}
                    url={url}
                    label={`Görsel ${index + 1} ekle`}
                    onRemove={() => removeImage(setter, urlSetter)}
                    isMain={false}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Video Yükleme */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Video size={14} className="text-blue-500" />
            Tanıtım Videosu{" "}
            <span className="text-slate-400 font-normal text-xs">
              (opsiyonel)
            </span>
          </Label>
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setVideoFile(file);
            }}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer block">
            <VideoPreview
              file={videoFile}
              url={videoUrl}
              onRemove={removeVideo}
            />
          </label>

          {/* ← YENİ: showVideo checkbox — sadece video varsa göster */}
          {hasVideo && (
            <div className="mt-3 flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <input
                type="checkbox"
                id="show-video"
                checked={showVideo}
                onChange={(e) => setShowVideo(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer flex-shrink-0"
              />
              <label
                htmlFor="show-video"
                className="text-sm font-medium text-slate-700 cursor-pointer select-none leading-tight"
              >
                Ürün kartında video göster{" "}
                <span className="text-xs text-slate-500 font-normal">
                  (hover'da video oynar, 2. görsel yerine)
                </span>
              </label>
            </div>
          )}

          <p className="text-xs text-slate-500 mt-2">
            💡 MP4, WebM veya MOV formatında, maksimum 100MB video
            yükleyebilirsiniz.
          </p>
        </div>

        <p className="text-xs text-slate-500 mt-4">
          💡 En iyi sonuçlar için 3:4 oranında (dik/portre), minimum 600x800px
          görseller kullanın.
        </p>
      </div>
    </div>
  );
}

// ─── Resim Önizleme ────────────────────────────────────────────────────────
interface ImagePreviewProps {
  file: File | null;
  url: string | null;
  label: string;
  onRemove: () => void;
  isMain?: boolean;
}

const ImagePreview = ({
  file,
  url,
  label,
  onRemove,
  isMain = false,
}: ImagePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file, url]);

  return (
    <div className="relative group">
      <div
        className={`relative w-full aspect-[3/4] overflow-hidden border-2 border-slate-200 rounded-xl bg-slate-50 hover:border-slate-400 transition-all ${isMain ? "max-w-md mx-auto" : ""}`}
      >
        {previewUrl ? (
          <>
            <Image
              src={previewUrl}
              alt={label}
              fill
              className="object-cover"
              unoptimized={!!file}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImagePlus size={isMain ? 48 : 32} className="mb-2" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Video Önizleme ────────────────────────────────────────────────────────
interface VideoPreviewProps {
  file: File | null;
  url: string | null;
  onRemove: () => void;
}

const VideoPreview = ({ file, url, onRemove }: VideoPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file, url]);

  return (
    <div className="relative group">
      <div className="relative w-full h-40 overflow-hidden border-2 border-slate-200 rounded-xl bg-slate-50 hover:border-slate-400 transition-all">
        {previewUrl ? (
          <>
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow">
                <Play size={18} className="text-slate-900 ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm max-w-[70%] truncate">
              {file ? file.name : "Mevcut Video"}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRemove();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <Video size={32} />
            <span className="text-xs font-medium">Tanıtım videosu ekle</span>
            <span className="text-[10px] text-slate-400">
              MP4, WebM, MOV • Max 100MB
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
