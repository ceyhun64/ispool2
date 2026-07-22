"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  alt: string;
}

const MODAL_ZOOM_SCALE = 2.5;
const DRAG_THRESHOLD = 4;

export function CustomImageZoom({
  images,
  activeIndex,
  onIndexChange,
  alt,
}: Props) {
  const src = images[activeIndex] ?? images[0];
  const hasMultiple = images.length > 1;
  const [showZoom, setShowZoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const [modalScale, setModalScale] = useState(1);
  const [modalTranslate, setModalTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const modalImageWrapperRef = useRef<HTMLDivElement>(null);
  const panStateRef = useRef<{
    startX: number;
    startY: number;
    startTranslateX: number;
    startTranslateY: number;
    moved: boolean;
  } | null>(null);

  // Cihazın dokunmatik olup olmadığını kontrol et
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    };
    checkTouch();
  }, []);

  const resetModalZoom = useCallback(() => {
    setModalScale(1);
    setModalTranslate({ x: 0, y: 0 });
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    resetModalZoom();
  }, [resetModalZoom]);

  const goToPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!hasMultiple) return;
      resetModalZoom();
      onIndexChange((activeIndex - 1 + images.length) % images.length);
    },
    [hasMultiple, activeIndex, images.length, onIndexChange, resetModalZoom],
  );

  const goToNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!hasMultiple) return;
      resetModalZoom();
      onIndexChange((activeIndex + 1) % images.length);
    },
    [hasMultiple, activeIndex, images.length, onIndexChange, resetModalZoom],
  );

  const clampTranslate = useCallback(
    (x: number, y: number, scale: number) => {
      const el = modalImageWrapperRef.current;
      if (!el) return { x, y };
      const maxX = (el.offsetWidth * (scale - 1)) / 2;
      const maxY = (el.offsetHeight * (scale - 1)) / 2;
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [],
  );

  // Resme tıklayınca yakınlaştır/uzaklaştır; sürükleme sonrası tetiklenen
  // click'te toggle yapılmaz (sürükleme ile yakınlaştırmayı kapatmayı önler).
  const handleModalImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (panStateRef.current?.moved) return;
      if (modalScale === 1) {
        setModalScale(MODAL_ZOOM_SCALE);
      } else {
        resetModalZoom();
      }
    },
    [modalScale, resetModalZoom],
  );

  const handleModalPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (modalScale === 1) return;
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      panStateRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTranslateX: modalTranslate.x,
        startTranslateY: modalTranslate.y,
        moved: false,
      };
      setIsPanning(true);
    },
    [modalScale, modalTranslate],
  );

  const handleModalPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pan = panStateRef.current;
      if (!pan || modalScale === 1) return;
      const dx = e.clientX - pan.startX;
      const dy = e.clientY - pan.startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        pan.moved = true;
      }
      if (!pan.moved) return;
      const next = clampTranslate(
        pan.startTranslateX + dx,
        pan.startTranslateY + dy,
        modalScale,
      );
      setModalTranslate(next);
    },
    [modalScale, clampTranslate],
  );

  const handleModalPointerUp = useCallback((e: React.PointerEvent) => {
    setIsPanning(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Modal açıldığında body scroll'u, topbar, navbar ve CategoryBar'ı gizle
  useEffect(() => {
    if (isModalOpen) {
      // Body scroll'u kapat
      document.body.style.overflow = "hidden";

      // Topbar'ı gizle
      const topbar = document.querySelector("[data-topbar]") as HTMLElement;
      if (topbar) {
        topbar.style.display = "none";
      }

      // Navbar'ı gizle
      const navbar = document.querySelector("[data-navbar]") as HTMLElement;
      if (navbar) {
        navbar.style.display = "none";
      }

      // CategoryBar'ı gizle
      const categoryBar = document.querySelector(
        "[data-category-bar]",
      ) as HTMLElement;
      if (categoryBar) {
        categoryBar.style.display = "none";
      }
    } else {
      // Modal kapandığında her şeyi geri yükle
      document.body.style.overflow = "unset";

      const topbar = document.querySelector("[data-topbar]") as HTMLElement;
      if (topbar) {
        topbar.style.display = "";
      }

      const navbar = document.querySelector("[data-navbar]") as HTMLElement;
      if (navbar) {
        navbar.style.display = "";
      }

      const categoryBar = document.querySelector(
        "[data-category-bar]",
      ) as HTMLElement;
      if (categoryBar) {
        categoryBar.style.display = "";
      }
    }

    return () => {
      // Cleanup
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // ESC ile kapatma, ok tuşlarıyla diğer resimlere geçiş
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleClose, goToPrev, goToNext]);

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
    [isTouchDevice],
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
          className={`object-contain transition-opacity duration-300  ${
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

      {/* Modal - Full screen overlay with maximum z-index */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
          style={{
            zIndex: 999999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={handleClose}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white hover:text-slate-300 transition-all duration-300 p-3 hover:bg-white/10 rounded-full group"
            style={{ zIndex: 1000000 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Kapat"
          >
            <X
              size={32}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
          </button>

          {/* ESC tuşu ile kapatma hint */}
          <div
            className="absolute hidden top-6 left-6 text-white/60 text-sm font-medium md:flex items-center gap-2"
            style={{ zIndex: 1000000 }}
          >
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
            <span>
              ile kapat • Resme tıkla:{" "}
              {modalScale === 1 ? "yakınlaştır" : "uzaklaştır"}
            </span>
          </div>

          {/* Diğer resimlere geçiş okları */}
          {hasMultiple && (
            <>
              <button
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-all duration-300 p-2 md:p-3 hover:bg-white/10 rounded-full"
                style={{ zIndex: 1000000 }}
                onClick={goToPrev}
                aria-label="Önceki resim"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-all duration-300 p-2 md:p-3 hover:bg-white/10 rounded-full"
                style={{ zIndex: 1000000 }}
                onClick={goToNext}
                aria-label="Sonraki resim"
              >
                <ChevronRight size={32} />
              </button>

              {/* Resim sayacı */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold tracking-widest bg-white/10 px-3 py-1.5 rounded-full"
                style={{ zIndex: 1000000 }}
              >
                {activeIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Image Container */}
          <div className="relative w-[95vw] h-[95vh] flex items-center justify-center">
            <div
              ref={modalImageWrapperRef}
              className="relative w-full h-full"
              style={{
                cursor:
                  modalScale === 1
                    ? "zoom-in"
                    : isPanning
                      ? "grabbing"
                      : "grab",
                touchAction: "none",
              }}
              onClick={handleModalImageClick}
              onPointerDown={handleModalPointerDown}
              onPointerMove={handleModalPointerMove}
              onPointerUp={handleModalPointerUp}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transform: `translate(${modalTranslate.x}px, ${modalTranslate.y}px) scale(${modalScale})`,
                  transition: isPanning
                    ? "none"
                    : "transform 0.25s ease-out",
                  willChange: "transform",
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain select-none pointer-events-none"
                  quality={100}
                  priority
                  sizes="95vw"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
