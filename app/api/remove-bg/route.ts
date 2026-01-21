// app/api/remove-bg/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Resim verisi bulunamadı" },
        { status: 400 },
      );
    }

    // API Key kontrolü
    if (!process.env.REMOVE_BG_API_KEY) {
      console.error("REMOVE_BG_API_KEY tanımlanmamış!");
      return NextResponse.json(
        {
          error:
            "API anahtarı yapılandırılmamış. Lütfen .env dosyasını kontrol edin.",
        },
        { status: 500 },
      );
    }

    console.log("Base64 uzunluğu:", imageBase64.length);

    // Base64'ü binary'ye çevir
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const binaryData = Buffer.from(base64Data, "base64");

    console.log("Binary data boyutu:", binaryData.length);

    // Blob oluştur
    const blob = new Blob([binaryData], { type: "image/png" });

    // FormData oluştur ve binary dosyayı ekle
    const formData = new FormData();
    formData.append("image_file", blob, "image.png");
    formData.append("size", "full"); // "preview" | "medium" | "hd" | "full"

    console.log("Remove.bg API'sine istek gönderiliyor...");

    const response = await fetch("https://removebgapi.com/api/v1/remove", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
      },
      body: formData,
    });

    console.log("Remove.bg API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg API Error:", errorText);

      let errorMessage = "Arka plan kaldırma işlemi başarısız oldu";
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage =
          errorJson.error?.message ||
          errorJson.errors?.[0]?.title ||
          errorMessage;
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

    console.log("Arka plan başarıyla kaldırıldı!");

    return NextResponse.json({
      image: `data:image/png;base64,${base64Result}`,
    });
  } catch (error) {
    console.error("Background removal error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Sunucu hatası oluştu",
      },
      { status: 500 },
    );
  }
}
