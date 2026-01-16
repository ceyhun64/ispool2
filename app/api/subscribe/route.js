import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const subscribes = await prisma.subscribe.findMany();
    return NextResponse.json(subscribes);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch users" },
      { status: 500 }
    );
  }
}

// POST isteği: herkes email girerek abone olabilir
export async function POST(req) {
  const { email } = await req.json();

  if (!email)
    return NextResponse.json({ error: "Email is required" }, { status: 400 });

  try {
    const subscribe = await prisma.subscribe.create({
      data: { email },
    });
    return NextResponse.json(subscribe);
  } catch (e) {
    console.error("Subscribe POST error:", e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
