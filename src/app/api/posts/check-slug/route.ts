import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const excludeId = searchParams.get("excludeId");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const whereClause: any = { slug };
    
    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const existingPost = await prisma.post.findUnique({
      where: whereClause,
      select: { id: true },
    });

    return NextResponse.json({ isAvailable: !existingPost });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized or Internal Server Error" }, { status: 500 });
  }
}
