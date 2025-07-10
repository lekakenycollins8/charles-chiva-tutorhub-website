import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string || "image"; // "image" or "video"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type based on fileType parameter
    let validTypes: string[] = [];
    let maxSize = 0;
    let uploadSubDir = "";
    
    if (fileType === "video") {
      // Common video formats
      validTypes = [
        "video/mp4", "video/webm", "video/ogg", "video/quicktime", 
        "video/x-msvideo", "video/x-ms-wmv", "video/x-flv", "video/3gpp"
      ];
      maxSize = 100 * 1024 * 1024; // 100MB for videos
      uploadSubDir = "videos";
    } else {
      // Default to images
      validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      maxSize = 5 * 1024 * 1024; // 5MB for images
      uploadSubDir = "images";
    }

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Supported formats for ${fileType}: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > maxSize) {
      const sizeInMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File size exceeds ${sizeInMB}MB limit.` },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const baseUploadDir = join(process.cwd(), "public", "uploads");
    const uploadDir = join(baseUploadDir, uploadSubDir);
    
    try {
      if (!existsSync(baseUploadDir)) {
        await mkdir(baseUploadDir, { recursive: true });
      }
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (err) {
      console.error("Error creating upload directories:", err);
      return NextResponse.json(
        { error: "Server error: Could not create upload directory" },
        { status: 500 }
      );
    }
    
    // Write file to disk
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${uploadSubDir}/${fileName}`;
    
    return NextResponse.json({
      url: fileUrl,
      type: file.type,
      size: file.size,
      name: file.name
    }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
