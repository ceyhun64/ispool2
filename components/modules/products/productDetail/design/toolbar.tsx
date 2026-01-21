// Toolbar.tsx
import React from "react";
import {
  HardHat,
  Undo,
  Redo,
  Move,
  Hand,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Download,
  Check,
  X,
} from "lucide-react";
import { cn } from "./types";

interface ToolbarProps {
  historyIndex: number;
  historyLength: number;
  tool: "select" | "pan";
  zoom: number;
  showGrid: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onToolChange: (tool: "select" | "pan") => void;
  onZoomChange: (zoom: number) => void;
  onGridToggle: () => void;
  onExport: () => void;
  onClose: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  historyIndex,
  historyLength,
  tool,
  zoom,
  showGrid,
  onUndo,
  onRedo,
  onToolChange,
  onZoomChange,
  onGridToggle,
  onExport,
  onClose,
}) => {
  return (
    <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 text-orange-500">
          <HardHat size={18} />
          <span className="font-black text-sm tracking-wider">
            PROFESSIONAL DESIGN STUDIO
          </span>
        </div>

        {/* History Controls */}
        <div className="flex items-center gap-1 ml-4 border-l border-slate-700 pl-4">
          <button
            onClick={onUndo}
            disabled={historyIndex <= 0}
            className={cn(
              "p-2 rounded hover:bg-slate-700 transition-colors",
              historyIndex <= 0
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-300"
            )}
            title="Geri Al (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIndex >= historyLength - 1}
            className={cn(
              "p-2 rounded hover:bg-slate-700 transition-colors",
              historyIndex >= historyLength - 1
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-300"
            )}
            title="İleri Al (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>

        {/* Tools */}
        <div className="flex items-center gap-1 ml-4 border-l border-slate-700 pl-4">
          <button
            onClick={() => onToolChange("select")}
            className={cn(
              "p-2 rounded transition-colors",
              tool === "select"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            )}
            title="Seçim Aracı (V)"
          >
            <Move size={16} />
          </button>
          <button
            onClick={() => onToolChange("pan")}
            className={cn(
              "p-2 rounded transition-colors",
              tool === "pan"
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            )}
            title="El Aracı (H)"
          >
            <Hand size={16} />
          </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 ml-4 border-l border-slate-700 pl-4">
          <button
            onClick={() => onZoomChange(Math.max(25, zoom - 25))}
            className="p-2 text-slate-300 hover:bg-slate-700 rounded transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-bold text-slate-400 min-w-[50px] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(400, zoom + 25))}
            className="p-2 text-slate-300 hover:bg-slate-700 rounded transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={onGridToggle}
            className={cn(
              "p-2 rounded transition-colors ml-2",
              showGrid
                ? "bg-orange-600 text-white"
                : "text-slate-300 hover:bg-slate-700"
            )}
          >
            <Grid3x3 size={16} />
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Download size={14} /> Export PNG
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Check size={14} /> Kaydet & Kapat
        </button>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white transition-colors ml-2"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};