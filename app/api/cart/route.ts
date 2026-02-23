// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Upload helper
// ---------------------------------------------------------------------------
async function uploadToCloudinary(file: File, folder: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folderName", folder);

  const res = await fetch(`${baseUrl}/api/upload`, {
    method: "POST",
    body: fd,
  });
  if (!res.ok) throw new Error("Cloudinary yükleme hatası");
  const data = await res.json();
  return data.path as string;
}

// ---------------------------------------------------------------------------
// GET  /api/cart
// ---------------------------------------------------------------------------
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        product: true,
        size: true, // ← beden adı / bilgi ile birlikte döndür
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Sepet yüklenemedi" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST  /api/cart   — yeni item ekle ya da mevcut adet arttır
// ---------------------------------------------------------------------------
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const formData = await req.formData();

    const productId = Number(formData.get("productId"));
    const quantity = Number(formData.get("quantity") || 1);
    const sizeIdRaw = formData.get("sizeId") as string | null;
    const sizeId = sizeIdRaw ? Number(sizeIdRaw) : null; // ← beden
    const customFile = formData.get("customImageFile") as File | null;
    let customImageUrl = formData.get("customImage") as string | null;

    // ─── Validasyon ────────────────────────────────────────────────────────
    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
    }
    if (quantity < 1) {
      return NextResponse.json({ error: "Geçersiz miktar" }, { status: 400 });
    }

    // ürün var mı
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // beden var mı (gönderilmişse)
    if (sizeId) {
      const size = await prisma.size.findUnique({ where: { id: sizeId } });
      if (!size) {
        return NextResponse.json({ error: "Geçersiz beden" }, { status: 400 });
      }
    }

    // ─── Resim yükleme ─────────────────────────────────────────────────────
    if (customFile && customFile.size > 0) {
      if (customFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Dosya boyutu 5MB'dan küçük olmalıdır" },
          { status: 400 },
        );
      }
      if (!customFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Geçersiz dosya tipi" },
          { status: 400 },
        );
      }
      customImageUrl = await uploadToCloudinary(
        customFile,
        "user_customizations",
      );
    }

    // base64 → cloudinary
    if (customImageUrl && customImageUrl.startsWith("data:image/")) {
      try {
        const base64Res = await fetch(customImageUrl);
        const blob = await base64Res.blob();
        const file = new File([blob], "custom-design.png", {
          type: "image/png",
        });
        customImageUrl = await uploadToCloudinary(file, "user_customizations");
      } catch (err) {
        console.error("Base64 upload error:", err);
      }
    }

    // ─── Duplicate kontrolü: productId + sizeId + customImage ──────────────
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: Number(session.user.id),
        productId,
        sizeId, // null === null → normal ürün
        customImage: customImageUrl || null, // null === null → özel resim yok
      },
    });

    if (existing) {
      // aynı kombinasyon → adet arttır
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true, size: true },
      });
      return NextResponse.json(updated);
    }

    // ─── Yeni kayıt ────────────────────────────────────────────────────────
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: Number(session.user.id),
        productId,
        quantity,
        sizeId, // ← beden kaydedildi
        customImage: customImageUrl || null,
      },
      include: { product: true, size: true },
    });

    return NextResponse.json(cartItem);
  } catch (error: any) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: error.message || "İşlem başarısız" },
      { status: 500 },
    );
  }
}
