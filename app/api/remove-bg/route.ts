// app/api/remove-bg/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ücretli bir 3. parti API'yi tüketiyor; kota istismarını önlemek için sınırla
  const ip = getClientIp(req);
  const rl = rateLimit(`remove-bg:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Çok fazla istek. Lütfen birkaç dakika bekleyin." },
      { status: 429 },
    );
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Resim verisi bulunamadı" },
        { status: 400 },
      );
    }

    // API Key kontrolü
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      console.error("REMOVE_BG_API_KEY tanımlanmamış!");
      return NextResponse.json(
        {
          error:
            "API anahtarı yapılandırılmamış. Lütfen .env dosyasını kontrol edin.",
        },
        { status: 500 },
      );
    }

    // Base64'ü binary'ye çevir. MIME tipi data URL'in KENDİSİNDEN okunur;
    // önceden gövde ne olursa olsun "image/png" olarak etiketlenip
    // "image.png" adıyla gönderiliyordu. İstemci görseli yüklemeden önce
    // küçültürken JPEG'e çeviriyor (colorUtils.ts -> resizeImageForUpload),
    // yani remove.bg'ye PNG diye JPEG gövdesi gidiyor ve servis bunu
    // `invalid_file_type` ile reddediyordu.
    const dataUrlMatch = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]*)$/.exec(
      imageBase64,
    );
    const mimeType = dataUrlMatch?.[1] ?? "image/png";
    const base64Data =
      dataUrlMatch?.[2] ?? imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    if (binaryData.length === 0) {
      return NextResponse.json(
        { error: "Resim verisi okunamadı" },
        { status: 400 },
      );
    }

    // remove.bg jpg/png/webp kabul eder; uzantı da gövdeyle tutarlı olmalı.
    const extension = mimeType.split("/")[1].replace("jpeg", "jpg");

    // FormData oluştur
    const formData = new FormData();
    const blob = new Blob([binaryData], { type: mimeType });
    formData.append("image_file", blob, `image.${extension}`);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg API Error:", errorText);

      let errorMessage = "Arka plan kaldırma işlemi başarısız oldu";
      try {
        const errorJson = JSON.parse(errorText);
        const apiError = errorJson.errors?.[0];
        if (apiError?.code === "invalid_file_type") {
          errorMessage =
            "Seçilen dosya geçerli bir resim dosyası değil (jpg, png veya webp olmalı). Lütfen başka bir görsel seçin.";
        } else {
          errorMessage =
            apiError?.title || errorJson.error?.message || errorMessage;
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status },
      );
    }

    // API'den gelen görüntüyü base64'e çevir
    const buffer = await response.arrayBuffer();
    const base64Result = Buffer.from(buffer).toString("base64");

    return NextResponse.json({
      image: `data:image/png;base64,${base64Result}`,
    });
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      {
        error: "Sunucu hatası oluştu",
      },
      { status: 500 },
    );
  }
}
