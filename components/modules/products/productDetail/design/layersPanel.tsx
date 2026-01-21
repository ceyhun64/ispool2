// LayersPanel.tsx
import React from "react";
import { UploadCloud, Layers } from "lucide-react";
import { LogoLayer } from "./types";
import { LayerItem } from "./layerItem";

interface LayersPanelProps {
  layers: LogoLayer[];
  activeLayerId: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLayerSelect: (id: string) => void;
  onLayerUpdate: (id: string, updates: Partial<LogoLayer>) => void;
  onLayerDuplicate: (id: string) => void;
  onLayerDelete: (id: string) => void;
  onLayerMove: (id: string, direction: "up" | "down") => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  onFileUpload,
  onLayerSelect,
  onLayerUpdate,
  onLayerDuplicate,
  onLayerDelete,
  onLayerMove,
}) => {
  return (
    <div className="w-[280px] bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Upload Area */}
      <div className="p-4 border-b border-slate-700">
        <label className="group relative flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-600 rounded hover:border-orange-500 hover:bg-slate-700/50 transition-all cursor-pointer">
          <UploadCloud
            className="text-slate-500 group-hover:text-orange-500 mb-1"
            size={20}
          />
          <span className="text-xs font-bold text-slate-400">Logo Ekle</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onFileUpload}
          />
        </label>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Layers size={12} /> Katmanlar ({layers.length})
        </div>

        {layers.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs">
            Henüz katman yok
          </div>
        ) : (
          [...layers].reverse().map((layer) => (
            <LayerItem
              key={layer.id}
              layer={layer}
              isActive={activeLayerId === layer.id}
              onSelect={() => onLayerSelect(layer.id)}
              onUpdate={(updates) => onLayerUpdate(layer.id, updates)}
              onDuplicate={() => onLayerDuplicate(layer.id)}
              onDelete={() => onLayerDelete(layer.id)}
              onMoveUp={() => onLayerMove(layer.id, "up")}
              onMoveDown={() => onLayerMove(layer.id, "down")}
            />
          ))
        )}
      </div>
    </div>
  );
};