"use client";

import Color from "color";
import { PipetteIcon } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Context ---
interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined,
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context)
    throw new Error("useColorPicker must be used within a ColorPickerProvider");
  return context;
};

// --- Ana Bileşen (Root) ---
export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0];
  defaultValue?: Parameters<typeof Color>[0];
  onChange?: (value: [number, number, number]) => void;
};

export const ColorPicker = ({
  value,
  defaultValue = "#6366f1",
  onChange,
  className,
  children,
  ...props
}: ColorPickerProps) => {
  const selectedColor = value ? Color(value) : null;
  const defaultColor = Color(defaultValue);

  const [hue, setHue] = useState(() => {
    try {
      return selectedColor?.hue() ?? defaultColor.hue() ?? 0;
    } catch {
      return 0;
    }
  });

  const [saturation, setSaturation] = useState(() => {
    try {
      return selectedColor?.saturationl() ?? defaultColor.saturationl() ?? 100;
    } catch {
      return 100;
    }
  });

  const [lightness, setLightness] = useState(() => {
    try {
      return selectedColor?.lightness() ?? defaultColor.lightness() ?? 50;
    } catch {
      return 50;
    }
  });

  const [mode, setMode] = useState("hex");

  // Controlled value update
  useEffect(() => {
    if (value) {
      try {
        const color = Color(value);
        const hslColor = color.hsl();
        setHue(hslColor.hue() || 0);
        setSaturation(hslColor.saturationl() || 0);
        setLightness(hslColor.lightness() || 0);
      } catch (error) {
        console.error("ColorPicker value parse error:", error);
      }
    }
  }, [value]);

  // Notify parent
  const prevValuesRef = useRef({ hue, saturation, lightness });
  useEffect(() => {
    const prev = prevValuesRef.current;
    if (
      prev.hue !== hue ||
      prev.saturation !== saturation ||
      prev.lightness !== lightness
    ) {
      if (onChange) {
        const color = Color.hsl(hue, saturation, lightness);
        const [r, g, b] = color.rgb().array();
        onChange([r, g, b]);
      }
      prevValuesRef.current = { hue, saturation, lightness };
    }
  }, [hue, saturation, lightness, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setMode,
      }}
    >
      <div
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
      >
        {children}
      </div>
    </ColorPickerContext.Provider>
  );
};

// --- Renk Seçim Alanı (Saturation/Lightness) ---
export const ColorPickerSelection = memo(
  ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { hue, setSaturation, setLightness, saturation, lightness } =
      useColorPicker();

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!(isDragging && containerRef.current)) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(1, (event.clientX - rect.left) / rect.width),
        );
        const y = Math.max(
          0,
          Math.min(1, (event.clientY - rect.top) / rect.height),
        );

        setSaturation(x * 100);
        const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x);
        setLightness(topLightness * (1 - y));
      },
      [isDragging, setSaturation, setLightness],
    );

    useEffect(() => {
      const handlePointerUp = () => setIsDragging(false);
      if (isDragging) {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [isDragging, handlePointerMove]);

    // Basit bir ters hesaplama ile imleç pozisyonu (yaklaşık)
    const posX = saturation;
    const posY =
      100 -
      (lightness /
        (saturation < 0.01 ? 100 : 50 + 50 * (1 - saturation / 100))) *
        100;

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative size-full cursor-crosshair rounded overflow-hidden",
          className,
        )}
        style={{
          background: `linear-gradient(0deg, #000, transparent), linear-gradient(90deg, #fff, transparent), hsl(${hue}, 100%, 50%)`,
        }}
        onPointerDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          handlePointerMove(e.nativeEvent);
        }}
        {...props}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
          style={{ left: `${posX}%`, top: `${posY}%` }}
        />
      </div>
    );
  },
);
ColorPickerSelection.displayName = "ColorPickerSelection";

// --- Ton (Hue) Slider ---
export const ColorPickerHue = ({
  className,
  ...props
}: ComponentProps<typeof Slider.Root>) => {
  const { hue, setHue } = useColorPicker();
  return (
    <Slider.Root
      className={cn(
        "relative flex h-4 w-full touch-none items-center",
        className,
      )}
      max={360}
      onValueChange={([val]) => setHue(val)}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
    </Slider.Root>
  );
};

// --- Göz Damlası (EyeDropper) ---
export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  const { setHue, setSaturation, setLightness } = useColorPicker();
  const handleEyeDropper = async () => {
    try {
      // @ts-ignore
      const result = await new EyeDropper().open();
      const color = Color(result.sRGBHex);
      setHue(color.hue());
      setSaturation(color.saturationl());
      setLightness(color.lightness());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      onClick={handleEyeDropper}
      size="icon"
      variant="outline"
      className={cn("shrink-0", className)}
      type="button"
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
};

// --- Format Seçici ---
export const ColorPickerOutput = ({
  className,
  ...props
}: ComponentProps<typeof SelectTrigger>) => {
  const { mode, setMode } = useColorPicker();
  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger
        className={cn("h-8 w-20 shrink-0 text-xs", className)}
        {...props}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {["hex", "rgb", "hsl", "css"].map((f) => (
          <SelectItem key={f} value={f} className="text-xs">
            {f.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// --- Renk Değer Gösterimi ---
export const ColorPickerFormat = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { hue, saturation, lightness, mode } = useColorPicker();
  const color = Color.hsl(hue, saturation, lightness);

  let displayValue = "";
  if (mode === "hex") displayValue = color.hex();
  else if (mode === "rgb")
    displayValue = color.rgb().array().map(Math.round).join(", ");
  else if (mode === "hsl")
    displayValue = color.hsl().array().map(Math.round).join(", ");
  else if (mode === "css") displayValue = color.rgb().string(0);

  return (
    <div className={cn("w-full", className)} {...props}>
      <Input
        className="h-8 w-full bg-secondary px-2 text-xs shadow-none"
        readOnly
        value={displayValue}
      />
    </div>
  );
};

// --- DEMO ---
export function Demo() {
  return (
    <div className="flex items-center justify-center p-8 bg-slate-50 min-h-[400px]">
      <ColorPicker
        defaultValue="#6366f1"
        className="w-64 p-4 bg-white rounded-xl shadow-lg border"
      >
        <ColorPickerSelection className="h-40 rounded-lg" />
        <ColorPickerHue />
        <div className="flex items-center gap-2 mt-2">
          <ColorPickerEyeDropper />
          <ColorPickerOutput />
          <ColorPickerFormat />
        </div>
      </ColorPicker>
    </div>
  );
}
