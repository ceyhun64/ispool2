"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  src: string;
  alt: string;
}

export function CustomImageZoom({ src, alt }: Props) {
  const [showZoom, setShowZoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);

  // Cihazın dokunmatik olup olmadığını kontrol et
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Dokunmatik cihazsa veya ref'ler yoksa zoom yapma
      if (isTouchDevice || !containerRef.current || !zoomLayerRef.current)
        return;

      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();

      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));

      zoomLayerRef.current.style.setProperty("--zoom-x", `${boundedX}%`);
      zoomLayerRef.current.style.setProperty("--zoom-y", `${boundedY}%`);
    },
    [isTouchDevice]
  );

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-zoom-in bg-white"
        onMouseEnter={() => !isTouchDevice && setShowZoom(true)}
        onMouseLeave={() => !isTouchDevice && setShowZoom(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsModalOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-contain transition-opacity duration-300 ${
            showZoom && !isTouchDevice ? "opacity-0" : "opacity-100"
          }`}
          priority
        />

        {/* Zoom katmanı sadece masaüstünde (isTouchDevice false iken) görünür */}
        {showZoom && !isTouchDevice && (
          <div
            ref={zoomLayerRef}
            className="absolute inset-0 pointer-events-none will-change-[background-position]"
            style={
              {
                backgroundImage: `url(${src})`,
                backgroundPosition: `var(--zoom-x, 50%) var(--zoom-y, 50%)`,
                backgroundSize: "250%",
                backgroundRepeat: "no-repeat",
                transition: "opacity 0.2s ease-in-out",
              } as React.CSSProperties
            }
          />
        )}
      </div>

      {/* Modal Kısmı */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 animate-in fade-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            className="rounded-sm absolute top-6 right-6 text-white hover:rotate-90 transition-transform duration-300 z-[10000] p-2 hover:bg-white/10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <X size={32} />
          </button>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
