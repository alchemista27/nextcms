import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveFile } from "@/lib/upload";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const results = [];
    
    for (const file of files) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        results.push({ error: `File ${file.name} exceeds 10MB limit` });
        continue;
      }
      
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "video/mp4", "video/webm", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        results.push({ error: `File type ${file.type} is not allowed` });
        continue;
      }
      
      const saved = await saveFile(file);
      
      const media = await prisma.media.create({
        data: {
          filename: saved.filename,
          originalName: saved.originalName,
          mimeType: saved.mimeType,
          size: saved.size,
          url: saved.url,
          uploadedById: session.user.id,
        },
        include: {
          uploadedBy: { select: { id: true, name: true } }
        }
      });
      
      results.push(media);
    }
    
    const successful = results.filter((r) => !("error" in r));
    const failed = results.filter((r) => "error" in r);
    
    return NextResponse.json({
      success: successful.length > 0,
      data: successful,
      errors: failed,
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
