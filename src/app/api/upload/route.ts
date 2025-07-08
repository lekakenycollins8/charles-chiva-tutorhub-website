import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Limit file size to 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Use the existing uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Write file to disk
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`;
    
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
