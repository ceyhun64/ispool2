// DesignPanel - Ana component (mobile responsive)
"use client";

import React, { useState, useRef, useEffect } from "react";
import { DesignPanelProps, LogoLayer } from "./types";
import { DEFAULT_LAYER_VALUES } from "./constants";
import { Toolbar } from "./toolbar";
import { LayersPanel } from "./layersPanel";
import { Canvas } from "./canvas";
import { PropertiesPanel } from "./propertiesPanel";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import {
  extractPalette,
  applyColorMap,
  resizeImageForUpload,
} from "./colorUtils";

// Dosyayı data URL olarak okur. Katman görselleri BİLEREK blob: değil data:
// olarak tutulur — gerekçe handleFileUpload içindeki açıklamada.
const readFileAsDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsDataURL(file);
  });

// html-to-image, bir katman görselini gömemediğinde promise'i ARGÜMANSIZ
// reddediyor (embed-images.js: clonedNode.onerror = reject). Bu yüzden catch
// bloğuna çoğu zaman undefined düşüyor ve tek satırlık genel mesaj teşhisi
// imkânsız kılıyordu. Elde ne varsa kullanıcıya taşı.
const describeRenderError = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return `${fallback} (${error.message})`;
  }
  return `${fallback} Katman görsellerinden biri okunamadı — logoyu kaldırıp yeniden ekleyip deneyin.`;
};

// Dışa aktarımda görüntüye girmemesi gereken yardımcı öğeler.
const EXPORT_EXCLUDED_CLASSES = [
  "react-resizable-handle",
  "export-hide-guides",
  "export-hide-handles",
  "selection-ring",
];

// "İndir" ve "kaydet & kapat" birebir aynı görüntüyü üretir; aynı kodun iki
// kopyası yerine tek kaynak.
const renderDesignToPng = async (): Promise<string> => {
  const designArea = document.getElementById("design-area");
  if (!designArea) {
    throw new Error("Tasarım alanı bulunamadı");
  }

  // Seçim çerçevesinin kaldırılması ekrana yansısın diye bir tık bekle.
  await new Promise((resolve) => setTimeout(resolve, 50));

  return toPng(designArea, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    filter: (node: HTMLElement) =>
      !node.classList ||
      !EXPORT_EXCLUDED_CLASSES.some((cls) => node.classList.contains(cls)),
  });
};

