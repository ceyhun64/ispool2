import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ilceId: string }> } // 👈 params artık Promise
) {
  try {
    const { ilceId } = await context.params; // 👈 await ile çöz

    const res = await fetch(
      `https://api.turkiyeapi.dev/v1/districts/${ilceId}`
    );
    if (!res.ok) throw new Error("Mahalle verisi alınamadı");

    const data = await res.json();

    const neighborhoods =
      data.data?.neighborhoods?.map((n: any) => ({
        id: n.id,
        name: n.name,
      })) || [];

    return NextResponse.json(neighborhoods);
  } catch (error) {
    console.error("Mahalleler alınırken hata:", error);
    return NextResponse.json(
      { error: "Mahalleler alınamadı" },
      { status: 500 }
    );
  }
}
