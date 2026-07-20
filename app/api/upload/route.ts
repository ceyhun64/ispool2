// /api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isInternalRequest } from "@/lib/internalAuth";
import { uploadToCloudinary, UploadError } from "@/lib/cloudinaryUpload";

export async function POST(req: NextRequest) {
  // Doğrudan tarayıcıdan gelen isteklerde oturum, diğer route handler'ların
  // (banner/blog/hero-slides/cart) sunucu içi çağrılarında internal secret
  // aranır — her iki durumda da çağıran taraf zaten kendi yetki kontrolünü
  // yapmış olmalıdır.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id && !isInternalRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const result = await uploadToCloudinary(file, folderNameInput || "genel");
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Dosya yükleme hatası:", err);
    const status = err instanceof UploadError ? 400 : 500;
    return NextResponse.json(
      { error: err.message || "Yükleme başarısız" },
      { status },
    );
  }
}
