import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Resim yükleme yardımcı fonksiyonu
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

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 200 });

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: Number(session.user.id) },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ error: "Sepet yüklenemedi" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const formData = await req.formData();

    // Verileri FormData'dan alıyoruz
    const productId = Number(formData.get("productId"));
    const quantity = Number(formData.get("quantity") || 1);
    const customFile = formData.get("customImageFile") as File | null;
    let customImageUrl = formData.get("customImage") as string | null;

    // Validasyon
    if (!productId || isNaN(productId)) {
      return NextResponse.json({ error: "Geçersiz ürün ID" }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Geçersiz miktar" }, { status: 400 });
    }

    // Ürünün var olduğunu kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }

    // Eğer bir dosya gönderilmişse, önce Cloudinary'ye yükle
    if (customFile && customFile.size > 0) {
      // Dosya boyutu kontrolü (5MB)
      if (customFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Dosya boyutu 5MB'dan küçük olmalıdır" },
          { status: 400 },
        );
      }

      // Dosya tipi kontrolü
      if (!customFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Geçersiz dosya tipi. Lütfen bir resim dosyası seçin." },
          { status: 400 },
        );
      }

      customImageUrl = await uploadToCloudinary(
        customFile,
        "user_customizations",
      );
    }

    // Base64 resim kontrolü (tasarım panelinden gelen)
    if (customImageUrl && customImageUrl.startsWith("data:image/")) {
      // Base64'ü Cloudinary'ye yükle
      try {
        const base64Response = await fetch(customImageUrl);
        const blob = await base64Response.blob();
        const file = new File([blob], "custom-design.png", {
          type: "image/png",
        });
        customImageUrl = await uploadToCloudinary(file, "user_customizations");
      } catch (err) {
        console.error("Base64 upload error:", err);
        // Base64 olarak sakla (alternatif)
      }
    }

    // Aynı ürün ve aynı özelleştirmeye sahip kayıt var mı?
    // customImage null ise normal ürün, dolu ise özelleştirilmiş ürün
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: Number(session.user.id),
        productId,
        customImage: customImageUrl || null,
      },
    });

    if (existing) {
      // Mevcut ürünü güncelle
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      });
      return NextResponse.json(updated);
    }

    // Yeni sepet öğesi oluştur
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: Number(session.user.id),
        productId,
        quantity,
        customImage: customImageUrl,
      },
      include: { product: true },
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

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { cartItemId, quantity } = await req.json();

    if (!cartItemId || quantity < 1) {
      return NextResponse.json(
        { error: "Geçersiz parametreler" },
        { status: 400 },
      );
    }

    // Sepet öğesinin bu kullanıcıya ait olduğunu kontrol et
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: Number(session.user.id),
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Sepet öğesi bulunamadı" },
        { status: 404 },
      );
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Cart PATCH error:", error);
    return NextResponse.json(
      { error: "Güncelleme başarısız" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get("id");

    if (cartItemId) {
      // Tek bir öğeyi sil
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: Number(cartItemId),
          userId: Number(session.user.id),
        },
      });

      if (!cartItem) {
        return NextResponse.json(
          { error: "Sepet öğesi bulunamadı" },
          { status: 404 },
        );
      }

      await prisma.cartItem.delete({
        where: { id: Number(cartItemId) },
      });

      return NextResponse.json({ success: true });
    } else {
      // Tüm sepeti temizle
      await prisma.cartItem.deleteMany({
        where: { userId: Number(session.user.id) },
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}
