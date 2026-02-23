// app/api/blog/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/server-upload";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const blogs = await prisma.blog.findMany();
    return NextResponse.json({ blogs });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Bloglar alınamadı." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const file = formData.get("image") as File | null;

    if (!title || !content || !category || !file) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur." },
        { status: 400 },
      );
    }

    const imagePath = await uploadToCloudinary(file, "blogs");

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        image: imagePath,
      },
    });

    return NextResponse.json({ blog }, { status: 201 });
  } catch (err: any) {
    console.error("Blog oluştururken hata:", err);
    return NextResponse.json(
      { message: "Blog oluşturulamadı." },
      { status: 500 },
    );
  }
}
