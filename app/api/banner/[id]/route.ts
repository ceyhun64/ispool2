import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 Promise olarak
) {
  const { id } = await context.params; // 👈 await ile çöz
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
        { status: 404 }
      );
    }

    await prisma.banner.delete({ where: { id: bannerId } });

    return NextResponse.json({ message: "Banner başarıyla silindi." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Silme işleminde hata oluştu." },
      { status: 500 }
    );
  }
}
