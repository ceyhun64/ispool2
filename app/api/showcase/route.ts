// app/api/showcase/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { internalHeaders } from "@/lib/internalAuth";
import type { NextRequest } from "next/server";

export async function GET() {
  try {
    const images = await prisma.showcaseImage.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ images });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Örnek çalışmalar alınamadı." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const order = parseInt(formData.get("order") as string) || 0;
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { message: "Resim zorunludur." },
        { status: 400 },
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);
    uploadFormData.append("folderName", "showcase");

    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      {
        method: "POST",
        headers: internalHeaders(),
        body: uploadFormData,
      },
    );

    if (!uploadRes.ok) {
      throw new Error("Resim yüklenemedi");
    }

    const { path: imagePath } = await uploadRes.json();

    const image = await prisma.showcaseImage.create({
      data: {
        title: title || null,
        image: imagePath,
        order,
        isActive: true,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Örnek çalışma ekleme hatası." },
      { status: 500 },
    );
  }
}
