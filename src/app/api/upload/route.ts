import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
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
      
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        results.push({ error: `File type ${file.type} is not allowed. Only images are supported.` });
        continue;
      }
      
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "alfida_cms" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        }) as any;

        const media = await prisma.media.create({
          data: {
            filename: uploadResult.public_id,
            originalName: file.name,
            mimeType: file.type,
            size: uploadResult.bytes,
            url: uploadResult.secure_url,
            uploadedById: user.id,
          },
          include: {
            uploadedBy: {
              select: { id: true, sharedUser: { select: { full_name: true } } }
            }
          }
        });

        // Remap for the frontend
        const { uploadedBy, ...rest } = media;
        const mappedMedia = {
          ...rest,
          uploadedBy: uploadedBy ? {
            id: uploadedBy.id,
            name: uploadedBy.sharedUser?.full_name || "Unknown"
          } : null
        };
        
        results.push(mappedMedia);
      } catch (err: any) {
        results.push({ error: `Failed to upload ${file.name}: ${err.message}` });
      }
    }
    
    const successful = results.filter((r) => !("error" in r));
    const failed = results.filter((r) => "error" in r);
    
    return NextResponse.json({
      success: successful.length > 0,
      data: successful,
      errors: failed,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
