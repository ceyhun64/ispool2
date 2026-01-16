//api/account/check/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// DÜZELTME: authOptions'ı Route Handler'dan değil, ortak config dosyasından içe aktarın.
import { authOptions } from "@/lib/auth"; // Yolu projenizin yapısına göre ayarlayın.

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  console.log("session", session);
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: session.user }, { status: 200 });
}
