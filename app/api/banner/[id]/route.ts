// app/api/banner/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const bannerId = Number(id);

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isNaN(bannerId)) {
    return NextResponse.json({ message: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const banner = await prisma.banner.findUnique({ where: { id: bannerId } });

    if (!banner) {
      return NextResponse.json(
        { message: "Banner bulunamadı." },
        { status: 404 },
      );
    }

    // Resim dosyasını sil
    if (banner.image) {
      try {
        const imagePath = path.join(process.cwd(), "public", banner.image);
        await unlink(imagePath);
      } catch (error) {
        console.error("Resim silinirken hata:", error);
        // Hata olsa bile devam et
      }
    }

    await prisma.banner.delete({ where: { id: bannerId } });

    return NextResponse.json({ message: "Banner başarıyla silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Silme işleminde hata oluştu." },
      { status: 500 },
    );
  }
}
