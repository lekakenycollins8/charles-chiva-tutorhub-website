import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getSession } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

// POST /api/upload - Upload a file
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop();
    
    // Generate a unique filename with the original extension
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    try {
      // Write the file to the uploads directory
      const filePath = join(uploadDir, uniqueFilename);
      await writeFile(filePath, buffer);
      
      // Return the file URL
      const fileUrl = `/uploads/${uniqueFilename}`;
      
      return NextResponse.json(
        { 
          success: true, 
          fileUrl,
          fileType: file.type,
          fileSize: file.size,
          originalFilename
        }, 
        { status: 200 }
      );
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
