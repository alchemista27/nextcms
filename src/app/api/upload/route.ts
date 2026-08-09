import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using a Promise wrapper around upload_stream
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "nextcms_uploads",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // Save to Prisma
    const newMedia = await prisma.media.create({
      data: {
        id: crypto.randomUUID(),
        filename: uploadResult.public_id,
        originalName: file.name,
        mimeType: file.type || uploadResult.format,
        size: uploadResult.bytes,
        url: uploadResult.secure_url,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
