import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const slideId = Number(id);

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(slideId)) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: slideId },
    });

    if (!slide) {
      return NextResponse.json(
        { message: "Slide bulunamadı." },
        { status: 404 },
      );
    }

    // Cloudinary'den resmi sil
    if (slide.desktopImage) {
      try {
        const publicId = slide.desktopImage
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (err) {
        console.error("Cloudinary silme hatası:", err);
      }
    }

    await prisma.heroSlide.delete({ where: { id: slideId } });

    return NextResponse.json({ message: "Slide başarıyla silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Silme işleminde hata oluştu." },
      { status: 500 },
    );
  }
}

// PUT - Slide güncelle
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const slideId = Number(id);

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const tag = formData.get("tag") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const order = parseInt(formData.get("order") as string) || 0;
    const isActive = formData.get("isActive") === "true";
    const newImage = formData.get("desktopImage") as File | null;

    let imageUrl: string | undefined;

    // Yeni resim yüklendiyse
    if (newImage && newImage.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", newImage);
      uploadFormData.append("folderName", "hero_slides");

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
        {
          method: "POST",
          body: uploadFormData,
        },
      );

      if (uploadRes.ok) {
        const { path } = await uploadRes.json();
        imageUrl = path;

        // Eski resmi sil
        const oldSlide = await prisma.heroSlide.findUnique({
          where: { id: slideId },
        });
        if (oldSlide?.desktopImage) {
          try {
            const publicId = oldSlide.desktopImage
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (err) {
            console.error("Eski resim silinemedi:", err);
          }
        }
      }
    }

    const slide = await prisma.heroSlide.update({
      where: { id: slideId },
      data: {
        tag,
        title,
        subtitle,
        description,
        order,
        isActive,
        ...(imageUrl && { desktopImage: imageUrl }),
      },
    });

    return NextResponse.json({ slide });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Güncelleme hatası." },
      { status: 500 },
    );
  }
}
