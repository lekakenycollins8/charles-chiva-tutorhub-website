import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

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
    let uploadFolder = "";
    
    if (fileType === "video") {
      // Common video formats
      validTypes = [
        "video/mp4", "video/webm", "video/ogg", "video/quicktime", 
        "video/x-msvideo", "video/x-ms-wmv", "video/x-flv", "video/3gpp"
      ];
      maxSize = 100 * 1024 * 1024; // 100MB for videos
      uploadFolder = "tutorhub-videos";
    } else if (fileType === "document") {
      // Document formats
      validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      maxSize = 10 * 1024 * 1024; // 10MB for documents
      uploadFolder = "tutorhub-documents";
    } else {
      // Default to images
      validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      maxSize = 5 * 1024 * 1024; // 5MB for images
      uploadFolder = "tutorhub-images";
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

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Extract original file name and extension
    const originalFileName = file.name;
    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
    
    // Generate a unique public_id for the file with the original extension
    const uniqueId = `${uuidv4()}${fileExtension}`;
    
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);
    
    // Upload to Cloudinary
    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: uploadFolder,
          public_id: uniqueId,
          resource_type: fileType === "video" ? "video" : fileType === "document" ? "raw" : "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(NextResponse.json(
              { error: "Error uploading file to cloud storage" },
              { status: 500 }
            ));
            return;
          }
          
          // Return the URL to the uploaded file
          resolve(NextResponse.json({
            url: result?.secure_url,
            type: file.type,
            size: file.size,
            name: file.name,
            public_id: result?.public_id
          }, { status: 200 }));
        }
      );
      
      // @ts-ignore - Cloudinary types are not perfect
      stream.pipe(uploadStream);
    }) as Promise<NextResponse>;
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