export default function DesignPanel({
  productImage,
  onClose,
  onSaveDesign,
  onDirectUpload,
}: DesignPanelProps & {
  onSaveDesign?: (imageUrl: string) => void;
  onDirectUpload?: () => void;
}) {
  const [layers, setLayers] = useState<LogoLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [history, setHistory] = useState<LogoLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [tool, setTool] = useState<"select" | "pan">("select");
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
      if (e.key === "v") setTool("select");
      if (e.key === "h") setTool("pan");
      if (e.key === "Delete" && activeLayerId) {
        e.preventDefault();
        deleteLayer(activeLayerId);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [historyIndex, history, activeLayerId]);

  // History Management
  const saveHistory = (newLayers: LogoLayer[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newLayers)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Layer Operations
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen geçerli bir resim dosyası seçin.");
      return;
    }

    // Katman görseli data URL olarak tutulur, blob: olarak DEĞİL.
    // html-to-image dışa aktarırken her <img> kaynağını fetch ile data URL'e
    // çevirmeye çalışır; blob: adresleri CSP'nin connect-src listesinde
    // olmadığı için bu fetch bloklanıyor, kütüphane hatayı yutup img.src'yi
    // boş string'e çekiyor ve ardından gelen error olayı toPng promise'ini
    // reddediyordu — "Tasarım kaydedilemedi" ve "Görsel oluşturulurken bir
    // hata oluştu" hatalarının kaynağı buydu. data URL kullanıldığında
    // html-to-image hiç fetch yapmaz (isDataUrl kısa devresi). Ek fayda:
    // revoke edilmeyen object URL sızıntısı da ortadan kalkar.
    let url: string;
    try {
      url = await readFileAsDataURL(file);
    } catch (err) {
      console.error("Dosya okuma hatası:", err);
      toast.error("Dosya okunamadı. Lütfen tekrar deneyin.");
      return;
    }

    let palette: string[] = [];
    try {
      palette = await extractPalette(url);
    } catch (err) {
      console.error("Palette extraction error:", err);
    }

    const newLayer: LogoLayer = {
      ...DEFAULT_LAYER_VALUES,
      id: `layer-${Date.now()}`,
      image: url,
      originalImage: url,
      colorMap: null,
      palette,
      name: `Logo ${layers.length + 1}`,
    };
    const newLayers = [...layers, newLayer];
    setLayers(newLayers);
    setActiveLayerId(newLayer.id);
    saveHistory(newLayers);
    toast.success("Logo eklendi!");
  };

  const updateLayer = (id: string, updates: Partial<LogoLayer>) => {
    const newLayers = layers.map((l) =>
      l.id === id ? { ...l, ...updates } : l,
    );
    setLayers(newLayers);
    saveHistory(newLayers);
  };

  const deleteLayer = (id: string) => {
    const newLayers = layers.filter((l) => l.id !== id);
    setLayers(newLayers);
    setActiveLayerId(newLayers[0]?.id || null);
    saveHistory(newLayers);
    toast.info("Katman silindi");
  };

  const duplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      const newLayer = {
        ...JSON.parse(JSON.stringify(layer)),
        id: `layer-${Date.now()}`,
        position: { x: layer.position.x + 20, y: layer.position.y + 20 },
        name: `${layer.name} Copy`,
      };
      const newLayers = [...layers, newLayer];
      setLayers(newLayers);
      setActiveLayerId(newLayer.id);
      saveHistory(newLayers);
      toast.success("Katman kopyalandı!");
    }
  };

  const moveLayer = (id: string, direction: "up" | "down") => {
    const index = layers.findIndex((l) => l.id === id);
    if (
      (direction === "up" && index < layers.length - 1) ||
      (direction === "down" && index > 0)
    ) {
      const newLayers = [...layers];
      const offset = direction === "up" ? 1 : -1;
      [newLayers[index], newLayers[index + offset]] = [
        newLayers[index + offset],
        newLayers[index],
      ];
      setLayers(newLayers);
      saveHistory(newLayers);
    }
  };

  const resetLayer = () => {
    if (activeLayer) {
      updateLayer(activeLayer.id, {
        rotation: 0,
        opacity: 100,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        flipH: false,
        flipV: false,
        tintColor: null,
        colorMap: null,
        image: activeLayer.originalImage || activeLayer.image,
      });
      toast.success("Katman sıfırlandı!");
    }
  };

  const handleColorMapChange = async (
    originalColor: string,
    newColor: string | null,
  ) => {
    if (!activeLayer || !activeLayer.originalImage) return;

    const newColorMap = { ...(activeLayer.colorMap || {}) };
    if (newColor) {
      newColorMap[originalColor] = newColor;
    } else {
      delete newColorMap[originalColor];
    }

    const hasMappings = Object.keys(newColorMap).length > 0;

    try {
      const newImage = hasMappings
        ? await applyColorMap(activeLayer.originalImage, newColorMap)
        : activeLayer.originalImage;

      updateLayer(activeLayer.id, {
        colorMap: hasMappings ? newColorMap : null,
        image: newImage,
        tintColor: null,
      });
    } catch (err) {
      console.error("Color remap error:", err);
      toast.error("Renk değiştirilemedi.");
    }
  };

  const handleResetColors = () => {
    if (!activeLayer || !activeLayer.originalImage) return;
    updateLayer(activeLayer.id, {
      colorMap: null,
      image: activeLayer.originalImage,
    });
  };

  const removeBackground = async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    toast.loading("Arka plan kaldırılıyor...");

    try {
      // Sunucunun istek boyutu sınırını aşmamak için göndermeden önce
      // küçültülür (bkz. resizeImageForUpload açıklaması).
      const imageBase64 = await resizeImageForUpload(layer.image);

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "API isteği başarısız oldu");
      }

      let palette: string[] = [];
      try {
        palette = await extractPalette(data.image);
      } catch (err) {
        console.error("Palette extraction error:", err);
      }

      updateLayer(layerId, {
        image: data.image,
        originalImage: data.image,
        backgroundRemoved: true,
        colorMap: null,
        palette,
      });

      toast.dismiss();
      toast.success("Arka plan başarıyla kaldırıldı!");
    } catch (err) {
      console.error("Background removal error:", err);
      toast.dismiss();
      toast.error(
        err instanceof Error
          ? err.message
          : "Arka plan kaldırılamadı. Lütfen tekrar deneyin.",
      );
    }
  };

  const handleExport = async () => {
    if (layers.length === 0) {
      toast.error("Lütfen önce bir logo ekleyin.");
      return;
    }

    const currentActiveId = activeLayerId;
    setActiveLayerId(null);

    toast.loading("Görsel hazırlanıyor...");

    try {
      const dataUrl = await renderDesignToPng();

      const link = document.createElement("a");
      link.download = `tasarim-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.dismiss();
      toast.success("Tasarım başarıyla indirildi!");
    } catch (error) {
      console.error("Export hatası:", error);
      toast.dismiss();
      toast.error(describeRenderError(error, "Görsel oluşturulamadı."));
    } finally {
      setActiveLayerId(currentActiveId);
    }
  };

  const handleSaveAndClose = async () => {
    if (layers.length === 0) {
      toast.info(
        "Logo eklenmedi. Dosya yükleme ekranına yönlendiriliyorsunuz...",
      );
      if (onDirectUpload) {
        onDirectUpload();
      }
      onClose();
      return;
    }

    const currentActiveId = activeLayerId;
    setActiveLayerId(null);

    toast.loading("Tasarım kaydediliyor...");

    try {
      const dataUrl = await renderDesignToPng();

      toast.dismiss();
      toast.success("Tasarımınız başarıyla kaydedildi! 🎨");

      if (onSaveDesign) {
        onSaveDesign(dataUrl);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      toast.dismiss();
      toast.error(describeRenderError(error, "Tasarım kaydedilemedi."));
      setActiveLayerId(currentActiveId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-slate-900 w-full max-w-[1600px] overflow-hidden shadow-2xl flex flex-col h-full border border-slate-700">
        {/* Toolbar */}
        <Toolbar
          historyIndex={historyIndex}
          historyLength={history.length}
          tool={tool}
          zoom={zoom}
          showGrid={showGrid}
          showLeftPanel={showLeftPanel}
          showRightPanel={showRightPanel}
          onUndo={undo}
          onRedo={redo}
          onToolChange={setTool}
          onZoomChange={setZoom}
          onGridToggle={() => setShowGrid(!showGrid)}
          onToggleLeftPanel={() => setShowLeftPanel(!showLeftPanel)}
          onToggleRightPanel={() => setShowRightPanel(!showRightPanel)}
          onExport={handleExport}
          onClose={handleSaveAndClose}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          {showLeftPanel && (
            <div className="hidden lg:block">
              <LayersPanel
                layers={layers}
                activeLayerId={activeLayerId}
                onFileUpload={handleFileUpload}
                onLayerSelect={setActiveLayerId}
                onLayerUpdate={updateLayer}
                onLayerDuplicate={duplicateLayer}
                onLayerDelete={deleteLayer}
                onLayerMove={moveLayer}
              />
            </div>
          )}

          {/* Canvas */}
          <Canvas
            productImage={productImage}
            layers={layers}
            activeLayerId={activeLayerId}
            zoom={zoom}
            showGrid={showGrid}
            showGuides={showGuides}
            tool={tool}
            canvasRef={canvasRef}
            onLayerUpdate={updateLayer}
          />

          {/* Right Panel */}
          {showRightPanel && (
            <div className="hidden lg:block">
              <PropertiesPanel
                activeLayer={activeLayer}
                onLayerUpdate={(updates) =>
                  activeLayer && updateLayer(activeLayer.id, updates)
                }
                onResetLayer={resetLayer}
                onRemoveBackground={removeBackground}
                onColorMapChange={handleColorMapChange}
                onResetColors={handleResetColors}
              />
            </div>
          )}
        </div>

        {/* Mobile Bottom Sheet for Layers/Properties */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 max-h-[40vh] overflow-y-auto">
          {activeLayer ? (
            <PropertiesPanel
              activeLayer={activeLayer}
              onLayerUpdate={(updates) =>
                activeLayer && updateLayer(activeLayer.id, updates)
              }
              onResetLayer={resetLayer}
              onRemoveBackground={removeBackground}
              onColorMapChange={handleColorMapChange}
              onResetColors={handleResetColors}
            />
          ) : (
            <LayersPanel
              layers={layers}
              activeLayerId={activeLayerId}
              onFileUpload={handleFileUpload}
              onLayerSelect={setActiveLayerId}
              onLayerUpdate={updateLayer}
              onLayerDuplicate={duplicateLayer}
              onLayerDelete={deleteLayer}
              onLayerMove={moveLayer}
            />
          )}
        </div>
      </div>
    </div>
  );
}
