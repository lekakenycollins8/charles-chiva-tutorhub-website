import { NextResponse } from "next/server";
import { getResource, incrementDownloadCount } from "@/lib/actions/resource-actions";
import { verifyDownloadToken } from "@/lib/auth-utils";

// Detect MIME type from file content (magic numbers)
function detectMimeType(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer);
  
  // PDF: %PDF (25 50 44 46)
  if (view[0] === 0x25 && view[1] === 0x50 && view[2] === 0x44 && view[3] === 0x46) {
    return 'application/pdf';
  }
  
  // DOCX: PK (50 4B) - ZIP archive
  if (view[0] === 0x50 && view[1] === 0x4B) {
    // Could be DOCX, XLSX, PPTX - need to check content
    // For simplicity, default to docx for "Document" type
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  
  // PNG (89 50 4E 47)
  if (view[0] === 0x89 && view[1] === 0x50 && view[2] === 0x4E && view[3] === 0x47) {
    return 'image/png';
  }
  
  // JPEG (FF D8 FF)
  if (view[0] === 0xFF && view[1] === 0xD8 && view[2] === 0xFF) {
    return 'image/jpeg';
  }
  
  // MP4 (ftyp)
  if (view[4] === 0x66 && view[5] === 0x74 && view[6] === 0x79 && view[7] === 0x70) {
    return 'video/mp4';
  }
  
  return 'application/octet-stream';
}

// Map file types to MIME types (fallback)
function getMimeType(fileType: string): string {
  const typeMap: { [key: string]: string } = {
    'PDF': 'application/pdf',
    'Document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'Spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Video': 'video/mp4',
    'Audio': 'audio/mpeg',
    'Image': 'image/jpeg'
  };
  return typeMap[fileType] || 'application/octet-stream';
}

// Get file extension from file type
function getFileExtension(fileType: string): string {
  const extMap: { [key: string]: string } = {
    'PDF': '.pdf',
    'Document': '.docx',
    'Presentation': '.pptx',
    'Spreadsheet': '.xlsx',
    'Video': '.mp4',
    'Audio': '.mp3',
    'Image': '.jpg'
  };
  return extMap[fileType] || '.bin';
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    
    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }
    
    // Get resource to check if it's paid and get fileUrl
    const { success, resource } = await getResource(resourceId);
    
    if (!success || !resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    // Check if resource is paid and verify token if it is
    if (resource.isPaid) {
      const url = new URL(request.url);
      const token = url.searchParams.get('token') || '';
      
      const { valid, resourceId: tokenResourceId } = await verifyDownloadToken(token);
      
      if (!valid || tokenResourceId !== resourceId) {
        return NextResponse.json(
          { error: "Valid download token required for paid resources" },
          { status: 403 }
        );
      }
    }
    
    // Increment download count for both free and paid resources
    await incrementDownloadCount(resourceId);
    
    // Fetch the file from Cloudinary
    const fileResponse = await fetch(resource.fileUrl);
    
    if (!fileResponse.ok) {
      console.error("Failed to fetch file from Cloudinary:", fileResponse.statusText);
      return NextResponse.json(
        { error: "Failed to fetch file from storage" },
        { status: 500 }
      );
    }
    
    // Get the file content as buffer
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Detect MIME type from actual file content (more reliable than fileType)
    const detectedMimeType = detectMimeType(fileBuffer);
    
    // Fallback to fileType-based MIME type if detection fails
    const mimeType = detectedMimeType !== 'application/octet-stream' 
      ? detectedMimeType 
      : getMimeType(resource.fileType);
    
    // Determine file extension based on detected MIME type
    let fileExtension = getFileExtension(resource.fileType);
    if (detectedMimeType === 'application/pdf') {
      fileExtension = '.pdf';
    } else if (detectedMimeType.includes('wordprocessingml')) {
      fileExtension = '.docx';
    } else if (detectedMimeType.includes('presentationml')) {
      fileExtension = '.pptx';
    } else if (detectedMimeType.includes('spreadsheetml')) {
      fileExtension = '.xlsx';
    }
    
    const sanitizedTitle = resource.title.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${sanitizedTitle}${fileExtension}`;
    
    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
