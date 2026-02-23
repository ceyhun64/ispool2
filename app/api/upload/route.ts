// /api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

async function compressImage(input: Buffer): Promise<Buffer> {
  let quality = 85;

  const process = async (q: number): Promise<Buffer> => {
    const result = await sharp(input)
      .resize(1200, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: q })
      .toBuffer();
    return Buffer.from(new Uint8Array(result));
  };

  let compressed = await process(quality);

  while (compressed.length > 9 * 1024 * 1024 && quality > 40) {
    quality -= 10;
    compressed = await process(quality);
  }

  return compressed;
}

async function compressVideo(input: Buffer): Promise<Buffer> {
  // ← Dinamik import — Turbopack build hatası bu şekilde çözülüyor
  const ffmpeg = (await import("fluent-ffmpeg")).default;
  const ffmpegInstaller = (await import("@ffmpeg-installer/ffmpeg")).default;
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);

  const id = randomUUID();
  const inputPath = join(tmpdir(), `input_${id}.mp4`);
  const outputPath = join(tmpdir(), `output_${id}.mp4`);

  try {
    await writeFile(inputPath, input);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-vcodec libx264",
          "-crf 24",
          "-preset slow",
          "-vf scale=1280:-2",
          "-acodec aac",
          "-b:a 96k",
          "-movflags +faststart",
        ])
        .save(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err));
    });

    const raw = await readFile(outputPath);
    return Buffer.from(new Uint8Array(raw));
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderNameInput = formData.get("folderName") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Dosya bulunamadı. Lütfen bir dosya yükleyin." },
        { status: 400 },
      );
    }

    const folderName =
      (folderNameInput || "genel")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "") || "genel";

    const isVideo = VIDEO_TYPES.includes(file.type);
    const arrayBuffer = await file.arrayBuffer();
    let buffer: Buffer = Buffer.from(new Uint8Array(arrayBuffer));

    if (!isVideo) {
      buffer = await compressImage(buffer);
    } else {
      buffer = await compressVideo(buffer);
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `products/${folderName}`,
          resource_type: isVideo ? "video" : "image",
          ...(!isVideo && {
            format: "webp",
            transformation: [{ quality: "auto:good" }],
          }),
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      path: uploadResult.secure_url,
      resourceType: isVideo ? "video" : "image",
    });
  } catch (err: any) {
    console.error("Dosya yükleme hatası:", err);
    return NextResponse.json(
      { error: err.message || "Yükleme başarısız" },
      { status: 500 },
    );
  }
}
