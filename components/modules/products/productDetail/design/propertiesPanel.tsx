// PropertiesPanel.tsx
import React from "react";
import {
  Settings,
  LayoutTemplate,
  SlidersHorizontal,
  Droplets,
  Sun,
  Contrast,
  Palette,
  Blend,
  RotateCcw,
  Layers,
} from "lucide-react";
import { LogoLayer, cn } from "./types";
import { QUICK_POSITIONS, BLEND_MODES } from "./constants";

interface PropertiesPanelProps {
  activeLayer: LogoLayer | undefined;
  onLayerUpdate: (updates: Partial<LogoLayer>) => void;
  onResetLayer: () => void;
  onRemoveBackground: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  activeLayer,
  onLayerUpdate,
  onResetLayer,
  onRemoveBackground,
}) => {
  if (!activeLayer) {
    return (
      <div className="w-[340px] bg-slate-800 border-l border-slate-700 overflow-y-auto">
        <div className="h-full flex items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
              <Layers size={24} className="text-slate-500" />
            </div>
            <p className="text-sm font-bold text-slate-500">Katman Seçilmedi</p>
            <p className="text-xs text-slate-600">
              Düzenlemek için sol panelden bir katman seçin
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[340px] bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Transform Section */}
        <section className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Settings size={12} /> Transform
          </div>

          {/* Size Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] text-slate-500 font-semibold">
                Genişlik
              </label>
              <input
                type="number"
                value={activeLayer.size.width}
                onChange={(e) =>
                  onLayerUpdate({
                    size: {
                      ...activeLayer.size,
                      width: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs border border-slate-600 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] text-slate-500 font-semibold">
                Yükseklik
              </label>
              <input
                type="number"
                value={activeLayer.size.height}
                onChange={(e) =>
                  onLayerUpdate({
                    size: {
                      ...activeLayer.size,
                      height: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs border border-slate-600 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold">
                Döndürme
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                {activeLayer.rotation}°
              </span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeLayer.rotation}
              onChange={(e) =>
                onLayerUpdate({ rotation: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>
          {activeLayer && (
            <button
              onClick={() => onRemoveBackground(activeLayer.id)}
              className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 rounded"
            >
              Arka Planı Kaldır
            </button>
          )}

          {/* Flip Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLayerUpdate({ flipH: !activeLayer.flipH })}
              className={cn(
                "py-2 text-[10px] font-bold rounded border transition-all",
                activeLayer.flipH
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-slate-700 text-slate-300 border-slate-600",
              )}
            >
              Yatay Çevir
            </button>
            <button
              onClick={() => onLayerUpdate({ flipV: !activeLayer.flipV })}
              className={cn(
                "py-2 text-[10px] font-bold rounded border transition-all",
                activeLayer.flipV
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-slate-700 text-slate-300 border-slate-600",
              )}
            >
              Dikey Çevir
            </button>
          </div>
        </section>

        {/* Quick Position Section */}
        <section className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <LayoutTemplate size={12} /> Hızlı Konum
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {QUICK_POSITIONS.map((pos) => (
              <button
                key={pos.name}
                onClick={() =>
                  onLayerUpdate({ position: { x: pos.x, y: pos.y } })
                }
                className="text-[9px] py-2 bg-slate-700 hover:bg-orange-600 text-slate-300 hover:text-white rounded font-semibold transition-all"
              >
                {pos.name}
              </button>
            ))}
          </div>
        </section>

        {/* Adjustments Section */}
        <section className="space-y-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal size={12} /> Ayarlamalar
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                <Droplets size={10} /> Opaklık
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                %{activeLayer.opacity}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={activeLayer.opacity}
              onChange={(e) =>
                onLayerUpdate({ opacity: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Brightness */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                <Sun size={10} /> Parlaklık
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                %{activeLayer.brightness}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={activeLayer.brightness}
              onChange={(e) =>
                onLayerUpdate({ brightness: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                <Contrast size={10} /> Kontrast
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                %{activeLayer.contrast}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={activeLayer.contrast}
              onChange={(e) =>
                onLayerUpdate({ contrast: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold flex items-center gap-1">
                <Palette size={10} /> Doygunluk
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                %{activeLayer.saturation}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={activeLayer.saturation}
              onChange={(e) =>
                onLayerUpdate({ saturation: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Hue */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold">
                Renk Tonu
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                {activeLayer.hue}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={activeLayer.hue}
              onChange={(e) => onLayerUpdate({ hue: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Blur */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-[9px] text-slate-500 font-semibold">
                Bulanıklık
              </label>
              <span className="text-[9px] text-orange-400 font-bold">
                {activeLayer.blur}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={activeLayer.blur}
              onChange={(e) => onLayerUpdate({ blur: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </section>

        {/* Blend Mode Section */}
        <section className="space-y-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Blend size={12} /> Karışım Modu
          </div>
          <select
            value={activeLayer.blendMode}
            onChange={(e) => onLayerUpdate({ blendMode: e.target.value })}
            className="w-full bg-slate-700 text-slate-200 px-3 py-2 rounded text-xs border border-slate-600 focus:border-orange-500 outline-none"
          >
            {BLEND_MODES.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.name}
              </option>
            ))}
          </select>
        </section>

        {/* Reset Button */}
        <button
          onClick={onResetLayer}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={14} /> Tüm Ayarları Sıfırla
        </button>
      </div>
    </div>
  );
};
