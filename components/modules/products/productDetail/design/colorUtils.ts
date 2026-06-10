// colorUtils.ts
// Logo görsellerindeki renkleri tespit etmek ve değiştirmek için canvas tabanlı yardımcılar.

const QUANT_STEP = 24;

const clamp255 = (value: number) => Math.min(255, Math.max(0, value));

const quantize = (value: number) =>
  clamp255(Math.round(value / QUANT_STEP) * QUANT_STEP);

const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Görsel yüklenemedi"));
    img.src = src;
  });

// Logo görselindeki en baskın renkleri (şeffaf pikseller hariç) tespit eder.
export async function extractPalette(
  src: string,
  maxColors = 6,
): Promise<string[]> {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  const sampleSize = 100;
  const scale = Math.min(1, sampleSize / Math.max(img.width, img.height));
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const counts = new Map<string, number>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 32) continue;
    const hex = rgbToHex(
      quantize(data[i]),
      quantize(data[i + 1]),
      quantize(data[i + 2]),
    );
    counts.set(hex, (counts.get(hex) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxColors)
    .map(([color]) => color);
}

// Logodaki belirli renkleri (extractPalette ile aynı kümeleme mantığıyla) yeni renklerle değiştirir.
export async function applyColorMap(
  src: string,
  colorMap: Record<string, string>,
): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return src;

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  const replacements = new Map<string, [number, number, number]>();
  for (const [original, replacement] of Object.entries(colorMap)) {
    replacements.set(original, hexToRgb(replacement));
  }

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 32) continue;
    const hex = rgbToHex(
      quantize(data[i]),
      quantize(data[i + 1]),
      quantize(data[i + 2]),
    );
    const replacement = replacements.get(hex);
    if (replacement) {
      data[i] = replacement[0];
      data[i + 1] = replacement[1];
      data[i + 2] = replacement[2];
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
